import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Modal,
  Carousel,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";

export default function MainGalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/gallery/public");
      setGalleries(res.data.galleries || []);
    } catch (err) {
      setError("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const openGallery = (gallery) => {
    setSelectedGallery(gallery);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <h5 className="mt-3 text-muted">Loading civic works gallery...</h5>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5 bg-light">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">📸 Civic Works Gallery</h1>
        <p className="lead text-muted">
          Photos and headlines of civic work uploaded by officers.
        </p>
        <Badge bg="success" className="fs-5 px-4 py-2">
          {galleries.length} galleries
        </Badge>
        <div className="mt-3">
          <Button variant="outline-primary" onClick={loadGalleries}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="text-center mb-5">
          {error}{" "}
          <Button variant="outline-light" size="sm" onClick={loadGalleries}>
            Try again
          </Button>
        </Alert>
      )}

      {/* Grid of cards */}
      {galleries.length === 0 && !error ? (
        <div className="text-center py-5">
          <div style={{ fontSize: "4rem", opacity: 0.5 }}>📸</div>
          <h4 className="mt-3">No galleries yet</h4>
          <p className="text-muted">
            Officers will upload civic work photos soon. Please check back later.
          </p>
        </div>
      ) : (
        <Container>
          <Row className="g-4">
            {galleries.map((gallery) => (
              <Col xs={12} sm={6} md={4} lg={3} key={gallery.id}>
                <Card className="h-100 shadow-sm border-0">
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      background: "#f8f9fa",
                      cursor: "pointer",
                    }}
                    onClick={() => openGallery(gallery)}
                  >
                    {gallery.imagepaths[0] ? (
                      <img
                        src={`http://localhost:5000/uploads/gallary/${gallery.imagepaths[0]}`}
                        alt={gallery.headline}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                        No image
                      </div>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between mb-2">
                      <Badge bg="primary">Employee #{gallery.employee_id}</Badge>
                      <Badge bg="info">{gallery.total_images} photos</Badge>
                    </div>
                    <Card.Title className="fs-6 fw-bold">
                      {gallery.headline}
                    </Card.Title>
                    <small className="text-muted mt-auto">
                      {new Date(gallery.created_at).toLocaleDateString("en-IN")}
                    </small>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => openGallery(gallery)}
                    >
                      👁️ View Gallery
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* View-only modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGallery?.headline}{" "}
            {selectedGallery && (
              <Badge bg="primary" className="ms-2">
                Employee #{selectedGallery.employee_id}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedGallery && (
            <Carousel interval={null}>
              {selectedGallery.imagepaths.map((p, idx) => (
                <Carousel.Item key={idx}>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "480px", background: "#f8f9fa" }}
                  >
                    <img
                      src={`http://localhost:5000/uploads/gallary/${p}`}
                      alt={`Photo ${idx + 1}`}
                      style={{
                        maxHeight: "480px",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <Carousel.Caption>
                    <p>
                      Photo {idx + 1} of {selectedGallery.total_images}
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
