// src/pages/admin/issues/Issueslist.js
import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Issueslist() {
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
        "http://localhost:5000/api/admin/issues" +
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

  // ✅ date formatting
  const formatDate = (d) => {
    if (!d) return "-";
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return d; // fallback if already string
    return dateObj.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* ✅ CSS inside same file */}
      <style>{`
        .issues-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .issues-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 14px;
        }

        .filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .filter-select {
          width: 260px;
          max-width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          background: #fff;
        }

        .filter-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
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
          min-width: 900px;
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

        .status-pill {
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

        .btn-view {
          border: none;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 900;
          background: #2563eb;
          color: #fff;
        }

        .btn-view:hover {
          opacity: 0.9;
        }

        .loading-text {
          font-weight: 800;
          color: #111827;
          margin-bottom: 10px;
        }

        .error-text {
          font-weight: 800;
          color: red;
          margin-bottom: 10px;
        }

        .no-data {
          padding: 10px;
          color: #6b7280;
          font-weight: 700;
        }
      `}</style>

      <div className="issues-page">
        <h3 className="issues-title">Issues List</h3>

        {/* ✅ Filter */}
        <div className="filters-row">
          <Form.Select
            className="filter-select"
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
        </div>

        {/* ✅ Loading */}
        {loading && (
          <div className="loading-text">
            <Spinner animation="border" size="sm" /> Loading issues...
          </div>
        )}

        {/* ✅ Error */}
        {error && <div className="error-text">{error}</div>}

        {/* ✅ Empty */}
        {!loading && !error && issues.length === 0 && (
          <div className="table-card">
            <div className="no-data">No issues found for the selected filter.</div>
          </div>
        )}

        {/* ✅ Table */}
        {!loading && !error && issues.length > 0 && (
          <div className="table-card">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Issue Type</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue, index) => {
                  const st = String(issue.status || "").toUpperCase();

                  let statusClass = "status-pill";
                  if (st === "NEW") statusClass += " st-new";
                  else if (st === "VIEWED") statusClass += " st-viewed";
                  else if (st === "VERIFIED") statusClass += " st-verified";
                  else if (st === "IN_PROGRESS") statusClass += " st-progress";
                  else if (st === "SOLVED") statusClass += " st-solved";

                  return (
                    <tr key={issue.id}>
                      <td>{index + 1}</td>
                      <td>{issue.issue_type || "-"}</td>

                      <td>
                        <span className={statusClass}>{issue.status}</span>
                      </td>

                      <td>{formatDate(issue.created_at)}</td>

                      <td>
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/admin/welcome/issues/${issue.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Issueslist;
