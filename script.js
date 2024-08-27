// Import the functions you need from the SDKs you need
// Import Firebase SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import {
  getDatabase,
  push,
  ref,
  set,
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration (replace with your own config)
const firebaseConfig = {};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM elements
const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const sendNotificationBtn = document.getElementById('send-notification-btn');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Login function
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Successful login
      console.log(userCredential);
      loginContainer.style.display = 'none';
      adminContainer.style.display = 'block';
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
      errorMessage.textContent = error.message;
    });
});

// Logout function
logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    loginContainer.style.display = 'block';
    adminContainer.style.display = 'none';
  });
});

// Send Notification function
sendNotificationBtn.addEventListener('click', () => {
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;
  const channelId = document.getElementById('channel-select').value;

  if (title && message) {
    const notificationRef = push(
      ref(database, `channel_notifications/${channelId}`)
    );
    set(notificationRef, {
      title: title,
      message: message,
      created_at: new Date().toISOString(),
    })
      .then(() => {
        successMessage.textContent = 'Notification sent successfully!';
      })
      .catch((error) => {
        errorMessage.textContent = error.message;
      });
  } else {
    errorMessage.textContent = 'Please fill in all fields.';
  }
});

// Check for admin authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'block';
  } else {
    loginContainer.style.display = 'block';
    adminContainer.style.display = 'none';
  }
});
