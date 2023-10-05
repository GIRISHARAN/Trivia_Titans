import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

import Navbar from "./components/navbar/navbar";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/teamview");
    }
  });
  return (
    <div className="App">
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
