const AWS = require("aws-sdk");

// Create a new instance of DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Extract user details from the event object
  const userEmail = event.userEmail;
  const userName = event.userName;
  const userFullname = event.userFullName;
  const questionsAndAnswers = event.qa2fa;

  // Define parameters for DynamoDB put operation
  let params = {
    TableName: "TriviaUsers",
    Item: {
      userEmail: userEmail,
      userName: userName,
      userFullName: userFullname,
      qa2fa: questionsAndAnswers,
      isLoggedIn: false,
      isAdmin: false,
    },
  };

  try {
    const data = await dynamodb.put(params).promise();

    // If the operation is successful, return a success message
    return "Success";
  } catch (err) {
    // If there's an error during the execution, log the error and throw it
    console.error("Error", err);
    throw err;
  }
};
