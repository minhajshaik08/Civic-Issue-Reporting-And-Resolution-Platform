import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function GalleryOptionsPage() {
  return (
    <Container className="gallery-options-wrapper">
      <Row className="g-4">
        <Col md={6}>
          <div className="gallery-option-card">
            <div className="gallery-option-title">List of images</div>
            <div className="gallery-option-desc">
              View all photos uploaded to the gallery. You can also delete
              images that are no longer needed.
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
            <div className="gallery-option-title">New upload</div>
            <div className="gallery-option-desc">
              Add a new photo to the gallery. The image will be stored and
              linked with your officer account.
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
  );
}
