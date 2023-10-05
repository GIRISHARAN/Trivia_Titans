export const getAllTeams = async (user_name) => {
    try {
        console.log(user_name);
        const response = await fetch('https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/get-all-teams', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user_name
            })
        });
        
        const data = await response.json();
        console.log(data.body.teams);
        return {
            teams: data.body.teams
        };
    } catch (error) {
        console.log(error);
        return {
            teams: []
        };
    }
}

export const generateTeamName = async () => {
    try {
        const response = await fetch('https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/generate-team-name', {
            method: 'GET',
        });
        
        const data = await response.json();
        console.log(data.team_name);
        return {
            teamName: data.team_name
        };
    } catch (error) {
        console.log(error);
        return {
            treamName: []
        };
    }
}

export const searchPlayers = async (userFullname) => {
    try {
        console.log(userFullname);
        const response = await fetch('https://oog7m6eguj.execute-api.us-east-1.amazonaws.com/getData/getuserdetails', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userFullName: userFullname
            })
        });
        const data = await response.json();
        console.log(data);
        return {
            user: data
        };
    } catch (error) {
        console.log(error);
        return {
            user: []
        };
    }
}

export const sendInvite = async (udata) => {
    try {
        const response = await fetch('https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/invites/send-invite', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: udata.userName,
                email: udata.userEmail,
                team_name: udata.teamname
            })
        });
        const data = await response.json();
        console.log(data);
        return {
            success: data.body.success
        };
    } catch (error) {
        console.log(error);
        return {
            success: false
        };
    }
}

export const createNewTeam = async (teamdata) => {
    try {
        const response = await fetch('https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/create-team', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                team_name: teamdata.teamName,
                team_admin: teamdata.teamAdmin,
                members: teamdata.members
            })
        });
        const data = await response.json();
        console.log(data);
        return {
            response: data.body
        };
    } catch (error) {
        console.log(error);
        return {
            response: { success: false}
        };
    }
}

export const getStatsById = async (id) => {
    try {
        const response = await fetch(`https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/team-stats/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);
        return {
            teamstat: data.team_statistics
        };
    } catch (error) {
        console.log(error);
        return {
            teamstat: null
        };
    }
}

export const getMembersById = async (id) => {
    try {
        const response = await fetch(`https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/get-all-members/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);
        return {
            members: data.team_members,
            admin: data.team_admin
        };
    } catch (error) {
        console.log(error);
        return {
            members: null
        };
    }
}


export const removeTeamMember = async (tdata) => {
    try {
        const response = await fetch('https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/manage-team/remove-member', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                team_id: tdata.team_id,
                user_id: tdata.user_name,
                member_id: tdata.member
            })
        });
        const data = await response.json();
        console.log(data);
        return {
            response: data.body.message
        };
    } catch (error) {
        console.log(error);
        return {
            response: { message: "Error connecting to server"}
        };
    }
}

export const promotionAdmin = async (tdata) => {
    try {
        const response = await fetch('https://scwmimxeql.execute-api.us-east-1.amazonaws.com/dev/manage-team/promote-to-admin', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                team_id: tdata.team_id,
                user_id: tdata.user_name,
                member_id: tdata.member
            })
        });
        const data = await response.json();
        console.log(data);
        return {
            response: data.body.message
        };
    } catch (error) {
        console.log(error);
        return {
            response: { message: "Error connecting to server"}
        };
    }
}