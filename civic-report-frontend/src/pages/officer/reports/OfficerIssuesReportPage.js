// src/pages/officer/reports/OfficerIssuesReportPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OfficerIssuesReportPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const navigate = useNavigate();

  // logged‑in officer
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const officerId = storedUser.id;

  const loadIssues = async () => {
    if (!officerId) {
      setError("No logged-in officer found.");
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

  const downloadReport = async (format) => {
    if (!officerId) {
      alert("No logged-in officer found.");
      return;
    }

    try {
      setDownloadLoading(true);
      const params = new URLSearchParams();
      params.append("officer_id", officerId.toString());
      if (statusFilter) params.append("status", statusFilter);
      params.append("format", format);

      const res = await fetch(
        "http://localhost:5000/api/officer/reports/issues/download?" +
          params.toString()
      );

      if (!res.ok) {
        alert("Failed to download report");
        return;
      }

      const contentDisposition = res.headers.get("content-disposition");
      let filename = `assigned_issues_${new Date().toISOString().split('T')[0]}.${format === "pdf" ? "pdf" : "xlsx"}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match) filename = match[1];
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
      alert("Error downloading report");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-3">My Assigned Issues Report</h3>

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

      {/* Download Buttons */}
      {issues.length > 0 && (
        <div className="mb-3 d-flex gap-2">
          <Button
            variant="danger"
            onClick={() => downloadReport("pdf")}
            disabled={downloadLoading}
            size="sm"
          >
            {downloadLoading ? "Downloading..." : "Download PDF"}
          </Button>
          <Button
            variant="success"
            onClick={() => downloadReport("excel")}
            disabled={downloadLoading}
            size="sm"
          >
            {downloadLoading ? "Downloading..." : "Download Excel"}
          </Button>
        </div>
      )}

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
              <th>Location</th>
              <th>Created At</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.issue_type}</td>
                <td>{issue.status}</td>
                <td>{issue.location_text}</td>
                <td>{issue.created_at}</td>
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
};

export default OfficerIssuesReportPage;
