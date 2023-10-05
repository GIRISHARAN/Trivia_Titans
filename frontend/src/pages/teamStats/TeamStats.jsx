import React, { useState, useEffect } from "react";
import classes from "./TeamStats.module.css";
import { getStatsById } from "../../services/teams";
import Lex from "../../Lex";

const TeamStatistics = () => {
  const [teamStats, setTeamStats] = useState([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const team_name = window.localStorage.getItem("teamName");
        const team_id = window.localStorage.getItem("teamId");
        const response = await getStatsById(team_id);
        response.teamID = team_id;
        setTeamStats([response]);
        setTeamName(team_name);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeamStats();
  }, []);

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}> {teamName} Statistics</h2>
      <div className={classes.teamList}>
        {teamStats.map((team) => (
          <div key={team.teamID} className={classes.teamItem}>
            <div className={classes.teamStat}>
              <pre>Games Played: {team.teamstat.games_played}</pre>
            </div>
            <div className={classes.teamStat}>
              <pre> Wins: {team.teamstat.wins}</pre>
            </div>
            <div className={classes.teamStat}>
              <pre> Losses: {team.teamstat.losses}</pre>
            </div>
            <div className={classes.teamStat}>
              <pre> Points: {team.teamstat.points}</pre>
            </div>
          </div>
        ))}
      </div>
      <Lex />
    </div>
  );
};

export default TeamStatistics;
