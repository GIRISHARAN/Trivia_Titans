import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import './login.css';
import { useNavigate } from 'react-router-dom';
import { getDataFromDynamoDB } from '../dynamoDb';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  // Function to set user in local storage and check if user is new
  const setUser = (user) => {
    window.localStorage.setItem("userEmail", user.email);
    checkIfNewUser(user.email);
  };

  // Function to check if user is new by checking in DynamoDB
  const checkIfNewUser = (async (userEmail) => {
    await getDataFromDynamoDB(userEmail).then((res) => {
      if(typeof res === "object" && Object.keys(res).length <= 0){
        navigate("/create2fa");
      }else {
        navigate("/complete2fa");
      }
    }, (error) => {
      alert(error);
    })
  });

  // Function to handle sign in with email
  const signInWithEmail = async (event) => {
    event.preventDefault();
    try {
      signInWithEmailAndPassword(auth, email, password).then((userCreds) => {
        if (userCreds.user) {
          setUser(userCreds.user);
        }
      }).catch((error) => {
        alert("Error: " + error.code);
      });
    } catch (error) {
      alert("error while signing in");
    }
  };

  // Function to handle sign in with Google
  const signInWithGoogle = async () => {
    setShowEmailLogin(false);
    try {
      signInWithPopup(auth, googleProvider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        let user = result.user;
        if (user) {
          user = Object.assign(user, { credential, token });
          setUser(user);
        }
      }).catch((error) => {
        alert("Error: " + error.message);
      });
    } catch (error) {
      alert("Error while signing in with google");
    }
  };

  // Function to handle sign in with Facebook
  const signInWithFacebook = async () => {
    setShowEmailLogin(false);
    try {
      signInWithPopup(auth, facebookProvider).then((result) => {
        let user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        user = Object.assign(user, { credential, accessToken });
        setUser(user);
      }).catch((error) => {
        alert("Error: " + error.message);
      })
    } catch (error) {
      alert("Error while signing in using facebook");
    }
  };

  return (
    <div className="login-form">
      <h2>Trivia Log-In</h2>
      <button type="button" onClick={() => setShowEmailLogin(true)}><img id="email-icon" className="social-icons" alt='email-icon'></img>Sign in with Email</button>

      {showEmailLogin &&
        <form id='email-form' onSubmit={signInWithEmail}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <span><a href='/resetpassword'>Forgot Password</a></span>
        </form>
      }

      <button type="button" onClick={signInWithGoogle}><img id="google-icon" className="social-icons" alt='google-icon'></img>Sign in with Google </button>
      <button type="button" onClick={signInWithFacebook}><img id="facebook-icon" className="social-icons" alt='facebook-icon'></img><span style={{ marginLeft: "18px" }}></span>Sign in with Facebook </button>
      <span>Dont have an account? <a href='/signup'>Signup using Email</a></span>

    </div>
  );
}

export default Login;
