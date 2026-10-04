import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Server,
  User,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NODE_API_URL, AI_API_URL } from "../services/api";
import "./Pages.css";

export default function SettingsPage() {
  const { user } = useAuth();
  const [nodeUrl, setNodeUrl] = useState(NODE_API_URL);
  const [aiUrl, setAiUrl] = useState(AI_API_URL);
  const [healthStatus, setHealthStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const testHealthEndpoints = async () => {
    setChecking(true);
    setHealthStatus(null);
    try {
      const nodeCheck = await fetch(`${nodeUrl}/health`).then(r => r.json()).catch(() => null);
      const aiCheck = await fetch(`${aiUrl}/health`).then(r => r.json()).catch(() => null);

      setHealthStatus({
        node: nodeCheck ? "Online (Express 5000)" : "Offline / Mock Active",
        ai: aiCheck ? "Online (FastAPI 8000)" : "Offline / Mock Active"
      });
    } catch (err) {
      setHealthStatus({ node: "Mock Active", ai: "Mock Active" });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title">Settings & System Configuration</h1>
          <p className="page-subtitle">
            Configure backend service endpoints, review role permissions, and inspect security parameters.
          </p>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="info-card-box">
        <div className="box-title-row">
          <User size={20} className="text-purple-600" />
          <h3>Active User Account & Role</h3>
        </div>
        <div className="profile-detail-grid">
          <div className="p-item">
            <span className="p-lbl">User Name</span>
            <span className="p-val">{user?.name || "Dr. Alex Vance"}</span>
          </div>
          <div className="p-item">
            <span className="p-lbl">Email Address</span>
            <span className="p-val">{user?.email || "alex.vance@citygeneral.org"}</span>
          </div>
          <div className="p-item">
            <span className="p-lbl">Assigned Role</span>
            <span className="role-chip font-bold">{user?.role?.toUpperCase() || "ADMINISTRATOR"}</span>
          </div>
          <div className="p-item">
            <span className="p-lbl">Hospital Node</span>
            <span className="p-val">{user?.hospital || "City General Hospital"}</span>
          </div>
        </div>
      </div>

      {/* API Endpoint Configuration */}
      <div className="info-card-box">
        <div className="box-title-row">
          <Server size={20} className="text-indigo-600" />
          <h3>Backend Microservice REST Endpoints</h3>
        </div>
        <div className="api-config-form">
          <div className="input-group">
            <label>Node.js Express Application API Base URL:</label>
            <input
              type="text"
              value={nodeUrl}
              onChange={(e) => setNodeUrl(e.target.value)}
              className="select-box w-full"
            />
          </div>
          <div className="input-group">
            <label>Python FastAPI AI Engine Base URL:</label>
            <input
              type="text"
              value={aiUrl}
              onChange={(e) => setAiUrl(e.target.value)}
              className="select-box w-full"
            />
          </div>
          <button
            className="btn-primary-purple self-start"
            onClick={testHealthEndpoints}
            disabled={checking}
          >
            <RefreshCw size={16} className={checking ? "animate-spin" : ""} />
            {checking ? "Pinging Services..." : "Run Service Health Check"}
          </button>

          {healthStatus && (
            <div className="health-results-box">
              <div className="h-res">
                <span>Express Node Backend:</span>
                <span className="font-bold text-green-600">{healthStatus.node}</span>
              </div>
              <div className="h-res">
                <span>FastAPI AI Service:</span>
                <span className="font-bold text-purple-600">{healthStatus.ai}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className="data-table-card">
        <div className="table-header-row">
          <div>
            <h3>Role-Based Access Control (RBAC) Permissions</h3>
            <p className="card-subtitle">Server-side enforced authorization rules</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Operation / Route</th>
                <th>Administrator</th>
                <th>Hospital Admin</th>
                <th>Researcher</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Register Hospital Node</td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
                <td>—</td>
              </tr>
              <tr>
                <td>Upload Local Hospital CSV</td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
                <td>—</td>
              </tr>
              <tr>
                <td>Trigger FedAvg Training Round</td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
                <td>—</td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
              </tr>
              <tr>
                <td>View Analytics & Brain Reports</td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
                <td><CheckCircle2 size={18} className="text-green-500" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance & Security Limitation Statement */}
      <div className="alert-disclaimer-box">
        <ShieldCheck size={24} className="text-purple-600" />
        <div>
          <strong>Privacy & Security Disclaimer:</strong> PrivaFuse is an academic demonstration platform. Standard model parameter updates are transmitted over REST APIs and require Transport Layer Security (TLS), access control tokens, and secure aggregation in production. This system is not HIPAA-certified or intended for clinical diagnosis.
        </div>
      </div>
    </div>
  );
}
