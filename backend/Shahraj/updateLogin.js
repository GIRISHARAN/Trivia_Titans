const AWS = require("aws-sdk");

// Create a new instance of DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Extract user email and login status from the event object
  const userEmail = event.userEmail;
  const isLoggedIn = event.isLoggedIn;

  // Define parameters for DynamoDB update operation
  const params = {
    TableName: "TriviaUsers",
    Key: {
      userEmail,
    },
    UpdateExpression: "set isLoggedIn = :value",
    ExpressionAttributeValues: {
      ":value": isLoggedIn,
    },
    ReturnValues: "UPDATED_NEW", // Return the new value of the updated attribute
  };

  try {
    // Execute update operation on DynamoDB
    const data = await dynamodb.update(params).promise();

    // If the operation is successful, log the updated data and return it
    console.info("Login status updated", data);
    return data;
  } catch (err) {
    // If there's an error during the execution, log the error and throw it
    console.error("Error", err);
    throw err;
  }
};
