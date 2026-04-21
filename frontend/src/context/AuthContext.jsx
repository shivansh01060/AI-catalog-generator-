import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ starts true — blocks routes

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai_catalog_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Make sure token exists before trusting stored data
        if (parsed && parsed.token) {
          setUser(parsed);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${parsed.token}`;
        } else {
          localStorage.removeItem("ai_catalog_user");
        }
      }
    } catch (err) {
      // Corrupted localStorage — clear it
      localStorage.removeItem("ai_catalog_user");
    } finally {
      setLoading(false); // ✅ only unblocks AFTER check is done
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("ai_catalog_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ai_catalog_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
