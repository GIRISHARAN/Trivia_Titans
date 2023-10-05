import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./CreateTeam.module.css";
import {
  generateTeamName,
  searchPlayers,
  sendInvite,
  createNewTeam,
} from "../../services/teams";
import Lex from "../../Lex";

const CreateTeamForm = () => {
  const [teamName, setTeamName] = useState("");
  const [teamAdmin, setTeamAdmin] = useState("");
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [allSearchResults, setAllSearchResults] = useState([]);

  const searchMembers = async () => {
    try {
      console.log(searchQuery);
      const response = await searchPlayers(searchQuery);
      setAllSearchResults((prevResults) => [...prevResults, response.user]);
    } catch (error) {
      console.error(error);
    }
  };

  const generateteamName = async () => {
    try {
      const response = await generateTeamName();
      setTeamName(response.teamName);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      const user_name = window.localStorage.getItem("userName");
      setTeamAdmin(user_name);
    };
    fetchAdmin();
  }, []);

  const sendInvites = async (data, index) => {
    try {
      data.teamname = teamName;
      const response = await sendInvite(data);
      console.log(response);
      if (response.success) {
        let newSearchResults = [...allSearchResults];
        newSearchResults[index].invited = true;
        setAllSearchResults(newSearchResults);
      } else {
        let newSearchResults = [...allSearchResults];
        newSearchResults[index].invited = false;
        setAllSearchResults(newSearchResults);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    setMembers([]);
    const formData = {
      teamName,
      teamAdmin,
      members,
    };

    try {
      const resp = await createNewTeam(formData);
      console.log(resp.response.success);
      if (resp.response.success) {
        window.localStorage.setItem("teamId", resp.response.team_id);
        window.localStorage.setItem("teamName", resp.response.team_name);
        navigate("/lobby");
      } else {
        console.log(resp.response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={createTeam} className={classes.container}>
      <h2>Create Your Team</h2>
      <div className={classes.inlineRow}>
        <label htmlFor="teamName" className={classes.label}>
          Team Name:
        </label>
        <input
          type="text"
          id="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className={classes.input}
        />
        <button
          type="button"
          onClick={generateteamName}
          className={classes.button}
        >
          Generate Name
        </button>
      </div>
      <div className={classes.inlineRow}>
        <label htmlFor="teamAdmin" className={classes.label}>
          Team Admin:
        </label>
        <input
          type="text"
          id="teamAdmin"
          value={teamAdmin}
          onChange={(e) => setTeamAdmin(e.target.value)}
          className={classes.input}
          disabled
        />
      </div>
      <div className={classes.inlineRow}>
        <label htmlFor="searchQuery" className={classes.label}>
          Search Members:
        </label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={classes.input}
        />
        <button
          type="button"
          onClick={searchMembers}
          className={classes.button}
        >
          Search
        </button>
      </div>
      <div className={classes.membersContainer}>
        <ol>
          {allSearchResults.map((member, index) => (
            <li key={member.userName}>
              {member.userName} ({member.userEmail})
              <button
                type="button"
                onClick={() => sendInvites(member, index)}
                className={classes.button}
                style={
                  member.invited
                    ? { backgroundColor: "green" }
                    : { backgroundColor: "blue" }
                }
              >
                {member.invited ? "Invited" : "Send Invite"}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <button
        type="submit"
        className={`${classes.button} ${classes.submitButton}`}
      >
        Create
      </button>
      <Lex />
    </form>
  );
};

export default CreateTeamForm;
