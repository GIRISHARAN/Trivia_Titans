// Import the necessary modules and libraries
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
    // Extract relevant data from the HTTP request body
    const {
      game_id,
      team_id,
      team_name,
      user_id,
      user_name,
      points,
      category,
    } = req.body;
    console.log(game_id, team_id, team_name, user_id, user_name, points);

    try {
      // Query the Firestore database for team scores matching game_id and team_id
      const teamQuerySnapshot = await db
        .collection("teamScores")
        .where("game_id", "==", game_id)
        .where("team_id", "==", team_id)
        .get();

      // Check if a matching team document exists in the database
      if (!teamQuerySnapshot.empty) {
        // Retrieve the reference and data of the first matching team document
        const teamDocRef = teamQuerySnapshot.docs[0].ref;
        const teamDocData = teamQuerySnapshot.docs[0].data();

        // Calculate updated team points
        const updatedTeamPoints = teamDocData.points + points;
        console.log(updatedTeamPoints);

        // Update the team document in the database with the new points value
        await teamDocRef.update({ points: updatedTeamPoints });

        console.log("Team document updated");
      } else {
        // If no matching team document exists, create a new team document in the database
        await db.collection("teamScores").add({
          game_id,
          team_id,
          team_name,
          points,
          category,
        });

        console.log("New team document created");
      }

      // Query the Firestore database for user scores matching game_id and user_id
      const userQuerySnapshot = await db
        .collection("userScores")
        .where("game_id", "==", game_id)
        .where("user_id", "==", user_id)
        .get();

      // Check if a matching user document exists in the database
      if (!userQuerySnapshot.empty) {
        // Retrieve the reference and data of the first matching user document
        const userDocRef = userQuerySnapshot.docs[0].ref;
        const userDocData = userQuerySnapshot.docs[0].data();

        // Calculate updated user points
        const updatedUserPoints = userDocData.points + points;
        console.log(updatedUserPoints);

        // Update the user document in the database with the new points value
        await userDocRef.update({ points: updatedUserPoints });

        console.log("User document updated");
      } else {
        // If no matching user document exists, create a new user document in the database
        await db.collection("userScores").add({
          game_id,
          team_id,
          user_id,
          user_name,
          points,
          category,
        });

        console.log("New user document created");
      }

      // Respond to the HTTP request with a success message
      res.json({ message: "Points updated successfully" });
    } catch (error) {
      // Handle errors by logging and sending an error response
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
});
