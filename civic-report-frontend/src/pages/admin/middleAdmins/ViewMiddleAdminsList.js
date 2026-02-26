import React, { useEffect, useState } from "react";

export default function ViewMiddleAdminsList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch(
          "http://13.201.16.142:5000/api/admin/middle-admins/list"
        );
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch admins");
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

  if (loading) return <p className="loading-text">Loading admins...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <>
      {/* ✅ CSS inside same file */}
      <style>{`
        .middle-admin-wrapper {
          background: #f6fbfb;
          padding: 20px;
          min-height: 100vh;
        }

        .middle-admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .middle-admin-title {
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

        .table-container {
          background: white;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.06);
          overflow-x: auto;
        }

        .styled-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
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

        .styled-table tbody tr:hover {
          background: #f1f5f9;
          transition: 0.2s;
        }

        .styled-table tbody tr:nth-child(even) {
          background: #fafafa;
        }

        .highlight {
          background: yellow;
          padding: 1px 4px;
          border-radius: 4px;
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

        .no-match {
          font-weight: 600;
          color: #6b7280;
          padding: 10px;
        }
      `}</style>

      <div className="middle-admin-wrapper">
        <div className="middle-admin-header">
          <h2 className="middle-admin-title">Admin List</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
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
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.map((admin, index) => (
                  <tr key={admin.id}>
                    {/* ✅ Serial Number */}
                    <td>{index + 1}</td>

                    <td>{admin.id}</td>
                    <td>{highlightMatch(admin.username || "")}</td>
                    <td>{highlightMatch(admin.email || "")}</td>

                    <td>
                      {admin.created_at
                        ? new Date(admin.created_at).toLocaleString("en-IN")
                        : "-"}
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
