import React, { useState, useEffect } from "react";
import classes from "./Manageteam.module.css";
import {
  getMembersById,
  removeTeamMember,
  promotionAdmin,
} from "../../services/teams";
import SearchAndInviteMembers from "../../components/profile/SearchAndInviteMembers";
import Lex from "../../Lex";

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamAdmin, setTeamAdmin] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const team_id = window.localStorage.getItem("teamId");
        const team_name = window.localStorage.getItem("teamName");
        setTeamName(team_name);
        const response = await getMembersById(team_id);
        console.log(response);
        setTeamAdmin(response.admin);
        setTeamMembers(response.members);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeamMembers();
  }, []);

  const removeMember = async (member) => {
    try {
      const team_id = window.localStorage.getItem("teamId");
      const user_name = window.localStorage.getItem("userName");
      const removeData = {
        team_id,
        user_name,
        member,
      };
      const message = await removeTeamMember(removeData);
      const response = await getMembersById(team_id);
      console.log(response);
      setTeamMembers(response.members);
      setPopupMessage(message.response);
      setShowPopup(true);
    } catch (error) {
      console.error(error);
    }
  };

  const makeAdmin = async (member) => {
    try {
      const team_id = window.localStorage.getItem("teamId");
      const user_name = window.localStorage.getItem("userName");
      const adminData = {
        team_id,
        user_name,
        member,
      };
      const message = await promotionAdmin(adminData);
      const response = await getMembersById(team_id);
      console.log(response);
      setTeamAdmin(response.admin);
      setTeamMembers(response.members);
      setPopupMessage(message.response);
      setShowPopup(true);
    } catch (error) {
      console.error(error);
    }
  };

  const sortedTeamMembers = [...teamMembers].sort((a, b) =>
    a === teamAdmin ? -1 : b === teamAdmin ? 1 : 0
  );

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={classes.container}>
      {showPopup && (
        <>
          <div className={classes.overlay} onClick={handleClosePopup}></div>
          <div className={classes.popup}>
            <span className={classes.popupMessage}>{popupMessage}</span>
            <button onClick={handleClosePopup} className={classes.closeButton}>
              Close
            </button>
          </div>
        </>
      )}
      <h2 className={classes.heading}>{teamName} Members</h2>
      <ul className={classes.memberList}>
        {sortedTeamMembers.map((member, index) => (
          <li key={index} className={classes.memberItem}>
            <span className={classes.memberName}>
              {member}
              {member === teamAdmin && (
                <span className={classes.adminTag}>Admin</span>
              )}
            </span>
            <div className={classes.memberButtons}>
              <button
                onClick={() => removeMember(member)}
                className={classes.removeButton}
              >
                Remove Member
              </button>
              {member !== teamAdmin && (
                <button
                  onClick={() => makeAdmin(member)}
                  className={classes.makeAdminButton}
                >
                  Make Admin
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowInvite((prevState) => !prevState)}
        className={classes.inviteButton}
      >
        {showInvite ? "Hide Invitations" : "Show Invitations"}
      </button>
      {showInvite && <SearchAndInviteMembers teamName={teamName} />}
      <Lex />
    </div>
  );
};

export default TeamMembers;
