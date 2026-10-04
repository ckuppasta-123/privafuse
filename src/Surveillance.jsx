
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Search,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import "./Surveillance.css";

const regions = [
  { name: "North Zone", cases: 128, level: "High", color: "#ef4444" },
  { name: "South Zone", cases: 74, level: "Moderate", color: "#f59e0b" },
  { name: "East Zone", cases: 46, level: "Low", color: "#10b981" },
  { name: "West Zone", cases: 91, level: "Moderate", color: "#f59e0b" },
];

const trend = [32, 44, 38, 58, 51, 68, 62, 82, 72, 94, 86, 108];

export default function Surveillance() {
  const [region, setRegion] = useState("All regions");
  const [search, setSearch] = useState("");

  const visibleRegions = regions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="surveillance-page">
      <header className="surveillance-header">
        <div>
          <span className="surveillance-eyebrow">
            <Activity size={15} /> PUBLIC HEALTH INTELLIGENCE
          </span>
          <h1>Disease Surveillance</h1>
          <p>Monitor regional health indicators and review outbreak signals.</p>
        </div>
        <div className="surveillance-demo-tag">DEMO DATA</div>
      </header>

      <section className="surveillance-filters">
        <label className="surveillance-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search region..."
          />
        </label>

        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option>All regions</option>
          <option>North Zone</option>
          <option>South Zone</option>
          <option>East Zone</option>
          <option>West Zone</option>
        </select>

        <button
          className="surveillance-date"
          onClick={() => window.alert("Demo view: Last 30 days")}
        >
          <CalendarDays size={17} /> Last 30 days
        </button>
      </section>

      <section className="surveillance-metrics">
        <article className="surveillance-card">
          <span className="metric-icon purple"><Activity size={20} /></span>
          <p>Reported cases</p>
          <h2>339</h2>
          <small>Illustrative total across regions</small>
        </article>
        <article className="surveillance-card">
          <span className="metric-icon orange"><AlertTriangle size={20} /></span>
          <p>Regions to review</p>
          <h2>2</h2>
          <small>Demo thresholds only</small>
        </article>
        <article className="surveillance-card">
          <span className="metric-icon green"><MapPin size={20} /></span>
          <p>Regions monitored</p>
          <h2>4</h2>
          <small>Sample monitoring zones</small>
        </article>
        <article className="surveillance-card">
          <span className="metric-icon blue"><TrendingUp size={20} /></span>
          <p>Trend indicator</p>
          <h2>Rising</h2>
          <small>Based on illustrative values</small>
        </article>
      </section>

      <section className="surveillance-main-grid">
        <article className="surveillance-panel trend-panel">
          <div className="surveillance-panel-heading">
            <div>
              <h3>Reported case trend</h3>
              <p>Sample weekly values · not real surveillance data</p>
            </div>
            <span className="trend-chip"><ArrowUpRight size={15} /> Sample trend</span>
          </div>

          <div className="trend-chart">
            {trend.map((value, index) => (
              <div className="trend-column" key={index}>
                <div
                  className="trend-bar"
                  style={{ height: `${(value / 110) * 100}%` }}
                  title={`${value} sample cases`}
                />
                <span>{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="trend-axis-labels">
            <span>Week 1</span><span>Week 6</span><span>Week 12</span>
          </div>
        </article>

        <article className="surveillance-panel">
          <div className="surveillance-panel-heading">
            <div>
              <h3>Regional overview</h3>
              <p>Illustrative regional distribution</p>
            </div>
            <MapPin size={19} color="#64748b" />
          </div>

          <div className="region-visual">
            <div className="region-map-shape">
              <span className="map-dot dot-one" />
              <span className="map-dot dot-two" />
              <span className="map-dot dot-three" />
              <span className="map-dot dot-four" />
              <span className="map-label label-one">North</span>
              <span className="map-label label-two">South</span>
              <span className="map-label label-three">East</span>
              <span className="map-label label-four">West</span>
            </div>
            <p className="map-disclaimer">
              Conceptual map illustration — not geographic boundaries.
            </p>
          </div>
        </article>
      </section>

      <section className="surveillance-panel regional-table-panel">
        <div className="surveillance-panel-heading">
          <div>
            <h3>Regional case summary</h3>
            <p>Use the search and filter to explore the sample dataset.</p>
          </div>
        </div>

        <div className="regional-table">
          <div className="regional-row regional-row-heading">
            <span>Region</span><span>Sample cases</span><span>Review level</span>
          </div>
          {visibleRegions
            .filter((item) => region === "All regions" || item.name === region)
            .map((item) => (
              <div className="regional-row" key={item.name}>
                <span className="region-name"><MapPin size={16} /> {item.name}</span>
                <strong>{item.cases}</strong>
                <span className="region-status" style={{ color: item.color }}>
                  <span style={{ background: item.color }} />
                  {item.level}
                </span>
              </div>
            ))}
          {visibleRegions.filter(
            (item) => region === "All regions" || item.name === region
          ).length === 0 && (
            <p className="no-regions">No matching regions found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
