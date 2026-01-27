import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const BASE_URL = "http://localhost:5000/uploads/gallary/";

export default function MainGalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD PUBLIC GALLERIES ================= */
  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:5000/api/gallary/public"
      );

      setGalleries(res.data.galleries || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE BUILDER ================= */
  const getBeforeImages = (g) =>
    Array.isArray(g.imagepaths)
      ? g.imagepaths.map((f) => BASE_URL + f)
      : [];

  const getAfterImages = (g) =>
    Array.isArray(g.afterimagepath)
      ? g.afterimagepath.map((f) => BASE_URL + f)
      : [];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <div className="mt-2 text-muted">Loading civic works...</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-5">
        <h3 className="fw-bold text-primary"> Civic Works Gallery</h3>
        <p className="text-muted">
          Before & After visual proof of resolved civic issues
        </p>
        <Badge bg="success" className="px-3 py-2">
          {galleries.length} Works
        </Badge>
      </div>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {/* ================= GALLERY ROWS ================= */}
      {galleries.length === 0 ? (
        <div className="text-center text-muted">No gallery data</div>
      ) : (
        galleries.map((g, index) => {
          const beforeImages = getBeforeImages(g);
          const afterImages = getAfterImages(g);

          return (
            <Row
              key={g.id}
              className="align-items-center mb-5 pb-4 border-bottom"
            >
              {/* ========== BEFORE COLUMN ========== */}
              <Col md={4} className="text-center mb-3 mb-md-0">
                <h6 className="fw-bold text-warning mb-3">BEFORE</h6>

                {beforeImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`before-${i}`}
                    className="img-fluid rounded shadow-sm mb-2"
                    style={{ maxHeight: "180px", objectFit: "cover" }}
                  />
                ))}

                <div className="mt-2">
                  <Badge bg="warning" text="dark">
                    {beforeImages.length} image(s)
                  </Badge>
                </div>
              </Col>

              {/* ========== CENTER COLUMN ========== */}
              <Col md={4} className="text-center">
                <h5 className="fw-bold mb-2">{g.headline}</h5>

                <p className="text-muted mb-2">
                  Resolved civic issue with documented proof
                </p>

                <Badge bg="secondary" className="mb-2">
                  {new Date(g.created_at).toLocaleDateString("en-IN")}
                </Badge>
              </Col>

              {/* ========== AFTER COLUMN ========== */}
              <Col md={4} className="text-center">
                <h6 className="fw-bold text-success mb-3">AFTER</h6>

                {afterImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`after-${i}`}
                    className="img-fluid rounded shadow-sm mb-2"
                    style={{ maxHeight: "180px", objectFit: "cover" }}
                  />
                ))}

                <div className="mt-2">
                  <Badge bg="success">
                    {afterImages.length} image(s)
                  </Badge>
                </div>
              </Col>
            </Row>
          );
        })
      )}
    </Container>
  );
}
