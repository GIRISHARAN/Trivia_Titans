// Import required modules and libraries
const functions = require("@google-cloud/functions-framework"); // Import the Google Cloud Functions framework
const admin = require("firebase-admin"); // Import the Firebase Admin SDK
const cors = require("cors"); // Import the CORS middleware

// Load the Firebase service account key JSON file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize the Firebase Admin SDK with the provided service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create a Firestore database instance
const db = admin.firestore();

// Create a CORS middleware instance to handle cross-origin requests
const corsMiddleware = cors();

// Define an HTTP Cloud Function named 'helloHttp'
functions.http("helloHttp", async (req, res) => {
  // Use the CORS middleware to handle cross-origin requests
  corsMiddleware(req, res, async () => {
    try {
      const { team_id } = req.body; // Extract relevant data from the HTTP request body

      // Query Firestore to gather all documents with the same team_id
      const querySnapshot = await db
        .collection("teamScores")
        .where("team_id", "==", team_id)
        .get();

      let totalPoints = 0;

      // Calculate the total points from all documents
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        totalPoints += docData.points;
      });

      const numberOfDocumentsRetrieved = querySnapshot.size; // Get the number of retrieved documents

      // Query Firestore to count the number of times the team_id occurs in the winners collection
      const winnersSnapshot = await db
        .collection("winners")
        .where("team_id", "==", team_id)
        .get();

      const gamesWon = winnersSnapshot.size; // Get the number of games won by the team

      // Respond with the calculated totalPoints, number of retrieved documents, and games won by the team
      res.json({ totalPoints, numberOfDocumentsRetrieved, gamesWon });
    } catch (error) {
      console.error("Error:", error); // Log the error
      res.status(500).json({ error: "An error occurred" }); // Respond with a 500 status and an error message
    }
  });
});
