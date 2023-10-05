// Import required modules and libraries
const functions = require("@google-cloud/functions-framework"); // Import the Google Cloud Functions framework
const { Firestore } = require("@google-cloud/firestore"); // Import Firestore class from the Firestore library
const cors = require("cors"); // Import the CORS middleware

// Create a new Firestore database instance
const db = new Firestore();

// Import the Firebase Admin SDK and service account key
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize the Firebase Admin SDK with the provided service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create another Firestore database instance using the Firebase Admin SDK
const newDb = admin.firestore();

// Create a CORS middleware instance to handle cross-origin requests
const corsMiddleware = cors();

// Define an HTTP Cloud Function named 'helloHttp'
functions.http("helloHttp", async (req, res) => {
  // Use the CORS middleware to handle cross-origin requests
  corsMiddleware(req, res, async () => {
    const { game_id } = req.body; // Extract the game_id from the HTTP request body
    console.log("Received game_id:", game_id);

    try {
      // Query Firestore to gather all documents from the teamScores collection with the provided game_id
      const querySnapshot = await newDb
        .collection("teamScores")
        .where("game_id", "==", game_id)
        .get();

      const results = [];
      // Iterate through the query snapshot and add each document's data to the results array
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      // Sort the results by points in descending order
      results.sort((a, b) => b.points - a.points);

      // Add ranks and format the response
      const rankedResults = results.map((result, index) => ({
        rank: index + 1,
        team_id: result.team_id,
        team_name: result.team_name,
        points: result.points,
      }));

      // Check if the document already exists in the winners collection
      const winnerDocRef = newDb.collection("winners").doc(game_id);
      const winnerDoc = await winnerDocRef.get();

      console.log(winnerDoc);

      if (!winnerDoc.exists) {
        console.log("1st");
        // If the document doesn't exist, create a new one with the team_id of the top-ranked team
        await winnerDocRef.set({ game_id, team_id: rankedResults[0].team_id });
      } else {
        console.log("2nd");
        // If the document exists, update the team_id field with the team_id of the top-ranked team
        await winnerDocRef.update({ team_id: rankedResults[0].team_id });
      }

      // Respond with the ranked results
      return res.status(200).json(rankedResults);
    } catch (error) {
      console.error("Error getting documents:", error);
      // Respond with a 500 status and an error message
      return res.status(500).send("Internal server error");
    }
  });
});
