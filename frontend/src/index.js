import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/authentication/authContext";
import Login from "./components/authentication/login/login";
import Signup from "./components/authentication/signup/signup";
import Signup2fa from "./components/authentication/signup2fa/signup2fa";
import Login2fa from "./components/authentication/login2fa/login2fa";
import CreateTeam from "./pages/createTeam/CreateTeam";
import TeamStats from "./pages/teamStats/TeamStats";
import ManageTeam from "./pages/manageteam/ManageTeam";
import ProfileHome from "./components/profile/ProfileHome";
import Quiz from "./components/in-game/Quiz";
import QuizHome from "./components/Admin/QuizHome";
import CreateQuiz from "./components/Admin/CreateQuiz";
import EditQuiz from "./components/Admin/EditQuiz";
import Lobby from "./components/lobby/Lobby";
import Leaderboard from "./pages/leaderboards/leaderboards";
import TeamView from "./pages/teamView/TeamView";
import BufferPage from "./components/lobby/BufferPage";
import ForgotPassword from "./components/authentication/forgotPassword/forgotPassword";
import Analytics from "./components/Admin/Analytics";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App></App>
      </AuthProvider>
    ),
    children: [
      {
        path: "/create_team",
        element: <CreateTeam></CreateTeam>,
      },
      {
        path: "/teamstats/:id",
        element: <TeamStats></TeamStats>,
      },
      {
        path: "/manageteam/:id",
        element: <ManageTeam></ManageTeam>,
      },
      {
        path: "/profile",
        element: <ProfileHome />,
      },

      {
        path: "/admin/home",
        element: <QuizHome />,
      },
      {
        path: "/admin/createquiz",
        element: <CreateQuiz />,
      },
      {
        path: "/admin/editquiz/:encodedQuizData",
        element: <EditQuiz />,
      },
      {
        path: "/admin/analytics",
        element: <Analytics />,
      },
      {
        path: "/lobby",
        element: <Lobby />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard></Leaderboard>,
      },

      {
        path: "/teamview",
        element: <TeamView></TeamView>,
      },
      {
        path: "/buffer",
        element: <BufferPage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <Login></Login>
      </AuthProvider>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthProvider>
        <Signup></Signup>
      </AuthProvider>
    ),
  },
  {
    path: "/complete2fa",
    element: (
      <AuthProvider>
        <Login2fa></Login2fa>
      </AuthProvider>
    ),
  },
  {
    path: "/create2fa",
    element: (
      <AuthProvider>
        <Signup2fa></Signup2fa>
      </AuthProvider>
    ),
  },
  {
    path: "/resetpassword",
    element: (
      <AuthProvider>
        <ForgotPassword></ForgotPassword>
      </AuthProvider>
    ),
  },
  {
    path: "/startquiz",
    element: <Quiz />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
