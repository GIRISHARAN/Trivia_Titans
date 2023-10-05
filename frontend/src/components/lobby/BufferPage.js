import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BufferPage.css";
const BufferPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quizNumber = searchParams.get("quiznumber");
  const teamId = searchParams.get("teamid");
  const teamName = searchParams.get("teamname");
  const userName = searchParams.get("userName");
  const userEmail = searchParams.get("useremail");
  const start = searchParams.get("start");

  // const start = "2023-08-04 21:37";
  const startTimestamp = new Date(start).getTime();
  const now = new Date().getTime();
  const timeRemaining = Math.max(0, startTimestamp - now);
  const [countdown, setCountdown] = useState(timeRemaining);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate(
        `/startquiz/?quizNumber=${quizNumber}&teamId=${teamId}&teamName=${teamName}&userName=${userName}&userEmail=${userEmail}`
      );
    }
  }, [countdown, navigate]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="loader-container">
      <div className="message">Game starting in:</div>
      <div className="loader-circle"></div>
      <div className="loader-timer">{formatTime(countdown)}</div>
    </div>
  );
};

export default BufferPage;
