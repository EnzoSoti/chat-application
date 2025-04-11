import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserSessionPersistence, 
  browserLocalPersistence, 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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
  const loginForm = document.getElementById("loginForm");
  const rememberMeCheckbox = document.getElementById("remember");
  const forgotPasswordLink = document.getElementById("forgotPassword");

  // Login form submission
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = rememberMeCheckbox.checked;

    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;

    setPersistence(auth, persistenceType)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        showToast("Login successful!");

        // Prevent back navigation
        preventBackNavigation();

        // Redirect to dashboard
        setTimeout(() => {
          window.location.replace("../pages/dashboard.html");
        }, 1500);
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          showToast("Invalid email or password", true);
        } else {
          showToast(error.message, true);
        }
      });
  });

  // Forgot password
  forgotPasswordLink.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;

    if (!email) {
      showToast("Please enter your email", true);
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        showToast("Password reset email sent. Check your inbox.");
      })
      .catch((error) => {
        showToast("Error: " + error.message, true);
      });
  });
});