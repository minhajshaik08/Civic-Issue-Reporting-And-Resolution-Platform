import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

function MiddleAdminSecuritySettingsPage() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!storedUser.id) {
      setError("User information missing. Please login again.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://13.201.16.142:5000/api/middle-admin/settings/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: storedUser.id,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setSuccess("✅ Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      setError("Error changing password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== SAME INLINE CSS AS ADMIN ===== */}
      <style>{`
        .security-card {
          max-width: 520px;
          margin: 40px auto;
          padding: 28px;
          border-radius: 16px;
          border: none;
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }

        .security-title {
          font-size: 22px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 20px;
        }

        .form-label {
          font-weight: 700;
          color: #111827;
        }

        .form-control {
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 600;
        }

        .form-control:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
        }

        .btn-save {
          border-radius: 12px;
          font-weight: 800;
          padding: 10px 16px;
        }

        .hint-text {
          font-size: 13px;
          color: #6b7280;
          margin-top: 6px;
        }
      `}</style>

      <Card className="security-card">
        <div className="security-title">Security Settings</div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleChangePassword}>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div className="hint-text">
              Password must be at least 6 characters
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="btn-save w-100"
            disabled={loading}
          >
            {loading ? "Updating Password..." : "Update Password"}
          </Button>
        </Form>
      </Card>
    </>
  );
}

export default MiddleAdminSecuritySettingsPage;
