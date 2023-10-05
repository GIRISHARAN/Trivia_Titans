const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
exports.handler = async (event, context) => {
  // Initialize userId variable
  let userId;

  // Parse the event body to get userId
  if (event.body) {
    try {
      const requestBody = JSON.parse(event.body);
      console.log(requestBody.id);
      if (requestBody.id) {
        userId = requestBody.id;
      }
      console.log(userId);
    } catch (error) {
      console.error("Error parsing event.body:", error);
      return {
        statusCode: 400,
        body: "Invalid request body",
      };
    }
  }

  // Create a DynamoDB DocumentClient
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  // Function to post an empty user to DynamoDB
  const postEmptyUser = async () => {
    const emptyUser = {
      id: userId,
      name: "Your Name",
      contact: "Your contact",
      image: "",
    };

    const params = {
      TableName: "Users",
      Item: emptyUser,
      ConditionExpression: "attribute_not_exists(id)", // Check if the user with the same id already exists
    };

    try {
      await dynamoDb.put(params).promise();
      console.log("Empty user posted successfully");
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        console.log("User with the same id already exists");
      } else {
        console.error(error);
        throw new Error("Error posting empty user");
      }
    }
  };

  // Function to get user by userId from DynamoDB
  const getUserId = async () => {
    const params = {
      TableName: "Users",
      Key: {
        id: userId,
      },
    };

    try {
      const result = await dynamoDb.get(params).promise();
      const user = result.Item;
      console.log(user);
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving user");
    }
  };

  try {
    // Call postEmptyUser function to insert an empty user
    await postEmptyUser();
    // Call getUserId function to get the user by userId
    const user = await getUserId();
    return user; // Return the user object
  } catch (error) {
    console.error(error);
  }
};
