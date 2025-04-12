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
const socket = io('https://88f3034c-e7b0-43d8-9ab9-f6c9c9cf7d2d-00-29lorfxjv1mn.pike.replit.dev/');
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
const onlineUsersCounter = document.querySelector('.text-xs.text-gray-500.flex.items-center');

// User profile elements
const userProfileName = document.querySelector('.p-4.border-t .flex.items-center .ml-3 .font-medium');
const userProfileEmail = document.querySelector('.p-4.border-t .flex.items-center .ml-3 .text-xs.text-gray-500');
const userProfileInitials = document.querySelector('.p-4.border-t .flex.items-center .w-10.h-10.rounded-full');

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    currentUserEmail = user.email;
    
    // Update user profile in sidebar
    updateUserProfile(user);
    
    // Register user with Socket.io
    socket.emit('register', {
      userId: currentUserId,
      email: currentUserEmail
    });
  } else {
    window.location.href = '../index.html';
  }
});

// Update user profile information in the sidebar
function updateUserProfile(user) {
  if (userProfileEmail) {
    userProfileEmail.textContent = user.email;
  }
  
  if (userProfileName) {
    // Use displayName if available, otherwise use email
    const displayName = user.displayName || user.email.split('@')[0];
    userProfileName.textContent = displayName;
  }
  
  if (userProfileInitials) {
    // Get initials from display name or email
    let initials;
    if (user.displayName) {
      // Get initials from display name (first letter of first and last name)
      initials = user.displayName.split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else {
      // Get first two letters from email
      initials = user.email.substring(0, 2).toUpperCase();
    }
    
    userProfileInitials.textContent = initials;
  }
}

// Socket.io event listeners
socket.on('onlineUsers', (users) => {
  onlineUsersList.innerHTML = '';
  
  // Update our local copy of online users
  Object.keys(users).forEach(userId => {
    onlineUsersData[userId] = users[userId];
  });
  
  // Count the number of online users
  const onlineCount = Object.keys(users).length;
  
  // Update the counter display
  updateOnlineCounter(onlineCount);
  
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

// Update the online users counter
function updateOnlineCounter(count) {
  if (onlineUsersCounter) {
    onlineUsersCounter.innerHTML = `
      <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
      ${count} ${count === 1 ? 'member' : 'members'} online
    `;
  }
}

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
  listItem.className = 'flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors';
  
  // Create green dot status indicator
  const statusSpan = document.createElement('span');
  statusSpan.className = 'w-2 h-2 bg-green-500 rounded-full flex-shrink-0';
  
  // Create user email display
  const emailSpan = document.createElement('span');
  emailSpan.className = 'text-sm truncate';
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