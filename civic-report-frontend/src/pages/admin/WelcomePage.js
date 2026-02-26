import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HamburgerSidebar from "../../components/HamburgerSidebar";
import "./WelcomePage.css";

function WelcomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/admin/welcome";

  // ✅ READ JWT TOKEN + USER
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ REMOVED: Token redirect check - RequireAuth handles this now

  // ✅ REAL DASHBOARD DATA
  const [stats, setStats] = useState({
    totalIssues: 0,
    registeredUsers: 0,
    onDutyOfficers: 0,
    resolvedIssues: 0,
  });

  const [recentIssues, setRecentIssues] = useState([]);

  // ✅ FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          "http://13.201.16.142:5000/api/admin/dashboard/summary"
        );

        setStats(res.data.stats);
        setRecentIssues(res.data.recentIssues);

        console.log("✅ Dashboard Data:", res.data);
      } catch (error) {
        console.log("❌ Dashboard API Error:", error);
      }
    };

    if (isDashboard) fetchDashboardData();
  }, [isDashboard]);

  const email = storedUser.email || "";
  const fullName = storedUser.full_name || storedUser.username || "";
  const role = storedUser.role || "";
  const photoPath = storedUser.photo_url || storedUser.photoPath || null;

  const initial =
    (email && email.trim()[0]) || (fullName && fullName.trim()[0]) || "U";

  const photoUrl = photoPath
    ? `http://13.201.16.142:5000/uploads/${photoPath}`
    : null;

  // ✅ Apply saved theme for admin
  useEffect(() => {
    const userKey =
      storedUser.username || storedUser.email || storedUser.id || "guest";
    const savedTheme =
      (userKey && localStorage.getItem(`theme_${userKey}`)) || "light";
    document.body.dataset.theme = savedTheme;
  }, [storedUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("sessionId");
    // use full replace to unload SPA state and ensure history entry is replaced
    window.location.replace("/Login");
  };

  const isActive = (to) => {
    return location.pathname === to || location.pathname.startsWith(to);
  };

  const getIcon = (label) => {
    if (label === "Total Issues") return "📋";
    if (label === "Registered Users") return "👥";
    if (label === "On-duty Officers") return "🛡️";
    if (label === "Resolved Issues") return "📊";
    return "✅";
  };

  // ✅ Show time if today else date
  const formatIssueTime = (dateString) => {
    if (!dateString) return "";

    const issueDate = new Date(dateString);
    const today = new Date();

    const isToday =
      issueDate.getDate() === today.getDate() &&
      issueDate.getMonth() === today.getMonth() &&
      issueDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return issueDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return issueDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  // ✅ Menu Items for Admin
  const menuItems = [
    { to: "/admin/welcome", label: "Home", icon: "🏠" },
    { to: "/admin/welcome/middle-admins", label: "Admins", icon: "🧑‍💼" },
    { to: "/admin/welcome/officers", label: "Officers", icon: "👮" },
    { to: "/admin/welcome/users", label: "Users", icon: "👥" },
    { to: "/admin/welcome/issues", label: "Issues", icon: "📋" },
    { to: "/admin/welcome/reports", label: "Reports", icon: "📈" },
    { to: "/admin/welcome/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="dashboard-layout-wrapper">
      <HamburgerSidebar
        user={fullName || email || "User"}
        photoUrl={photoUrl}
        initial={initial}
        menuItems={menuItems}
        onLogout={handleLogout}
        role={role}
      />

      <div className="dashboard-content-wrapper">
        {isDashboard && (
          <div className="p-4 dashboard-bg">
            {/* ✅ Stat Cards (4 in single row) */}
            <Row className="g-3 mb-4">
              <Col md={3} sm={6} xs={12}>
                <Card className="stat-card">
                  <div className="stat-left">
                    <div className="stat-icon blue">
                      {getIcon("Total Issues")}
                    </div>
                    <div>
                      <div className="stat-title">Total Issues</div>
                      <div className="stat-value">{stats.totalIssues}</div>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col md={3} sm={6} xs={12}>
                <Card className="stat-card">
                  <div className="stat-left">
                    <div className="stat-icon green">
                      {getIcon("Registered Users")}
                    </div>
                    <div>
                      <div className="stat-title">Registered Users</div>
                      <div className="stat-value">{stats.registeredUsers}</div>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col md={3} sm={6} xs={12}>
                <Card className="stat-card">
                  <div className="stat-left">
                    <div className="stat-icon yellow">
                      {getIcon("On-duty Officers")}
                    </div>
                    <div>
                      <div className="stat-title">On-duty Officers</div>
                      <div className="stat-value">{stats.onDutyOfficers}</div>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col md={3} sm={6} xs={12}>
                <Card className="stat-card">
                  <div className="stat-left">
                    <div className="stat-icon orange">
                      {getIcon("Resolved Issues")}
                    </div>
                    <div>
                      <div className="stat-title">Resolved Issues</div>
                      <div className="stat-value">{stats.resolvedIssues}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* ✅ Recent Issues */}
            <Card className="recent-card">
              <div className="recent-header">
                <h5 className="mb-0">Recent Issues</h5>
              </div>

              <div className="recent-list">
                {recentIssues.length === 0 ? (
                  <div style={{ padding: "10px", color: "#6b7280" }}>
                    No recent issues found.
                  </div>
                ) : (
                  recentIssues.map((issue) => (
                    <div key={issue.id} className="recent-item">
                      <div className="recent-badge warning">⚠</div>

                      <div className="recent-text">
                        <div className="recent-title">
                          {issue.issue_type}
                        </div>
                        <div className="recent-desc">{issue.description}</div>
                      </div>

                      {/* ✅ TIME (if today) else DATE */}
                      <div className="recent-time">
                        {formatIssueTime(issue.created_at)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
}

export default WelcomePage;