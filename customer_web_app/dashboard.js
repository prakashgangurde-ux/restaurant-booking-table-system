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

// Get elements from the HTML
const userNameSpan = document.getElementById('user-name');
const userEmailSpan = document.getElementById('user-email');
const userPhoneSpan = document.getElementById('user-phone');
const logoutButton = document.getElementById('logout-button');

// --- Auth State Observer ---
// This function runs whenever the user's login state changes.
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        console.log("User is logged in:", user);
        
        // Fetch user data from Firestore
        db.collection('customers').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    // Update the HTML with the user's data
                    userNameSpan.textContent = userData.name;
                    userEmailSpan.textContent = userData.email;
                    userPhoneSpan.textContent = userData.phone;
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

    } else {
        // User is signed out.
        console.log("User is not logged in.");
        // Redirect them to the login page
        window.location.href = "login.html";
    }
});

// --- Logout Button ---
logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        // Sign-out successful.
        alert("You have been logged out.");
        // The onAuthStateChanged observer will automatically redirect to the login page.
    }).catch((error) => {
        // An error happened.
        console.error("Logout Error:", error);
    });
});