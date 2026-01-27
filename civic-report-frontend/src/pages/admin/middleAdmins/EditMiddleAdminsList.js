import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewMiddleAdminsList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
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
        <span className="highlight">{match}</span>
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

  const handleEdit = (admin) => {
    navigate("/admin/welcome/middle-admins/edit", { state: { admin } });
  };

  if (loading) return <p className="loading-text">Loading middle admins...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <>
      {/* ✅ CSS inside same file */}
      <style>{`
        .page-wrapper {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .page-title {
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
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.06);
          padding: 14px;
          overflow-x: auto;
        }

        .styled-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
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

        .btn-edit {
          background: #2563eb;
          border: none;
          color: #fff;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-edit:hover {
          opacity: 0.9;
        }

        .no-match {
          font-weight: 600;
          color: #6b7280;
          padding: 10px;
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

      <div className="page-wrapper">
        <div className="header-row">
          <h2 className="page-title">Middle Admin List</h2>

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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.map((admin, index) => (
                  <tr key={admin.id}>
                    {/* ✅ Serial Number */}
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
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(admin)}
                      >
                        Edit
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
