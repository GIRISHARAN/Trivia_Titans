const AWS = require("aws-sdk");

// Create a new instance of DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Retrieve user data from event object
  let userId = event.userId;
  let userAnswer = event.userAnswer;
  let userQues = event.userQues;

  // Define parameters for DynamoDB get operation
  let getParams = {
    TableName: "TriviaUsers",
    Key: {
      userEmail: userId,
    },
  };

  try {
    // Retrieve stored answers from DynamoDB
    let data = await dynamodb.get(getParams).promise();

    let storedAnswers = data.Item.qa2fa;

    let response = {};

    // Check if the user's answer matches the stored answer
    if (storedAnswers[userQues] !== userAnswer) {
      // If not, return a 400 status code with an error message
      response = {
        statusCode: 400,
        body: "Answers do not match",
      };
    } else if (storedAnswers[userQues] === userAnswer) {
      // If the answers match, return a 200 status code with a success message
      response = {
        statusCode: 200,
        body: "Answers matched",
      };
    } else {
      // If there's an unexpected issue, return a 400 status code with an error message
      response = {
        statusCode: 400,
        body: "There was some problem with verifying",
      };
    }

    // Return the response
    return response;
  } catch (error) {
    // If there's an error during the execution, log the error and return a 500 status code with an error message
    console.log(error);
    return {
      statusCode: 500,
      body: "An error occurred",
    };
  }
};
