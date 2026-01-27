import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, ListGroup, Card, Button } from "react-bootstrap";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./WelcomePage.css";

function WelcomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/admin/welcome";

  // ✅ READ JWT TOKEN + USER
  const token = localStorage.getItem("token");
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
          "http://localhost:5000/api/admin/dashboard/summary"
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
    ? `http://localhost:5000/uploads/${photoPath}`
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
    navigate("/login", { replace: true });
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

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* ✅ Sidebar */}
        <Col md={2} className="bg-dark text-white min-vh-100 d-flex flex-column">
          <div className="p-3">
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#6c757d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: "bold",
                color: "#fff",
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>{initial.toUpperCase()}</span>
              )}
            </div>

            {/* Name + role */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>
                {fullName || email || "User"}
              </div>
              {role && (
                <div style={{ fontSize: 12, color: "#d1d5db" }}>
                  {role.replace("_", " ")}
                </div>
              )}
            </div>

            {/* Menu */}
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/middle-admins"
                  className="text-white text-decoration-none"
                >
                  Middle Admins
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/officers"
                  className="text-white text-decoration-none"
                >
                  Officers
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/users"
                  className="text-white text-decoration-none"
                >
                  Users
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/issues"
                  className="text-white text-decoration-none"
                >
                  Issues
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/reports"
                  className="text-white text-decoration-none"
                >
                  Reports
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/settings"
                  className="text-white text-decoration-none"
                >
                  Settings
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </div>

          {/* Logout */}
          <div className="mt-auto p-3">
            <Button
              variant="outline-light"
              size="sm"
              className="w-50"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Col>

        {/* ✅ Main Content */}
        <Col md={10} className="p-4 dashboard-bg">
          {isDashboard && (
            <>
              {/* ✅ Stat Cards (4 in single row) */}
              <Row className="g-3 mb-4">
                <Col md={3}>
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

                <Col md={3}>
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

                <Col md={3}>
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

                <Col md={3}>
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
                  <Link to="/admin/welcome/issues" className="view-all-link">
                    View All →
                  </Link>
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
            </>
          )}

          <Outlet />
        </Col>
      </Row>
    </Container> 
  );
}

export default WelcomePage; 