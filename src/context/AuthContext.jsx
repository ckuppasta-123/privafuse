import React, { createContext, useContext, useState, useEffect } from "react";
import { nodeClient } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("privafuse_user");
    return saved ? JSON.parse(saved) : {
      name: "Dr. Alex Vance",
      email: "alex.vance@citygeneral.org",
      role: "admin", // admin, hospital_admin, researcher
      hospital: "City General Hospital"
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem("privafuse_token") || "demo_jwt_token");

  useEffect(() => {
    if (user) {
      localStorage.setItem("privafuse_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("privafuse_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("privafuse_token", token);
    } else {
      localStorage.removeItem("privafuse_token");
    }
  }, [token]);

  const login = async (email, password, selectedRole) => {
    try {
      const res = await nodeClient.post("/auth/login", { email, password, role: selectedRole });
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      // Fallback for demo if backend is offline or starting up
      const mockUser = {
        name: email.split("@")[0] || "Health Admin",
        email: email,
        role: selectedRole || "hospital_admin",
        hospital: selectedRole === "admin" ? "Central Coordinator" : "City General Hospital"
      };
      setUser(mockUser);
      setToken("demo_token_secret");
      return { success: true, isDemo: true };
    }
  };

  const register = async (formData) => {
    try {
      const res = await nodeClient.post("/auth/register", formData);
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      const mockUser = {
        name: formData.contactPerson || "New User",
        email: formData.email,
        role: "hospital_admin",
        hospital: formData.hospitalName || "Registered Hospital"
      };
      setUser(mockUser);
      setToken("demo_token_secret");
      return { success: true, isDemo: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("privafuse_user");
    localStorage.removeItem("privafuse_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
