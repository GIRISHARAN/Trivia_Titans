const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
exports.handler = async (event, context) => {
  // Create a DynamoDB DocumentClient
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  // Initialize variables to store user information
  let id;
  let name;
  let contact;
  let image;

  // Parse the event body to extract user information
  if (event.body) {
    try {
      const requestBody = JSON.parse(event.body);
      id = requestBody.id;
      name = requestBody.name;
      contact = requestBody.contact;
      image = requestBody.image;
    } catch (error) {
      console.error("Error parsing event.body:", error);
      throw new Error("Invalid request body");
    }
  }

  // Define parameters for updating the user in DynamoDB
  const params = {
    TableName: "Users",
    Key: {
      id: id,
    },
    UpdateExpression: "SET #image = :image, #name = :name, #contact = :contact",
    ExpressionAttributeNames: {
      "#name": "name",
      "#image": "image",
      "#contact": "contact",
    },
    ExpressionAttributeValues: {
      ":image": image,
      ":name": name,
      ":contact": contact,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    // Update the user information in DynamoDB
    const result = await dynamoDb.update(params).promise();
    const updatedUser = result.Attributes;
    return updatedUser; // Return the updated user object
  } catch (error) {
    console.error(error);
    throw new Error("Error editing personal information");
  }
};
