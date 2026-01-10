import React, { useEffect, useState, useCallback } from "react";
import { Container, Card, Modal, Badge, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getAuthToken = () => localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt');

export default function GalleryListPage() {
  const [images, setImages] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // ✅ Load THEIR galleries using employee_id
  const fetchImages = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Login from dashboard first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get email from JWT
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload + '==='.slice((payload.length + 3) % 4)));
      const email = decoded.email;
      setCurrentEmail(email);

      // ✅ Profile: email → employee_id
      const profileRes = await axios.get("http://localhost:5000/api/officer/gallary/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const empId = profileRes.data.employee_id;
      setEmployeeId(empId);

      // ✅ List: THEIR galleries only (backend filters by employee_id)
      const listRes = await axios.get("http://localhost:5000/api/officer/gallary/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setImages(listRes.data.images || []);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to load");
      console.error('Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const buildAllPhotoUrls = (img) => {
    try {
      const arr = typeof img.imagepaths === 'string' ? JSON.parse(img.imagepaths || '[]') : img.imagepaths;
      return arr.map(filename => `http://localhost:5000/uploads/gallary/${filename}`).filter(Boolean);
    } catch (e) {
      return [];
    }
  };

  const handleOpenModal = (img) => {
    const allUrls = buildAllPhotoUrls(img);
    if (allUrls.length === 0) return;
    
    setSelectedEntry(img);
    setCurrentImageIndex(0);
    setSelectedImageUrl(allUrls[0]);
    setShowImageModal(true);
  };

  const handleNextImage = () => {
    if (!selectedEntry) return;
    const allUrls = buildAllPhotoUrls(selectedEntry);
    const nextIndex = (currentImageIndex + 1) % allUrls.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImageUrl(allUrls[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!selectedEntry) return;
    const allUrls = buildAllPhotoUrls(selectedEntry);
    const prevIndex = (currentImageIndex - 1 + allUrls.length) % allUrls.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImageUrl(allUrls[prevIndex]);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = getAuthToken();
      setIsDeleting(true);
      
      await axios.delete(`http://localhost:5000/api/officer/gallary/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchImages();  // Reload THEIR galleries
      
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
      setDeleteModal(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="text-muted mt-3">Loading your galleries...</p>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: 32, marginBottom: 40 }}>
      {/* ✅ Employee ID Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5>📸 <strong>My Gallery</strong> ({images.length})</h5>
          {employeeId && (
            <div className="mt-1">
              <Badge bg="primary" className="me-2 fs-6 px-3 py-2">
                Employee ID: {employeeId}
              </Badge>
              <Badge bg="info" className="fs-6 px-3 py-2">
                {currentEmail}
              </Badge>
            </div>
          )}
        </div>
        <Button variant="outline-primary" size="sm" onClick={fetchImages} disabled={loading}>
          🔄 Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <div className="d-flex flex-wrap gap-4 justify-content-start">
        {images.map((img) => {
          const allUrls = buildAllPhotoUrls(img);
          const firstPhoto = allUrls[0];
          
          return (
            <Card key={img.id} style={{ width: "300px" }} className="shadow-sm">
              <div
                style={{
                  height: "220px",
                  backgroundColor: "#f8f9fa",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative"
                }}
                onClick={() => handleOpenModal(img)}
              >
                {firstPhoto ? (
                  <img 
                    src={firstPhoto} 
                    alt={img.headline || 'Gallery preview'} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    🖼️
                  </div>
                )}
                {allUrls.length > 1 && (
                  <Badge bg="dark" className="position-absolute top-2 end-2">
                    1/{allUrls.length}
                  </Badge>
                )}
              </div>

              <Card.Body className="p-3">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">
                    {new Date(img.created_at).toLocaleDateString()}
                  </small>
                  <Badge bg="info">{allUrls.length} imgs</Badge>
                </div>
                <h6 className="mb-2 text-truncate">{img.headline || "Untitled"}</h6>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="flex-grow-1"
                    onClick={() => handleOpenModal(img)}
                  >
                    👁️ View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-grow-1"
                    onClick={() => { 
                      setDeleteId(img.id); 
                      setDeleteModal(true); 
                    }}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {images.length === 0 && !error && employeeId && (
        <div className="text-center py-5">
          <div style={{ fontSize: "4rem" }}>📸</div>
          <h5 className="mt-3">No Galleries Yet</h5>
          <p className="text-muted mb-4">
            Employee #{employeeId} - <strong>Your galleries will appear here</strong>
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/officer/gallary/upload')}>
            📤 Upload First Gallery
          </Button>
        </div>
      )}

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEntry?.headline || "Gallery"} 
            ({currentImageIndex + 1}/{buildAllPhotoUrls(selectedEntry || {}).length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-light" style={{ minHeight: "500px", position: "relative" }}>
          {selectedImageUrl && (
            <>
              <img 
                src={selectedImageUrl} 
                alt={`Gallery ${currentImageIndex + 1}`} 
                style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }} 
              />
              {buildAllPhotoUrls(selectedEntry || {}).length > 1 && (
                <>
                  <Button 
                    variant="light" 
                    className="position-absolute start-0 top-50 ms-3 rounded-circle"
                    onClick={handlePrevImage}
                    style={{ width: "50px", height: "50px" }}
                  >
                    ◀
                  </Button>
                  <Button 
                    variant="light" 
                    className="position-absolute end-0 top-50 me-3 rounded-circle"
                    onClick={handleNextImage}
                    style={{ width: "50px", height: "50px" }}
                  >
                    ▶
                  </Button>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Gallery?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Delete "{selectedEntry?.headline}" permanently? 
          ({buildAllPhotoUrls(selectedEntry || {}).length} images)
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
