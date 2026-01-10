// src/pages/middle-admin/issues/MiddleAdminIssuesList.jsx
import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MiddleAdminIssuesList() {
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const res = await fetch(
        "http://localhost:5000/api/middle-admin/issues" +
          (params.toString() ? "?" + params.toString() : "")
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load issues");
        setIssues([]);
        return;
      }

      setIssues(data.issues || []);
    } catch (err) {
      setError("Error loading issues");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      <h3 className="mb-3">Issues List</h3>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="VIEWED">Viewed</option>
            <option value="VERIFIED">Verified</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SOLVED">Solved</option>
          </Form.Select>
        </Col>
      </Row>

      {loading && (
        <div className="mb-3">
          <Spinner animation="border" size="sm" /> Loading issues...
        </div>
      )}

      {error && <div className="text-danger mb-3">{error}</div>}

      {!loading && !error && issues.length === 0 && (
        <p>No issues found for the selected filter.</p>
      )}

      {issues.length > 0 && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue Type</th>
              <th>Status</th>
              <th>Assigned Officer</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.issue_type}</td>
                <td>{issue.status}</td>

                {/* NEW COLUMN */}
                <td>{issue.assigned_officer_name || "-"}</td>

                <td>{issue.created_at}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/middle-admin/dashboard/issues/${issue.id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default MiddleAdminIssuesList;
