// MiddleAdminIssuesOptions.jsx
import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MiddleAdminIssuesOptions() {
  const navigate = useNavigate();

  return (
    <>
      <h3 className="mb-4">Issues Management</h3>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>View / Manage Issues</Card.Title>
              <Card.Text>
                See all complaints, filter by status (Pending, In‑Progress,
                Resolved) and open details to update status or assignment.
              </Card.Text>
              <Button
                variant="success"
                onClick={() =>
                  navigate("/middle-admin/dashboard/issues/list")
                }
              >
                Open Issues List
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Assign Issues to Officers</Card.Title>
              <Card.Text>
                Assign each issue to the responsible officer so they see only
                their own tasks.
              </Card.Text>
              <Button
                variant="outline-success"
                onClick={() =>
                  navigate("/middle-admin/dashboard/issues/assign")
                }
              >
                Assign Issues
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default MiddleAdminIssuesOptions;
