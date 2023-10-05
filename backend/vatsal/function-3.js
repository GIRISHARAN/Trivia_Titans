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
    const { game_id, user_id } = req.body; // Extract relevant data from the HTTP request body

    try {
      // Query Firestore to gather all documents with the same game_id
      const querySnapshot = await db
        .collection("userScores")
        .where("game_id", "==", game_id)
        .get();

      const totalDocuments = querySnapshot.size; // Get the total number of documents

      // Sort documents based on points in descending order
      const sortedDocuments = querySnapshot.docs
        .map((doc) => ({ id: doc.id, data: doc.data() }))
        .sort((a, b) => b.data.points - a.data.points);

      // Find the rank of the document with the same user_id
      const rank =
        sortedDocuments.findIndex((doc) => doc.data.user_id === user_id) + 1;

      if (rank === 1) {
        // Check if the document already exists in the winners collection
        const winnerDocRef = db.collection("winners").doc(game_id);
        const winnerDoc = await winnerDocRef.get();

        if (!winnerDoc.exists) {
          // If the document doesn't exist, create a new one with the user_id of the top-ranked user
          await winnerDocRef.set({
            game_id,
            user_id: sortedDocuments[0].data.user_id,
          });
        } else {
          // If the document exists, update the user_id field with the user_id of the top-ranked user
          await winnerDocRef.update({
            user_id: sortedDocuments[0].data.user_id,
          });
        }
      }

      // Respond with the user's rank and the total number of documents
      res.json({ rank, totalDocuments });
    } catch (error) {
      console.error("Error:", error); // Log the error
      res.status(500).json({ error: "An error occurred" }); // Respond with a 500 status and an error message
    }
  });
});
