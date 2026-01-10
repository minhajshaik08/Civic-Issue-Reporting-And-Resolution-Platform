import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function MiddleAdminOfficerOptionsPage() {
  return (
    <div className="p-4">
      <h3 className="mb-4">Officer Staff Management</h3>
      <Row className="g-3">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <Link
                  to="/middle-admin/dashboard/officers/add"
                  className="text-decoration-none"
                >
                  Add Officer
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <Link
                  to="/middle-admin/dashboard/officers/list"
                  className="text-decoration-none"
                >
                  View Officer List
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <Link
                  to="/middle-admin/dashboard/officers/manage"
                  className="text-decoration-none"
                >
                  Block / Delete Officer
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <Link
                  to="/middle-admin/dashboard/officers/edit"
                  className="text-decoration-none"
                >
                  Edit Officer Details
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
