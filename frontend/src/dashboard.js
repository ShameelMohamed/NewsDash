import React, { useEffect, useState } from "react";
import { fetchUsers } from "./api";

export default function Dashboard({ username, token, logout }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers(token)
      .then(setUsers)
      .catch(() => alert("Error fetching users"));
  }, [token]);

  return (
    <div className="container fixed-container">
      <div className="glass-card full-card">
        <h1>Welcome, {username}!</h1>
        <button onClick={logout} className="btn">Logout</button>

        <h2>All Users:</h2>
        <ul style={{ textAlign: "left" }}>
          {users.map((user) => (
            <li key={user.id}>
              {user.first_name} {user.last_name} ({user.username})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
