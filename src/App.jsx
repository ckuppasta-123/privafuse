import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import DashboardPage from "./pages/DashboardPage";
import HospitalsPage from "./pages/HospitalsPage";
import DatasetsPage from "./pages/DatasetsPage";
import BrainReportPage from "./pages/BrainReportPage";
import TrainingPage from "./pages/TrainingPage";
import SurveillancePage from "./pages/SurveillancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import Register from "./Register";
import {
  ShieldCheck,
  Hospital,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  HeartPulse,
  Network,
  Activity,
  UserCheck
} from "lucide-react";
import "./App.css";

function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState("hospital_admin"); // admin, hospital_admin, researcher
  const [email, setEmail] = useState("doctor@citygeneral.org");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password, role);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setMessage("Invalid login credentials.");
    }
  };

  return (
    <main className="page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="layout">
        <section className="intro">
          <div className="brand">
            <div className="brand-icon"><ShieldCheck size={29} /></div>
            <span>PrivaFuse</span>
          </div>

          <p className="tagline">
            AI-Powered Privacy-Preserving Healthcare & Brain Report Analysis Platform
          </p>

          <h1>Smarter healthcare.<br /><span>Stronger privacy.</span></h1>

          <p className="description">
            Participating hospitals collaborate through federated learning AI while sensitive patient records remain strictly protected within local systems.
          </p>

          <div className="features">
            <div className="feature">
              <div className="feature-icon"><ShieldCheck size={21} /></div>
              <div><h3>Privacy First</h3><p>Local CSV storage with zero raw data transmission.</p></div>
            </div>
            <div className="feature">
              <div className="feature-icon"><Network size={21} /></div>
              <div><h3>Federated Averaging</h3><p>Aggregate model parameters securely using FedAvg.</p></div>
            </div>
            <div className="feature">
              <div className="feature-icon"><Activity size={21} /></div>
              <div><h3>Brain Report ML</h3><p>Analyze synthetic brain-report metadata & held-out test metrics.</p></div>
            </div>
          </div>

          <p className="copyright">
            <HeartPulse size={15} /> Academic FL Healthcare Simulation
          </p>
        </section>

        <section className="login-card">
          <div className="card-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Sign In to Workspace</h2>
            <p>Access your PrivaFuse federated healthcare dashboard.</p>
          </div>

          {/* Role Switcher */}
          <div className="role-switch">
            <button
              type="button"
              className={role === "hospital_admin" ? "role active" : "role"}
              onClick={() => { setRole("hospital_admin"); setEmail("doctor@citygeneral.org"); }}
            >
              <Hospital size={16} /> Hospital Admin
            </button>
            <button
              type="button"
              className={role === "admin" ? "role active" : "role"}
              onClick={() => { setRole("admin"); setEmail("admin@privafuse.org"); }}
            >
              <ShieldCheck size={16} /> Coordinator
            </button>
            <button
              type="button"
              className={role === "researcher" ? "role active" : "role"}
              onClick={() => { setRole("researcher"); setEmail("researcher@privafuse.org"); }}
            >
              <UserCheck size={16} /> Researcher
            </button>
          </div>

          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="email">Email Address</label>
            <div className="input-box">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hospital@example.com"
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-box">
              <LockKeyhole size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {message && <p className="status-message">{message}</p>}

            <button className="sign-in" type="submit">
              Sign In to Workspace <ArrowRight size={19} />
            </button>
          </form>

          <p className="register-footer">
            New hospital node?{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/register")}
            >
              Register Workspace
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/hospitals" element={<ProtectedLayout><HospitalsPage /></ProtectedLayout>} />
        <Route path="/datasets" element={<ProtectedLayout><DatasetsPage /></ProtectedLayout>} />
        <Route path="/brain-report" element={<ProtectedLayout><BrainReportPage /></ProtectedLayout>} />
        <Route path="/training" element={<ProtectedLayout><TrainingPage /></ProtectedLayout>} />
        <Route path="/surveillance" element={<ProtectedLayout><SurveillancePage /></ProtectedLayout>} />
        <Route path="/analytics" element={<ProtectedLayout><AnalyticsPage /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
