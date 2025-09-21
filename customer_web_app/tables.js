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
        // User is logged in, so fetch and display tables
        fetchTables();
    } else {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
    }
});

// --- Function to Fetch and Display Tables ---
function fetchTables() {
    const tablesContainer = document.getElementById('tables-container');
    
    db.collection('tables').orderBy('number').get()
        .then((querySnapshot) => {
            // Clear the "Loading..." message
            tablesContainer.innerHTML = ''; 
            
            if (querySnapshot.empty) {
                tablesContainer.innerHTML = '<p>No tables found.</p>';
                return;
            }

            // Loop through each document (table) in the collection
            querySnapshot.forEach((doc) => {
                const tableData = doc.data();
                const tableId = doc.id; // Get the document ID
                
                // Create a div element for the table card
                const tableCard = document.createElement('div');
                tableCard.classList.add('table-card');
                tableCard.classList.add(tableData.status);

                // Populate the card with table info
                tableCard.innerHTML = `
                    <h3>Table #${tableData.number}</h3>
                    <p><strong>Capacity:</strong> ${tableData.capacity} people</p>
                    <p><strong>Location:</strong> ${tableData.location}</p>
                    <p><strong>Status:</strong> <span class="status-text">${tableData.status}</span></p>
                `;

                // Add booking button if table is available
                if (tableData.status === 'available') {
                    const bookButton = document.createElement('a');
                    bookButton.href = `booking.html?id=${tableId}&number=${tableData.number}`;
                    bookButton.textContent = 'Book Now';
                    bookButton.classList.add('button', 'book-button');
                    tableCard.appendChild(bookButton);
                }
                
                // Add the new card to the container
                tablesContainer.appendChild(tableCard);
            });
        })
        .catch((error) => {
            console.error("Error fetching tables: ", error);
            tablesContainer.innerHTML = '<p>Error loading tables. Please try again.</p>';
        });
}