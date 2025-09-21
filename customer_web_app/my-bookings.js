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

// --- Auth Guard ---
auth.onAuthStateChanged(user => {
    if (user) {
        // User is logged in, fetch their bookings
        fetchUserBookings(user.uid);
    } else {
        // User is not logged in, redirect
        window.location.href = 'login.html';
    }
});

// --- Function to Fetch User's Bookings ---
function fetchUserBookings(userId) {
    const bookingsContainer = document.getElementById('bookings-container');
    
    // Use .where() to query for bookings that match the user's ID
    db.collection('bookings')
      .where('customerId', '==', userId)
      .orderBy('date', 'desc') // Show most recent bookings first
      .get()
      .then((querySnapshot) => {
          bookingsContainer.innerHTML = ''; // Clear loading message
          
          if (querySnapshot.empty) {
              bookingsContainer.innerHTML = '<p>You have no bookings.</p>';
              return;
          }

          querySnapshot.forEach((doc) => {
              const booking = doc.data();
              
              const bookingCard = document.createElement('div');
              bookingCard.classList.add('table-card'); // Reuse table-card style
              
              bookingCard.innerHTML = `
                  <h3>Table #${booking.tableNumber}</h3>
                  <p><strong>Date:</strong> ${booking.date}</p>
                  <p><strong>Time:</strong> ${booking.time}</p>
                  <p><strong>Guests:</strong> ${booking.people}</p>
                  <p><strong>Status:</strong> <span class="status-text">${booking.status}</span></p>
              `;
              
              bookingsContainer.appendChild(bookingCard);
          });
      })
      .catch(error => {
          console.error("Error fetching bookings: ", error);
          bookingsContainer.innerHTML = '<p>Could not load bookings.</p>';
      });
}