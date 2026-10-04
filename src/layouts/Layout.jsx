import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  LayoutDashboard,
  Hospital as HospitalIcon,
  Database,
  Brain,
  Network,
  Activity,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  User,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import "./Layout.css";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Hospitals", path: "/hospitals", icon: HospitalIcon },
    { name: "Datasets & Upload", path: "/datasets", icon: Database },
    { name: "Brain Report Analysis", path: "/brain-report", icon: Brain },
    { name: "Federated Learning", path: "/training", icon: Network },
    { name: "Disease Surveillance", path: "/surveillance", icon: Activity },
    { name: "Model Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Settings & Privacy", path: "/settings", icon: Settings },
  ];

  const getBreadcrumbs = () => {
    const current = navigation.find((item) => item.path === location.pathname);
    return current ? current.name : "Overview";
  };

  const notifications = [
    { id: 1, title: "Global Model Aggregated", time: "10 mins ago", type: "success" },
    { id: 2, title: "Hospital A CSV Uploaded", time: "1 hour ago", type: "info" },
    { id: 3, title: "Anomalous Risk Detected in North Zone", time: "3 hours ago", type: "warning" },
  ];

  return (
    <div className="layout-root">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-badge">
            <ShieldCheck className="brand-logo-icon" size={24} />
            <div className="brand-titles">
              <span className="brand-name">PrivaFuse</span>
              <span className="brand-sub">Privacy Healthcare AI</span>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="nav-section-label">MAIN WORKSPACE</div>
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={19} className="nav-icon" />
                <span>{item.name}</span>
                {isActive && <div className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="privacy-status-card">
            <div className="status-header">
              <Sparkles size={16} className="text-purple-600" />
              <span>FedAvg Engine Active</span>
            </div>
            <p>Raw patient data never leaves local hospital boundaries.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        {/* Top Header */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="breadcrumbs">
              <span className="breadcrumb-root">PrivaFuse</span>
              <ChevronRight size={14} className="breadcrumb-sep" />
              <span className="breadcrumb-current">{getBreadcrumbs()}</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Search Bar */}
            <div className="search-input-box">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Search datasets, models, hospitals..." />
            </div>

            {/* Notification Menu */}
            <div className="popover-container">
              <button
                className="icon-btn"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </button>
              {notificationsOpen && (
                <div className="popover-dropdown notifications-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <span className="badge">3 New</span>
                  </div>
                  <div className="notification-list">
                    {notifications.map((n) => (
                      <div key={n.id} className="notification-item">
                        <div className={`notif-icon-wrap ${n.type}`}>
                          <Info size={14} />
                        </div>
                        <div className="notif-content">
                          <p className="notif-title">{n.title}</p>
                          <span className="notif-time">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="popover-container">
              <button
                className="profile-btn"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="avatar">
                  {user?.name ? user.name.charAt(0) : "U"}
                </div>
                <div className="profile-text">
                  <span className="user-name">{user?.name || "Dr. Alex Vance"}</span>
                  <span className="user-role">
                    {user?.role === "admin"
                      ? "Administrator"
                      : user?.role === "researcher"
                      ? "Researcher"
                      : "Hospital Admin"}
                  </span>
                </div>
              </button>

              {profileOpen && (
                <div className="popover-dropdown profile-dropdown">
                  <div className="profile-dropdown-user">
                    <p className="user-full-name">{user?.name || "Dr. Alex Vance"}</p>
                    <p className="user-email">{user?.email || "alex@privafuse.org"}</p>
                    <span className="role-chip">
                      Role: {user?.role || "Hospital Admin"}
                    </span>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => navigate("/settings")}>
                    <User size={16} /> Profile & Settings
                  </button>
                  <button
                    className="dropdown-item text-red-600"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
