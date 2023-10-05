// Import required modules and libraries
const functions = require("@google-cloud/functions-framework"); // Import the Google Cloud Functions framework
const cors = require("cors"); // Import the CORS middleware
const admin = require("firebase-admin"); // Import the Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Load the Firebase service account key JSON file

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
    const { game_id, team_id } = req.body; // Extract relevant data from the HTTP request body

    try {
      // Query the Firestore database for team scores matching game_id and team_id
      const teamQuerySnapshot = await db
        .collection("teamScores")
        .where("game_id", "==", game_id)
        .where("team_id", "==", team_id)
        .get();

      // Check if no matching team documents exist in the database
      if (teamQuerySnapshot.empty) {
        res.json({ totalPoints: 0 }); // Respond with total points as 0
        return;
      }

      // Retrieve the data of the first matching team document
      const teamDocData = teamQuerySnapshot.docs[0].data();
      const totalPoints = teamDocData.points; // Get the total points from the team document

      res.json({ totalPoints }); // Respond with the total points for the specified team
    } catch (error) {
      console.error("Error:", error); // Log the error
      res.status(500).json({ error: "An error occurred" }); // Respond with a 500 status and an error message
    }
  });
});
