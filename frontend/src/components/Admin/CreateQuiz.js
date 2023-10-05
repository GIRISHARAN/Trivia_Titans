import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    quizNumber: "",
    quizName: "",
    quizDescription: "",
    quizCategory: "",
    quizLevel: "easy",
    quizExpiry: "",
    timeLimit: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "quizExpiry") {
      const formattedDate = value.replace("T", " ").substring(0, 16);
      setQuizData((prevData) => ({
        ...prevData,
        [name]: formattedDate,
      }));
    } else if (name === "timeLimit") {
      const timeLimitValue = Math.max(parseInt(value, 10), 0);
      setQuizData((prevData) => ({
        ...prevData,
        [name]: timeLimitValue,
      }));
    } else {
      setQuizData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://d8nbpcntna.execute-api.us-east-1.amazonaws.com/serverless/addquiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quizData),
        }
      );

      if (response.ok) {
        navigate("/admin/home");
      } else {
        console.error("Failed to submit quiz data:", response);
      }
    } catch (error) {
      console.error("Error submitting quiz data:", error);
    }
  };

  const handleTimeLimitKeyPress = (event) => {
    const allowedKeys = new Set([
      "ArrowUp",
      "ArrowDown",
      "Backspace",
      "Delete",
    ]);
    const key = event.key;

    if (!allowedKeys.has(key)) {
      event.preventDefault();
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 4, p: 3, boxShadow: 2, borderRadius: 8 }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Create New Quiz
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quiz Number"
            name="quizNumber"
            value={quizData.quizNumber}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quiz Name"
            name="quizName"
            value={quizData.quizName}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quiz Description"
            name="quizDescription"
            value={quizData.quizDescription}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quiz Category"
            name="quizCategory"
            value={quizData.quizCategory}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Quiz Level</InputLabel>
            <Select
              name="quizLevel"
              value={quizData.quizLevel}
              onChange={handleChange}
              label="Quiz Level"
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quiz Start Time"
            name="quizExpiry"
            type="datetime-local"
            value={quizData.quizExpiry}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Time Limit (in minutes)"
            name="timeLimit"
            type="number"
            value={quizData.timeLimit}
            onChange={handleChange}
            variant="outlined"
            onKeyPress={handleTimeLimitKeyPress}
          />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Submit
      </Button>
    </Container>
  );
};

export default CreateQuizPage;
