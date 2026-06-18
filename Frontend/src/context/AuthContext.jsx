import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setUser(null);
    }
  }, [token]);

  const fetchUser = async (authToken) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user details", err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        updateUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);