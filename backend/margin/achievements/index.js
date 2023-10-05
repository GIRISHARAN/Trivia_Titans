const AWS = require("aws-sdk");
const axios = require("axios");

// Create a DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    // API URL to fetch data from
    const apiUrl =
      "https://us-central1-sdp-project-392915.cloudfunctions.net/function-8";
    const response = await axios.get(apiUrl); // Fetch data from the API

    const apiData = response.data; // Store the API response data

    let highestPoints = 0;
    // Find the highest points from the API data
    apiData.forEach((item) => {
      if (item.userPoints > highestPoints) {
        highestPoints = item.userPoints;
      }
    });

    // An array of promises to store data in DynamoDB
    const promises = apiData.map(async (item) => {
      const userPoints = item.userPoints;
      const achievements = calculateAchievements(userPoints);
      const userRanking = calculateUserRanking(userPoints, highestPoints);

      const params = {
        TableName: "Achievements",
        Item: {
          user_id: item.user_id,
          user_name: item.user_name,
          userPoints: userPoints,
          achievements: achievements,
          userRanking: userRanking,
          timestamp: new Date().toISOString(),
        },
      };
      await dynamoDB.put(params).promise(); // Store each item in DynamoDB
    });

    await Promise.all(promises); // Wait for all DynamoDB operations to finish

    // Create a response body with calculated achievements and user ranking
    const responseBody = apiData.map((item) => {
      const userPoints = item.userPoints;
      const achievements = calculateAchievements(userPoints);
      const userRanking = calculateUserRanking(userPoints, highestPoints);

      return {
        user_id: item.user_id,
        user_name: item.user_name,
        userPoints: userPoints,
        achievements: achievements,
        userRanking: userRanking,
        timestamp: new Date().toISOString(),
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    };
  } catch (error) {
    console.error(
      "Error fetching data from API or storing it in DynamoDB:",
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching data from API or storing it in DynamoDB.",
      }),
    };
  }
};

// Function to calculate achievements based on user points
function calculateAchievements(userPoints) {
  if (userPoints >= 100) {
    return "Gold Achiever";
  } else if (userPoints >= 75) {
    return "Silver Achiever";
  } else if (userPoints >= 50) {
    return "Bronze Achiever";
  } else if (userPoints >= 25) {
    return "Newbie";
  } else {
    return "No Achievements";
  }
}

// Function to calculate user ranking based on user points and highest points
function calculateUserRanking(userPoints, highestPoints) {
  const percentage = (userPoints / highestPoints) * 100;
  if (percentage >= 90) {
    return "Top10%";
  } else if (percentage >= 75) {
    return "Top 25%";
  } else if (percentage >= 50) {
    return "Top 50%";
  } else if (percentage >= 25) {
    return "Top 75%";
  } else {
    return "Top 90%";
  }
}
