const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const Mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { userModel } = require('./model/UserModel.js');
const { docModel } = require('./model/DocModel.js');
const { requestModel } = require('./model/RequestModel.js');

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// Error Handler
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Database Connection
Mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authentication Routes
app.post('/signup', async (req, res) => {
    try {
        const { Name, Password } = req.body;

        if (!Name || !Password) {
            return res.status(400).json({ message: 'Name and Password are required' });
        }

        const existingUser = await userModel.findOne({ Name });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, SALT_ROUNDS);
        const user = await userModel.create({
            Name,
            Password: hashedPassword
        });

        const token = jwt.sign(
            { _id: user._id, Name: user.Name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            _id: user._id,
            Name: user.Name,
            token
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Error creating user' });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { Name, Password } = req.body;

        const user = await userModel.findOne({ Name });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(Password, user.Password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { _id: user._id, Name: user.Name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json([{
            _id: user._id,
            Name: user.Name,
            token
        }]);
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ message: 'Error during signin' });
    }
});

// Protected User Routes
app.get('/user', authenticateToken, async (req, res) => {
    try {
        const { _id } = req.query;
        const user = await userModel.findById(_id, '_id Name');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

app.get('/searchfriend', authenticateToken, async (req, res) => {
    try {
        const { Name } = req.query;
        const users = await userModel.find({ Name }, '_id Name');
        res.json(users || []);
    } catch (err) {
        console.error('Search friend error:', err);
        res.status(500).json({ message: 'Error searching friends' });
    }
});

// Document Routes
app.post('/createdoc', authenticateToken, async (req, res) => {
    try {
        const { obj, Invites } = req.body;

        const document = await docModel.create({
            DocumentName: obj.DocumentName,
            DocumentAdminId: obj.DocumentAdminId,
            DocumentFile: obj.DocumentFile,
            Group: [obj.DocumentAdminId]
        });

        if (Invites && Invites.length > 0) {
            const inviteRequests = Invites.map(element => {
                return requestModel.create({
                    senderId: obj.DocumentAdminId,
                    receiverId: element._id,
                    documentId: document._id
                });
            });
            await Promise.all(inviteRequests);
        }

        res.status(201).json({ message: 'Document created successfully', documentId: document._id });
    } catch (err) {
        console.error('Create document error:', err);
        res.status(500).json({ message: 'Error creating document' });
    }
});

app.get('/getrequest', authenticateToken, async (req, res) => {
    try {
        const { _id } = req.query;
        const requests = await requestModel.find({ receiverId: _id })
            .populate('senderId', '_id Name')
            .populate('documentId', '_id DocumentName');
        res.json(requests);
    } catch (err) {
        console.error('Get request error:', err);
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

app.post('/acceptrequest', authenticateToken, async (req, res) => {
    try {
        const { UserId, DocId } = req.body;
        await docModel.findOneAndUpdate(
            { _id: DocId },
            { $push: { Group: UserId } }
        );
        res.status(200).json({ message: 'Request accepted successfully' });
    } catch (err) {
        console.error('Accept request error:', err);
        res.status(500).json({ message: 'Error accepting request' });
    }
});

app.delete('/deleterequest', authenticateToken, async (req, res) => {
    try {
        const { _id } = req.query;
        await requestModel.findByIdAndDelete(_id);
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (err) {
        console.error('Delete request error:', err);
        res.status(500).json({ message: 'Error deleting request' });
    }
});

app.get('/getdocument', authenticateToken, async (req, res) => {
    try {
        const { _id } = req.query;
        const documents = await docModel.find({
            'Group': { $in: [_id] }
        }, '_id DocumentName DocumentAdminId');
        res.json(documents);
    } catch (err) {
        console.error('Get document error:', err);
        res.status(500).json({ message: 'Error fetching documents' });
    }
});

app.delete('/deletedocument', authenticateToken, async (req, res) => {
    try {
        const { _id } = req.query;
        await requestModel.deleteMany({ documentId: _id });
        await docModel.findByIdAndDelete(_id);
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (err) {
        console.error('Delete document error:', err);
        res.status(500).json({ message: 'Error deleting document' });
    }
});

app.get('/documentdetails', authenticateToken, async (req, res) => {
    try {
        const { _id, UserId } = req.query;
        const document = await docModel.find({
            _id: _id,
            'Group': { $in: [UserId] }
        }).populate('Group', '_id Name');

        if (!document || document.length === 0) {
            return res.status(404).json({ message: 'Not authorized' });
        }
        res.json(document);
    } catch (err) {
        console.error('Document details error:', err);
        res.status(500).json({ message: 'Error fetching document details' });
    }
});

app.put('/deleteaccess', authenticateToken, async (req, res) => {
    try {
        const { DocId, UserId } = req.query;
        const updatedDoc = await docModel.findByIdAndUpdate(
            { _id: DocId },
            { $pull: { Group: UserId } },
            { new: true }
        ).populate('Group', '_id Name');
        res.json(updatedDoc);
    } catch (err) {
        console.error('Delete access error:', err);
        res.status(500).json({ message: 'Error updating access' });
    }
});

app.post('/sendinvite', authenticateToken, async (req, res) => {
    try {
        const { senderid, receiverid, docid } = req.body;
        await requestModel.create({
            senderId: senderid,
            receiverId: receiverid,
            documentId: docid
        });
        res.status(200).json({ message: 'Invite sent successfully' });
    } catch (err) {
        console.error('Send invite error:', err);
        res.status(500).json({ message: 'Error sending invite' });
    }
});

// Error handling middleware
app.use(errorHandler);

// Server Setup
const httpServer = createServer(app);

// WebSocket Setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

// WebSocket Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

// WebSocket Connection Handling
const activeRooms = {};

io.on("connection", (socket) => {
    console.log('New client connected');
    let currentRoom = null;

    socket.on('user_connection', (userId) => {
        socket.userId = userId; // Store userId in socket instance
        console.log('User connected with ID:', userId);
    });

    socket.on('joinRoom', (roomId, username) => {
        currentRoom = roomId;
        
        if (!activeRooms[roomId]) {
            activeRooms[roomId] = {
                users: [],
                canvasState: null
            };
        }

        // Check if user already exists in room
        const existingUserIndex = activeRooms[roomId].users.findIndex(u => u.id === socket.userId);
        if (existingUserIndex !== -1) {
            // Update existing user's socket information
            activeRooms[roomId].users[existingUserIndex] = {
                id: socket.userId,
                username: username
            };
        } else {
            // Add new user
            activeRooms[roomId].users.push({
                id: socket.userId,
                username: username
            });
        }

        socket.join(roomId);
        
        io.to(roomId).emit('userJoined', {
            username: username,
            users: activeRooms[roomId].users
        });
    });

    socket.on('draw', (data) => {
        if (!data.roomId) return;
        
        socket.to(data.roomId).emit('drawEvent', {
            type: data.type,
            x: data.x,
            y: data.y,
            color: data.color,
            lineWidth: data.lineWidth,
            tool: data.tool,
            userId: socket.userId
        });
    });

    socket.on('clearCanvas', (roomId) => {
        if (activeRooms[roomId]) {
            socket.to(roomId).emit('canvasCleared', {
                userId: socket.userId
            });
        }
    });

    socket.on('leaveRoom', (roomId, username) => {
        handleUserLeaving(socket, roomId, username);
        currentRoom = null;
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected, userId:', socket.userId);
        if (currentRoom) {
            const user = activeRooms[currentRoom]?.users.find(u => u.id === socket.userId);
            if (user) {
                handleUserLeaving(socket, currentRoom, user.username);
            }
        }
    });
});

function handleUserLeaving(socket, roomId, username) {
    socket.leave(roomId);
    if (activeRooms[roomId]) {
        activeRooms[roomId].users = activeRooms[roomId].users.filter(
            user => user.id !== socket.userId
        );
        io.to(roomId).emit('userLeft', {
            username: username,
            users: activeRooms[roomId].users,
            userId: socket.userId
        });

        if (activeRooms[roomId].users.length === 0) {
            delete activeRooms[roomId];
        }
    }
}

// Start Server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});