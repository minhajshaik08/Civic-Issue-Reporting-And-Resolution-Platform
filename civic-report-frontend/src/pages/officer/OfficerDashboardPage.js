import React, { useEffect } from "react";
import { Container, Row, Col, ListGroup, Card, Button } from "react-bootstrap";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import HamburgerSidebar from "../../components/HamburgerSidebar";
import "./OfficerDashboardPage.css";

function OfficerDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/officer/dashboard";

  // ✅ READ JWT TOKEN + USER (not loggedInUser)
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ REMOVED: Token redirect check - RequireAuth handles this now

  const email = storedUser.email || "";
  const fullName = storedUser.full_name || storedUser.username || "";
  const role = storedUser.role || "";
  const photoPath = storedUser.photo_url || storedUser.photoPath || null;

  // First letter from email; fallback to name; then "U"
  const initial =
    (email && email.trim()[0]) ||
    (fullName && fullName.trim()[0]) ||
    "U";

  const photoUrl = photoPath
    ? `http://13.201.16.142:5000/uploads/${photoPath}`
    : null;

  // Apply saved theme for this user when dashboard mounts
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

  // ✅ Menu Items for Officer
  const menuItems = [
    { to: "/officer/dashboard", label: "Home", icon: "🏠" },
    { to: "/officer/dashboard/issues", label: "Issues", icon: "📋" },
    { to: "/officer/dashboard/reports", label: "Reports", icon: "📈" },
    { to: "/officer/dashboard/gallery-upload", label: "Gallery", icon: "🖼️" },
    { to: "/officer/dashboard/settings", label: "Settings", icon: "⚙️" },
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
            <div className="welcome-section">
              <h2>Welcome, {fullName || email || "Officer"}! 👋</h2>
              <p>Here's your dashboard overview</p>
            </div>
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
}

export default OfficerDashboardPage;
