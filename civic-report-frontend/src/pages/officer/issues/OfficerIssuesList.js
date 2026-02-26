import React, { useEffect, useState } from "react";
import { Form, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function OfficerIssuesList() {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [rowStatus, setRowStatus] = useState({});

  const navigate = useNavigate();
  const officerId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  const loadIssues = async () => {
    if (!officerId) {
      setError("Officer id not found. Please login again.");
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

      const initial = {};
      (data.issues || []).forEach(i => (initial[i.id] = i.status));
      setRowStatus(initial);
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

  const handleUpdateStatus = async (issueId) => {
    try {
      setSavingId(issueId);

      const res = await fetch(
        `http://13.201.16.142:5000/api/officer/issues/${issueId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: rowStatus[issueId],
            officer_id: officerId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Update failed");
        return;
      }

      setIssues(prev =>
        prev.map(i =>
          i.id === issueId ? { ...i, status: rowStatus[issueId] } : i
        )
      );
    } catch {
      setError("Error updating status");
    } finally {
      setSavingId(null);
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
          gap: 12px;
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
          min-width: 1100px;
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
          white-space: nowrap;
          font-size: 14px;
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

        .btn-update {
          font-weight: 900;
        }
      `}</style>

      <div className="issues-page">
        <h3 className="issues-title">My Assigned Issues</h3>

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
        </div>

        {loading && <Spinner animation="border" size="sm" />}
        {error && <div className="text-danger">{error}</div>}

        {!loading && issues.length > 0 && (
          <div className="table-card">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Location</th>
                  <th>Created</th>
                  <th>Update</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {issues.map(issue => (
                  <tr key={issue.id}>
                    <td>{issue.id}</td>
                    <td>{issue.issue_type}</td>
                    <td>
                      <span className={statusClass(issue.status)}>
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={rowStatus[issue.id]}
                        onChange={e =>
                          setRowStatus(p => ({
                            ...p,
                            [issue.id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select</option>
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
                        className="btn-update"
                        disabled={savingId === issue.id}
                        onClick={() => handleUpdateStatus(issue.id)}
                      >
                        {savingId === issue.id ? "Saving..." : "Update"}
                      </Button>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
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
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default OfficerIssuesList;
