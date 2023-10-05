const { LanguageServiceClient } = require("@google-cloud/language");
const functions = require("@google-cloud/functions-framework");
const cors = require("cors");

// Create a Google Cloud Natural Language client
const client = new LanguageServiceClient();

// Function to analyze and tag trivia questions
const tagTriviaQuestion = async (req, res) => {
  // Extract 'question' parameter from the request body
  const { question } = req.body;

  // Check if 'question' parameter exists in the request body
  if (!question) {
    return res
      .status(400)
      .send("No 'question' parameter found in the request body.");
  }

  try {
    // Duplicate the question multiple times to increase analysis accuracy
    const ques =
      question +
      " " +
      question +
      " " +
      question +
      " " +
      question +
      " " +
      question;
    const document = {
      content: ques,
      type: "PLAIN_TEXT",
    };

    // Call Google Cloud Natural Language API to classify the text
    const [result] = await client.classifyText({ document });
    const categories = result.categories.map((category) => category.name);
    console.log(result);
    // Return the categories and the original question for analysis
    return res.status(200).json({ categories, ques });
  } catch (error) {
    console.error("Error analyzing trivia question:", error);
    return res.status(500).send("Error analyzing trivia question.");
  }
};

// Function to wrap tagTriviaQuestion with CORS handling
const wrappedTagTriviaQuestion = (req, res) => {
  cors()(req, res, () => {
    tagTriviaQuestion(req, res);
  });
};

// Create a Google Cloud Function that listens to HTTP requests
functions.http("tagTriviaQuestion", wrappedTagTriviaQuestion);
