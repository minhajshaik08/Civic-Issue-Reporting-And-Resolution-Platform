// src/pages/officer/reports/OfficerIssuesReportPage.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Form, Table, Spinner } from "react-bootstrap";

const OfficerIssuesReportPage = () => {
  const [period, setPeriod] = useState("daily");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // logged‑in officer
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
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
      params.append("period", period);
      params.append("officer_id", officerId.toString());
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const res = await fetch(
        "http://localhost:5000/api/officer/reports/issues?" +
          params.toString()
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load issues report");
        setIssues([]);
        return;
      }

      setIssues(data.issues || []);
    } catch (err) {
      setError("Error loading issues report");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loadIssues();
  };

  const downloadReport = async (format) => {
    if (!officerId) {
      alert("No logged-in officer found.");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("period", period);
      params.append("officer_id", officerId.toString());
      if (search) params.append("search", search);
      if (status) params.append("status", status);
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
      let filename = `my_assigned_issues.${format === "pdf" ? "pdf" : "xlsx"}`;
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
      alert("Error downloading report");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Assigned Issues Report</h2>

      <Form onSubmit={handleSubmit} className="mb-3">
        <Row className="g-2">
          <Col md={3}>
            <Form.Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Form.Select>
          </Col>

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

          <Col md={4}>
            <Form.Control
              placeholder="Search by issue type, area, or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col md={2}>
            <button type="submit" className="btn btn-primary w-100">
              Search
            </button>
          </Col>
        </Row>
      </Form>

      {loading && (
        <div className="mb-3">
          <Spinner animation="border" size="sm" /> Loading...
        </div>
      )}

      {error && <div className="text-danger mb-3">{error}</div>}

      {!loading && !error && issues.length === 0 && (
        <p>No assigned issues found for this filter.</p>
      )}

      {issues.length > 0 && (
        <>
          <div className="mb-3 d-flex gap-2">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => downloadReport("pdf")}
            >
              Download PDF
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => downloadReport("excel")}
            >
              Download Excel
            </button>
          </div>

          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Issue Type</th>
                <th>Status</th>
                <th>Area</th>
                <th>Reported At</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={issue.id}>
                  {/* serial number instead of database id */}
                  <td>{index + 1}</td>
                  <td>{issue.issue_type}</td>
                  <td>{issue.status}</td>
                  <td>{issue.location_text}</td>
                  <td>{issue.created_at}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default OfficerIssuesReportPage;
