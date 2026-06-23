import axios from "axios";
import API from "./api"; // your existing base URL constant (VITE_API_URL)

const axiosClient = axios.create({
  baseURL: API,
});

// Attach token to every request — reads the same storage shape as AuthContext
axiosClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("ai_catalog_user");
    const token = stored ? JSON.parse(stored).token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // corrupted storage — let the request go out unauthenticated, backend will 401 it
  }
  return config;
});

// If the backend ever says 401 (expired/invalid token), force logout immediately.
// This catches cases the client-side timer can miss, e.g. laptop was asleep
// past the token's expiry and the timer never got to fire.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ai_catalog_user");
      delete axios.defaults.headers.common["Authorization"];
      // Hard redirect (not react-router navigate) since this can fire
      // outside of React component context.
      window.location.href = "/login?sessionExpired=true";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
