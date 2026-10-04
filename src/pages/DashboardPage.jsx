import React, { useState, useEffect } from "react";
import {
  Hospital,
  Brain,
  Activity,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Database,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Play,
  Upload,
  Sparkles,
  Users
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useNavigate } from "react-router-dom";
import { nodeClient, aiClient } from "../services/api";
import "./Pages.css";

const accuracyData = [
  { round: "R1", accuracy: 68.2, loss: 0.62 },
  { round: "R2", accuracy: 74.5, loss: 0.54 },
  { round: "R3", accuracy: 81.0, loss: 0.45 },
  { round: "R4", accuracy: 86.4, loss: 0.38 },
  { round: "R5", accuracy: 89.8, loss: 0.29 },
  { round: "R6", accuracy: 92.1, loss: 0.22 },
  { round: "R7", accuracy: 94.8, loss: 0.16 },
];

const datasetDistribution = [
  { name: "City General", records: 1250, color: "#6366f1" },
  { name: "St. Mary's", records: 980, color: "#0d9488" },
  { name: "Apollo Care", records: 1420, color: "#8b5cf6" },
  { name: "Unity Health", records: 850, color: "#f59e0b" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    hospitals: 4,
    accuracy: 94.8,
    rounds: 12,
    datasets: 6,
    globalVersion: "v2.4",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch stats from Express backend if available
    nodeClient.get("/hospitals/stats")
      .then(res => {
        if (res.data) setStats(prev => ({ ...prev, ...res.data }));
      })
      .catch(() => {
        // Fallback to demo values
      });
  }, []);

  return (
    <div className="dashboard-container">
      {/* Top Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="status-pill">
            <span className="pulse-dot" />
            <span>PRIVAFUSE FEDERATED ENGINE v2.4 ACTIVE</span>
          </div>
          <h1>Healthcare Intelligence & Federated Learning</h1>
          <p>
            Privacy-preserving collaborative AI platform for multi-hospital analytics and brain report metadata evaluation.
          </p>
        </div>
        <div className="banner-actions">
          <button className="btn-primary-purple" onClick={() => navigate("/training")}>
            <Play size={16} /> Run FL Round
          </button>
          <button className="btn-secondary-white" onClick={() => navigate("/datasets")}>
            <Upload size={16} /> Upload Dataset
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-card-header">
            <span className="stat-title">Connected Hospitals</span>
            <div className="stat-icon-bg blue"><Hospital size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">{stats.hospitals}</span>
            <span className="stat-trend positive">
              <TrendingUp size={14} /> +1 active
            </span>
          </div>
          <p className="stat-sub">Isolated local nodes participating</p>
        </div>

        <div className="stat-card purple">
          <div className="stat-card-header">
            <span className="stat-title">Global Model Accuracy</span>
            <div className="stat-icon-bg purple"><Brain size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">{stats.accuracy}%</span>
            <span className="stat-trend positive">
              <TrendingUp size={14} /> +2.4% (R7)
            </span>
          </div>
          <p className="stat-sub">Evaluated on held-out test set</p>
        </div>

        <div className="stat-card green">
          <div className="stat-card-header">
            <span className="stat-title">Completed Rounds</span>
            <div className="stat-icon-bg green"><Activity size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">{stats.rounds}</span>
            <span className="stat-chip green">FedAvg Sync</span>
          </div>
          <p className="stat-sub">Global version {stats.globalVersion}</p>
        </div>

        <div className="stat-card teal">
          <div className="stat-card-header">
            <span className="stat-title">Registered Datasets</span>
            <div className="stat-icon-bg teal"><Database size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">4,500</span>
            <span className="stat-trend neutral">Tabular Records</span>
          </div>
          <p className="stat-sub">Local CSV datasets configured</p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="charts-main-grid">
        {/* FedAvg Convergence Area Chart */}
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>Federated Convergence & Accuracy Curve</h3>
              <p className="card-subtitle">Global model test accuracy over rounds (FedAvg)</p>
            </div>
            <span className="tag-purple">Live Evaluation</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={accuracyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="round" stroke="#94a3b8" />
                <YAxis domain={[50, 100]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" name="Accuracy (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dataset Distribution Bar Chart */}
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>Local Dataset Record Counts</h3>
              <p className="card-subtitle">Local patient record distribution per hospital node</p>
            </div>
            <span className="tag-teal">Demographics</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={datasetDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="records" fill="#0d9488" radius={[6, 6, 0, 0]} name="Sample Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Row: Privacy Assurance & Audit Feed */}
      <div className="bottom-sections-grid">
        {/* Privacy & Architecture Box */}
        <div className="info-card-box">
          <div className="box-title-row">
            <ShieldCheck className="text-teal-600" size={22} />
            <h3>Privacy & Security Architecture</h3>
          </div>
          <p className="box-description">
            PrivaFuse enforces strict dataset isolation. Hospital data stays inside local hospital perimeters. Only mathematical model updates (gradients/weights) are sent to the central coordinator.
          </p>
          <div className="privacy-feature-list">
            <div className="privacy-feature-item">
              <CheckCircle2 size={16} className="text-green-500" />
              <div>
                <strong>Local Dataset Storage:</strong> CSV and tabular files remain on private local storage nodes.
              </div>
            </div>
            <div className="privacy-feature-item">
              <CheckCircle2 size={16} className="text-green-500" />
              <div>
                <strong>FedAvg Weight Transmission:</strong> Only compatible parameter weights are transferred over REST APIs.
              </div>
            </div>
            <div className="privacy-feature-item">
              <CheckCircle2 size={16} className="text-green-500" />
              <div>
                <strong>Audit Event Logging:</strong> Security and training event logs are captured without storing patient PHI.
              </div>
            </div>
          </div>
        </div>

        {/* Audit / Recent Activity Log */}
        <div className="activity-card-box">
          <div className="box-title-row">
            <Clock size={20} className="text-indigo-600" />
            <h3>System Audit & Training Activity</h3>
          </div>
          <div className="activity-timeline">
            <div className="timeline-item">
              <div className="timeline-dot purple" />
              <div className="timeline-content">
                <span className="time">Just now</span>
                <p><strong>Global Model v2.4 Aggregated</strong> — FedAvg completed across 3 participating clients.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot teal" />
              <div className="timeline-content">
                <span className="time">15 mins ago</span>
                <p><strong>Dataset Validated</strong> — Hospital A uploaded synthetic risk dataset (1,250 records).</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot blue" />
              <div className="timeline-content">
                <span className="time">1 hour ago</span>
                <p><strong>Brain Report Classifier Evaluated</strong> — Held-out test set accuracy achieved 92.5%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
