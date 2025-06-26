import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await axios.get("https://disease.sh/v3/covid-19/all");
        const historyRes = await axios.get(
          "https://disease.sh/v3/covid-19/historical/all?lastdays=30"
        );

        const summaryArray = [
          { name: "Cases", value: summaryRes.data.cases },
          { name: "Deaths", value: summaryRes.data.deaths },
          { name: "Recovered", value: summaryRes.data.recovered },
          { name: "Active", value: summaryRes.data.active },
        ];

        const formattedDaily = Object.keys(historyRes.data.cases).map((date) => ({
          date,
          cases: historyRes.data.cases[date],
          deaths: historyRes.data.deaths[date],
        }));

        setSummaryData(summaryArray);
        setDailyData(formattedDaily);
      } catch (error) {
        console.error("Error fetching COVID data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard dark-theme">
      <nav className="simple-navbar">
        <div className="logo">📰 NewsDash</div>
        <div className="page-title">Dashboard</div>
        <button className="nav-btn" onClick={() => navigate("/welcome")}>
          Back
        </button>
      </nav>

      <main className="dashboard-content">
        <h1>🦠 Corona Dashboard</h1>

        <div className="chart-section">
          <div className="chart-box">
            <h3>Total Global Stats</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip
                  formatter={(val) => val.toLocaleString()}
                  contentStyle={{ backgroundColor: "#222", borderColor: "#555", color: "#eee" }}
                  labelStyle={{ color: "#ccc" }}
                />
                <Legend wrapperStyle={{ color: "#ccc", fontWeight: "bold" }} />
                <Bar dataKey="value" fill="#6a5acd" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>Cases & Deaths (30 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="casesColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3498db" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="deathsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e74c3c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={formatYAxis} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  formatter={(val) => val.toLocaleString()}
                  contentStyle={{ backgroundColor: "#222", borderColor: "#555", color: "#eee" }}
                  labelStyle={{ color: "#ccc" }}
                />
                <Legend wrapperStyle={{ color: "#ccc", fontWeight: "bold" }} />
                <Area
                  type="monotone"
                  dataKey="cases"
                  stroke="#3498db"
                  fill="url(#casesColor)"
                  name="Daily Cases"
                />
                <Area
                  type="monotone"
                  dataKey="deaths"
                  stroke="#e74c3c"
                  fill="url(#deathsColor)"
                  name="Daily Deaths"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
