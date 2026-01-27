// src/pages/admin/settings/ProfileSettingsPage.js
import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";

function ProfileSettingsPage() {
  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ original values (to compare)
  const originalUsername = userData.username || "";
  const originalFullName = userData.full_name || "";
  const originalPhone = userData.phone || "";

  // ✅ Form state
  const [username, setUsername] = useState(originalUsername);
  const [fullName, setFullName] = useState(originalFullName);
  const [phone, setPhone] = useState(originalPhone);
  const [photoFile, setPhotoFile] = useState(null);

  const email = userData.email || "";
  const role = userData.role || "super_admin";
  const userId = userData.id;

  // ✅ Avatar letter same as sidebar
  const avatarLetter =
    (email && email.trim()[0]) ||
    (fullName && fullName.trim()[0]) ||
    (username && username.trim()[0]) ||
    "U";

  const roleText = role ? role.replace("_", " ").toUpperCase() : "USER";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      const trimmedUsername = username.trim();
      const trimmedFullName = fullName.trim();
      const trimmedPhone = phone.trim();

      // ✅ Decide which table to use
      const table =
        role === "super_admin"
          ? "admins"
          : role === "middle_admin"
          ? "middle_admins"
          : "officers";

      // ✅ Check username only if changed
      const usernameChanged = trimmedUsername !== originalUsername;

      if (usernameChanged) {
        const checkRes = await fetch(
          `http://localhost:5000/api/login/check-username?username=${encodeURIComponent(
            trimmedUsername
          )}&excludeId=${userId}&table=${table}`
        );

        const checkData = await checkRes.json();

        if (!checkData.available) {
          setError("Username already exists. Please choose another.");
          setLoading(false);
          return;
        }
      }

      // ✅ Build FormData
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("table", table);
      formData.append("username", trimmedUsername);
      formData.append("full_name", trimmedFullName);
      formData.append("phone", trimmedPhone);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      // ✅ Update profile API
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

      // ✅ Update LocalStorage + state immediately
      const updatedUser = {
        ...userData,
        username: trimmedUsername,
        full_name: trimmedFullName,
        phone: trimmedPhone,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);

      setSuccess("✅ Profile updated successfully!");
      setIsEditing(false);
      setPhotoFile(null);

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error(err);
      setError("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .profile-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-card {
          width: 100%;
          max-width: 760px;
          border: none;
          border-radius: 16px;
          background: #fff;
          padding: 22px;
          box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.08);
        }

        .profile-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 14px;
        }

        .top-info {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 14px;
        }

        .email-text {
          color: #2563eb;
          font-weight: 900;
        }

        .avatar-box {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          font-weight: 900;
          color: #111827;
          margin: 0 auto;
        }

        .role-pill {
          display: inline-block;
          margin-top: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #e9f4ff;
          color: #1e40af;
          font-weight: 900;
          font-size: 12px;
        }

        .profile-lines p {
          margin: 0;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 700;
          color: #111827;
        }

        .profile-lines p:last-child {
          border-bottom: none;
        }

        .profile-lines span {
          font-weight: 600;
          color: #6b7280;
        }

        .form-label {
          font-weight: 900;
          color: #111827;
        }

        .form-control {
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 600;
        }

        .form-control:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
        }

        .btn-strong {
          border-radius: 12px !important;
          font-weight: 900 !important;
          padding: 10px 14px !important;
        }
      `}</style>

      <div className="profile-page">
        <Card className="profile-card">
          <div className="profile-title">Profile Settings</div>

          <div className="top-info">
            <p className="mb-0">
              <strong>Current Email:</strong>{" "}
              <span className="email-text">{email || "Not Available"}</span>
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
            <>
              <Row className="align-items-center mb-4">
                <Col md={3} className="text-center">
                  <div className="avatar-box">{avatarLetter.toUpperCase()}</div>
                  <div className="role-pill">{roleText}</div>
                </Col>

                <Col md={9}>
                  <div className="profile-lines">
                    <p>
                      Username: <span>{userData.username || "Not set"}</span>
                    </p>
                    <p>
                      Full Name: <span>{userData.full_name || "Not set"}</span>
                    </p>
                    <p>
                      Phone Number: <span>{userData.phone || "Not set"}</span>
                    </p>
                  </div>
                </Col>
              </Row>

              <Button
                variant="primary"
                className="btn-strong"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Username *</Form.Label>
                    <Form.Control
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Form.Text className="text-muted">
                      Must be unique (checked only if changed)
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
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
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Profile Photo (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhotoFile(e.target.files[0])}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  variant="success"
                  className="btn-strong"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="btn-strong"
                  disabled={loading}
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                    setSuccess("");
                    setUsername(userData.username || "");
                    setFullName(userData.full_name || "");
                    setPhone(userData.phone || "");
                    setPhotoFile(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </div>
    </>
  );
}

export default ProfileSettingsPage;
