import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const QuizHome = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          "https://d8nbpcntna.execute-api.us-east-1.amazonaws.com/serverless/getquizquestions"
        );
        const data = await response.json();
        setQuizzes(data.body);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleEditQuiz = (quizNumber) => {
    const quizToEdit = quizzes.find((quiz) => quiz.quizNumber === quizNumber);

    if (quizToEdit) {
      const encodedQuizData = encodeURIComponent(JSON.stringify(quizToEdit));
      navigate(`/admin/editquiz/${encodedQuizData}`);
    } else {
      console.error("Quiz not found!");
    }
  };

  const handleOpenQuiz = (quizNumber) => {
    navigate(`/quiz/${quizNumber}`);
  };

  const handleShowDetails = (quizNumber) => {
    setExpandedQuiz((prevExpanded) =>
      prevExpanded === quizNumber ? null : quizNumber
    );
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1>QuizHome</h1>

          <div>
            <Link to="/admin/createquiz" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary">
                Create New Quiz
              </Button>
            </Link>
          </div>
        </div>

        {quizzes.map((quiz) => (
          <Card
            key={quiz.quizNumber}
            style={{
              marginBottom: "16px",
              background: "#f5f5f5",
              borderRadius: "8px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                variant="h5"
                style={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  marginRight: "8px",
                }}
              >
                Quiz {quiz.quizNumber}
              </Typography>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleEditQuiz(quiz.quizNumber)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleOpenQuiz(quiz.quizNumber)}
                >
                  Open
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleShowDetails(quiz.quizNumber)}
                >
                  Show Details
                </Button>
              </div>
            </CardContent>
            {expandedQuiz === quiz.quizNumber && (
              <CardContent>
                <Typography variant="body1">
                  Category: {quiz.quizCategory}
                </Typography>
                <Typography variant="body1">Level: {quiz.quizLevel}</Typography>
                <Typography variant="body1">
                  Time Limit: {quiz.timeLimit} minutes
                </Typography>
                <Typography variant="body1">
                  Expiry: {quiz.quizExpiry}
                </Typography>
              </CardContent>
            )}
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default QuizHome;
