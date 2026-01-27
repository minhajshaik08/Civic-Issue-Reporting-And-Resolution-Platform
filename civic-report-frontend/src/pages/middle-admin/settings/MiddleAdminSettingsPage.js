// src/pages/middle-admin/settings/MiddleAdminSettingsPage.js
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MiddleAdminSettingsPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ SAME CSS AS ADMIN */}
      <style>{`
        .settings-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .settings-title {
          font-size: 24px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 16px;
        }

        .clickable-card {
          border: none;
          border-radius: 16px;
          background: #ffffff;
          cursor: pointer;
          transition: 0.25s ease;
          height: 100%;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.06);
          padding: 18px !important;
        }

        .clickable-card:hover {
          transform: translateY(-4px);
          box-shadow: 0px 10px 22px rgba(0, 0, 0, 0.12);
        }

        .card-heading {
          font-size: 18px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 6px;
        }

        .card-desc {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0px;
          line-height: 1.4;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .icon-profile {
          background: #e9f4ff;
        }

        .icon-security {
          background: #fff6da;
        }

        .icon-appearance {
          background: #e9fff2;
        }
      `}</style>

      <div className="settings-page">
        <h2 className="settings-title">Settings</h2>

        <Row className="g-4">
          <Col md={4}>
            <Card
              className="clickable-card"
              onClick={() =>
                navigate("/middle-admin/dashboard/settings/profile")
              }
            >
              <div className="card-icon icon-profile">👤</div>
              <div className="card-heading">Profile</div>
              <p className="card-desc">
                Update name, phone number, and profile photo.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card
              className="clickable-card"
              onClick={() =>
                navigate("/middle-admin/dashboard/settings/security")
              }
            >
              <div className="card-icon icon-security">🔒</div>
              <div className="card-heading">Security</div>
              <p className="card-desc">
                Change password, manage sessions, and login security.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card
              className="clickable-card"
              onClick={() =>
                navigate("/middle-admin/dashboard/settings/appearance")
              }
            >
              <div className="card-icon icon-appearance">🎨</div>
              <div className="card-heading">Appearance</div>
              <p className="card-desc">
                Switch between light and dark mode.
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default MiddleAdminSettingsPage;
