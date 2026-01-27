// src/pages/middle-admin/officers/MiddleAdminOfficerListEdit.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MiddleAdminOfficerListEdit() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/middle-admin/officers/list"
      );
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to fetch officers");
      } else {
        setOfficers(data.officers || []);
      }
    } catch {
      setError("❌ Backend not reachable. Check server running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOfficers = officers.filter((o) => {
    const s = search.toLowerCase();
    return (
      !s ||
      (o.name && o.name.toLowerCase().includes(s)) ||
      (o.mobile && String(o.mobile).includes(s)) ||
      (o.email && o.email.toLowerCase().includes(s)) ||
      (o.employee_id && o.employee_id.toLowerCase().includes(s))
    );
  });

  const handleEditClick = (officer) => {
    navigate("/middle-admin/dashboard/officers/editform", {
      state: { officer },
    });
  };

  if (loading) return <p className="loading-text">Loading officers...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (officers.length === 0)
    return <p className="no-data">No officers found.</p>;

  return (
    <>
      {/* ✅ SAME CSS AS ADMIN EDIT LIST */}
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
          margin-bottom: 14px;
        }

        .page-title {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #111827;
        }

        .search-box {
          width: 340px;
          max-width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .search-box:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
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

        .btn-edit {
          border: none;
          padding: 7px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          background: #2563eb;
          color: white;
        }

        .btn-edit:hover {
          opacity: 0.9;
        }

        .loading-text {
          padding: 20px;
          font-weight: 700;
          color: #111827;
        }

        .error-text {
          padding: 20px;
          font-weight: 800;
          color: red;
        }

        .no-data {
          padding: 20px;
          font-weight: 700;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .page-wrapper {
            padding: 12px;
          }

          .page-title {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="page-wrapper">
        <div className="header-row">
          <h2 className="page-title">
            Edit Officers (Middle Admin)
          </h2>

          <input
            type="text"
            className="search-box"
            placeholder="Search by name, mobile, email, employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          {filteredOfficers.length === 0 ? (
            <p className="no-data">No match found.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOfficers.map((o, index) => (
                  <tr key={o.id}>
                    <td>{index + 1}</td>
                    <td>{o.id}</td>
                    <td>{o.name || "-"}</td>
                    <td>{o.mobile || "-"}</td>
                    <td>{o.email || "-"}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(o)}
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
