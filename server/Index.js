const express=require ('express');
const app=express();
const cors=require('cors')
const dotenv=require('dotenv').config()
const { createServer } = require("http");
const { Server } = require("socket.io");
const Mongoose=require('mongoose');
const {userModel}=require('./model/UserModel.js')

const{docModel}=require('./model/DocModel.js')

const {requestModel}=require('./model/RequestModel.js')
//mongoose connection
Mongoose.connect(process.env.DB_URL)



//cors  config
app.use(cors({ origin:true, credentials: true }));


//express json
app.use(express.json())

//urlencoded
 app.use(express.urlencoded({extended:false}));


 app.get('/user',(req,res)=>{
    const{_id}=req.query
    userModel.findById(_id,'_id Name')
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
 })

 app.post('/signup',(req,res)=>{
    const {Name,Password}=req.body
    userModel.create({
        Name,
        Password
    })
    .then(result=>{
        res.json({
            _id:result._id,
            Name:result.Name
        })
    })
    .catch(err=>{
        console.log(err)
    })

 })

 app.get('/signin',(req,res)=>{
    const obj=req.query
    userModel.find(obj,'_id Name')
    .then(result=>{
        if(result.length>0)
        {
            res.json(result)
        }
        else{
            res.status(404).json({ message: "User not found" });
        }
    })
    .catch(err=>{
        console.log(err)
    })

 })

 app.get('/searchfriend',(req,res)=>{
    const {Name}=req.query
    userModel.find({Name},'_id Name')
    .then(result=>{
        if(result.length>0){
            res.json(result)
        }
        else{
            res.json([])
        }
    })
    .catch(err=>{
        console.log(err)
    })
 })

 app.post('/createdoc',(req,res,next)=>{
    const {obj}=req.body
    docModel.create({
        DocumentName:obj.DocumentName,
        DocumentAdminId:obj.DocumentAdminId,
        DocumentFile:obj.DocumentFile,
        Group:[obj.DocumentAdminId]   
    })
    .then((result)=>{
        res.locals.docId=result._id
        next()
    })
    .catch(err=>{
        console.log(err)
    })
 })

 app.post('/createdoc',async(req,res)=>{
    const {obj,Invites}=req.body
    const docId=res.locals.docId
    try {       
        const inviterequest=Invites.map(element => {
           return requestModel.create(
                {
                    senderId:obj.DocumentAdminId,
                    receiverId:element._id,
                    documentId:docId
                }
                )
        });
        await Promise.all(inviterequest)
    
        res.json("success")
    } catch (error) {
        console.log(error)
    }
 })

 app.get('/getrequest',(req,res)=>{
    const {_id}=req.query
    requestModel.find({receiverId:_id})
    .populate('senderId','_id Name')
    .populate('documentId','_id DocumentName')
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
 })

 app.post('/acceptrequest',(req,res)=>{
    const {UserId,DocId}=req.body
    docModel.findOneAndUpdate({_id:DocId}
    ,{
        $push:{
            Group:UserId
        }
    })
    .then(()=>{
        res.status(200).send()
    })
    .catch(err=>{
        console.log(err)
        res.status(500).send()
    })
    
 })

 app.delete('/deleterequest',(req,res)=>{
    const {_id}=req.query
    requestModel.findByIdAndDelete({_id:_id})
    .then(()=>{
        res.status(200).send()
    })
    .catch(err=>{
        console.log(err)
    })
 })

 app.get('/getdocument',(req,res)=>{
    const{_id}=req.query
    docModel.find({
        'Group':{
            $in:[_id]            
        }
    },'_id DocumentName DocumentAdminId')
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
 })

 app.delete('/deletedocument',async(req,res)=>{
    try {
        const {_id}=req.query
        await requestModel.deleteMany({
            documentId:_id
        })
        await docModel.findByIdAndDelete({_id:_id})
        res.status(200).send()
        
    } catch (error) {
        console.log(error)
    }

 })

 app.get('/documentdetails',(req,res)=>{
    const {_id,UserId}=req.query
    docModel.find({_id:_id,
        'Group':{
            $in:[UserId]
        }
    })
    .populate('Group','_id Name')
    .then(result=>{
        if(result.length>0){
            res.json(result)
        }
        else{
            res.status(404).json({message:"Not authorized"})
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });

    })
 })

 app.put('/deleteaccess',(req,res)=>{
    const {DocId,UserId}=req.query
    docModel.findByIdAndUpdate(
        
        {_id:DocId},
        {$pull:{
            Group:UserId
        }},
        {new:true}
    )
    .populate('Group','_id Name')
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
 })

 app.post('/sendinvite',(req,res)=>{
    const {senderid,receiverid,docid}=req.body
    requestModel.create(
        {
            senderId:senderid,
            receiverId:receiverid,
            documentId:docid
        })
        .then(()=>{
            res.status(200).send()
        })
        .catch(error=>{
            console.log(error)
        })
     })

const httpServer = createServer(app);

const users=new Map();
const activeRooms={}

const io = new Server(httpServer, {
    cors: {
      // origin: "http://localhost:3000",
      // or with an array of origins
       origin:process.env.CLIENT_URL,
      credentials: true
    }
  });

  io.on("connection",(socket)=>{

    socket.on('user_connection',(Data)=>{
        //users.set(Data,socket.id) 
        socket.data.userId=Data
    })

    socket.on('JoinGroup',(data,response)=>{
        activeRooms[data].push(response)
      socket.join(data)
      io.to(data).emit('userjoined',response)
    })

    socket.on('LeaveGroup',(docid,Name)=>{
        socket.leave(docid)
        io.to(docid).emit('userLeft',Name)
        if(activeRooms[docid]){
            activeRooms[docid]=activeRooms[docid].filter((name)=>name!==Name)
        }
    })

    socket.on('activemembers',(docid)=>{
        if(!activeRooms[docid]){
            activeRooms[docid]=[];
        }
        socket.emit('receivedactivemembers',activeRooms[docid])
    })

    socket.on('datachange',(d,response)=>{
        socket.to(response).emit('datachanged',d)
    })


  }) 
httpServer.listen(process.env.port)
