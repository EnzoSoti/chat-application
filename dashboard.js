import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBd4Dxe_gZ4kL1cd2_fCSn0u2BXSzNLHbw",
  authDomain: "chap-application-7fbe1.firebaseapp.com",
  projectId: "chap-application-7fbe1",
  storageBucket: "chap-application-7fbe1.firebaseapp.com",
  messagingSenderId: "805455096714",
  appId: "1:805455096714:web:80508ce675395f273cb673"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to Socket.io server
const socket = io('http://localhost:3000'); // Replace with your server URL
let currentUserId = null;
let currentUserEmail = null;

// Store online users data
const onlineUsersData = {};

// DOM elements
const onlineUsersList = document.getElementById('onlineUsersList');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    currentUserEmail = user.email;
    
    // Register user with Socket.io
    socket.emit('register', {
      userId: currentUserId,
      email: currentUserEmail
    });
  } else {
    window.location.href = '../index.html';
  }
});

// Socket.io event listeners
socket.on('onlineUsers', (users) => {
  onlineUsersList.innerHTML = '';
  
  // Update our local copy of online users
  Object.keys(users).forEach(userId => {
    onlineUsersData[userId] = users[userId];
  });
  
  // Add current user first
  if (currentUserId && currentUserEmail) {
    addUserToOnlineList(currentUserId, onlineUsersData[currentUserId] || currentUserEmail);
  }
  
  // Add other online users
  Object.keys(users).forEach(userId => {
    if (userId !== currentUserId) {
      addUserToOnlineList(userId, users[userId]);
    }
  });
});

socket.on('receiveMessage', (data) => {
  displayMessage(data.senderId, data.senderEmail, data.message, false, data.timestamp);
});

// Display a message in the chat
function displayMessage(senderId, senderEmail, message, isSent, timestamp) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'message-info';
  
  // Use email if available, otherwise use userId
  const displayName = isSent ? 'You' : (senderEmail || `User ${senderId.substring(0, 5)}`);
  infoDiv.textContent = displayName;
  
  if (timestamp) {
    const timeString = new Date(timestamp).toLocaleTimeString();
    infoDiv.textContent += ` • ${timeString}`;
  }
  
  const textDiv = document.createElement('div');
  textDiv.textContent = message;
  
  messageDiv.appendChild(infoDiv);
  messageDiv.appendChild(textDiv);
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add user to online list
function addUserToOnlineList(userId, email) {
  const listItem = document.createElement('li');
  
  const statusSpan = document.createElement('span');
  statusSpan.className = 'online-status';
  
  const emailSpan = document.createElement('span');
  emailSpan.textContent = userId === currentUserId ? `${email} (You)` : email;
  
  listItem.appendChild(statusSpan);
  listItem.appendChild(emailSpan);
  
  onlineUsersList.appendChild(listItem);
}

// Send message
sendMessageBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message && currentUserId) {
    // Send message to everyone (group chat)
    socket.emit('sendMessage', {
      senderId: currentUserId,
      senderEmail: currentUserEmail,
      message: message
    });
    
    // Display the message locally
    displayMessage(currentUserId, currentUserEmail, message, true, new Date());
    messageInput.value = '';
  }
});

// Allow sending message with Enter key
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessageBtn.click();
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = '../index.html';
  }).catch((error) => {
    console.error('Logout error:', error);
  });
});