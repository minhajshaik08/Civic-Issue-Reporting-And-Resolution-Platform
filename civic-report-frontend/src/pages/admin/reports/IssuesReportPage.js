import React, { useEffect, useState } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { showToast } from "../../../components/Toast";

const IssuesReportPage = () => {
  const [period, setPeriod] = useState("daily"); // all | daily | weekly | monthly
  const [status, setStatus] = useState(""); // "", NEW, VIEWED, VERIFIED, IN_PROGRESS, SOLVED
  const [search, setSearch] = useState("");

  // ✅ month picker for monthly reports
  const [month, setMonth] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`; // YYYY-MM
  });

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      // ✅ period
      params.append("period", period);

      // ✅ month filter only for monthly
      if (period === "monthly" && month) {
        params.append("month", month); // YYYY-MM
      }

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const res = await fetch(
        "http://13.201.16.142:5000/api/admin/reports/issues?" + params.toString()
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
  }, [period, status, month]); // ✅ reload when filters change

  const handleSubmit = (e) => {
    e.preventDefault();
    loadIssues();
  };

  // ✅ Download PDF or Excel with current filters
  const downloadReport = async (format) => {
    try {
      const params = new URLSearchParams();
      params.append("period", period);

      if (period === "monthly" && month) {
        params.append("month", month);
      }

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      params.append("format", format);

      const res = await fetch(
        "http://13.201.16.142:5000/api/admin/reports/issues/download?" +
          params.toString()
      );

      if (!res.ok) {
        showToast("Failed to download report", "error");
        return;
      }

      const contentDisposition = res.headers.get("content-disposition");
      let filename = `issues_report.${format === "pdf" ? "pdf" : "xlsx"}`;

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
      showToast("Report downloaded successfully", "success");
    } catch (err) {
      showToast("Error downloading report", "error");
    }
  };

  // ✅ date formatting
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

  // ✅ status badge class
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
      {/* ✅ CSS INSIDE SAME FILE */}
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
          outline: none;
          font-size: 14px;
          font-weight: 600;
          background: #fff;
        }

        .field:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .btn-search {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 900;
          background: #2563eb;
          color: white;
          cursor: pointer;
        }

        .btn-search:hover {
          opacity: 0.9;
        }

        .download-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .btn-download {
          border: none;
          border-radius: 12px;
          padding: 10px 14px;
          font-weight: 900;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-pdf {
          background: #dc2626;
          color: white;
        }

        .btn-excel {
          background: #16a34a;
          color: white;
        }

        .btn-download:hover {
          opacity: 0.9;
        }

        .table-card {
          background: #fff;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.06);
          overflow-x: auto;
        }

        .styled-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 950px;
        }

        .styled-table thead tr {
          background: #111827;
          color: white;
          text-align: left;
        }

        .styled-table th,
        .styled-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          white-space: nowrap;
        }

        .styled-table tbody tr:nth-child(even) {
          background: #fafafa;
        }

        .styled-table tbody tr:hover {
          background: #f1f5f9;
          transition: 0.2s;
        }

        .badge-pill {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .st-new {
          background: #dbeafe;
          color: #1e40af;
        }

        .st-viewed {
          background: #e0e7ff;
          color: #3730a3;
        }

        .st-verified {
          background: #dcfce7;
          color: #166534;
        }

        .st-progress {
          background: #fef9c3;
          color: #854d0e;
        }

        .st-solved {
          background: #e9fff2;
          color: #15803d;
        }

        .st-default {
          background: #e5e7eb;
          color: #374151;
        }

        .loading-text {
          font-weight: 800;
          color: #111827;
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

        {/* ✅ Filters */}
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

            {/* ✅ Month picker only if monthly */}
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
                placeholder="Search by issue type, area, or name"
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

        {/* ✅ Loading */}
        {loading && (
          <div className="loading-text">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        )}

        {/* ✅ Error */}
        {error && <div className="error-text">{error}</div>}

        {/* ✅ Empty */}
        {!loading && !error && issues.length === 0 && (
          <div className="table-card">
            <div className="no-data">No issues found for this filter.</div>
          </div>
        )}

        {/* ✅ Download buttons */}
        {issues.length > 0 && (
          <div className="download-row">
            <button
              type="button"
              className="btn-download btn-pdf"
              onClick={() => downloadReport("pdf")}
            >
              Download PDF
            </button>

            <button
              type="button"
              className="btn-download btn-excel"
              onClick={() => downloadReport("excel")}
            >
              Download Excel
            </button>
          </div>
        )}

        {/* ✅ Table */}
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
                  <tr key={issue.id}>
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

export default IssuesReportPage;
