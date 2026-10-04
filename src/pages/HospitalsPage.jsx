import React, { useState, useEffect } from "react";
import {
  Hospital as HospitalIcon,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Folder,
  Database,
  Activity,
  Sliders,
  Edit2,
  Trash2,
  ShieldAlert
} from "lucide-react";
import { nodeClient } from "../services/api";
import "./Pages.css";

const defaultHospitals = [
  {
    id: "hosp_1",
    name: "City General Hospital",
    location: "North Zone (Chicago, IL)",
    contact: "Dr. Sarah Jenkins",
    email: "sarah.j@citygeneral.org",
    status: "Active",
    participating: true,
    localPath: "/data/hospitals/city_general/",
    recordsCount: 1250,
    datasets: ["hospital_a.csv", "hospital_a_brain_demo.csv"],
    lastSync: "10 mins ago"
  },
  {
    id: "hosp_2",
    name: "St. Mary's Medical Center",
    location: "South Zone (Austin, TX)",
    contact: "Dr. Robert Chen",
    email: "r.chen@stmarys.org",
    status: "Active",
    participating: true,
    localPath: "/data/hospitals/st_marys/",
    recordsCount: 980,
    datasets: ["hospital_b.csv", "hospital_b_brain_demo.csv"],
    lastSync: "25 mins ago"
  },
  {
    id: "hosp_3",
    name: "Apollo Care Hospital",
    location: "East Zone (Boston, MA)",
    contact: "Dr. Anita Patel",
    email: "anita.p@apollocare.org",
    status: "Active",
    participating: true,
    localPath: "/data/hospitals/apollo_care/",
    recordsCount: 1420,
    datasets: ["hospital_c.csv", "hospital_c_brain_demo.csv"],
    lastSync: "1 hour ago"
  },
  {
    id: "hosp_4",
    name: "Unity Health Institute",
    location: "West Zone (Seattle, WA)",
    contact: "Dr. Marcus Brody",
    email: "m.brody@unityhealth.org",
    status: "Offline",
    participating: false,
    localPath: "/data/hospitals/unity_health/",
    recordsCount: 850,
    datasets: ["hospital_d_risk.csv"],
    lastSync: "1 day ago"
  }
];

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState(defaultHospitals);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHosp, setNewHosp] = useState({
    name: "",
    location: "",
    contact: "",
    email: "",
    localPath: ""
  });

  const toggleParticipation = (id) => {
    setHospitals(prev =>
      prev.map(h => h.id === id ? { ...h, participating: !h.participating } : h)
    );
  };

  const handleAddHospital = (e) => {
    e.preventDefault();
    const created = {
      id: `hosp_${Date.now()}`,
      name: newHosp.name,
      location: newHosp.location || "Central Region",
      contact: newHosp.contact || "Admin",
      email: newHosp.email,
      status: "Active",
      participating: true,
      localPath: newHosp.localPath || `/data/hospitals/${newHosp.name.toLowerCase().replace(/\s+/g, '_')}/`,
      recordsCount: 0,
      datasets: [],
      lastSync: "Just registered"
    };
    setHospitals([...hospitals, created]);
    setShowAddModal(false);
    setNewHosp({ name: "", location: "", contact: "", email: "", localPath: "" });
  };

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="flex-between">
        <div>
          <h1 className="page-title">Hospital Node Management</h1>
          <p className="page-subtitle">
            Configure participating hospital clients, local directory paths, and model training switches.
          </p>
        </div>
        <button className="btn-primary-purple" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Hospital Node
        </button>
      </div>

      {/* Notice Banner */}
      <div className="demo-notice-bar">
        <ShieldAlert size={18} className="text-purple-600" />
        <span>
          <strong>Simulated Nodes Disclaimer:</strong> Hospital entries are illustrative nodes for local federated aggregation demonstration.
        </span>
      </div>

      {/* Search Filter */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search hospital by name or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="count-badge">{filteredHospitals.length} Participating Nodes</span>
      </div>

      {/* Hospital Cards Grid */}
      <div className="hospitals-grid">
        {filteredHospitals.map((h) => (
          <div key={h.id} className={`hospital-card ${!h.participating ? "disabled-card" : ""}`}>
            <div className="hosp-card-header">
              <div className="hosp-avatar">
                <HospitalIcon size={22} />
              </div>
              <div className="hosp-header-text">
                <h3>{h.name}</h3>
                <span className="hosp-location">{h.location}</span>
              </div>
              <span className={`badge-status ${h.participating ? "active" : "offline"}`}>
                {h.participating ? "Training Enabled" : "Paused"}
              </span>
            </div>

            <div className="hosp-body">
              <div className="hosp-info-row">
                <span className="label">Contact Person:</span>
                <span className="value">{h.contact}</span>
              </div>
              <div className="hosp-info-row">
                <span className="label">Official Email:</span>
                <span className="value">{h.email}</span>
              </div>
              <div className="hosp-info-row">
                <span className="label">Local Data Path:</span>
                <span className="value-code"><Folder size={13} /> {h.localPath}</span>
              </div>
              <div className="hosp-info-row">
                <span className="label">Sample Records:</span>
                <span className="value font-bold">{h.recordsCount.toLocaleString()} rows</span>
              </div>
            </div>

            <div className="hosp-footer">
              <div className="datasets-chips">
                {h.datasets.length > 0 ? (
                  h.datasets.map((d, i) => (
                    <span key={i} className="chip-dataset">
                      <Database size={12} /> {d}
                    </span>
                  ))
                ) : (
                  <span className="chip-empty">No datasets assigned</span>
                )}
              </div>
              <div className="toggle-wrapper">
                <span className="toggle-label">Participate in FedAvg</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={h.participating}
                    onChange={() => toggleParticipation(h.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Register New Hospital Node</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddHospital} className="modal-form">
              <label>Hospital Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Metro Health Center"
                value={newHosp.name}
                onChange={(e) => setNewHosp({ ...newHosp, name: e.target.value })}
              />

              <label>Geographic Region / Location</label>
              <input
                type="text"
                placeholder="e.g. East Zone (Boston, MA)"
                value={newHosp.location}
                onChange={(e) => setNewHosp({ ...newHosp, location: e.target.value })}
              />

              <label>Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Dr. Jane Doe"
                value={newHosp.contact}
                onChange={(e) => setNewHosp({ ...newHosp, contact: e.target.value })}
              />

              <label>Official Email *</label>
              <input
                type="email"
                required
                placeholder="contact@metrohealth.org"
                value={newHosp.email}
                onChange={(e) => setNewHosp({ ...newHosp, email: e.target.value })}
              />

              <label>Assigned Local Directory Path</label>
              <input
                type="text"
                placeholder="/data/hospitals/metro_health/"
                value={newHosp.localPath}
                onChange={(e) => setNewHosp({ ...newHosp, localPath: e.target.value })}
              />

              <div className="modal-actions">
                <button type="button" className="btn-secondary-white" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-purple">
                  Save Hospital Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
