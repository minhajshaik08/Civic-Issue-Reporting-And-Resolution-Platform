import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* ================= AUTO REDIRECT IF SESSION EXISTS ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;

    if (token && role) {
      const normalizedRole = String(role).toLowerCase();

      if (normalizedRole === "super_admin") {
        navigate("/admin/welcome", { replace: true });
      } else if (normalizedRole === "middle_admin") {
        navigate("/middle-admin/dashboard", { replace: true });
      } else if (normalizedRole === "officer") {
        navigate("/officer/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const isValidPassword = (value) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).{6,}$/.test(
      value
    );

  /* ================= LOGIN SUBMIT ================= */
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
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        return;
      }

      const { token: jwt, user } = data;

      if (!jwt) {
        setError("Server error: No token received");
        return;
      }

      const rawRole = user?.role || "";
      const role = String(rawRole).toLowerCase();

      if (!["super_admin", "middle_admin", "officer"].includes(role)) {
        setError(
          "Access denied. Only Admin, Middle Admin, and Officer accounts have dashboard access."
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      /* ================= SAVE SESSION (FIXED) ================= */
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      localStorage.setItem("token", jwt);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user?.id,
          email: user?.email,
          role: role,
          username: user?.username || "",

          // ✅ Admin / Middle Admin fields
          full_name: user?.full_name || "",
          phone: user?.phone || "",

          // ✅ Officer fields (IMPORTANT FIX)
          name: user?.name || user?.full_name || "",
          mobile: user?.mobile || user?.phone || "",
        })
      );

      /* ================= ROLE BASED REDIRECT ================= */
      if (role === "middle_admin") {
        navigate("/middle-admin/dashboard", { replace: true });
      } else if (role === "officer") {
        navigate("/officer/dashboard", { replace: true });
      } else if (role === "super_admin") {
        navigate("/admin/welcome", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Backend not reachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/login/forgot-password");
  };

  return (
    <main className="py-5">
      <Container style={{ maxWidth: "480px" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-3 text-center">Login</h3>
            <p className="text-muted text-center mb-4">
              Super Admin / Middle Admin / Officer access only.
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
