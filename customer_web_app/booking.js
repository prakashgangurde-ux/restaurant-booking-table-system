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

// --- Get Table Info from URL ---
const params = new URLSearchParams(window.location.search);
const tableId = params.get('id');
const tableNumber = params.get('number');

document.getElementById('table-number').textContent = tableNumber;

const bookingForm = document.getElementById('booking-form');

// --- Auth Guard and Form Logic ---
auth.onAuthStateChanged(user => {
    if (user) {
        // User is logged in
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const people = document.getElementById('people').value;

            // Redirect to payment simulation with all necessary parameters
            window.location.href = `payment-simulation.html?tableId=${tableId}&tableNum=${tableNumber}&date=${date}&time=${time}&people=${people}`;
        });
    } else {
        // User is not logged in
        console.log("User is not logged in.");
        window.location.href = 'login.html';
    }
});