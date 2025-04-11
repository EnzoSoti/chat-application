import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const auth = getAuth();

// Function to show toast notifications
function showToast(message, isError = false) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: isError ? "#ff5252" : "#4caf50",
    stopOnFocus: true,
  }).showToast();
}

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById("registerForm");
  
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const agreeTerms = document.getElementById("agreeTerms").checked;
    
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      showToast("Please fill in all fields", true);
      return;
    }
    
    if (password !== confirmPassword) {
      showToast("Passwords do not match", true);
      return;
    }
    
    if (!agreeTerms) {
      showToast("Please agree to the Terms of Service and Privacy Policy", true);
      return;
    }
    
    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        
        // Here you could store additional user data like username in Firestore
        // For now, just show toast and redirect
        showToast("Account created successfully!");
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        // Show specific error messages
        if (errorCode === 'auth/email-already-in-use') {
          showToast("This email is already registered. Please use a different email or login.", true);
        } else if (errorCode === 'auth/weak-password') {
          showToast("Password is too weak. Please use a stronger password.", true);
        } else {
          showToast(errorMessage, true);
        }
      });
  });
});