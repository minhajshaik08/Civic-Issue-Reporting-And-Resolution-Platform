import React, { useEffect, useState } from "react";
import { Form, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../components/Toast";

const OfficerIssuesReportPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const navigate = useNavigate();

  const officerId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  const loadIssues = async () => {
    if (!officerId) {
      setError("No logged-in officer found.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({ officer_id: officerId });
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(
        "http://13.201.16.142:5000/api/officer/issues?" + params.toString()
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load issues");
        return;
      }

      setIssues(data.issues || []);
    } catch {
      setError("Error loading issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    // eslint-disable-next-line
  }, [statusFilter]);

  const downloadReport = async (format) => {
    try {
      setDownloadLoading(true);

      const params = new URLSearchParams({
        officer_id: officerId,
        format,
      });
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(
        "http://13.201.16.142:5000/api/officer/reports/issues/download?" +
          params.toString()
      );

      if (!res.ok) {
        showToast("Failed to download report", "error");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assigned_issues.${format === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("Report downloaded successfully", "success");
    } catch {
      showToast("Download error", "error");
    } finally {
      setDownloadLoading(false);
    }
  };

  const statusClass = (st) => {
    if (st === "NEW") return "status-pill st-new";
    if (st === "VIEWED") return "status-pill st-viewed";
    if (st === "VERIFIED") return "status-pill st-verified";
    if (st === "IN_PROGRESS") return "status-pill st-progress";
    if (st === "SOLVED") return "status-pill st-solved";
    return "status-pill";
  };

  return (
    <>
      {/* ✅ SAME CSS AS MIDDLE ADMIN */}
      <style>{`
        .issues-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .issues-title {
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 14px;
        }

        .filters-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .filter-select {
          width: 260px;
          padding: 10px;
          border-radius: 10px;
        }

        .table-card {
          background: #fff;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          overflow-x: auto;
        }

        .styled-table {
          width: 100%;
          min-width: 900px;
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

        .styled-table tbody tr:nth-child(even) {
          background: #fafafa;
        }

        .styled-table tbody tr:hover {
          background: #f1f5f9;
        }

        .status-pill {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
        }

        .st-new { background:#dbeafe;color:#1e40af }
        .st-viewed { background:#e0e7ff;color:#3730a3 }
        .st-verified { background:#dcfce7;color:#166534 }
        .st-progress { background:#fef9c3;color:#854d0e }
        .st-solved { background:#e9fff2;color:#15803d }
      `}</style>

      <div className="issues-page">
        <h3 className="issues-title">My Assigned Issues Report</h3>

        <div className="filters-row">
          <Form.Select
            className="filter-select"
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

          {issues.length > 0 && (
            <div className="d-flex gap-2">
              <Button
                size="lg"
                variant="danger"
                disabled={downloadLoading}
                onClick={() => downloadReport("pdf")}
              >
                PDF
              </Button>
              <Button
                size="lg"
                variant="success"
                disabled={downloadLoading}
                onClick={() => downloadReport("excel")}
              >
                Excel
              </Button>
            </div>
          )}
        </div>

        {loading && <Spinner animation="border" size="sm" />}
        {error && <div className="text-danger">{error}</div>}

        {!loading && issues.length > 0 && (
          <div className="table-card">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Issue Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Created</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.issue_type}</td>
                    <td>
                      <span className={statusClass(i.status)}>
                        {i.status}
                      </span>
                    </td>
                    <td>{i.location_text}</td>
                    <td>{i.created_at}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          navigate(`/officer/dashboard/issues/${i.id}`)
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && issues.length === 0 && (
          <div className="table-card">No issues found.</div>
        )}
      </div>
    </>
  );
};

export default OfficerIssuesReportPage;
