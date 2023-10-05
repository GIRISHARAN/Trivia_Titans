import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./TeamView.module.css";
import { getAllTeams } from "../../services/teams";
import Lex from "../../Lex";

function TeamPage() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  const goToCreateTeam = () => {
    navigate("/create_team");
  };

  const joinTeam = (team) => {
    window.localStorage.setItem("teamId", team.id);
    window.localStorage.setItem("teamName", team.name);
    navigate("/lobby");
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const user_name = window.localStorage.getItem("userName");
      const AllTeams = await getAllTeams(user_name);
      if (AllTeams) {
        setTeams(AllTeams.teams);
      } else {
        setTeams([]);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className={classes.vtcontainer}>
      <table className={classes.teamtable}>
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Team Name</th>
            <th>Join Team</th>
          </tr>
        </thead>
        {teams && teams.length > 0 ? (
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.id}>
                <td>{index + 1}</td>
                <td>{team.name}</td>
                <td>
                  <button
                    className={classes.joinbtn}
                    onClick={() => joinTeam(team)}
                  >
                    Join
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tr>
            <td></td>
            <td colSpan="3" className={classes.Msg}>
              No Teams Found
            </td>
          </tr>
        )}
      </table>
      <div className={classes.separator}>--OR--</div>
      <button className={classes.createteambtn} onClick={goToCreateTeam}>
        Create New Team
      </button>
      <Lex />
    </div>
  );
}

export default TeamPage;
