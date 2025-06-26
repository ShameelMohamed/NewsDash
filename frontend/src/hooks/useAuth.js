import { useState, useEffect } from "react";

// Custom hook to retrieve and provide the authentication token
export const useAuth = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Assuming token is stored in localStorage
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return { token };
};
