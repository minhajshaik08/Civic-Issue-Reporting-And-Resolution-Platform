import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserOptionsPage() {
  return (
    <div className="p-4">
      <h3 className="mb-4">User Management</h3>
      <Row className="g-3">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <Link to="list" className="text-decoration-none">
                  View All Users
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <Link to="manage" className="text-decoration-none">
                  Block / Unblock Users
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <Link to="activity" className="text-decoration-none">
                  User Activity
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
