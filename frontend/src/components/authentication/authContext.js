import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Create a new context for authentication
export const AuthContext = createContext();

// Provider component for the authentication context
export const AuthProvider = ({ children }) => {
  // State variable to keep track of authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(
    window.localStorage.getItem("userEmail") ? true : false
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Effect hook to handle changes in authentication status
  useEffect(() => {
    // Define routes that do not require authentication
    const exemptedRoutes = {
      "/signup": 1,
      "/create2fa": 2,
      "/complete2fa": 3,
      "/resetpassword": 4,
    };

    // If user is authenticated
    if (isAuthenticated) {
      const path = location.pathname;
      // If user is an admin
      if (window.localStorage.getItem("isAdmin") === "true") {
        // If the current path includes "/admin", do nothing
        if (path.includes("/admin")) {
          //
        } else {
          // Otherwise, navigate to the admin home page
          navigate("/admin/home");
        }
      } else {
        // If the current path includes "/admin", navigate to the team view page
        if (path.includes("/admin")) {
          navigate("/teamview");
        } else {
          // Otherwise, do nothing
          //
        }
      }
    } else if (exemptedRoutes[location.pathname]) {
      // If the current route is exempted from authentication
      const user = window.localStorage.getItem("userEmail");
      if (!user) {
        // If the current path is either "/signup" or "/resetpassword", do nothing
        if (
          location.pathname === "/signup" ||
          location.pathname === "/resetpassword"
        ) {
          //
        } else {
          // Otherwise, navigate to the login page
          navigate("/login");
        }
      }
    } else {
      // If user is not authenticated and the current route is not exempted, navigate to the login page
      navigate("/login");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Provide the authentication state and the setter function to children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);
