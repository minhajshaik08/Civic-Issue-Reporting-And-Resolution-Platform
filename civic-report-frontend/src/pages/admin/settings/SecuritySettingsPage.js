import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SecuritySettingsPage() {
  const navigate = useNavigate();
  // use the same key used everywhere else
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!storedUser.id || !storedUser.table) {
      setMessage("User information missing. Please login again.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // backend endpoint you will implement in /api/login/change-password
      const res = await fetch(
        "http://localhost:5000/api/login/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: storedUser.id,
            table: storedUser.table, // "admins" | "middle_admins" | "officers"
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message || "Failed to change password.");
        return;
      }

      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setMessage("Error changing password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = () => {
    // Clear current login for this browser
    localStorage.removeItem("loggedInUser");
    navigate("/Login");
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="mb-3">Security</h4>

      <Form onSubmit={handleChangePassword} className="mb-4">
        <h5 className="mb-3">Change Password</h5>
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
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>
        <Button type="submit" variant="success" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </Button>
        {message && (
          <p className="mt-2" style={{ color: "#374151" }}>
            {message}
          </p>
        )}
      </Form>

      <div className="mb-4">
        <h5>Logout from all devices</h5>
        <p className="text-muted mb-2">
          This will clear your current session on this browser.
        </p>
        <Button variant="outline-danger" onClick={handleLogoutAll}>
          Logout from all devices
        </Button>
      </div>
    </Card>
  );
}

export default SecuritySettingsPage;
