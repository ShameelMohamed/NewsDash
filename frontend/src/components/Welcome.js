import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../api";  // Make sure your API helper exists
import "./Welcome.css";

const NEWS_API_KEY = "e402b33aacea47daaf31f84dfebcb0c5";

export default function Welcome({ logout }) {
  const [username, setUsername] = useState(null);
  const [news, setNews] = useState("Loading news...");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&page=${randomPage}&language=en&apiKey=${NEWS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "ok" && data.articles.length > 0) {
        const shuffled = data.articles.sort(() => 0.5 - Math.random()).slice(0, 3);
        const headlines = shuffled.map((article, index) => (
          <div key={index} className="news-card">
            <h3>{article.title}</h3>
          </div>
        ));
        setNews(headlines);
      } else {
        setNews("No news found.");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews("Failed to fetch news");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile(token)
        .then(data => setUsername(data.username))
        .catch(err => {
          console.error("Error fetching profile:", err);
          setUsername("Guest");
        });
    } else {
      setUsername("Guest");
    }
  }, []);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const goToProfile = () => navigate("/profile");
  const goToDashboard = () => navigate("/dashboard");

  return (
    <div className={`welcome ${darkMode ? "dark-theme" : "light-theme"}`}>
      <nav className="navbar">
        <div className="logo">📰 NewsDash</div>
        <ul className="nav-links">
          <li>
            <button className="nav-btn" onClick={goToProfile}>Profile</button>
          </li>
          <li>
            <button className="nav-btn" onClick={goToDashboard}>Dashboard</button>
          </li>
          <li>
            <button className="nav-btn" onClick={logout}>Logout</button>
          </li>
          <li>
            <button className="nav-btn" onClick={toggleTheme}>
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <h2 className="welcome-title">Welcome, {username || "Guest"}!</h2>

        <div className="news-container">
          {loading ? <p className="loading-text">Fetching latest news...</p> : news}
        </div>

        <button className="refresh-btn" onClick={fetchNews} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh News"}
        </button>
      </main>
    </div>
  );
}
