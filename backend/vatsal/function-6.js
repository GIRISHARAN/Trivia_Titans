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
      // Query Firestore to gather all documents from the teamScores collection
      const querySnapshot = await db.collection("teamScores").get();

      // Create a map to store the total points for each team
      const teamPointsMap = new Map();

      // Iterate through each document in the query snapshot
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const teamId = docData.team_id;
        const teamPoints = docData.points;

        // Log the teamId and teamPoints for debugging
        console.log(teamId, teamPoints);

        // Add or update the total points for the team in the map
        if (teamPointsMap.has(teamId)) {
          teamPointsMap.set(teamId, teamPointsMap.get(teamId) + teamPoints);
        } else {
          teamPointsMap.set(teamId, teamPoints);
        }
      });

      // Log the entire teamPointsMap for debugging
      console.log(teamPointsMap);

      // Create an array of objects to store team_id, team_name, and total points
      const teamResults = [];

      // Iterate through the entries of the teamPointsMap
      for (const [teamId, teamPoints] of teamPointsMap) {
        // Query Firestore to retrieve the team_name for the current team_id
        const querySnapshot = await db
          .collection("teamScores")
          .where("team_id", "==", teamId)
          .get();
        const document = querySnapshot.docs[0];
        const teamName = document.data().team_name;

        // Create a teamResult object and add it to the teamResults array
        const teamResult = {
          team_id: teamId,
          team_name: teamName,
          teamPoints: teamPoints,
        };
        teamResults.push(teamResult);
      }

      // Respond with the array of team results
      res.json(teamResults);
    } catch (error) {
      console.error("Error:", error); // Log the error
      res.status(500).json({ error: "An error occurred" }); // Respond with a 500 status and an error message
    }
  });
});
