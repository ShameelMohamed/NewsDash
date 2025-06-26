import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchProfile,
  updateProfile,
  changePassword,
} from "../api";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Redirect to welcome if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/welcome");
    }
  }, [token, navigate]);

  // Fetch profile data on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    }
    if (token) loadProfile();
  }, [token]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await updateProfile(token, profile);
      setMessage(res.success);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await changePassword(token, passwordData);
      setMessage(res.success);
      setPasswordData({ old_password: "", new_password: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-container dark-theme">
      <nav className="simple-navbar">
        <div className="logo">📰 NewsDash</div>
        <div className="page-title">Profile</div>
        <button className="nav-btn" onClick={() => navigate("/welcome")}>
          Back
        </button>
      </nav>

      <main className="profile-content">
        <div className="form-columns">
          {/* Profile Section */}
          <div className="profile-section">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileSubmit}>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  required
                />
              </label>

              <label>
                First Name
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleProfileChange}
                />
              </label>

              <label>
                Last Name
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleProfileChange}
                />
              </label>

              <button type="submit" className="btn">
                Save Changes
              </button>
            </form>
          </div>

          {/* Password Section */}
          <div className="password-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <label>
                Old Password
                <input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <button type="submit" className="btn">
                Change Password
              </button>
            </form>
          </div>
        </div>

        {/* Success/Error Messages */}
        <div className="message-section">
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
        </div>
      </main>
    </div>
  );
}
