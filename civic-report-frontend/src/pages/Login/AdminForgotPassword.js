import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // TODO: replace this with real backend call to /api/login/forgot-password
    // e.g.:
    // const res = await fetch("http://localhost:5000/api/login/forgot-password", { ... })

    setTimeout(() => {
      setMessage(`Password reset link sent to ${email}`);
      setError("");
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="py-5">
      <Container style={{ maxWidth: "480px" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-3 text-center">Forgot Password?</h3>
            <p className="text-muted text-center mb-4">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            {message && (
              <Alert variant="success" className="mb-3">
                {message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button type="submit" variant="success" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/Login/login")}
                  disabled={loading}
                >
                  ← Back to Login
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default AdminForgotPassword;
