const AWS = require("aws-sdk");

// Create a DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    // Log the user_id from the event
    console.log(event.user_id);
    const user_id = event.user_id; // Extract user_id from the event object

    // Define parameters for fetching user achievements from DynamoDB
    const params = {
      TableName: "Achievements",
      Key: {
        user_id: user_id,
      },
    };

    // Get the user achievements from DynamoDB
    const result = await dynamoDB.get(params).promise();
    const userAchievements = result.Item;

    // If user achievements not found, return a 404 response
    if (!userAchievements) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found." }),
      };
    }

    // Return a 200 response with the user achievements
    return {
      statusCode: 200,
      body: JSON.stringify(userAchievements),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error fetching user details from DynamoDB:", error);
    // If there is an error, return a 500 response
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching user details from DynamoDB.",
      }),
    };
  }
};
