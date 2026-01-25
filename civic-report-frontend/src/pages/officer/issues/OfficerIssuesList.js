import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function OfficerIssuesList() {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [rowStatus, setRowStatus] = useState({});

  const navigate = useNavigate();

  // Read logged-in officer from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const officerId = storedUser.id;

  const loadIssues = async () => {
    if (!officerId) {
      setError("Officer id not found. Please login again.");
      setIssues([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.append("officer_id", officerId);
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(
        "http://localhost:5000/api/officer/issues" +
          (params.toString() ? "?" + params.toString() : "")
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load issues");
        setIssues([]);
        return;
      }

      const list = data.issues || [];
      setIssues(list);

      const initial = {};
      list.forEach((iss) => {
        initial[iss.id] = iss.status;
      });
      setRowStatus(initial);
    } catch (err) {
      console.error("Error loading issues:", err);
      setError("Error loading issues");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officerId, statusFilter]);

  const handleRowStatusChange = (issueId, value) => {
    setRowStatus((prev) => ({
      ...prev,
      [issueId]: value,
    }));
  };

  const handleUpdateStatus = async (issueId) => {
    const newStatus = rowStatus[issueId];
    if (!newStatus) return;

    try {
      setSavingId(issueId);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/officer/issues/${issueId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, officer_id: officerId }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update status");
        return;
      }

      setIssues((prev) =>
        prev.map((iss) =>
          iss.id === issueId ? { ...iss, status: newStatus } : iss
        )
      );
    } catch (err) {
      setError("Error updating status");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <h3 className="mb-3">My Assigned Issues</h3>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
        <p>No issues assigned to you for this filter.</p>
      )}

      {issues.length > 0 && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue Type</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Location</th>
              <th>Created At</th>
              <th>Update</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.issue_type}</td>
                <td>{issue.status}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={rowStatus[issue.id] || ""}
                    onChange={(e) =>
                      handleRowStatusChange(issue.id, e.target.value)
                    }
                  >
                    <option value="">Select status</option>
                    <option value="NEW">New</option>
                    <option value="VIEWED">Viewed</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="SOLVED">Solved</option>
                  </Form.Select>
                </td>
                <td>{issue.location_text}</td>
                <td>{issue.created_at}</td>
                <td>
                  <Button
                    size="sm"
                    variant="success"
                    disabled={!rowStatus[issue.id] || savingId === issue.id}
                    onClick={() => handleUpdateStatus(issue.id)}
                  >
                    {savingId === issue.id ? "Saving..." : "Update"}
                  </Button>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      navigate(`/officer/dashboard/issues/${issue.id}`)
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default OfficerIssuesList;
