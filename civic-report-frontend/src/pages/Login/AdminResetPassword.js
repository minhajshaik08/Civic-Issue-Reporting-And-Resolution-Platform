import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function AdminResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // read id from URL: /admin/reset-password?token=...&id=1
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password.trim()) {
      setError("Please enter a new password.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, password })
        }
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Password updated. You can now login.");
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <main className="py-5">
      <Container style={{ maxWidth: "480px" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-3 text-center">Reset Password</h3>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}
              {message && <p className="text-success">{message}</p>}

              <div className="d-grid mb-3">
                <Button type="submit" variant="primary">
                  Reset Password
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default AdminResetPassword;
