# Collaborative Whiteboard Application

A real-time collaborative whiteboard application built with React.js and Node.js, allowing multiple users to collaborate on documents simultaneously.

## Features

- 🔄 Real-time collaboration
- 👥 User authentication and authorization
- 📝 Document creation and editing
- 🔗 Document sharing and invitations
- 👀 Active users tracking
- 📱 Responsive design
- 🔐 Access control management

## Tech Stack

### Frontend
- React.js
- Redux (State Management)
- Socket.io-client (Real-time Communication)
- Tailwind CSS (Styling)
- React Router (Navigation)
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Socket.io (WebSocket Server)
- JWT (Authentication)
- Bcrypt (Password Hashing)

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

## Installation

### Frontend Setup

1. Clone the repository

git clone <repository-url>
cd client
```

2. Install dependencies

npm install
# or
yarn install
```

3. Create a `.env` file in the frontend root directory

VITE_BASE_URL=http://localhost:3001

4. Start the development server

npm run dev


### Backend Setup

1. Navigate to the backend directory

cd server
```

2. Install dependencies

npm install
# or
yarn install
```

3. Create a `.env` file in the backend root directory

PORT=3001
DB_URL= mongo db url
CLIENT_URL=http://localhost:5173
JWT_SECRET=your secret key
```

4. Start the server
```bash
npm run dev
# or
yarn dev
```

## Acknowledgments

- React.js documentation
- Node.js documentation
- Socket.io documentation
- MongoDB documentation
- Tailwind CSS documentation