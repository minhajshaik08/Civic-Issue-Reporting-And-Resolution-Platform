import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";

function OfficerProfileSettingsPage() {
  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [username, setUsername] = useState(userData.username || "");
  const [name, setName] = useState(userData.name || "");
  const [mobile, setMobile] = useState(userData.mobile || "");

  const email = userData.email;
  const userId = userData.id;

  const avatarLetter =
    (email && email[0]) ||
    (name && name[0]) ||
    (username && username[0]) ||
    "O";

  /* ================= UPDATE PROFILE ================= */
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
          `http://13.201.16.142:5000/api/officer/settings/profile/check-username?username=${encodeURIComponent(
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
        "http://13.201.16.142:5000/api/officer/settings/profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            username,
            name,
            mobile,
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
        name,
        mobile,
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
                <div className="mt-2 fw-bold">OFFICER</div>
              </Col>

              <Col md={9}>
                <p><b>Username:</b> {userData.username}</p>
                <p><b>Name:</b> {userData.name}</p>
                <p><b>Mobile:</b> {userData.mobile || "—"}</p>
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
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
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

export default OfficerProfileSettingsPage;
