import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Grid,
  withStyles,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  SnackbarContent,
} from "@material-ui/core";
import axios from "axios";

const StyledButton = withStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(2),
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
    },
  },
}))(Button);

const TeamAffiliation = () => {
  const [teams, setTeams] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const userName = window.localStorage.getItem("userName");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.post(
          "https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/get-all-teams",
          { username: userName }
        );

        const teamsData = response.data.body.teams;

        console.log(teamsData);
        if (teamsData) setTeams(teamsData);
      } catch (error) {
        console.error("Error while fetching teams:", error);
      }
    };

    fetchTeams();
  }, [userName]);

  const handleLeaveClick = (teamId) => {
    axios
      .post(
        "https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/leave-team",
        {
          team_id: teamId,
          user_id: userName,
        }
      )
      .then(() => {
        setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
        console.log(`Leave Team clicked for teamId: ${teamId}`);
        setSnackbarMessage("Successfully left the team!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarMessage("Error leaving the team!");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Grid
      container
      alignItems="center"
      style={{
        background: "#f0f7f9",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid item xs={6}>
        <Typography
          variant="h5"
          style={{
            color: "#333",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
        >
          Your Teams
        </Typography>
      </Grid>
      <Grid item xs={6} container justify="flex-end">
        <Typography
          variant="h5"
          style={{
            color: "#333",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
        >
          Manage Teams
        </Typography>
      </Grid>
      {teams && teams.length === 0 ? (
        <Grid item xs={12}>
          <Typography
            variant="h6"
            style={{
              color: "#333",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            You are not a member of any team
          </Typography>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <List>
            {teams.map((team) => (
              <ListItem
                key={team.id}
                style={{
                  background: "#fff",
                  margin: "8px",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ListItemText
                  primary={team.name}
                  style={{
                    flex: "1",
                    color: "#333",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                  }}
                />
                <StyledButton
                  variant="contained"
                  onClick={() => handleLeaveClick(team.id)}
                  style={{
                    background: "#FF4F64",
                    color: "#fff",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                    marginLeft: "16px",
                  }}
                >
                  Leave
                </StyledButton>
              </ListItem>
            ))}
          </List>
        </Grid>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          style={{
            background: snackbarMessage.includes("Successfully")
              ? "#4CAF50"
              : "#F44336",
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </Grid>
  );
};

export default TeamAffiliation;
