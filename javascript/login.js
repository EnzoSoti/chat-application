// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("loginForm");
  const rememberMeCheckbox = document.getElementById("remember");
  const forgotPasswordLink = document.getElementById("forgotPassword");
  
  // Handle login form submission
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = rememberMeCheckbox.checked;
    
    // Set persistence based on remember me checkbox
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    
    setPersistence(auth, persistenceType)
      .then(() => {
        // Sign in user with email and password
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        
        // Redirect to chat or dashboard page
        alert("Login successful!");
        window.location.href = "chat.html"; // Change this to your app's main page
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        // Show specific error messages
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
          alert("Invalid email or password. Please try again.");
        } else {
          alert(errorMessage);
        }
      });
  });
  
  // Handle forgot password
  forgotPasswordLink.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    
    if (!email) {
      alert("Please enter your email address to reset your password");
      return;
    }
    
    // You would need to import sendPasswordResetEmail from Firebase Auth
    // and implement the password reset functionality
    alert("Password reset functionality would be implemented here.");
    // Example implementation:
    // sendPasswordResetEmail(auth, email)
    //   .then(() => {
    //     alert("Password reset email sent. Please check your inbox.");
    //   })
    //   .catch((error) => {
    //     alert("Error sending password reset email: " + error.message);
    //   });
  });
});