import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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
const auth = getAuth();

// Toast notification function
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

// Prevent going back function
function preventBackNavigation() {
  history.pushState(null, null, window.location.href);
  window.addEventListener('popstate', function() {
    history.pushState(null, null, window.location.href);
  });
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
    
    // Validation
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
    
    // Create user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showToast("Account created successfully!");
        
        // Prevent back navigation
        preventBackNavigation();
        
        // Redirect with replace to prevent going back
        setTimeout(() => {
          window.location.replace("/index.html");
        }, 1500);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          showToast("Email already registered. Please login.", true);
        } else if (error.code === 'auth/weak-password') {
          showToast("Password should be at least 6 characters", true);
        } else {
          showToast(error.message, true);
        }
      });
  });
});