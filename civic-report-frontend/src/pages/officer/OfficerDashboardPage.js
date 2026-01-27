import React, { useEffect } from "react";
import { Container, Row, Col, ListGroup, Card, Button } from "react-bootstrap";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

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
    ? `http://localhost:5000/uploads/${photoPath}`
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
    localStorage.removeItem("token"); // ✅ REMOVE TOKEN
    localStorage.removeItem("user");  // ✅ REMOVE USER
    navigate("/login", { replace: true });
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col
          md={2}
          className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-between"
        >
          <div className="p-3">
            {/* Logo / Avatar */}
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

            {/* Role / name text */}
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

            <ListGroup variant="flush">
              {/* Officer dashboard main sections */}
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/officer/dashboard/issues"
                  className="text-white text-decoration-none"
                >
                  Issues
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/officer/dashboard/reports"
                  className="text-white text-decoration-none"
                >
                  Reports
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/officer/dashboard/settings"
                  className="text-white text-decoration-none"
                >
                  Settings
                </Link>
              </ListGroup.Item>

              {/* Gallery Upload link to nested route */}
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/officer/dashboard/gallery-upload"
                  className="text-white text-decoration-none"
                >
                  Gallery Upload
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </div>

          {/* Logout near bottom, slightly above edge */}
          <div style={{ padding: "1rem", marginBottom: "96px" }}>
            <Button
              variant="outline-light"
              size="sm"
              className="w-100"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          {/* Default 4 boxes only on /officer/dashboard */}
          {isDashboard && (
            <Row className="mb-4">
              {[1, 2, 3, 4].map((item) => (
                <Col md={3} key={item} className="mb-3">
                  <Card className="shadow-sm text-center p-3">
                    <h5>Box {item}</h5>
                    <p>Placeholder</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Nested route content renders here */}
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default OfficerDashboardPage;
