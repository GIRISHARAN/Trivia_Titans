const AWS = require("aws-sdk");

// Create a new instance of DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Extract user id from the event object
  const userId = event.userId;

  // Define parameters for DynamoDB get operation
  let getParams = {
    TableName: "TriviaUsers",
    Key: {
      userEmail: userId,
    },
  };

  try {
    // Execute get operation on DynamoDB
    const data = await dynamodb.get(getParams).promise();

    // If the operation is successful, return a 200 status code, CORS headers, and the retrieved data
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(data), // Convert the retrieved data to a JSON string
    };
  } catch (err) {
    // If there's an error during the execution, log the error and throw it
    console.error("Error", err);
    throw err;
  }
};
