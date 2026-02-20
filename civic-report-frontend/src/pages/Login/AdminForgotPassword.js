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

    setTimeout(() => {
      setMessage(`Password reset link sent to ${email}`);
      setError("");
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="login-page">
      <Container style={{ maxWidth: "480px" }}>
        <Card className="login-card shadow-lg">
          <Card.Body>
            <h3 className="login-title">Forgot Password?</h3>
            <p className="login-subtitle">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <Alert variant="danger" className="mb-3 fade-in">
                {error}
              </Alert>
            )}
            {message && (
              <Alert variant="success" className="mb-3 fade-in">
                {message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label className="gradient-label">
                  <b>Email Address</b>
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

              <div className="d-grid mb-3">
                <Button
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>

              <div className="d-grid">
                <Button
                  className="back-btn"
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

      {/* ================= CSS ================= */}
      <style jsx>{`
        .login-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #c7f9cc, #e0f4ef);
          overflow: hidden;
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
          color: #648b79;
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
          color: white;
        }

        .login-btn:hover {
          background: #16a34a;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
        }

        /* Premium Back Button */
        .back-btn {
          background: transparent;
          border: 2px solid #22c55e;
          color: #22c55e;
          border-radius: 10px;
          font-weight: 600;
          padding: 10px;
          transition: all 0.35s ease;
        }

        .back-btn:hover {
          background: #ffffff;
          color: #15803d;
          border-color: #15803d;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.35);
        }

        .back-btn:active {
          transform: scale(0.97);
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

        .fade-in {
          animation: fadePage 0.4s ease;
        }

        @keyframes fadePage {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

export default AdminForgotPassword;
