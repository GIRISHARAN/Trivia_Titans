import React, { useState } from "react";
import { auth } from "../firebase";
import {
  sendPasswordResetEmail,
} from "firebase/auth";
import "../login/login.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email)
        .then((res) => {
          alert("password reset email has been sent");
        })
        .catch((error) => {
          console.error(error);
          alert("error while reseting password");
        });
    } catch (error) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="login-form">
      <h2>Reset password</h2>
      <form id="email-form" onSubmit={resetPassword}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Request Password Reset</button>
      </form>
      <span>
        Already have an account? <a href="/login">Login</a>
      </span>
    </div>
  );
};

export default ForgotPassword;
