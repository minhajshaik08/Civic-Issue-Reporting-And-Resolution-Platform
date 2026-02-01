import React, { useEffect, useState } from "react";
import { showToast } from "../../../components/Toast";
import { confirm } from "../../../components/Confirm";

export default function ManageOfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOfficers();
  }, []);

  // ✅ helper: safe JSON parse
  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, message: text || "Invalid server response" };
    }
  };

  const fetchOfficers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/officers/list");

      const data = await safeJson(res);

      if (!res.ok) {
        setError(data.message || "Server error while fetching officers");
        setOfficers([]);
        return;
      }

      if (!data.success) {
        setError(data.message || "Failed to fetch officers");
      } else {
        setOfficers(Array.isArray(data.officers) ? data.officers : []);
        setError("");
      }
    } catch (err) {
      setError("❌ Backend not reachable. Check server running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ highlight search term
  const highlightMatch = (text) => {
    if (!search.trim()) return text;

    const value = String(text || "");
    const lower = value.toLowerCase();
    const term = search.toLowerCase();
    const index = lower.indexOf(term);

    if (index === -1) return text;

    const before = value.slice(0, index);
    const match = value.slice(index, index + term.length);
    const after = value.slice(index + term.length);

    return (
      <>
        {before}
        <mark className="highlight">{match}</mark>
        {after}
      </>
    );
  };

  const filteredOfficers = officers.filter((o) => {
    const s = search.toLowerCase();
    if (!s) return true;

    return (
      (o.name && o.name.toLowerCase().includes(s)) ||
      (o.mobile && String(o.mobile).includes(s)) ||
      (o.email && o.email.toLowerCase().includes(s)) ||
      (o.employee_id && o.employee_id.toLowerCase().includes(s))
    );
  });

  // ✅ Block/Unblock officer (status: 0=Active, 1=Blocked)
  const toggleBlock = async (officer) => {
    const newBlockStatus = officer.status === 0; // active -> block(true)

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/officers/block/${officer.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block: newBlockStatus }),
        }
      );

      const data = await safeJson(res);

      if (!res.ok) {
        showToast(data.message || "Server error while blocking/unblocking", "error");
        return;
      }

      if (!data.success) {
        showToast(data.message || "Failed to change block status", "error");
      } else {
        // ✅ update instantly in UI
        setOfficers((prev) =>
          prev.map((o) =>
            o.id === officer.id ? { ...o, status: newBlockStatus ? 1 : 0 } : o
          )
        );
        showToast(newBlockStatus ? "Officer blocked successfully" : "Officer unblocked successfully", "success");
      }
    } catch {
      showToast("❌ Backend not reachable. Check server running on port 5000.", "error");
    }
  };

  // ✅ Delete officer
  const deleteOfficer = async (officer) => {
    const confirmed = await confirm(
      `Are you sure you want to delete ${officer.name}?`,
      "Delete Officer"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/officers/${officer.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await safeJson(res);

      if (!res.ok) {
        showToast(data.message || "Server error while deleting", "error");
        return;
      }

      if (!data.success) {
        showToast(data.message || "Failed to delete officer", "error");
      } else {
        // ✅ remove instantly
        setOfficers((prev) => prev.filter((o) => o.id !== officer.id));
        showToast("Officer deleted successfully", "success");
      }
    } catch {
      showToast("❌ Backend not reachable. Check server running on port 5000.", "error");
    }
  };

  if (loading) return <p className="loading-text">Loading officers...</p>;

  if (error)
    return (
      <div className="manage-wrapper">
        <p className="error-text">{error}</p>
        <button className="btn-action btn-block" onClick={fetchOfficers}>
          Retry
        </button>
      </div>
    );

  return (
    <>
      {/* ✅ CSS inside SAME FILE */}
      <style>{`
        .manage-wrapper {
          background: #f6fbfb;
          padding: 20px;
          min-height: 100vh;
        }

        .manage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .manage-title {
          margin: 0;
          font-weight: 800;
          color: #111827;
        }

        .search-input {
          width: 340px;
          max-width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
        }

        .search-input:focus {
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
        }

        .styled-table tbody tr:nth-child(even) {
          background: #fafafa;
        }

        .styled-table tbody tr:hover {
          background: #f1f5f9;
          transition: 0.2s;
        }

        .highlight {
          background: yellow;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .status-pill {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .status-active {
          background: #dcfce7;
          color: #166534;
        }

        .status-blocked {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-action {
          border: none;
          padding: 7px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          margin-right: 8px;
        }

        .btn-block {
          background: #2563eb;
          color: white;
        }

        .btn-unblock {
          background: #16a34a;
          color: white;
        }

        .btn-delete {
          background: #dc2626;
          color: white;
        }

        .btn-action:hover {
          opacity: 0.9;
        }

        .no-match {
          padding: 10px;
          color: #6b7280;
          font-weight: 600;
        }

        .loading-text {
          padding: 20px;
          font-weight: 600;
        }

        .error-text {
          padding: 12px;
          color: red;
          font-weight: 800;
        }
      `}</style>

      <div className="manage-wrapper">
        <div className="manage-header">
          <h2 className="manage-title">Manage Officers (Block / Delete)</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search by name, mobile, email, employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          {filteredOfficers.length === 0 ? (
            <p className="no-match">No match found.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Dept</th>
                  <th>Zone</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOfficers.map((o, index) => (
                  <tr key={o.id}>
                    <td>{index + 1}</td>
                    <td>{o.id}</td>
                    <td>{highlightMatch(o.name)}</td>
                    <td>{o.department || "-"}</td>
                    <td>{o.zone || "-"}</td>
                    <td>{highlightMatch(o.mobile)}</td>
                    <td>{highlightMatch(o.email)}</td>

                    <td>
                      {o.status === 1 ? (
                        <span className="status-pill status-blocked">
                          Blocked
                        </span>
                      ) : (
                        <span className="status-pill status-active">Active</span>
                      )}
                    </td>

                    <td>
                      <button
                        className={`btn-action ${
                          o.status === 1 ? "btn-unblock" : "btn-block"
                        }`}
                        onClick={() => toggleBlock(o)}
                      >
                        {o.status === 1 ? "Unblock" : "Block"}
                      </button>

                      <button
                        className="btn-action btn-delete"
                        onClick={() => deleteOfficer(o)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
