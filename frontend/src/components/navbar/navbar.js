import React, { useState } from "react";
import "./navbar.css";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircle from "@mui/icons-material/AccountCircle";
import GamepadIcon from "@mui/icons-material/Gamepad";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import { useAuth } from "../authentication/authContext";
import { updateUserLoginStatus } from "../authentication/dynamoDb";
import { auth } from "../authentication/firebase";
import { signOut } from "firebase/auth";
import { BarChart, Group, GroupAdd, Settings } from "@mui/icons-material";
import QuizIcon from "@mui/icons-material/Quiz";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { Menu, MenuItem } from "@mui/material";

const onLogout = async () => {
  await signOut(auth)
    .then((res) => {
      updateUserLoginStatus(window.localStorage.getItem("userEmail"), false);
      localStorage.clear();
    })
    .catch((error) => {
      console.error(error);
      alert("error while logging out");
    });
};

const Navbar = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const teamId = localStorage.getItem("teamId");
  const [teamMenuAnchorEl, setTeamMenuAnchorEl] = useState(null);
  const teamMenuOpen = Boolean(teamMenuAnchorEl);

  const handleTeamMenuOpen = (event) => {
    setTeamMenuAnchorEl(event.currentTarget);
  };

  const handleTeamMenuClose = () => {
    setTeamMenuAnchorEl(null);
  };
  const { setIsAuthenticated } = useAuth();
  return (
    <div>
      <AppBar
        position="static"
        style={{ backgroundColor: "rgba(27,118,210, 1)" }}
      >
        <Toolbar>
          <GamepadIcon sx={{ marginRight: "8px" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "left" }}
          >
            Trivia Titans
          </Typography>
          {isAdmin && (
            <div>
              <a
                href="/admin/home"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Button
                  color="inherit"
                  aria-label="All Quiz"
                  startIcon={<QuizIcon />}
                >
                  Quizzes
                </Button>
              </a>
              <a
                href="/admin/analytics"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Button
                  color="inherit"
                  aria-label="Analytics"
                  startIcon={<AnalyticsIcon />}
                >
                  Analytics
                </Button>
              </a>
            </div>
          )}
          {!isAdmin && (
            <div>
              <Button
                color="inherit"
                aria-controls="team-menu"
                aria-haspopup="true"
                startIcon={<Group />}
                onClick={handleTeamMenuOpen}
              >
                Teams
              </Button>
              <Menu
                id="team-menu"
                anchorEl={teamMenuAnchorEl}
                keepMounted
                open={teamMenuOpen}
                onClose={handleTeamMenuClose}
              >
                <MenuItem onClick={handleTeamMenuClose}>
                  <a
                    href="/teamview"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <Group sx={{ marginRight: "8px" }} />
                    View Team
                  </a>
                </MenuItem>
                <MenuItem onClick={handleTeamMenuClose}>
                  <a
                    href="/create_team"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <GroupAdd sx={{ marginRight: "8px" }} />
                    Create Team
                  </a>
                </MenuItem>
                {teamId && (
                  <div>
                    <MenuItem onClick={handleTeamMenuClose}>
                      <a
                        href={`/manageteam/${teamId}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <Settings sx={{ marginRight: "8px" }} />
                        Manage Team
                      </a>
                    </MenuItem>
                    <MenuItem onClick={handleTeamMenuClose}>
                      <a
                        href={`/teamstats/${teamId}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <BarChart sx={{ marginRight: "8px" }} />
                        Team Stats
                      </a>
                    </MenuItem>
                  </div>
                )}
              </Menu>
              <a
                href="/leaderboard"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Button
                  color="inherit"
                  aria-label="leaderboard"
                  startIcon={<LeaderboardIcon />}
                >
                  Leaderboard
                </Button>
              </a>
              <a href="/profile" style={{ color: "inherit" }}>
                <Button
                  color="inherit"
                  aria-label="profile"
                  startIcon={<AccountCircle />}
                >
                  Profile
                </Button>
              </a>
            </div>
          )}
          <Button
            color="error"
            variant="contained"
            className="logout-button"
            onClick={() => {
              onLogout();
              setIsAuthenticated(false);
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
