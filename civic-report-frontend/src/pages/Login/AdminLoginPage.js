import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const isValidPassword = (value) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).{6,}$/.test(
      value
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 6 characters and contain at least one uppercase letter, one number, and one special character."
      );
      return;
    }

    setLoading(true);

    try {
      // CORRECT backend URL (matches server.js + routes/login.js)
      const res = await fetch("http://localhost:5000/api/login/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // ROLE-BASED REDIRECTION
      const { user } = data; // backend sends { user: { role, ... } }
      const role = user?.role;

      localStorage.setItem("user", JSON.stringify(user));

      switch (role) {
        case "middle_admin":
          navigate("/middle-admin/welcome");
          break;
        case "officer":
          navigate("/admin/welcome/officers");
          break;
        case "super_admin":
        default:
          navigate("/admin/welcome");
          break;
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/Login/forgot-password");
  };

  return (
    <main className="py-5">
      <Container style={{ maxWidth: "480px" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-3 text-center">Admin Login</h3>
            <p className="text-muted text-center mb-4">
              Only authorized administrators can access the dashboard.
            </p>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  At least 6 characters, 1 uppercase, 1 number, 1 special
                  character.
                </Form.Text>
              </Form.Group>

              <div className="text-end mb-3">
                <Button
                  variant="link"
                  size="sm"
                  className="p-0"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </Button>
              </div>

              <div className="d-grid mb-3">
                <Button
                  type="submit"
                  variant="success"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default AdminLoginPage;
