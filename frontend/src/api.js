const API_BASE = "https://newsdashbackennd.onrender.com/api";

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function signupUser(details) {
  const res = await fetch(`${API_BASE}/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });

  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function fetchUsers(token) {
  const res = await fetch(`${API_BASE}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// NEW: Profile endpoints

export async function fetchProfile(token) {
  const res = await fetch(`${API_BASE}/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateProfile(token, data) {
  const res = await fetch(`${API_BASE}/profile/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update profile");
  }
  return res.json();
}

export async function changePassword(token, data) {
  const res = await fetch(`${API_BASE}/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to change password");
  }
  return res.json();
}
