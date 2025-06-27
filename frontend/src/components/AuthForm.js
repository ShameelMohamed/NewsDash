import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css";

const BASE_URL = "https://newsdashbackennd.onrender.com/api";

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    loginUsername: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });

  const [animating, setAnimating] = useState(false);
  const [leftAnim, setLeftAnim] = useState("");
  const [rightAnim, setRightAnim] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () =>
    setFormData({
      username: "",
      loginUsername: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    });

  const config = {
    headers: { "Content-Type": "application/json" },
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login flow
        const loginData = {
          username: formData.loginUsername,
          password: formData.password,
        };
        if (!loginData.username || !loginData.password) {
          return alert("Enter username and password");
        }
        const res = await axios.post(`${BASE_URL}/login/`, loginData, config);
        if (res.data && res.data.access) {
          localStorage.setItem("access_token", res.data.access);
          onLogin(loginData.username); // Notify parent about login success
          resetForm();
        }
      } else {
        // Signup flow
        const { username, password, confirmPassword, firstName, lastName } = formData;
        if (!username || !password || !confirmPassword || !firstName || !lastName) {
          return alert("Fill all fields");
        }
        if (password !== confirmPassword) {
          return alert("Passwords do not match");
        }
        const signupData = { username, password, first_name: firstName, last_name: lastName };
        const res = await axios.post(`${BASE_URL}/signup/`, signupData, config);
        if (res.status === 201 || res.status === 200) {
          alert("Signup successful! Please login.");
          resetForm();

          // Animated swap to login form after signup
          if (!isLogin && !animating) {
            setLeftAnim("fade-out-to-center-right");
            setRightAnim("fade-out-to-center-left");
            setAnimating(true);

            setTimeout(() => {
              setIsLogin(true);
              setIsSwapped(true);

              setLeftAnim("fade-in-from-center-left");
              setRightAnim("fade-in-from-center-right");

              setTimeout(() => {
                setLeftAnim("");
                setRightAnim("");
                setAnimating(false);
              }, 500);
            }, 500);
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error.response || error.message);
      alert("Authentication failed: " + (error.response?.data?.detail || error.message));
    }
  };

  const toggleForm = () => {
    if (animating) return;

    setLeftAnim("fade-out-to-center-right");
    setRightAnim("fade-out-to-center-left");
    setAnimating(true);

    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setIsSwapped((prev) => !prev);

      setLeftAnim("fade-in-from-center-left");
      setRightAnim("fade-in-from-center-right");

      setTimeout(() => {
        setLeftAnim("");
        setRightAnim("");
        setAnimating(false);
      }, 500);
    }, 500);
  };

  const textSection = isLogin
    ? { title: "Welcome to NewsDash!", subtitle: "Login with your credentials" }
    : { title: "Create Account", subtitle: "Enter details to sign up" };

  const formSection = (
    <form onSubmit={handleAuth}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      {!isLogin && (
        <>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </>
      )}
      {isLogin ? (
        <input
          name="loginUsername"
          placeholder="Username"
          value={formData.loginUsername}
          onChange={handleInputChange}
          required
        />
      ) : null}
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      {!isLogin && (
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
      )}
      <button type="submit" className="btn">
        {isLogin ? "Login" : "Signup"}
      </button>
    </form>
  );

  const toggleText = isLogin ? (
    <>
      Don't have an account?{" "}
      <span onClick={toggleForm} className="toggle-link" style={{ cursor: "pointer", color: "#0ac6c6" }}>
        Signup
      </span>
    </>
  ) : (
    <>
      Have an account?{" "}
      <span onClick={toggleForm} className="toggle-link" style={{ cursor: "pointer", color: "#0ac6c6" }}>
        Login
      </span>
    </>
  );

  return (
    <div className="page-wrapper">
      <div className="container fixed-container">
        <div className="glass-card left-card">
          <div className={`content-wrapper ${leftAnim}`}>
            <div className="content-center">
              {!isSwapped ? (
                <>
                  <h1>{textSection.title}</h1>
                  <p className="welcome-subtext">{textSection.subtitle}</p>
                  {toggleText}
                </>
              ) : (
                formSection
              )}
            </div>
          </div>
        </div>

        <div className="glass-card right-card">
          <div className={`content-wrapper ${rightAnim}`}>
            <div className="content-center">
              {isSwapped ? (
                <>
                  <h1>{textSection.title}</h1>
                  <p className="welcome-subtext">{textSection.subtitle}</p>
                  {toggleText}
                </>
              ) : (
                formSection
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
