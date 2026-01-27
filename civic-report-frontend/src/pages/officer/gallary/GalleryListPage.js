import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Modal,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const getAuthToken = () => localStorage.getItem("token");

export default function GalleryListPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // view modal
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);

  // delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadGalleries();
  }, []);

  /* ================= LOAD ================= */
  const loadGalleries = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const res = await axios.get(
        "http://localhost:5000/api/officer/gallary/list",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGalleries(res.data.galleries || []);
    } catch (err) {
      setError("Failed to load galleries");
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE URL BUILDER ================= */
  const buildAllUrls = (g) => {
    const base = "http://localhost:5000/uploads/gallary/";
    return [
      ...(g.imagepaths || []).map((f) => base + f),
      ...(g.afterimagepath || []).map((f) => base + f),
    ];
  };

  /* ================= VIEW ================= */
  const openGallery = (g) => {
    const urls = buildAllUrls(g);
    if (!urls.length) return;
    setImages(urls);
    setIndex(0);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const token = getAuthToken();

      await axios.delete(
        `http://localhost:5000/api/officer/gallary/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDeleteModal(false);
      setDeleteId(null);
      loadGalleries(); // refresh list
    } catch (err) {
      setError("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner />
        <div className="mt-2 text-muted">Loading galleries...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h5 className="mb-4">📸 My Galleries</h5>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex flex-wrap gap-4">
        {galleries.map((g) => {
          const allUrls = buildAllUrls(g);

          return (
            <Card key={g.id} style={{ width: 280 }} className="shadow-sm">
              <div
                style={{
                  height: 180,
                  cursor: "pointer",
                  overflow: "hidden",
                  background: "#f1f5f9",
                }}
                onClick={() => openGallery(g)}
              >
                {allUrls[0] ? (
                  <img
                    src={allUrls[0]}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                    No Image
                  </div>
                )}
              </div>

              <Card.Body className="p-3">
                <h6 className="text-truncate mb-2">{g.headline}</h6>

                <div className="mb-2">
                  <Badge bg="secondary" className="me-2">
                    Before: {g.imagepaths.length}
                  </Badge>
                  <Badge bg="success">
                    After: {g.afterimagepath.length}
                  </Badge>
                </div>

                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="flex-fill"
                    onClick={() => openGallery(g)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-fill"
                    onClick={() => confirmDelete(g.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* ================= VIEW MODAL ================= */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Body className="text-center">
          <img
            src={images[index]}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
          />
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button
            variant="secondary"
            onClick={() =>
              setIndex((index - 1 + images.length) % images.length)
            }
          >
            ◀
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIndex((index + 1) % images.length)}
          >
            ▶
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================= DELETE MODAL ================= */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this gallery?
          <br />
          <small className="text-muted">
            This will delete both before & after images.
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
