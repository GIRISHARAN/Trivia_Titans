import React, { useState } from 'react';
import { searchPlayers, sendInvite } from '../../services/teams';
import classes from '../../pages/createTeam/CreateTeam.module.css';

const SearchAndInviteMembers = ({ teamName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allSearchResults, setAllSearchResults] = useState([]);

  const searchMembers = async () => {
    try {
      const response = await searchPlayers(searchQuery);
      setAllSearchResults((prevResults) => [...prevResults, response.user]);
    } catch (error) {
      console.error(error);
    }
  };

  const sendInvites = async (data, index) => {
    try {
      data.teamname = teamName;
      const response = await sendInvite(data);
      if(response.success){
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

  return (
    <div>
      <div className={classes.inlineRow}>
        <label htmlFor="searchQuery" className={classes.label}>Search Members:</label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={classes.input}
        />
        <button type="button" onClick={searchMembers} className={classes.button}>Search</button>
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
                style={member.invited ? { backgroundColor: 'green' } : { backgroundColor: 'blue' }}
              >
                {member.invited ? 'Invited' : 'Send Invite'}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default SearchAndInviteMembers;
