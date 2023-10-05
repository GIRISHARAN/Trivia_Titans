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
      // Query Firestore to gather all documents from the userScores collection
      const querySnapshot = await db.collection("userScores").get();

      // Create a map to store the total points for each user
      const userPointsMap = new Map();

      // Iterate through each document in the query snapshot
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const userId = docData.user_id;
        const userPoints = docData.points;

        // Add or update the total points for the user in the map
        if (userPointsMap.has(userId)) {
          userPointsMap.set(userId, userPointsMap.get(userId) + userPoints);
        } else {
          userPointsMap.set(userId, userPoints);
        }
      });

      // Create an array of objects to store user_id, user_name, and total points
      const userResults = [];

      // Iterate through the entries of the userPointsMap
      for (const [userId, userPoints] of userPointsMap) {
        // Query Firestore to retrieve the user_name for the current user_id
        const querySnapshot = await db
          .collection("userScores")
          .where("user_id", "==", userId)
          .get();
        const document = querySnapshot.docs[0];
        const userName = document.data().user_name;

        // Create a userResult object and add it to the userResults array
        const userResult = {
          user_id: userId,
          user_name: userName,
          userPoints: userPoints,
        };
        userResults.push(userResult);
      }

      // Respond with the array of user results
      res.json(userResults);
    } catch (error) {
      console.error("Error:", error); // Log the error
      res.status(500).json({ error: "An error occurred" }); // Respond with a 500 status and an error message
    }
  });
});
