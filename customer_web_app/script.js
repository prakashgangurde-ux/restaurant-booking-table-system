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
const db = firebase.firestore();

// Get the form from the HTML
const signupForm = document.getElementById('signup-form');

// Add a submit event listener
signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    // Get user input from the form fields
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // --- Basic Validation ---
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return; // Stop the function
    }

    // --- Firebase Authentication ---
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User has been created successfully in Firebase Auth
            console.log("User created:", userCredential.user);
            const user = userCredential.user;

            // Now, save the additional user info to the 'customers' collection in Firestore
            return db.collection('customers').doc(user.uid).set({
                name: fullName,
                email: email,
                phone: phone
            });
        })
        .then(() => {
            alert("Account created successfully!");
            // Optional: Redirect to a login page or dashboard
            // window.location.href = "login.html"; 
        })
        .catch((error) => {
            // Handle errors
            console.error("Error creating user:", error);
            alert(error.message);
        });
});