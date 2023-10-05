import React, { useState, useEffect } from 'react';

import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';

import { getDataFromDynamoDB, updateUserLoginStatus } from '../dynamoDb';
import { useAuth } from '../authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login2fa = () => {
    const {setIsAuthenticated} = useAuth();
    const [ques, setQues] = useState("");
    const [ans, setAns] = useState("");
    const [loading, setLoading] = useState(true);
    const user = window.localStorage.getItem("userEmail");
    const [userName, setUserName] = useState("");
    const [userFullName, setUserFullName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    // Function to handle 2FA submission
    const submitLogin2fa = async (event) => {
        event.preventDefault();
        const payload = {
            userId: user,
            userQues: ques,
            userAnswer: ans
        }

        axios.post("https://fpdodavmf6.execute-api.us-east-1.amazonaws.com/prod/verify2fa",payload).then((res)=>{
            if(res.data.statusCode === 200 && res.data.body === "Answers matched"){
                updateUserLoginStatus(user,true);
                window.localStorage.clear();
                window.localStorage.setItem("userEmail", user);
                window.localStorage.setItem("userName", userName);
                window.localStorage.setItem("userFullName", userFullName);
                window.localStorage.setItem("isAdmin", isAdmin);
                setIsAuthenticated(true);
                if(isAdmin){
                    navigate("/admin/home");
                }else{
                    navigate("/teamview");
                }
               
            }else if(res.data.statusCode === 400 && res.data.body === "Answers do not match"){
                alert("Answer does not match, Please try again");
            }else {
                alert("error while verifying 2fa");
            }
        }).catch((error)=>{
            alert(error.message);
        });
    };

    // Function to fetch 2FA data from DynamoDB
    const getData = async () => {
        if (!user) {
            alert("Error while fetching 2fa data");
        } else {
            await getDataFromDynamoDB(user).then((result) => {
                const qalist = result?.Item?.qa2fa;
                setUserFullName(result?.Item?.userFullName);
                setUserName(result?.Item?.userName);
                setIsAdmin(result?.Item?.isAdmin);
                if (qalist) {
                    const randomInteger = Math.floor(Math.random() * 3);
                    Object.keys(qalist).forEach((key, index) => {
                        if (index === randomInteger) {
                            setQues(key);
                        }
                    });
                    setLoading(false);
                } else {
                    alert("Error while fetching 2fa data");
                }
            }, (error) => {
                alert(error);
            })
        }
    }

    // Fetch 2FA data on component mount
    useEffect(() => {
        getData();
    }, []);

    const TextFieldStyles = {
        width: "100%",
        minWidth: "348px",
        "margin": "0.5rem auto"
    }

    return (<>
        <Card sx={{ "display": "flex", "flexFlow": "column", "justifyContent": "center", "alignItems": "center", "margin": "2rem auto", "width": "400px", "height": "350px", "padding": "1rem" }}>
            <h2>2 step-verification</h2>
            <h3>
                Please answer the following question to verify
            </h3>
            {loading ? 
                <p>Loading 2fa, please wait !</p> :
                <form id="signup2fa-form" style={{ textAlign: "center" }} onSubmit={submitLogin2fa}>
                    <TextField id="qa2fa-1" sx={TextFieldStyles} required label={ques} value={ans} onChange={(e) => setAns(e.target.value)} variant="outlined" />
                    <Button type="submit" sx={{ "margin": "1rem auto" }} variant="contained">Verify</Button>
                </form>
            }
        </Card>
    </>)
};

export default Login2fa;
