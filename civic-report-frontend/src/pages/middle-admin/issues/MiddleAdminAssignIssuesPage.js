import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

function MiddleAdminAssignIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoading(true);

        const issuesRes = await fetch(
          "http://localhost:5000/api/middle-admin/issues?status=NEW"
        );
        const issuesData = await issuesRes.json();

        const officersRes = await fetch(
          "http://localhost:5000/api/middle-admin/officers/list"
        );
        const officersData = await officersRes.json();

        if (!issuesRes.ok || !issuesData.success) {
          throw new Error(issuesData.message || "Failed to load issues");
        }
        if (!officersRes.ok || !officersData.success) {
          throw new Error(officersData.message || "Failed to load officers");
        }

        setIssues(issuesData.issues || []);
        setOfficers(officersData.officers || []);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOfficerChange = (issueId, officerId) => {
    setSelectedOfficer((prev) => ({
      ...prev,
      [issueId]: officerId,
    }));
  };

  const handleAssign = async (issueId) => {
    const officerId = selectedOfficer[issueId];
    if (!officerId) return;

    try {
      setSavingId(issueId);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/middle-admin/issues/${issueId}/assign-officer`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ officer_id: officerId }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to assign officer");
      }

      setIssues((prev) => prev.filter((i) => i.id !== issueId));
    } catch (err) {
      setError(err.message || "Error assigning officer");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-text">
        <Spinner animation="border" size="sm" /> Loading issues...
      </div>
    );
  }

  return (
    <>
      {/* ✅ CSS INSIDE SAME FILE */}
      <style>{`
        .assign-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .assign-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 6px;
        }

        .assign-subtitle {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .table-card {
          background: white;
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

        .select-box {
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-weight: 600;
          width: 100%;
        }

        .btn-assign {
          border: none;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 900;
          background: #16a34a;
          color: white;
          cursor: pointer;
        }

        .btn-assign:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .error-text {
          color: red;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .loading-text {
          padding: 20px;
          font-weight: 800;
        }

        .no-data {
          padding: 10px;
          font-weight: 700;
          color: #6b7280;
        }
      `}</style>

      <div className="assign-page">
        <h3 className="assign-title">Assign Issues to Officers</h3>
        <p className="assign-subtitle">
          Only issues with status <strong>NEW</strong> are shown here.
        </p>

        {error && <div className="error-text">{error}</div>}

        <div className="table-card">
          {issues.length === 0 ? (
            <div className="no-data">No new issues to assign.</div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Issue</th>
                  <th>Location</th>
                  <th>Assign Officer</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue, index) => {
                  const deptKey = issue.issue_type
                    ? issue.issue_type.toLowerCase()
                    : "";

                  const matchingOfficers = officers.filter(
                    (o) =>
                      o.department &&
                      o.department.toLowerCase() === deptKey
                  );

                  const options =
                    matchingOfficers.length > 0
                      ? matchingOfficers
                      : officers;

                  return (
                    <tr key={issue.id}>
                      <td>{index + 1}</td>
                      <td>{issue.issue_type}</td>
                      <td>{issue.location_text}</td>
                      <td>
                        <select
                          className="select-box"
                          value={selectedOfficer[issue.id] || ""}
                          onChange={(e) =>
                            handleOfficerChange(issue.id, e.target.value)
                          }
                        >
                          <option value="">Select officer</option>
                          {options.map((off) => (
                            <option key={off.id} value={off.id}>
                              {off.name}
                              {off.zone ? ` - ${off.zone}` : ""}
                              {off.department
                                ? ` (${off.department})`
                                : ""}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn-assign"
                          disabled={
                            !selectedOfficer[issue.id] ||
                            savingId === issue.id
                          }
                          onClick={() => handleAssign(issue.id)}
                        >
                          {savingId === issue.id
                            ? "Assigning..."
                            : "Assign"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default MiddleAdminAssignIssuesPage;
