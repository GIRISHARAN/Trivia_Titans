import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper } from "@mui/material";

const Achievement = () => {
  const [achievements, setAchievements] = useState(null);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const apiUrl =
      "https://uh6cwpkuu6.execute-api.us-east-1.amazonaws.com/default/getachievements";
    axios
      .post(apiUrl, { user_id: userEmail })
      .then((response) => {
        const data = JSON.parse(response.data.body);
        setAchievements(data);
      })
      .catch((error) => {
        console.error("Error fetching achievements:", error);
      });
  }, []);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, my: 3 }}>
        {achievements ? (
          <div>
            <Typography
              variant="h4"
              sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
            >
              Achievements
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              User Name: {achievements.user_name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              User Points: {achievements.userPoints}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              User Ranking: {achievements.userRanking}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Achievements: {achievements.achievements}
            </Typography>
          </div>
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "gray" }}
          >
            Loading...
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Achievement;
