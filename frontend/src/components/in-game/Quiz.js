import React, { useState, useEffect } from "react";
import { Typography, Box, Container, ListItem, List } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ChatBox from "./ChatBox";

const Quiz = () => {
  const changePage = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [timer, setTimer] = useState(5);
  const [isTimerComplete, setTimerComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [teamScore, setTeamScore] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quizNumber = searchParams.get("quizNumber");
  const teamId = searchParams.get("teamId");
  const teamName = searchParams.get("teamName");
  const userName = searchParams.get("userName");
  const userEmail = searchParams.get("userEmail");

  const [questionData, setQuestionData] = useState({ questions: [] });

  useEffect(() => {
    console.log(quizNumber);

    axios
      .post(
        "https://d8nbpcntna.execute-api.us-east-1.amazonaws.com/serverless/getquestions",
        { quizNumber: quizNumber }
      )
      .then((response) => {
        if (response.data && response.data.body) {
          console.log(response.data.body.questions);
          setQuestionData({ questions: response.data.body.questions });
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(countdown);
      setTimerComplete(true);
      setTimeout(handleNextQuestion, 5000);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    axios
      .post(
        "https://us-central1-sdp-project-392915.cloudfunctions.net/function-2",
        {
          game_id: quizNumber,
          team_id: teamId,
        }
      )
      .then((response) => {
        console.log(response.data);
        setTeamScore(response.data.totalPoints);
      })
      .then(() => {
        axios
          .post(
            "https://us-central1-sdp-project-392915.cloudfunctions.net/function-3",
            {
              game_id: quizNumber,
              user_id: userEmail,
            }
          )
          .then((response) => {
            console.log(response.data.rank);
            setUserRank(response.data.rank);
          })
          .then(() => {
            axios
              .post(
                "https://us-central1-sdp-project-392915.cloudfunctions.net/function-4",
                {
                  game_id: quizNumber,
                }
              )
              .then((res) => {
                console.log(res.data);
                setTeamLeaderboard(res.data);
              })
              .catch((error) => {
                console.error("Failed to fetch team leaderboard:", error);
              });
          })
          .catch((error) => {
            console.error("Failed to fetch team score:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch team score:", error);
      });
  }, []);

  const handleOptionSelect = (option) => {
    if (!isTimerComplete) {
      setSelectedOption(option);
    }
  };

  const handleNextQuestion = () => {
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    setSelectedOption("");
    setTimer(5);
    setTimerComplete(false);

    const scoreUpdate = isCorrect ? 10 : 0;
    setScore((prevScore) => prevScore + scoreUpdate);

    axios
      .post(
        "https://us-central1-sdp-project-392915.cloudfunctions.net/function-1",
        {
          team_name: teamName,
          user_name: userName,
          category: questionData.questions[0].questionCategory,
          game_id: quizNumber,
          team_id: teamId,
          user_id: userEmail,
          points: scoreUpdate,
        }
      )
      .then(() => {
        console.log("Score updated successfully");
      })
      .then(() => {
        axios
          .post(
            "https://us-central1-sdp-project-392915.cloudfunctions.net/function-2",
            {
              game_id: quizNumber,
              team_id: teamId,
            }
          )
          .then((response) => {
            setTeamScore(response.data.totalPoints);
          })
          .then(() => {
            axios
              .post(
                "https://us-central1-sdp-project-392915.cloudfunctions.net/function-3",
                {
                  game_id: quizNumber,
                  user_id: userEmail,
                }
              )
              .then((response) => {
                setUserRank(response.data.rank);
              })
              .then(() => {
                axios
                  .post(
                    "https://us-central1-sdp-project-392915.cloudfunctions.net/function-4",
                    {
                      game_id: quizNumber,
                    }
                  )
                  .then((response) => {
                    console.log(response.data);
                    setTeamLeaderboard(response.data);
                  })
                  .catch((error) => {
                    console.error("Failed to fetch team leaderboard:", error);
                  });
              })
              .catch((error) => {
                console.error("Failed to fetch team score:", error);
              });
          })
          .catch((error) => {
            console.error("Failed to fetch team score:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to update score:", error);
      });
    if (currentQuestionIndex === questionData.questions.length - 1) {
      changePage("/leaderboard");
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const currentQuestion = questionData?.questions[currentQuestionIndex];
  if (questionData.questions.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Box display="flex">
        <Container maxWidth="xs">
          <Box
            p={2}
            ml={2}
            bgcolor="#ffffff"
            boxShadow={3}
            borderRadius={8}
            mb={2}
          >
            <Typography
              variant="h6"
              align="center"
              color="#2196f3"
              gutterBottom
            >
              Team Score
            </Typography>
            <Box bgcolor="#2196f3" borderRadius={8} p={1} textAlign="center">
              <Typography variant="h6" color="#ffffff">
                {teamScore}
              </Typography>
            </Box>
          </Box>
          <Box p={2} ml={2} bgcolor="#ffffff" boxShadow={3} borderRadius={8}>
            <Typography
              variant="h6"
              align="center"
              color="#2196f3"
              gutterBottom
            >
              User Rank
            </Typography>
            <Box bgcolor="#2196f3" borderRadius={8} p={1} textAlign="center">
              <Typography variant="h6" color="#ffffff">
                {userRank}
              </Typography>
            </Box>
          </Box>
        </Container>
        <Container maxWidth="sm">
          <Box flexGrow={1} ml={2}>
            <Box p={2} bgcolor="#ffffff" boxShadow={3} borderRadius={8} mb={3}>
              <Typography variant="h6" align="right" color="#2196f3">
                Timer: {timer}
              </Typography>
              <Box mt={3}>
                <Typography variant="h5" align="center" color="#2196f3">
                  {currentQuestion.question}
                </Typography>
                <Box mt={3}>
                  <List>
                    {currentQuestion.options.map((option) => (
                      <ListItem
                        key={option}
                        button
                        disabled={isTimerComplete}
                        onClick={() => handleOptionSelect(option)}
                        sx={{
                          border: "1px solid #ddd",
                          borderRadius: 8,
                          mb: 2,
                          backgroundColor:
                            selectedOption === option ? "#2196f3" : "#ffffff",
                          color:
                            selectedOption === option ? "#ffffff" : "#000000",
                        }}
                      >
                        <Typography variant="body1">{option}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
            {isTimerComplete && (
              <Box p={2} bgcolor="#ffffff" boxShadow={3} borderRadius={8}>
                <Typography variant="h5" align="center" color="#2196f3">
                  Correct Answer: {currentQuestion.correctAnswer}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
        <Container maxWidth="xs">
          <Box p={2} ml={2} bgcolor="#ffffff" boxShadow={3} borderRadius={8}>
            <Typography
              variant="h6"
              align="center"
              color="#2196f3"
              gutterBottom
            >
              Team Leaderboard
            </Typography>
            <List>
              {teamLeaderboard.map((team) => (
                <ListItem
                  key={team.team_id}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 8,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box p={1}>
                    <Typography variant="body1">
                      Team Name: {team.team_name}
                    </Typography>
                  </Box>
                  <Box p={1} bgcolor="#2196f3" borderRadius={8}>
                    <Typography variant="body1" color="#ffffff">
                      Points: {team.points}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Container>
      </Box>
      <ChatBox teamId={teamId} gameId={quizNumber} userName={userName} />
    </>
  );
};

export default Quiz;
