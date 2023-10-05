import axios from "axios";

// Function to update the login status of a user
export const updateUserLoginStatus = async (userEmail, isLoggedIn) => {
  await axios
    .post(
      "https://fpdodavmf6.execute-api.us-east-1.amazonaws.com/prod/updateuserstatus",
      {
        userEmail: userEmail,
        isLoggedIn: isLoggedIn,
      }
    )
    .then((res) => {
      // Handle the response here if needed
    })
    .catch((error) => {
      console.error(error);
      alert("error while setting user status");
    });
};

// Function to store user data in DynamoDB
export const storeDataInDynamoDB = async (
  userEmail,
  userName,
  userFullname,
  questionsAndAnswers
) => {
  const qa2faPromise = new Promise((resolve, reject) => {
    let params = {
      userEmail: userEmail,
      userName: userName,
      userFullName: userFullname,
      qa2fa: questionsAndAnswers,
      isLoggedIn: false,
      isAdmin: false,
    };
    axios
      .post(
        "https://fpdodavmf6.execute-api.us-east-1.amazonaws.com/prod/store2fadata",
        params
      )
      .then((res) => {
        if(res.data === "Success"){
          resolve("Success");
        }else{
          reject("error while creating user");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("error while creating userId");
      });
  });
  return await qa2faPromise;
};

// Function to retrieve user data from DynamoDB
export const getDataFromDynamoDB = async (userId) => {
  const getDataPromise = new Promise((resolve, reject) => {
    axios
      .post(
        "https://fpdodavmf6.execute-api.us-east-1.amazonaws.com/prod/getdatafromdb",
        { userId: userId }
      )
      .then((res) => {
        resolve(JSON.parse(res.data.body));
      })
      .catch((error) => {
        console.error(error);
        reject("Error while fetching 2fa data");
      });
  });
  return await getDataPromise;
};
