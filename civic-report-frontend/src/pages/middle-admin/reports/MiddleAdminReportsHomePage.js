import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const MiddleAdminReportsHomePage = () => {
  return (
    <div>
      <h2 className="mb-4">Reports & Analytics</h2>

      <Row className="g-3">
        <Col md={4}>
          <Card
            as={Link}
            to="/middle-admin/dashboard/reports/issues"
            className="p-3 text-decoration-none"
          >
            <h4>Total Issues</h4>
            <p>Daily / weekly / monthly issues, pending vs resolved.</p>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            as={Link}
            to="/middle-admin/dashboard/reports/areas"
            className="p-3 text-decoration-none"
          >
            <h4>Top Areas</h4>
            <p>Top problematic areas by number of issues.</p>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            as={Link}
            to="/middle-admin/dashboard/reports/officers/performance"
            className="p-3 text-decoration-none"
          >
            <h4>Officer Performance</h4>
            <p>Issues handled, resolved, and average resolution time.</p>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            as={Link}
            to="/middle-admin/dashboard/reports/users"
            className="p-3 text-decoration-none mt-3"
          >
            <h4>User Activity</h4>
            <p>Active users and issues reported per user.</p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 mt-3">
            <h4>Download Reports</h4>
            <p>Export data as PDF or Excel.</p>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm">
                Download PDF
              </button>
              <button className="btn btn-outline-success btn-sm">
                Download Excel
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MiddleAdminReportsHomePage;
