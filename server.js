const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store online users: { userId: email }
const onlineUsers = {};
// Store socket mapping: { socketId: userId }
const socketToUser = {};

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  
  // Register user
  socket.on('register', ({ userId, email }) => {
    socketToUser[socket.id] = userId;
    onlineUsers[userId] = email;
    
    console.log(`User ${userId} (${email}) connected`);
    
    // Broadcast updated online users list
    broadcastOnlineUsers();
  });
  
  // Handle messages - broadcast to everyone
  socket.on('sendMessage', ({ senderId, senderEmail, message }) => {
    console.log(`Message from ${senderId} (${senderEmail}): ${message}`);
    
    // Broadcast message to all clients except sender
    socket.broadcast.emit('receiveMessage', {
      senderId,
      senderEmail,
      message,
      timestamp: new Date()
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = socketToUser[socket.id];
    if (userId) {
      delete socketToUser[socket.id];
      delete onlineUsers[userId];
      console.log(`User ${userId} disconnected`);
      broadcastOnlineUsers();
    }
  });
  
  // Function to broadcast online users list
  function broadcastOnlineUsers() {
    io.emit('onlineUsers', onlineUsers);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});