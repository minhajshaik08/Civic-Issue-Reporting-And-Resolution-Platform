// src/pages/admin/settings/ProfileSettingsPage.js
import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";

function ProfileSettingsPage() {
  // Read logged-in user from localStorage (saved at login)
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [username, setUsername] = useState(storedUser.username || "");
  const [fullName, setFullName] = useState(storedUser.full_name || "");
  const [phone, setPhone] = useState(storedUser.phone || "");
  const [photoFile, setPhotoFile] = useState(null);

  const email = storedUser.email || "";
  const role = storedUser.role || "super_admin";
  const userId = storedUser.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Decide which table to use based on role
      const table =
        role === "super_admin"
          ? "admins"
          : role === "middle_admin"
          ? "middle_admins"
          : "officers";

      // Check if username already exists (call backend endpoint)
      const checkRes = await fetch(
        `http://localhost:5000/api/login/check-username?username=${encodeURIComponent(
          username
        )}&excludeId=${userId}&table=${table}`
      );
      const checkData = await checkRes.json();

      if (!checkData.available) {
        setError("Username already exists. Please choose another.");
        setLoading(false);
        return;
      }

      // Build FormData for file upload
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("table", table);
      formData.append("username", username);
      formData.append("full_name", fullName);
      formData.append("phone", phone);
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      // Call backend PUT endpoint
      const res = await fetch("http://localhost:5000/api/login/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      // Update localStorage with new data
      const updatedUser = { ...storedUser, username, full_name: fullName, phone };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error updating profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="mb-4">Profile Settings</h4>

      {/* Display current email */}
      <div className="mb-4 p-3 bg-light border rounded">
        <p className="mb-0">
          <strong>Current Email:</strong>{" "}
          <span className="text-primary">{email}</span>
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-3">
          {success}
        </Alert>
      )}

      {!isEditing ? (
        // View mode
        <div>
          <Row className="mb-4">
            <Col md={3} className="text-center">
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  backgroundColor: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 600,
                }}
              >
                {fullName ? fullName[0].toUpperCase() : "U"}
              </div>
            </Col>
            <Col md={9}>
              <p className="mb-1">
                <strong>Role:</strong> {role}
              </p>
              <p className="text-muted">
                Role is managed by the system and cannot be edited here.
              </p>
            </Col>
          </Row>

          <div className="mb-3">
            <p>
              <strong>Username:</strong> {username || "Not set"}
            </p>
            <p>
              <strong>Full Name:</strong> {fullName || "Not set"}
            </p>
            <p>
              <strong>Phone Number:</strong> {phone || "Not set"}
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </div>
      ) : (
        // Edit mode
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
                <Form.Text className="text-muted">
                  Unique identifier for your account
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </Form.Group>
            </Col>
            
          </Row>

          <div className="d-flex gap-2">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setError("");
                setSuccess("");
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Card>
  );
}

export default ProfileSettingsPage;
