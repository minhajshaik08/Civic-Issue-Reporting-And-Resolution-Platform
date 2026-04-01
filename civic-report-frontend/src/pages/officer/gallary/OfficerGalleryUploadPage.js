import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import axios from "axios";

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const OfficerGalleryUploadPage = () => {
  const [headline, setHeadline] = useState("");
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");

  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);

  const [beforePreviews, setBeforePreviews] = useState([]);
  const [afterPreviews, setAfterPreviews] = useState([]);

  const [employeeId, setEmployeeId] = useState(null);
  const [currentEmail, setCurrentEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const beforeRef = useRef(null);
  const afterRef = useRef(null);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      const token = getAuthToken();
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentEmail(payload.email);

      const res = await axios.get(
        "http://localhost:5000/api/officer/gallary/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployeeId(res.data.employee_id);
    };

    loadProfile();
  }, []);

  /* ================= PREVIEWS ================= */
  useEffect(() => {
    const urls = beforeImages.map((f) => URL.createObjectURL(f));
    setBeforePreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [beforeImages]);

  useEffect(() => {
    const urls = afterImages.map((f) => URL.createObjectURL(f));
    setAfterPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [afterImages]);

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files)
      .filter(
        (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
      )
      .slice(0, 5);

    type === "before" ? setBeforeImages(files) : setAfterImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !headline || !beforeText || !afterText) {
      setStatus("❌ All fields are required");
      return;
    }

    setLoading(true);
    setStatus("⏳ Uploading gallery...");

    const token = getAuthToken();
    const formData = new FormData();

    formData.append("headline", headline);
    formData.append("beforesolve", beforeText);
    formData.append("afteresolve", afterText);

    beforeImages.forEach((img) => formData.append("beforeImages", img));
    afterImages.forEach((img) => formData.append("afterImages", img));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/officer/gallary/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus(`✅ ${res.data.message}`);
      setHeadline("");
      setBeforeText("");
      setAfterText("");
      setBeforeImages([]);
      setAfterImages([]);
      if (beforeRef.current) beforeRef.current.value = "";
      if (afterRef.current) afterRef.current.value = "";
    } catch {
      setStatus("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== MEDIUM SIZE STYLES (IssueDetails-like) ===== */}
      <style>{`
        .gallery-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 16px;
        }

        .gallery-card {
          background: #fff;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          max-width: 900px;
          margin: auto;
        }

        .gallery-title {
          font-size: 20px;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .gallery-field {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 12px;
        }

        .gallery-label {
          font-size: 11px;
          font-weight: 800;
          color: #6b7280;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .thumb-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .thumb-img {
          width: 100px;
          height: 75px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .submit-btn {
          width: 100%;
          padding: 10px;
          font-weight: 800;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .thumb-img {
            width: 90px;
            height: 70px;
          }
        }
      `}</style>

      <div className="gallery-page">
        <div className="gallery-card">
          <div className="gallery-title">Before / After Gallery</div>

          <Badge bg="primary" className="mb-2">
            Employee ID: {employeeId || "Loading..."}
          </Badge>

          {status && (
            <Alert
              variant={status.includes("✅") ? "success" : "danger"}
              className="py-2"
            >
              {status}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <div className="gallery-field">
              <div className="gallery-label">Gallery Title</div>
              <Form.Control
                size="sm"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Road repair before and after"
              />
            </div>

            <div className="gallery-field">
              <div className="gallery-label">Before Resolve</div>
              <Form.Control
                as="textarea"
                rows={2}
                size="sm"
                value={beforeText}
                onChange={(e) => setBeforeText(e.target.value)}
              />
              <Form.Control
                type="file"
                size="sm"
                multiple
                accept="image/*"
                ref={beforeRef}
                className="mt-1"
                onChange={(e) => handleImageChange(e, "before")}
              />

              <div className="thumb-row">
                {beforePreviews.map((src, i) => (
                  <img key={i} src={src} className="thumb-img" />
                ))}
              </div>
            </div>

            <div className="gallery-field">
              <div className="gallery-label">After Resolve</div>
              <Form.Control
                as="textarea"
                rows={2}
                size="sm"
                value={afterText}
                onChange={(e) => setAfterText(e.target.value)}
              />
              <Form.Control
                type="file"
                size="sm"
                multiple
                accept="image/*"
                ref={afterRef}
                className="mt-1"
                onChange={(e) => handleImageChange(e, "after")}
              />

              <div className="thumb-row">
                {afterPreviews.map((src, i) => (
                  <img key={i} src={src} className="thumb-img" />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="success"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Save Gallery"}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default OfficerGalleryUploadPage;
