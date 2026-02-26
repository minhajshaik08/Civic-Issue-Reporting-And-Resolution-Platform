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
      const res = await fetch("http://13.201.16.142:5000/api/login", {
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

      const role = String(user?.role || "").toLowerCase();

      if (!["super_admin", "middle_admin", "officer"].includes(role)) {
        setError(
          "Access denied. Only Admin, Middle Admin, and Officer accounts have dashboard access."
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      const sessionId =
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem("sessionId", sessionId);

      localStorage.setItem("token", jwt);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user?.id,
          email: user?.email,
          role: role,
          username: user?.username || "",
          full_name: user?.full_name || "",
          phone: user?.phone || "",
          name: user?.name || user?.full_name || "",
          mobile: user?.mobile || user?.phone || "",
        })
      );

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
    <main className="login-page">
      <Container style={{ maxWidth: "480px" }}>
        <Card className="login-card shadow-lg">
          <Card.Body>
            <h3 className="login-title">Admin Login</h3>
            <p className="login-subtitle">
              Super Admin / Admin / Officer access only
            </p>

            {error && (
              <Alert variant="danger" className="mb-3 fade-in">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label className="gradient-label">
                  <b>Email</b>
                </Form.Label>
                <Form.Control
                  className="styled-input"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="gradient-label">
                  <b>Password</b>
                </Form.Label>
                <Form.Control
                  className="styled-input"
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
                  className="forgot-link"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </Button>
              </div>

              <div className="d-grid mb-3">
                <Button
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* ================= CSS ================= */}
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #c7f9cc, #e0f4ef);
          animation: fadePage 0.8s ease-in;
        }

        .login-card {
          border-radius: 18px;
          border: none;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          animation: slideUp 0.7s ease forwards;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
        }

        .login-title {
          text-align: center;
          font-weight: 800;
          background: linear-gradient(135deg, #0bbf7a, #067a58);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gradient-label {
          background: linear-gradient(135deg, #0bbf7a, #067a58);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .login-subtitle {
          text-align: center;
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .styled-input {
          border-radius: 10px;
          padding: 10px;
          transition: all 0.25s ease;
        }

        .styled-input:hover {
          border-color: #22c55e;
        }

        .styled-input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
          transform: scale(1.02);
        }

        .login-btn {
          background: #22c55e;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          padding: 10px;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          background: #16a34a;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
        }

        .forgot-link {
          color: #16a34a;
          font-weight: 500;
        }

        .forgot-link:hover {
          text-decoration: underline;
          color: #15803d;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadePage {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .fade-in {
          animation: fadePage 0.4s ease;
        }

        @media (max-width: 500px) {
          .login-card {
            margin: 10px;
          }
        }
      `}</style>
    </main>
  );
}

export default AdminLoginPage;
