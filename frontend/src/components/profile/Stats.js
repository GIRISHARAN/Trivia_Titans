import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  withStyles,
  Box,
} from "@material-ui/core";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  body: {
    fontSize: "1.5rem",
  },
}))(TableCell);

const Stats = () => {
  const userEmail = window.localStorage.getItem("userEmail");
  const userName = window.localStorage.getItem("userName");
  const [statsData, setStatsData] = useState({
    totalPoints: 0,
    numberOfDocumentsRetrieved: 0,
    gamesWon: 0,
  });

  useEffect(() => {
    axios
      .post(
        "https://us-central1-sdp-project-392915.cloudfunctions.net/function-10",
        {
          user_id: userEmail,
        }
      )
      .then((response) => {
        setStatsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stats data:", error);
      });
  }, []);

  const totalGamesPlayed = statsData.numberOfDocumentsRetrieved;
  const Loss = totalGamesPlayed - statsData.gamesWon;

  // Data for the Pie Chart
  const pieChartData = [
    { name: "Win", value: statsData.gamesWon },
    { name: "Loss", value: Loss },
  ];

  // Colors for the Pie Chart
  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <Box mt={4} px={2}>
      <Box mb={3}>
        <Typography
          variant="h4"
          align="center"
          style={{ fontFamily: "cursive" }}
          gutterBottom
        >
          Your Game Statistics
        </Typography>
      </Box>

      <Table style={{ border: "2px solid #ccc" }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Games Played</StyledTableCell>
            <StyledTableCell>Win/Loss Ratio</StyledTableCell>
            <StyledTableCell>Total Points</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="h6">{userName}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">{totalGamesPlayed}</Typography>
            </TableCell>
            <TableCell>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                <PieChart width={170} height={130}>
                  <Pie
                    dataKey="value"
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    innerRadius={20}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                  />
                </PieChart>
              </Box>
            </TableCell>
            <TableCell>
              <Typography variant="h6">{statsData.totalPoints}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default Stats;
