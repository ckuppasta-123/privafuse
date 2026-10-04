import axios from "axios";

export const NODE_API_URL = import.meta.env.VITE_NODE_API_URL || "http://localhost:5000/api";
export const AI_API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000/api";

export const nodeClient = axios.create({
  baseURL: NODE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const aiClient = axios.create({
  baseURL: AI_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if present
nodeClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("privafuse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
