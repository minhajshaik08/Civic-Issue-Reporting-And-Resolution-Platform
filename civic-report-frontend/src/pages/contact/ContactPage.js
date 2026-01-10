import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setSending(true);

    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);

      if (res.data && res.data.success) {
        setStatus("Message sent successfully.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus(res.data?.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("Error sending message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#e0f4ef", // match app background
        minHeight: "100vh",
        padding: "50px 0",
      }}
    >
      <Container style={{ maxWidth: "1100px" }}>
        {/* heading */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <h2 style={{ marginBottom: 6, color: "#0f172a" }}>Contact Us</h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
            Get in touch with us for support, questions, or feedback.
          </p>
        </div>

        {/* two forms side by side on desktop, stacked on mobile */}
        <Row
          style={{
            rowGap: "28px",
            columnGap: "80px", // big horizontal gap ≈ 4–5cm on desktop
          }}
        >
          {/* FORM 1: message form */}
          <Col
            md={5}
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Card
              className="shadow-sm"
              style={{
                borderRadius: "18px",
                border: "1px solid #dbeafe",
                width: "100%",
              }}
            >
              <Card.Body style={{ padding: "24px 20px" }}>
                <h5 className="mb-2" style={{ color: "#111827" }}>
                  Send us a Message
                </h5>
                <p
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                    marginBottom: 12,
                  }}
                >
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>

                {status && (
                  <div
                    className="mb-2"
                    style={{ fontSize: 14, color: "#047857" }}
                  >
                    {status}
                  </div>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">
                        Technical Support
                      </option>
                      <option value="Feedback">Feedback</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      rows={4}
                      maxLength={300}
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                    <div
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        textAlign: "right",
                        marginTop: 4,
                      }}
                    >
                      {form.message.length}/300
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100"
                    disabled={sending}
                    style={{
                      backgroundColor: "#059669",
                      borderColor: "#059669",
                    }}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* FORM 2: info section, side by side with Form 1 */}
          <Col
            md={5}
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Card
              className="shadow-sm"
              style={{
                borderRadius: "18px",
                border: "1px solid #dbeafe",
                width: "100%",
              }}
            >
              <Card.Body style={{ padding: "24px 20px" }}>
                <h5 className="mb-2" style={{ color: "#111827" }}>
                  Get in touch with us
                </h5>
                <p
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                    marginBottom: 18,
                  }}
                >
                  We&apos;re here to help you with any questions or concerns.
                </p>

                {/* inner blocks that float individually on hover */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {/* Support Email */}
                  <Card
                    className="shadow-sm"
                    style={{
                      borderRadius: "14px",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 30px rgba(15,23,42,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <Card.Body className="d-flex">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "999px",
                          backgroundColor: "#ecfdf5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <span style={{ fontSize: 20 }}>✉️</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Support Email</div>
                        <div>support@civicgreen.com</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          We typically respond within 24 hours.
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Phone Support */}
                  <Card
                    className="shadow-sm"
                    style={{
                      borderRadius: "14px",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 30px rgba(15,23,42,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <Card.Body className="d-flex">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "999px",
                          backgroundColor: "#ecfdf5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <span style={{ fontSize: 20 }}>📞</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Phone Support</div>
                        <div>+91 7978538331</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          Mon–Fri: 9 AM – 5 PM IST
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Office Address */}
                  <Card
                    className="shadow-sm"
                    style={{
                      borderRadius: "14px",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 30px rgba(15,23,42,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <Card.Body className="d-flex">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "999px",
                          backgroundColor: "#ecfdf5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <span style={{ fontSize: 20 }}>📍</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Office Address</div>
                        <div>SRKR Engineering College</div>
                        <div>Chinnamiram, Bhimavaram</div>
                        <div>West Godavari, Andhra Pradesh 534204</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          Walk‑in hours: Mon–Fri 8 AM – 4 PM
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Emergency */}
                  <Card
                    className="shadow-sm"
                    style={{
                      borderRadius: "14px",
                      borderLeft: "4px solid #ef4444",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 30px rgba(15,23,42,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <Card.Body className="d-flex">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "999px",
                          backgroundColor: "#fee2e2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <span style={{ fontSize: 20 }}>🚨</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Emergency Hotline</div>
                        <div>112</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          For immediate emergencies only.
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
