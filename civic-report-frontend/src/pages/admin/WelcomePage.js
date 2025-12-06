import React from "react";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";

function WelcomePage() {
  const location = useLocation();
  const isDashboard = location.pathname === "/admin/welcome";

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="bg-dark text-white min-vh-100">
          <div className="p-3">
            <h4 className="mb-4">Logo</h4>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome"
                  className="text-white text-decoration-none"
                >
                  Dashboard
                </Link>
              </ListGroup.Item>
              
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/middle-admins"
                  className="text-white text-decoration-none"
                >
                  Middle Admins
                </Link>
              </ListGroup.Item>
              
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/officers"
                  className="text-white text-decoration-none"
                >
                  Officers
                </Link>
              </ListGroup.Item>

              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/users"
                  className="text-white text-decoration-none"
                >
                  Users
                </Link>
              </ListGroup.Item>
              
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/view-issues"
                  className="text-white text-decoration-none"
                >
                  Issues
                </Link>
              </ListGroup.Item>
              
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/reports"
                  className="text-white text-decoration-none"
                >
                  Reports
                </Link>
              </ListGroup.Item>
              
              <ListGroup.Item className="bg-dark border-0 p-2">
                <Link
                  to="/admin/welcome/settings"
                  className="text-white text-decoration-none"
                >
                  Settings
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          {/* Default 4 boxes only on /admin/welcome */}
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

          {/* Nested route content renders here */}
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default WelcomePage;
