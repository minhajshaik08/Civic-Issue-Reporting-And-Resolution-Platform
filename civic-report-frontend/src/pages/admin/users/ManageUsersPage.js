import React, { useEffect, useMemo, useState } from "react";
import { showToast } from "../../../components/Toast";
import { confirm } from "../../../components/Confirm";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://13.201.16.142:5000/api/admin/users/list");
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to fetch users");
      } else {
        setUsers(data.users || []);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UNIQUE USERS (by mobile only)
  const uniqueUsers = useMemo(() => {
    const map = new Map();

    users.forEach((u) => {
      const mobileKey = String(u.mobile || "").trim();
      if (!mobileKey) return;

      // keep first occurrence only
      if (!map.has(mobileKey)) {
        map.set(mobileKey, {
          mobile: mobileKey,
          is_blocked: Boolean(u.is_blocked),
        });
      }
    });

    return Array.from(map.values());
  }, [users]);

  const toggleBlock = async (user) => {
    const action = user.is_blocked ? "Unblock" : "Block";
    const confirmed = await confirm(
      `Are you sure you want to ${action} this user?`,
      `${action} User`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://13.201.16.142:5000/api/admin/users/block/${user.mobile}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block: !user.is_blocked }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // ✅ update instantly in unique list also
        setUsers((prev) =>
          prev.map((u) =>
            u.mobile === user.mobile ? { ...u, is_blocked: !user.is_blocked } : u
          )
        );
        showToast(user.is_blocked ? "User unblocked successfully" : "User blocked successfully", "success");
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  const filteredUsers = uniqueUsers.filter((u) => {
    const s = search.toLowerCase().trim();
    return !s || (u.mobile && String(u.mobile).includes(s));
  });

  if (loading) return <div className="loading-text">Loading...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <>
      {/* ✅ CSS INSIDE SAME FILE */}
      <style>{`
        .manage-users-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 14px;
        }

        .search-box {
          width: 340px;
          max-width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          margin-bottom: 14px;
        }

        .search-box:focus {
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
          min-width: 600px;
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
        }

        .badge-active {
          background: #dcfce7;
          color: #166534;
        }

        .badge-inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-action {
          border: none;
          padding: 7px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 900;
        }

        .btn-block {
          background: #dc2626;
          color: white;
        }

        .btn-unblock {
          background: #16a34a;
          color: white;
        }

        .btn-action:hover {
          opacity: 0.9;
        }

        .loading-text {
          padding: 20px;
          font-weight: 800;
          color: #111827;
        }

        .error-text {
          padding: 20px;
          font-weight: 800;
          color: red;
        }

        .no-data {
          padding: 10px;
          color: #6b7280;
          font-weight: 700;
        }
      `}</style>

      <div className="manage-users-page">
        <h3 className="page-title">Block / Unblock Users</h3>

        <input
          type="text"
          placeholder="Search by mobile..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-card">
          {filteredUsers.length === 0 ? (
            <div className="no-data">No users found.</div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u, index) => (
                  <tr key={`${u.mobile}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{u.mobile}</td>

                    <td>
                      {u.is_blocked ? (
                        <span className="badge-pill badge-inactive">
                          Inactive
                        </span>
                      ) : (
                        <span className="badge-pill badge-active">Active</span>
                      )}
                    </td>

                    <td>
                      <button
                        className={`btn-action ${
                          u.is_blocked ? "btn-unblock" : "btn-block"
                        }`}
                        onClick={() => toggleBlock(u)}
                      >
                        {u.is_blocked ? "Unblock" : "Block"}
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
