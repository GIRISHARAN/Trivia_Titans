import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import "./leaderboard.css";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { AppBar, Button, CircularProgress, Toolbar } from "@mui/material";
import axios from "axios";
import Lex from "../../Lex";

// The Leaderboard component is a functional component that manages the state and behavior of the leaderboard.
const Leaderboard = () => {
  // State variables for time frame, player rankings, team rankings, leaderboard type, detailed statistics, category and loading status.
  const [timeFrame, setTimeFrame] = useState("all-time");
  const [playerRankings, setPlayerRankings] = useState([]);
  const [teamRankings, setTeamRankings] = useState([]);
  const [leaderboardType, setleaderboardType] = useState("player");
  const [detailedStatistics, setDetailedStatics] = useState(null);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to process player data and update the player rankings state.
  const processPlayerData = (data) => {
    let playerData = [];
    if (Array.isArray(data)) {
      data.forEach((team, index) => {
        let playerObj = team;
        playerObj["rank"] = index + 1;
        playerData.push(playerObj);
      });
    }
    setPlayerRankings(playerData);
    setIsLoading(false);
  };

  // Async function to fetch player data from an API endpoint.
  const getPlayerData = async (categ) => {
    setIsLoading(true);
    if (categ && categ !== "") {
      await axios
        .post(
          "https://us-central1-sdp-project-392915.cloudfunctions.net/function-9",
          { category: categ }
        )
        .then((res) => {
          let unsortedData = [...res.data];
          unsortedData.sort(function (a, b) {
            return parseInt(b.userPoints) - parseInt(a.userPoints);
          });
          processPlayerData(unsortedData);
        })
        .catch((error) => {
          console.error(error);
          alert("error while fetching player leaderbaord");
        });
    } else {
      await axios
        .post(
          "https://us-central1-sdp-project-392915.cloudfunctions.net/function-8",
          {}
        )
        .then((res) => {
          let unsortedData = [...res.data];
          unsortedData.sort(function (a, b) {
            return parseInt(b.userPoints) - parseInt(a.userPoints);
          });
          processPlayerData(unsortedData);
        })
        .catch((error) => {
          console.error(error);
          alert("error while fetching player leaderbaord");
        });
    }
  };

  // Function to process team data and update the team rankings state.
  const processTeamData = (data) => {
    let teamData = [];
    if (Array.isArray(data)) {
      data.forEach((team, index) => {
        let teamObj = team;
        teamObj["rank"] = index + 1;
        teamData.push(teamObj);
      });
    }
    setTeamRankings(teamData);
    setIsLoading(false);
  };

   // Async function to fetch team data from an API endpoint.
  const getTeamData = async (categ) => {
    setIsLoading(true);
    if (categ && categ !== "") {
      await axios
        .post(
          "https://us-central1-sdp-project-392915.cloudfunctions.net/get-team-data-category",
          { category: categ }
        )
        .then((res) => {
          let unsortedData = [...res.data];
          unsortedData.sort(function (a, b) {
            return parseInt(b.teamPoints) - parseInt(a.teamPoints);
          });
          processTeamData(unsortedData);
        })
        .catch((error) => {
          console.error(error);
          //alert("error while fetching player leaderbaord");
        });
    } else {
      await axios
        .post(
          "https://us-central1-sdp-project-392915.cloudfunctions.net/get-team-data",
          {}
        )
        .then((res) => {
          let unsortedData = [...res.data];
          unsortedData.sort(function (a, b) {
            return parseInt(b.teamPoints) - parseInt(a.teamPoints);
          });
          processTeamData(unsortedData);
        })
        .catch((error) => {
          console.error(error);
          //alert("error while fetching player leaderbaord");
        });
    }
  };

  // useEffect hook to reset detailed statistics when leaderboard type changes.
  useEffect(() => {
    setDetailedStatics(null);
  }, [leaderboardType]);

  // useEffect hook to fetch data when leaderboard type, time frame or category changes.
  useEffect(() => {
    // Simulating API call with mock response
    if (leaderboardType === "player") {
      getPlayerData(category);
    } else {
      getTeamData(category);
    }
  }, [leaderboardType, timeFrame, category]);

  // Render the leaderboard component.
  return (
    <div className="container">
      <Filter
        setTimeFrame={setTimeFrame}
        timeFrame={timeFrame}
        setLeaderboard={setleaderboardType}
        leaderboardType={leaderboardType}
        category={category}
        setCategory={setCategory}
      />
      <Box
        sx={{
          display: "flex",

          height: "calc(100% - 64px)",
          "& > :not(style)": {
            m: 1,
            width: "auto",
          },
        }}
      >
        <Paper style={{ width: "60%", height: "99%", overflowY: "scroll" }}>
          <Box>
            {leaderboardType === "player" ? (
              <>
                <RankingTable
                  title="Player Leaderboard"
                  rankings={playerRankings}
                  isLoading={isLoading}
                  setDetailedStatics={setDetailedStatics}
                  detailedStatistics={detailedStatistics}
                />
              </>
            ) : (
              <>
                <RankingTable
                  title="Team Leaderboard"
                  rankings={teamRankings}
                  isLoading={isLoading}
                  setDetailedStatics={setDetailedStatics}
                />
              </>
            )}
          </Box>
        </Paper>
        <Paper
          style={{
            flexGrow: 1,
            display: "flex",
            flexFlow: "column",
            paddingTop: "0.2rem",
            height: "99%",
          }}
        >
          {detailedStatistics ? (
            <>
              <Details details={detailedStatistics}></Details>
            </>
          ) : (
            <>
              <Typography variant="p">
                Please select a row form leaderboard to view details
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </div>
  );
};

// The Filter component is a functional component that manages the filters for the leaderboard.
const Filter = ({
  setTimeFrame,
  timeFrame,
  setLeaderboard,
  leaderboardType,
  setCategory,
  category,
}) => {
  // Function to handle changes in the time frame filter.
  const handleFilterChange = (e) => {
    setTimeFrame(e.target.value);
  };

  // Function to handle changes in the category filter.
  const handleCategoryChange = (e) => {
    if (e.target.value === "any") {
      setCategory("");
    } else {
      setCategory(e.target.value);
    }
  };

  // Render the Filter component.
  return (
    <div>
      <AppBar position="static">
        <Toolbar className="leaderboard-toolbar">
          <Typography
            variant="h6"
            component="div"
            className="leaderboard-toolbar-header"
          >
            Leaderboard
          </Typography>
          <Button
            sx={{ marginRight: "12px", width: "96px" }}
            variant={leaderboardType === "player" ? "contained" : "outlined"}
            color="primary"
            onClick={() => {
              setLeaderboard("player");
            }}
          >
            Player
          </Button>
          <Button
            onClick={() => {
              setLeaderboard("team");
            }}
            sx={{ marginRight: "12px", width: "96px" }}
            variant={leaderboardType === "team" ? "contained" : "outlined"}
            color="primary"
          >
            Team
          </Button>
          <Select
            className="select-cetagory"
            labelId="time-cetagory-select"
            id="time-category-item"
            value={category ? category : "any"}
            label="Select Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value={"any"}>Any Category</MenuItem>
            <MenuItem value={"sports"}>Sports</MenuItem>
            <MenuItem value={"news"}>News</MenuItem>
          </Select>
          <Select
            className="select-time-range"
            labelId="time-range-select"
            id="time-range-select-item"
            value={timeFrame}
            label="Time Range"
            onChange={handleFilterChange}
          >
            <MenuItem value={"daily"}>Daily</MenuItem>
            <MenuItem value={"weekly"}>Weekly</MenuItem>
            <MenuItem value={"monthly"}>Monthly</MenuItem>
            <MenuItem value={"all-time"}>All Time</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
    </div>
  );
};

// The RankingTable component is a functional component that displays the leaderboard rankings in a table.

const RankingTable = ({ title, rankings, isLoading, setDetailedStatics }) => (
  // The container for the leaderboard table.
  <div className="leaderboard-table-container" style={{ position: "relative" }}>
    <Table stickyHeader style={{ position: "fixed", maxWidth: "48%" }}>
      <TableHead>
        <TableRow>
          <TableCell className="leaderboard-table-cell">Rank</TableCell>
          <TableCell className="leaderboard-table-cell">
            {title.includes("Player") ? "Player Name" : "Team Name"}
          </TableCell>
          <TableCell className="leaderboard-table-cell">Score</TableCell>
        </TableRow>
      </TableHead>
    </Table>
    <TableContainer>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "4rem",
          }}
        >
          <h4>Loading Data</h4>
          <CircularProgress></CircularProgress>
        </div>
      ) : (
        <>
          <Table style={{ marginTop: "57px" }}>
            {Array.isArray(rankings) && rankings.length <= 0 ? (
              <>
                <TableBody>
                  <h4 style={{ fontFamily: "sans-serif" }}>
                    No Leaderboard data available yet
                  </h4>
                </TableBody>
              </>
            ) : (
              <>
                <TableBody style={{ overflowY: "scroll" }}>
                  {rankings.map((row, i) => (
                    <TableRow
                      className="leaderboard-table-row"
                      key={i}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell
                        onClick={() => {
                          setDetailedStatics(row);
                        }}
                        className="leaderboard-table-cell"
                      >
                        {row.rank}
                      </TableCell>
                      <TableCell
                        className="leaderboard-table-cell"
                        onClick={() => {
                          setDetailedStatics(row);
                        }}
                      >
                        {title.includes("Player")
                          ? row.user_name
                          : row.team_name}
                      </TableCell>
                      <TableCell
                        className="leaderboard-table-cell"
                        onClick={() => {
                          setDetailedStatics(row);
                        }}
                      >
                        {title.includes("Player")
                          ? row.userPoints
                          : row.teamPoints}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </>
      )}
    </TableContainer>
  </div>
);

const Details = ({ details }) => {
  const [data, setData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    setIsLoadingData(true);
    if (details.user_id) {
      axios
        .post(
          "https://us-central1-sdp-project-392915.cloudfunctions.net/function-10",
          { user_id: details.user_id }
        )
        .then((res) => {
          let resData = res.data;
          Object.assign(resData, details);
          setData(resData);
          setIsLoadingData(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (details.team_id) {
      axios
        .post(
          "https://us-central1-sdp-project-392915.cloudfunctions.net/function-5",
          { team_id: details.team_id }
        )
        .then((res) => {
          let resData = res.data;
          Object.assign(resData, details);
          setData(resData);
          setIsLoadingData(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("wrong key selected");
    }
  }, [details]);
  return (
    <>
      {isLoadingData ? (
        <>
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "4rem",
            }}
          >
            <h4>Loading Data</h4>
            <CircularProgress></CircularProgress>
          </div>
        </>
      ) : (
        <>
          <TableContainer component={"paper"}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {data?.team_name ? "Team Name" : "Player Name"}
                  </TableCell>
                  <TableCell>
                    {data?.team_name ? data?.team_name : data?.user_name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rank </TableCell>
                  <TableCell>{data?.rank}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Points </TableCell>
                  <TableCell>{data?.totalPoints}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Games Played </TableCell>
                  <TableCell>{data?.numberOfDocumentsRetrieved}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Games Won </TableCell>
                  <TableCell>{data?.gamesWon}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Games Lost </TableCell>
                  <TableCell>
                    {data?.numberOfDocumentsRetrieved - data?.gamesWon}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Win Rate </TableCell>
                  <TableCell>
                    {(data?.gamesWon / data?.numberOfDocumentsRetrieved) * 100}{" "}
                    %
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Lex />
    </>
  );
};

export default Leaderboard;
