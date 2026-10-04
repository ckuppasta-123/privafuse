
import { useState } from "react";
import {
  HeartPulse,
  LayoutDashboard,
  Hospital,
  Users,
  Activity,
  MapPinned,
  BrainCircuit,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock3,
  CircleCheck,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [active, setActive] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Hospitals", icon: Hospital },
    { label: "Patients", icon: Users },
    { label: "Disease Surveillance", icon: MapPinned },
    { label: "Federated Learning", icon: BrainCircuit },
    { label: "Privacy & Security", icon: ShieldCheck },
    { label: "Settings", icon: Settings },
  ];

  const stats = [
    {
      label: "Connected Hospitals",
      value: "24",
      change: "+3 this month",
      icon: Hospital,
      type: "blue",
    },
    {
      label: "Model Accuracy",
      value: "94.8%",
      change: "+2.4% this month",
      icon: BrainCircuit,
      type: "purple",
    },
    {
      label: "Training Rounds",
      value: "128",
      change: "12 completed today",
      icon: Activity,
      type: "green",
    },
    {
      label: "Active Alerts",
      value: "03",
      change: "Requires review",
      icon: AlertTriangle,
      type: "orange",
    },
  ];

  return (
    <main className="dashboard">
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="dash-brand">
          <div className="dash-logo"><HeartPulse size={25} /></div>
          <div>
            <h2>FL-Health</h2>
            <span>Healthcare Intelligence</span>
          </div>
          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="side-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`nav-item ${active === item.label ? "nav-active" : ""}`}
                onClick={() => {
                  setActive(item.label);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.label === "Disease Surveillance" && (
                  <span className="nav-count">3</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="privacy-card">
            <ShieldCheck size={22} />
            <h4>Privacy protected</h4>
            <p>Patient records remain within their source hospitals.</p>
            <div className="privacy-status">
              <span /> Privacy status: Demo
            </div>
          </div>

          <button className="profile-row" onClick={() => navigate("/")}>
            <div className="profile-avatar">FH</div>
            <div className="profile-info">
              <strong>Hospital Admin</strong>
              <span>Demo workspace</span>
            </div>
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{active}</strong>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input placeholder="Search workspace..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="notification-button" aria-label="Notifications">
              <Bell size={19} />
              <span />
            </button>
            <div className="top-avatar">HA</div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-row">
            <div>
              <p className="date-label">HEALTHCARE INTELLIGENCE PLATFORM</p>
              <h1>{active}</h1>
              <p className="welcome-description">
                Monitor collaborative AI training and healthcare trends in one place.
              </p>
            </div>
            <button className="primary-action" onClick={() => setActive("Federated Learning")}>
              <BrainCircuit size={18} /> View AI Training
            </button>
          </div>

          <div className="system-banner">
            <div className="banner-icon"><ShieldCheck size={23} /></div>
            <div className="banner-copy">
              <strong>Your privacy-first AI workspace</strong>
              <p>Federated learning brings model updates together without centralizing raw patient records.</p>
            </div>
            <span className="demo-pill">DEMO DATA</span>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article className="stat-card" key={stat.label}>
                  <div className="stat-top">
                    <div className={`stat-icon ${stat.type}`}><Icon size={21} /></div>
                    <button className="stat-more" aria-label={`View ${stat.label}`}>
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                  <p>{stat.label}</p>
                  <h2>{stat.value}</h2>
                  <span className={`stat-change ${stat.type}`}>
                    {stat.type === "orange" ? <AlertTriangle size={14} /> : <TrendingUp size={14} />}
                    {stat.change}
                  </span>
                </article>
              );
            })}
          </div>

          <div className="dashboard-columns">
            <section className="panel training-panel">
              <div className="panel-heading">
                <div>
                  <h3>Federated Learning</h3>
                  <p>Collaborative model training status</p>
                </div>
                <button className="subtle-button" onClick={() => setActive("Federated Learning")}>
                  View details <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="training-summary">
                <div className="training-graphic"><BrainCircuit size={34} /></div>
                <div>
                  <span className="status-label"><span /> Model training active</span>
                  <h2>Round 128</h2>
                  <p>Last update: 8 minutes ago</p>
                </div>
              </div>

              <div className="progress-heading">
                <span>Current round progress</span>
                <strong>76%</strong>
              </div>
              <div className="progress-track"><div /></div>

              <div className="training-footer">
                <div><span>Participating hospitals</span><strong>18 / 24</strong></div>
                <div><span>Model version</span><strong>v2.4.1</strong></div>
              </div>
            </section>

            <section className="panel alerts-panel">
              <div className="panel-heading">
                <div>
                  <h3>Disease Surveillance</h3>
                  <p>Illustrative monitoring alerts</p>
                </div>
                <button className="icon-action" aria-label="Open surveillance" onClick={() => setActive("Disease Surveillance")}>
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div className="alert-item">
                <div className="alert-icon alert-orange"><AlertTriangle size={18} /></div>
                <div className="alert-copy">
                  <strong>Respiratory cases</strong>
                  <p>Region A · Review suggested</p>
                </div>
                <span className="severity medium">Review</span>
              </div>

              <div className="alert-item">
                <div className="alert-icon alert-purple"><Activity size={18} /></div>
                <div className="alert-copy">
                  <strong>Seasonal trend</strong>
                  <p>Region B · Monitor trend</p>
                </div>
                <span className="severity low">Monitor</span>
              </div>

              <div className="alert-item">
                <div className="alert-icon alert-green"><CircleCheck size={18} /></div>
                <div className="alert-copy">
                  <strong>Data synchronization</strong>
                  <p>Region C · Demo status</p>
                </div>
                <span className="severity normal">Normal</span>
              </div>

              <button className="all-alerts" onClick={() => setActive("Disease Surveillance")}>
                View surveillance overview <ArrowUpRight size={16} />
              </button>
            </section>
          </div>

          <section className="panel activity-panel">
            <div className="panel-heading">
              <div>
                <h3>Recent Activity</h3>
                <p>Example events from the demo workspace</p>
              </div>
              <button className="subtle-button" onClick={() => setActive("Federated Learning")}>
                View all <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="activity-table">
              <div className="activity-row activity-header">
                <span>EVENT</span><span>STATUS</span><span>TIME</span>
              </div>
              <div className="activity-row">
                <div className="event-cell"><span className="event-dot blue-dot" /><div><strong>Model update received</strong><small>Hospital node 08</small></div></div>
                <span className="table-status success-status">Completed</span>
                <span className="event-time"><Clock3 size={14} /> 8 min ago</span>
              </div>
              <div className="activity-row">
                <div className="event-cell"><span className="event-dot purple-dot" /><div><strong>Training round initiated</strong><small>Federated model v2.4.1</small></div></div>
                <span className="table-status running-status">In progress</span>
                <span className="event-time"><Clock3 size={14} /> 18 min ago</span>
              </div>
              <div className="activity-row">
                <div className="event-cell"><span className="event-dot green-dot" /><div><strong>Privacy audit completed</strong><small>Audit record #DEMO-104</small></div></div>
                <span className="table-status success-status">Completed</span>
                <span className="event-time"><Clock3 size={14} /> 32 min ago</span>
              </div>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>FL-Health · Federated Healthcare Intelligence</span>
            <span><ShieldCheck size={14} /> Privacy-first design · Demonstration environment</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
