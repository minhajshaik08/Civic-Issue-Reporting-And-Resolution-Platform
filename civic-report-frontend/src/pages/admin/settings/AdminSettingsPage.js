// src/pages/admin/settings/AdminSettingsPage.js
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminSettingsPage() {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="mb-4">Settings</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card
            className="p-3 shadow-sm clickable-card"
            onClick={() => navigate("/admin/welcome/settings/profile")}
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
            onClick={() => navigate("/admin/welcome/settings/security")}
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
            onClick={() => navigate("/admin/welcome/settings/appearance")}
          >
            <h5>Appearance</h5>
            <p className="mb-0 text-muted">
              Switch between light and dark mode.
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default AdminSettingsPage;
