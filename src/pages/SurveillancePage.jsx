import React, { useState } from "react";
import {
  MapPin,
  Activity,
  AlertTriangle,
  TrendingUp,
  Filter,
  Calendar,
  ShieldCheck,
  Search,
  Sliders
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./Pages.css";

const regionsData = [
  { id: "reg_1", name: "North Zone", code: "NZ-01", cases: 142, level: "High Risk", riskScore: 84, trend: "+14%", lat: 41.8781, lng: -87.6298, color: "#ef4444" },
  { id: "reg_2", name: "South Zone", code: "SZ-02", cases: 78, level: "Moderate Risk", riskScore: 52, trend: "-3%", lat: 30.2672, lng: -97.7431, color: "#f59e0b" },
  { id: "reg_3", name: "East Zone", code: "EZ-03", cases: 46, level: "Low Risk", riskScore: 28, trend: "-8%", lat: 42.3601, lng: -71.0589, color: "#10b981" },
  { id: "reg_4", name: "West Zone", code: "WZ-04", cases: 94, level: "Moderate Risk", riskScore: 61, trend: "+5%", lat: 47.6062, lng: -122.3321, color: "#f59e0b" },
];

const weeklyTrend = [
  { week: "W1", North: 32, South: 45, East: 20, West: 40 },
  { week: "W2", North: 48, South: 52, East: 22, West: 45 },
  { week: "W3", North: 75, South: 60, East: 28, West: 55 },
  { week: "W4", North: 110, South: 68, East: 35, West: 72 },
  { week: "W5", North: 142, South: 78, East: 46, West: 94 },
];

export default function SurveillancePage() {
  const [selectedRegion, setSelectedRegion] = useState(regionsData[0]);
  const [diseaseCategory, setDiseaseCategory] = useState("Respiratory/Flu");
  const [alertThreshold, setAlertThreshold] = useState(70);
  const [search, setSearch] = useState("");

  const filteredRegions = regionsData.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title">Geospatial Disease Surveillance</h1>
          <p className="page-subtitle">
            Real-time public health monitoring, synthetic regional case counts, and outbreak risk scores.
          </p>
        </div>
        <span className="tag-teal font-bold">Provenance: Synthetic Demo Signals</span>
      </div>

      {/* Synthetic Geographic Data Notice */}
      <div className="alert-disclaimer-box">
        <ShieldCheck size={20} className="text-teal-600" />
        <div>
          <strong>Geospatial Data Provenance Notice:</strong> All maps, case counts, and outbreak scores are synthetic demo visualizations. No real patient location or private address data is used or stored.
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-card-header">
            <span className="stat-title">Total Active Cases</span>
            <div className="stat-icon-bg purple"><Activity size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">360</span>
            <span className="stat-trend positive"><TrendingUp size={14} /> +8.2%</span>
          </div>
          <p className="stat-sub">Across 4 monitored geographic zones</p>
        </div>

        <div className="stat-card red">
          <div className="stat-card-header">
            <span className="stat-title">High Risk Regions</span>
            <div className="stat-icon-bg red"><AlertTriangle size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">1 Zone</span>
            <span className="stat-chip red">Threshold Exceeded</span>
          </div>
          <p className="stat-sub">North Zone (Risk Score: 84/100)</p>
        </div>

        <div className="stat-card teal">
          <div className="stat-card-header">
            <span className="stat-title">Configured Alert Trigger</span>
            <div className="stat-icon-bg teal"><Sliders size={20} /></div>
          </div>
          <div className="stat-value-group">
            <span className="stat-number">{alertThreshold}</span>
            <span className="stat-chip green">Custom Threshold</span>
          </div>
          <p className="stat-sub">Triggers alert when risk score {'>'} {alertThreshold}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="schema-selector-card">
        <div className="schema-group">
          <label className="schema-label">Disease Surveillance Category:</label>
          <select
            value={diseaseCategory}
            onChange={(e) => setDiseaseCategory(e.target.value)}
            className="select-box"
          >
            <option>Respiratory / Influenza-Like Illness</option>
            <option>Gastrointestinal Infections</option>
            <option>Vector-Borne Pathogens</option>
          </select>
        </div>

        <div className="hospital-select-group">
          <label className="schema-label">Alert Risk Threshold Score: {alertThreshold}</label>
          <input
            type="range"
            min="30"
            max="90"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
            className="w-48"
          />
        </div>
      </div>

      {/* Main Grid: Interactive Region Map & Regional Trend */}
      <div className="surveillance-main-grid">
        {/* Interactive Map Visualizer Card */}
        <div className="map-card-box">
          <div className="box-title-row">
            <MapPin size={20} className="text-purple-600" />
            <h3>Regional Surveillance Map</h3>
          </div>

          <div className="interactive-map-container">
            {regionsData.map((reg) => (
              <div
                key={reg.id}
                className={`map-zone-pin ${reg.id === selectedRegion.id ? "selected-pin" : ""}`}
                style={{
                  top: reg.id === "reg_1" ? "20%" : reg.id === "reg_2" ? "70%" : reg.id === "reg_3" ? "30%" : "55%",
                  left: reg.id === "reg_1" ? "55%" : reg.id === "reg_2" ? "45%" : reg.id === "reg_3" ? "80%" : "20%",
                  backgroundColor: reg.color
                }}
                onClick={() => setSelectedRegion(reg)}
              >
                <div className="pin-pulse" />
                <span className="pin-title">{reg.name} ({reg.cases})</span>
              </div>
            ))}
          </div>

          <div className="region-inspector-bar">
            <div>
              <strong>Selected Zone:</strong> {selectedRegion.name} ({selectedRegion.code})
            </div>
            <div>
              <strong>Risk Score:</strong> <span style={{ color: selectedRegion.color, fontWeight: 700 }}>{selectedRegion.riskScore}/100</span> ({selectedRegion.level})
            </div>
          </div>
        </div>

        {/* Regional Trend Chart */}
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>5-Week Regional Outbreak Trend</h3>
              <p className="card-subtitle">Weekly case aggregation for {selectedRegion.name}</p>
            </div>
            <span className="tag-purple">{selectedRegion.trend} this week</span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="North" stroke="#ef4444" strokeWidth={3} name="North Zone" />
                <Line type="monotone" dataKey="South" stroke="#f59e0b" strokeWidth={2} name="South Zone" />
                <Line type="monotone" dataKey="East" stroke="#10b981" strokeWidth={2} name="East Zone" />
                <Line type="monotone" dataKey="West" stroke="#8b5cf6" strokeWidth={2} name="West Zone" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Surveillance Data Table */}
      <div className="data-table-card">
        <div className="table-header-row">
          <h3>Regional Outbreak Risk Matrix</h3>
          <span className="count-badge">{filteredRegions.length} Monitored Zones</span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Zone Code</th>
                <th>Region Name</th>
                <th>Synthetic Cases</th>
                <th>Weekly Trend</th>
                <th>Outbreak Risk Score</th>
                <th>Surveillance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegions.map((reg) => (
                <tr key={reg.id} className={reg.id === selectedRegion.id ? "selected-row" : ""}>
                  <td className="font-bold">{reg.code}</td>
                  <td>{reg.name}</td>
                  <td className="font-bold">{reg.cases}</td>
                  <td className={reg.trend.startsWith("+") ? "text-red-600 font-semibold" : "text-green-600"}>
                    {reg.trend}
                  </td>
                  <td>
                    <div className="risk-score-wrapper">
                      <div className="risk-bar-bg">
                        <div
                          className="risk-bar-fill"
                          style={{ width: `${reg.riskScore}%`, backgroundColor: reg.color }}
                        />
                      </div>
                      <span className="risk-score-text">{reg.riskScore}/100</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-status ${reg.riskScore >= alertThreshold ? "syncing" : "active"}`}>
                      {reg.riskScore >= alertThreshold ? "Alert Triggered" : "Normal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
