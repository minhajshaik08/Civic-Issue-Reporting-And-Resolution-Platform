import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast";

function AdminSignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const isValidPassword = (value) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).{6,}$/.test(
      value
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      showToast("Please enter a username.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (!isValidPassword(password)) {
      showToast(
        "Password must be at least 6 characters and contain at least one uppercase letter, one number, and one special character.",
        "error"
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (data.success) {
        showToast("Account created successfully!", "success");
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        showToast(data.error || "Signup failed.", "error");
      }
    } catch (err) {
      showToast("Network error. Please check if backend is running on port 5000.", "error");
    }
  };

  return (
    <main className="py-5">
      <Container style={{ maxWidth: "480px" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-3 text-center">Admin Sign Up</h3>
            <p className="text-muted text-center mb-4">
              Create an admin account with a strong password to access the
              dashboard.
            </p>

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Text className="text-muted">
                  At least 6 characters, 1 uppercase, 1 number, 1 special
                  character.
                </Form.Text>
              </Form.Group>

              <div className="d-grid mb-3">
                <Button type="submit" variant="success">
                  Sign Up
                </Button>
              </div>
            </Form>

            <div className="text-center">
              <span>
                Already have an account?{" "}
                <Link to="/admin/login">Login</Link>
              </span>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default AdminSignupPage;
