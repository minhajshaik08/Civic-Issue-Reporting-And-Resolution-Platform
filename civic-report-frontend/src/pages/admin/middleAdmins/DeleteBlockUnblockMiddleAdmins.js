import React, { useEffect, useState } from "react";
import { showToast } from "../../../components/Toast";
import { confirm } from "../../../components/Confirm";

export default function DeleteBlockUnblockMiddleAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/middle-admins/list"
      );
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to fetch middle admins");
      } else {
        setAdmins(data.middleAdmins || []);
        setError("");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

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

  const filteredAdmins = admins.filter((admin) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();

    return (
      admin.username?.toLowerCase().includes(s) ||
      admin.email?.toLowerCase().includes(s)
    );
  });

  // ✅ Toggle Block / Unblock (Instant UI update)
  const toggleBlock = async (admin) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/middle-admins/block/${admin.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block: !admin.is_blocked }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Failed to change block status", "error");
      } else {
        // ✅ Update instantly using returned admin row
        setAdmins((prev) =>
          prev.map((a) => (a.id === admin.id ? data.admin : a))
        );
        showToast(admin.is_blocked ? "Admin blocked successfully" : "Admin unblocked successfully", "success");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  // ✅ Delete admin
  const deleteAdmin = async (admin) => {
    const confirmed = await confirm(
      `Are you sure you want to delete ${admin.username}?`,
      "Delete Admin"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/middle-admins/${admin.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Failed to delete admin", "error");
      } else {
        // ✅ Remove instantly from UI
        setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
        showToast("Admin deleted successfully", "success");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  if (loading) return <p className="loading-text">Loading middle admins...</p>;
  if (error) return <p className="error-text">{error}</p>;

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
          width: 320px;
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
          font-weight: 700;
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
          font-weight: 700;
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
          padding: 20px;
          color: red;
          font-weight: 600;
        }
      `}</style>

      <div className="manage-wrapper">
        <div className="manage-header">
          <h2 className="manage-title">Manage Middle Admins</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          {filteredAdmins.length === 0 ? (
            <p className="no-match">No match found.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.map((admin, index) => (
                  <tr key={admin.id}>
                    <td>{index + 1}</td>
                    <td>{admin.id}</td>
                    <td>{highlightMatch(admin.username)}</td>
                    <td>{highlightMatch(admin.email)}</td>

                    <td>
                      {admin.created_at
                        ? new Date(admin.created_at).toLocaleString("en-IN")
                        : "-"}
                    </td>

                    <td>
                      {admin.is_blocked ? (
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
                          admin.is_blocked ? "btn-unblock" : "btn-block"
                        }`}
                        onClick={() => toggleBlock(admin)}
                      >
                        {admin.is_blocked ? "Unblock" : "Block"}
                      </button>

                      <button
                        className="btn-action btn-delete"
                        onClick={() => deleteAdmin(admin)}
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
