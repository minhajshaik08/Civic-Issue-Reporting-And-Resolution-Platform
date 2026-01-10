import React, { useState, useRef, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";

const getAuthToken = () => localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt') || sessionStorage.getItem('token');

export default function OfficerGalleryUploadPage() {
  const [imageFiles, setImageFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [headline, setHeadline] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [employeeId, setEmployeeId] = useState(null);  // ✅ Employee ID from officers table
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isReadyToUpload, setIsReadyToUpload] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Load JWT email + get employee_id from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      const token = getAuthToken();
      
      if (!token) {
        setStatus("⚠️ Login from dashboard first");
        return;
      }

      try {
        // Parse JWT for email
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload + '==='.slice((payload.length + 3) % 4)));
        const email = decoded.email;
        setCurrentEmail(email);
        console.log('📧 JWT email:', email);

        // ✅ Backend lookup: email → employee_id
        const profileRes = await axios.get("http://localhost:5000/api/officer/gallary/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEmployeeId(profileRes.data.employee_id);
        setStatus(`✅ Employee ID: ${profileRes.data.employee_id}`);
        setIsReadyToUpload(true);
        console.log('✅ Backend employee_id:', profileRes.data.employee_id);

      } catch (err) {
        console.error('Profile error:', err.response?.data || err);
        setStatus(`❌ ${err.response?.data?.message || 'Officer not found'}`);
        setEmployeeId(null);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    const urls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [imageFiles]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
      .filter(f => f.size <= 5 * 1024 * 1024 && f.type.startsWith('image/'))
      .slice(0, 10);
    setImageFiles(files);
  };

  const removeImage = (index) => {
    setImageFiles(files => files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!employeeId) {
      setStatus("❌ Officer profile required");
      return;
    }
    if (!headline.trim()) {
      setStatus("❌ Enter title");
      return;
    }
    if (!imageFiles.length) {
      setStatus("❌ Select images");
      return;
    }

    setIsLoading(true);
    setStatus("⏳ Uploading images...");

    const token = getAuthToken();
    const formData = new FormData();
    imageFiles.forEach(file => formData.append("images", file));
    formData.append("headline", headline.trim());

    try {
      const res = await axios.post("http://localhost:5000/api/officer/gallary/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        timeout: 60000
      });

      setStatus(`✅ ${res.data.message}`);
      setImageFiles([]);
      setHeadline("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setStatus(""), 3000);
      
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.message || 'Upload failed'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isUploadReady = employeeId && headline.trim() && imageFiles.length > 0 && !isLoading;

  return (
    <Container style={{ maxWidth: "900px", margin: "20px auto" }}>
      <Card className="shadow-lg border-0">
        <Card.Body className="p-4">
          <h4 className="mb-3">📸 <strong>Officer Gallery</strong></h4>

          {/* ✅ EMPLOYEE ID DISPLAY (from officers table) */}
          <div className={`mb-4 p-3 rounded-3 ${employeeId ? 'bg-success-subtle' : 'bg-warning-subtle'}`}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>👤 {currentEmail}</strong><br/>
                <Badge bg="primary" className="mt-2 fs-6 px-4 py-2">
                  Employee ID: <strong>{employeeId || "Loading..."}</strong>
                </Badge>
              </div>
              <Badge bg={employeeId ? "success" : "secondary"} className="fs-6 px-3 py-2">
                {employeeId ? "Verified" : "Checking..."}
              </Badge>
            </div>
          </div>

          {status && (
            <Alert variant={status.includes("✅") ? "success" : "danger"} dismissible 
              onClose={() => setStatus("")} className="mb-4">
              {status}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">📰 Gallery Title <span className="text-danger">*</span></Form.Label>
              <Form.Control as="textarea" rows={3} value={headline} 
                onChange={e => setHeadline(e.target.value)}
                placeholder={`Gallery for Employee #${employeeId || ''}`}
                maxLength={255} disabled={!employeeId || isLoading}
              />
              <small className="text-muted">{headline.length}/255</small>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">📷 Photos <span className="text-danger">*</span></Form.Label>
              <Form.Control type="file" accept="image/*" multiple ref={fileInputRef}
                onChange={handleFileChange} disabled={!employeeId || isLoading} />
              <small className="text-muted">Max 10 images, 5MB each</small>
            </Form.Group>

            {imageFiles.length > 0 && (
              <div className="mb-4">
                <h6>✅ {imageFiles.length}/10 selected</h6>
                <Row>
                  {imageFiles.map((file, index) => (
                    <Col xs={6} sm={4} md={3} lg={2} key={index} className="mb-3">
                      <div className="position-relative">
                        <img src={previewUrls[index]} alt={`Preview ${index}`} 
                          className="img-thumbnail w-100" style={{height: "130px", objectFit: "cover"}} />
                        <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-1"
                          onClick={() => removeImage(index)} disabled={isLoading}>×</Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            <Button type="submit" className="w-100 btn-lg" variant="primary" disabled={!isUploadReady}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Uploading...
                </>
              ) : (
                `📤 Save Gallery (${imageFiles.length || 0} images)`
              )}
            </Button>
          </Form>

          <div className="mt-4 p-3 bg-light rounded">
            <strong>🔒 Employee #{employeeId || '?'}</strong><br/>
            <small>Private gallery • officers table verified</small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
