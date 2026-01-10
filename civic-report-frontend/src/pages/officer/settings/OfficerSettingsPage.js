// src/pages/officer/settings/OfficerSettingsPage.jsx
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate, Outlet } from "react-router-dom";

function OfficerSettingsPage() {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="mb-4">Settings</h2>

      {/* Cards row – same style as admin */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card
            className="p-3 shadow-sm clickable-card"
            onClick={() => navigate("/officer/dashboard/settings/profile")}
          >
            <h5>Profile</h5>
            <p className="mb-0 text-muted">
              Update name, phone number, and profile photo.
            </p>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="p-3 shadow-sm clickable-card"
            onClick={() => navigate("/officer/dashboard/settings/security")}
          >
            <h5>Security</h5>
            <p className="mb-0 text-muted">
              Change password, manage sessions, and login security.
            </p>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="p-3 shadow-sm clickable-card"
            onClick={() => navigate("/officer/dashboard/settings/appearance")}
          >
            <h5>Appearance</h5>
            <p className="mb-0 text-muted">
              Switch between light and dark mode.
            </p>
          </Card>
        </Col>
      </Row>

      {/* Child pages (profile / security / appearance) render here */}
      <Outlet />
    </>
  );
}

export default OfficerSettingsPage;
