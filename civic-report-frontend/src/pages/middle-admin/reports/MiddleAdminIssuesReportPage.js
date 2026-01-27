import React, { useEffect, useState } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";

const MiddleAdminIssuesReportPage = () => {
  const [period, setPeriod] = useState("daily");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  // ✅ month picker (SAME AS ADMIN)
  const [month, setMonth] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  });

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.append("period", period);

      // ✅ month only for monthly
      if (period === "monthly" && month) {
        params.append("month", month);
      }

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const res = await fetch(
        "http://localhost:5000/api/middle-admin/reports/issues?" +
          params.toString()
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load issues report");
        setIssues([]);
        return;
      }

      setIssues(data.issues || []);
    } catch {
      setError("Error loading issues report");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, status, month]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loadIssues();
  };

  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (st) => {
    const s = String(st || "").toUpperCase();
    if (s === "NEW") return "badge-pill st-new";
    if (s === "VIEWED") return "badge-pill st-viewed";
    if (s === "VERIFIED") return "badge-pill st-verified";
    if (s === "IN_PROGRESS") return "badge-pill st-progress";
    if (s === "SOLVED") return "badge-pill st-solved";
    return "badge-pill st-default";
  };

  return (
    <>
      {/* ✅ SAME CSS AS ADMIN */}
      <style>{`
        .report-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .report-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 16px;
        }

        .filter-card {
          background: #fff;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.06);
          margin-bottom: 16px;
        }

        .field {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          font-weight: 600;
        }

        .btn-search {
          width: 100%;
          border-radius: 12px;
          padding: 10px;
          font-weight: 900;
          background: #2563eb;
          color: white;
          border: none;
        }

        .table-card {
          background: #fff;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0px 6px 16px rgba(0,0,0,0.06);
          overflow-x: auto;
        }

        .styled-table {
          width: 100%;
          min-width: 950px;
          border-collapse: collapse;
        }

        .styled-table thead tr {
          background: #111827;
          color: white;
        }

        .styled-table th,
        .styled-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          white-space: nowrap;
        }

        .badge-pill {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
        }

        .st-new { background: #dbeafe; color: #1e40af; }
        .st-viewed { background: #e0e7ff; color: #3730a3; }
        .st-verified { background: #dcfce7; color: #166534; }
        .st-progress { background: #fef9c3; color: #854d0e; }
        .st-solved { background: #e9fff2; color: #15803d; }
        .st-default { background: #e5e7eb; color: #374151; }

        .loading-text {
          font-weight: 800;
          margin-bottom: 12px;
        }

        .error-text {
          font-weight: 900;
          color: red;
          margin-bottom: 12px;
        }

        .no-data {
          padding: 10px;
          color: #6b7280;
          font-weight: 700;
        }
      `}</style>

      <div className="report-page">
        <h2 className="report-title">Total Issues Report</h2>

        {/* ✅ FILTERS (IDENTICAL TO ADMIN) */}
        <Form onSubmit={handleSubmit} className="filter-card">
          <Row className="g-2">
            <Col md={3}>
              <select
                className="field"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="all">All</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </Col>

            {period === "monthly" && (
              <Col md={3}>
                <input
                  type="month"
                  className="field"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </Col>
            )}

            <Col md={period === "monthly" ? 3 : 4}>
              <select
                className="field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="NEW">New</option>
                <option value="VIEWED">Viewed</option>
                <option value="VERIFIED">Verified</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SOLVED">Solved</option>
              </select>
            </Col>

            <Col md={period === "monthly" ? 3 : 4}>
              <input
                className="field"
                placeholder="Search by issue type or area"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>

            <Col md={2}>
              <button type="submit" className="btn-search">
                Search
              </button>
            </Col>
          </Row>
        </Form>

        {loading && (
          <div className="loading-text">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        )}

        {error && <div className="error-text">{error}</div>}

        {!loading && !error && issues.length === 0 && (
          <div className="table-card">
            <div className="no-data">No issues found.</div>
          </div>
        )}

        {issues.length > 0 && (
          <div className="table-card">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Issue Type</th>
                  <th>Status</th>
                  <th>Area</th>
                  <th>Reported At</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, index) => (
                  <tr key={issue.id || index}>
                    <td>{index + 1}</td>
                    <td>{issue.issue_type || "-"}</td>
                    <td>
                      <span className={getStatusClass(issue.status)}>
                        {issue.status}
                      </span>
                    </td>
                    <td>{issue.location_text || "-"}</td>
                    <td>{formatDate(issue.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MiddleAdminIssuesReportPage;
