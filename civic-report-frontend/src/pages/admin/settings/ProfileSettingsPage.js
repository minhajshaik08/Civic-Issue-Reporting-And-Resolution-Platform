import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";

function ProfileSettingsPage() {
  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [username, setUsername] = useState(userData.username || "");
  const [fullName, setFullName] = useState(userData.full_name || "");
  const [phone, setPhone] = useState(userData.phone || "");

  const email = userData.email;
  const userId = userData.id;

  const avatarLetter =
    (email && email[0]) ||
    (fullName && fullName[0]) ||
    (username && username[0]) ||
    "U";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!userId) {
        setError("User not found. Please login again.");
        return;
      }

      // Username uniqueness check
      if (username !== userData.username) {
        const checkRes = await fetch(
          `http://localhost:5000/api/admin/settings/profile/check-username?username=${encodeURIComponent(
            username
          )}&excludeId=${userId}`
        );

        const checkData = await checkRes.json();
        if (!checkData.available) {
          setError("Username already exists.");
          return;
        }
      }

      const res = await fetch(
        "http://localhost:5000/api/admin/settings/profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            username,
            full_name: fullName,
            phone,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Update failed");
        return;
      }

      const updatedUser = {
        ...userData,
        username,
        full_name: fullName,
        phone,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);

      setSuccess("✅ Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="p-4 mx-auto" style={{ maxWidth: 750 }}>
        <h4>Profile Settings</h4>

        <p>
          <strong>Email:</strong>{" "}
          <span style={{ color: "#2563eb" }}>{email}</span>
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {!isEditing ? (
          <>
            <Row className="mb-4">
              <Col md={3} className="text-center">
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "#e5e7eb",
                    fontSize: 32,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {avatarLetter}
                </div>
                <div className="mt-2 fw-bold"> SUPER ADMIN</div>
              </Col>

              <Col md={9}>
                <p><b>Username:</b> {userData.username}</p>
                <p><b>Full Name:</b> {userData.full_name}</p>
                <p><b>Phone:</b> {userData.phone || "—"}</p>
              </Col>
            </Row>

            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Username *</Form.Label>
                <Form.Control
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Col>

              <Col md={6}>
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Col>
            </Row>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>{" "}
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}

export default ProfileSettingsPage;
