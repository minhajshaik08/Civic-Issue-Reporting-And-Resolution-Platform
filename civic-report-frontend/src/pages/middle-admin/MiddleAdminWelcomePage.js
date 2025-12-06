import React from "react";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";

function MiddleAdminWelcomePage() {
  const location = useLocation();
  const isDashboard = location.pathname === "/middle-admin/welcome";

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar for Middle Admin */}
        <Col md={2} className="bg-dark text-white min-vh-100">
          <div className="p-3">
            <h4 className="mb-4">Logo</h4>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/middle-admin/welcome"
                  className="text-white text-decoration-none"
                >
                  Dashboard
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/middle-admin/welcome/officers"
                  className="text-white text-decoration-none"
                >
                  Officers
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/middle-admin/welcome/view-issues"
                  className="text-white text-decoration-none"
                >
                  Issues
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/middle-admin/welcome/reports"
                  className="text-white text-decoration-none"
                >
                  Reports
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          <h3 className="mb-4">Hello Middle Admin, welcome back!</h3>

          {isDashboard && (
            <Row className="mb-4">
              {[1, 2, 3, 4].map((item) => (
                <Col md={3} key={item} className="mb-3">
                  <Card className="shadow-sm text-center p-3">
                    <h5>Box {item}</h5>
                    <p>Placeholder</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default MiddleAdminWelcomePage;
