import React from "react";
import {
  BarChart3,
  TrendingUp,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Layers,
  FileSpreadsheet
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import "./Pages.css";

const versionData = [
  { version: "v1.0 (Local Only)", accuracy: 74.2, precision: 72.0, recall: 75.1, f1: 73.5 },
  { version: "v2.0 (FedAvg 3 Rounds)", accuracy: 86.4, precision: 84.8, recall: 87.2, f1: 86.0 },
  { version: "v2.4 (FedAvg 7 Rounds)", accuracy: 94.8, precision: 93.5, recall: 95.2, f1: 94.3 },
];

const clientWeightsData = [
  { feature: "age", hospitalA: 0.42, hospitalB: 0.39, hospitalC: 0.45, aggregated: 0.42 },
  { feature: "temperature", hospitalA: 1.15, hospitalB: 1.08, hospitalC: 1.22, aggregated: 1.15 },
  { feature: "heart_rate", hospitalA: 0.85, hospitalB: 0.82, hospitalC: 0.89, aggregated: 0.85 },
];

export default function AnalyticsPage() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title">Model Evaluation & Deep Analytics</h1>
          <p className="page-subtitle">
            Comprehensive held-out test evaluation, model version comparisons, and parameter weight distributions.
          </p>
        </div>
        <span className="tag-purple font-bold">Global Model Version v2.4</span>
      </div>

      {/* 4 Core Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-card-header">
            <span className="stat-title">Test Accuracy</span>
            <div className="stat-icon-bg purple"><Brain size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">94.8%</span>
            <span className="stat-trend positive"><TrendingUp size={14} /> +2.4%</span>
          </div>
          <p className="stat-sub">Calculated on 500 held-out test records</p>
        </div>

        <div className="stat-card blue">
          <div className="stat-card-header">
            <span className="stat-title">Precision Score</span>
            <div className="stat-icon-bg blue"><BarChart3 size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">93.5%</span>
            <span className="stat-chip green">High Confidence</span>
          </div>
          <p className="stat-sub">Low false positive rate (2.1%)</p>
        </div>

        <div className="stat-card green">
          <div className="stat-card-header">
            <span className="stat-title">Recall Rate</span>
            <div className="stat-icon-bg green"><CheckCircle2 size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">95.2%</span>
            <span className="stat-chip green">Clinical Sensitivity</span>
          </div>
          <p className="stat-sub">Identifies 95.2% true positive risks</p>
        </div>

        <div className="stat-card teal">
          <div className="stat-card-header">
            <span className="stat-title">F1 Score</span>
            <div className="stat-icon-bg teal"><Layers size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">94.3%</span>
            <span className="stat-trend neutral">Harmonic Mean</span>
          </div>
          <p className="stat-sub">Balanced performance index</p>
        </div>
      </div>

      {/* Model Version Comparison Chart */}
      <div className="chart-card">
        <div className="card-header">
          <div>
            <h3>Global Model Version Comparison</h3>
            <p className="card-subtitle">Performance progression from baseline single-hospital model to FedAvg v2.4</p>
          </div>
          <span className="tag-teal">+20.6% gain over baseline</span>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={versionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="version" stroke="#94a3b8" />
              <YAxis domain={[50, 100]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="accuracy" fill="#6366f1" radius={[6, 6, 0, 0]} name="Accuracy (%)" />
              <Bar dataKey="f1" fill="#0d9488" radius={[6, 6, 0, 0]} name="F1 Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Aggregated Model Parameter Weights Matrix */}
      <div className="data-table-card">
        <div className="table-header-row">
          <div>
            <h3>FedAvg Parameter Weight Distribution Matrix</h3>
            <p className="card-subtitle">Client weight contributions weighted by local dataset sample counts</p>
          </div>
          <span className="tag-purple">FedAvg Weight Formula</span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Feature Parameter</th>
                <th>Hospital A Weight (n=1,250)</th>
                <th>Hospital B Weight (n=980)</th>
                <th>Hospital C Weight (n=1,420)</th>
                <th>FedAvg Global Weight</th>
              </tr>
            </thead>
            <tbody>
              {clientWeightsData.map((row, i) => (
                <tr key={i}>
                  <td className="font-bold">{row.feature}</td>
                  <td>{row.hospitalA}</td>
                  <td>{row.hospitalB}</td>
                  <td>{row.hospitalC}</td>
                  <td className="font-bold text-indigo-600">{row.aggregated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
