import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AuthForm from "./components/AuthForm";
import Welcome from "./components/Welcome";
import Profile from "./components/Profile";      // <-- import Profile
import Dashboard from "./components/Dashboard";  // <-- import Dashboard

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access_token"))
  );
  const [username, setUsername] = useState("");

  const handleLogin = (user) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <Router>
      <Routes>
        {/* Public route: Login / Signup */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/welcome" replace />
            ) : (
              <AuthForm onLogin={handleLogin} />
            )
          }
        />

        {/* Protected welcome route */}
        <Route
          path="/welcome"
          element={
            isAuthenticated ? (
              <Welcome username={username} logout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protected profile route */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/" replace />
          }
        />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
          }
        />

        {/* Fallback route for unknown paths */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/welcome" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}
