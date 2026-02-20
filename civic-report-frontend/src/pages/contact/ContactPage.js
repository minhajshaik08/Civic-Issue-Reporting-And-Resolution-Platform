import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Toast } from "react-bootstrap";
import axios from "axios";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);

      if (res.data?.success) {
        setToastMsg("Message sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setToastMsg("Failed to send message.");
      }
    } catch {
      setToastMsg("Error sending message.");
    } finally {
      setSending(false);
      setShowToast(true);
    }
  };

  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.className = "ripple";

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  return (
    <div className="page-wrapper fade-in">

      <div className="toast-wrapper">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={2500} autohide>
          <Toast.Body>{toastMsg}</Toast.Body>
        </Toast>
      </div>

      <Container className="main-container">

        <div className="heading-section">
          <h2 className="gradient-text">Contact Us</h2>
          <p className="subtitle">
            Get in touch with us for support, questions, or feedback.
          </p>
        </div>

        <Row>

          <Col md={6}>
            <Card className="glass-card float-card">
              <Card.Body>
                <h5>Send us a Message</h5>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-2">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control name="name" value={form.name} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Subject</Form.Label>
                    <Form.Select name="subject" value={form.subject} onChange={handleChange} required>
                      <option value="">Select subject</option>
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Feedback</option>
                      <option>Complaint</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" name="message" value={form.message} onChange={handleChange} required />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="submit-btn w-100 ripple-btn"
                    disabled={sending}
                    onClick={createRipple}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="glass-card float-card">
              <Card.Body>

                {[
                  ["✉️", "Support Email", "support@civicgreen.com", "We respond within 24 hours"],
                  ["📞", "Phone Support", "+91 7978538331", "Mon–Fri: 9 AM – 5 PM"],
                  ["📍", "Office Address", "SRKR Engineering College, Bhimavaram", ""],
                  ["🚨", "Emergency Hotline", "112", "Urgent emergencies only"],
                ].map((item, i) => (
                  <Card key={i} className="mini-card hover-lift shadow-sm">
                    <Card.Body className="d-flex">
                      <div className="icon-circle">{item[0]}</div>
                      <div>
                        <b>{item[1]}</b>
                        <div>{item[2]}</div>
                        <small>{item[3]}</small>
                      </div>
                    </Card.Body>
                  </Card>
                ))}

              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>

      <style>{`

        /* ✅ Enable scrolling */
        body {
          overflow-y: auto;
          overflow-x: hidden;
        }

        .page-wrapper {
          min-height: 100vh;
          padding: 60px 20px;
          background: linear-gradient(135deg,#c7f9cc,#e0f4ef);
        }

        .heading-section {
          text-align: center;
          margin-bottom: 14px;
        }

        .fade-in { animation: fadeIn 0.7s ease forwards; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gradient-text {
          font-weight: 800;
          background: linear-gradient(135deg,#0bbf7a,#067a58);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle { font-size: 12px; color: #6b7280; }

        .float-card { animation: float 4s ease-in-out infinite; }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .glass-card {
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.6);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        textarea.form-control {
          height: 70px !important;
          resize: none;
        }

        .hover-lift {
          transition: 0.25s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }

        .submit-btn {
          background: #22c55e;
          border: none;
          font-weight: bold;
          position: relative;
          overflow: hidden;
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background: rgba(255,255,255,0.6);
        }

        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }

        .mini-card {
          margin-top: 6px;
          border-radius: 12px;
        }

        .icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }

        .toast-wrapper {
          position: fixed;
          top: 12px;
          right: 12px;
          z-index: 9999;
        }

      `}</style>
    </div>
  );
}
