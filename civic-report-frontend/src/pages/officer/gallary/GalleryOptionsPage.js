import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function GalleryOptionsPage() {
  return (
    <>
      {/* ===== Inline CSS ===== */}
      <style>{`
        .gallery-options-wrapper {
          padding: 40px 0;
        }

        .gallery-option-card {
          height: 100%;
          background: #ffffff;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .gallery-option-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
        }

        .gallery-option-title {
          font-size: 22px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
        }

        .gallery-option-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 22px;
        }

        .gallery-option-btn {
          font-weight: 700;
          border-radius: 12px;
          padding: 10px 18px;
          align-self: flex-start;
        }

        @media (max-width: 768px) {
          .gallery-option-card {
            padding: 22px;
          }

          .gallery-option-title {
            font-size: 20px;
          }
        }
      `}</style>

      <Container className="gallery-options-wrapper">
        <Row className="g-4">
          <Col md={6}>
            <div className="gallery-option-card">
              <div>
                <div className="gallery-option-title">List of images</div>
                <div className="gallery-option-desc">
                  View all photos uploaded to the gallery. You can also delete
                  images that are no longer needed.
                </div>
              </div>

              <Button
                as={Link}
                to="/officer/dashboard/gallery-upload/list"
                variant="success"
                className="gallery-option-btn"
              >
                Open gallery
              </Button>
            </div>
          </Col>

          <Col md={6}>
            <div className="gallery-option-card">
              <div>
                <div className="gallery-option-title">New upload</div>
                <div className="gallery-option-desc">
                  Add a new photo to the gallery. The image will be stored and
                  linked with your officer account.
                </div>
              </div>

              <Button
                as={Link}
                to="/officer/dashboard/gallery-upload/new"
                variant="outline-success"
                className="gallery-option-btn"
              >
                Upload image
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
