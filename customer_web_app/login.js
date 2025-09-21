// PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Get the form from the HTML
const loginForm = document.getElementById('login-form');

// Add a submit event listener
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    // Get user input
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // --- Firebase Authentication ---
    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Login was successful
        alert("Login successful!");

        // Redirect to a new page (e.g., a dashboard or homepage)
        window.location.href = "dashboard.html"; // This line is now active
    })
        .catch((error) => {
            // Handle errors
            console.error("Error logging in:", error);
            alert(error.message); // Show a more user-friendly error
        });
});