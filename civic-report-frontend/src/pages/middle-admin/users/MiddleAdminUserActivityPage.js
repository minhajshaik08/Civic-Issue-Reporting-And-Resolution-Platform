import React, { useEffect, useMemo, useState } from "react";

export default function MiddleAdminUserActivityPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/middle-admin/users/list"
      );
      const data = await res.json();

      if (data.success) {
        setUsers(data.users || []);
      }
    } catch {
      console.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UNIQUE USERS BY MOBILE (same as Admin)
  const uniqueUsers = useMemo(() => {
    const map = new Map();
    users.forEach((u) => {
      const mobileKey = String(u.mobile || "").trim();
      if (!mobileKey) return;
      if (!map.has(mobileKey)) map.set(mobileKey, u);
    });
    return Array.from(map.values());
  }, [users]);

  if (loading)
    return <div className="loading-text">Loading activity data...</div>;

  return (
    <>
      {/* ✅ SAME CSS AS ADMIN USER ACTIVITY */}
      <style>{`
        .activity-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .activity-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 6px;
        }

        .activity-subtitle {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 16px;
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
          min-width: 800px;
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
          background: #e0f2fe;
          color: #075985;
        }

        .badge-inactive {
          background: #e5e7eb;
          color: #374151;
        }

        .loading-text {
          padding: 20px;
          font-weight: 800;
          color: #111827;
        }

        .no-data {
          padding: 10px;
          color: #6b7280;
          font-weight: 700;
        }
      `}</style>

      <div className="activity-page">
        <h3 className="activity-title">
          User Activity Summary (Middle Admin)
        </h3>
        <p className="activity-subtitle">
          Track issue submissions and login history.
        </p>

        <div className="table-card">
          {uniqueUsers.length === 0 ? (
            <div className="no-data">No activity data available.</div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Mobile</th>
                  <th>Total Reports</th>
                  <th>Last Active</th>
                  <th>Activity Status</th>
                </tr>
              </thead>

              <tbody>
                {uniqueUsers.map((u, index) => {
                  const isActive = u.report_count && u.report_count > 0;

                  return (
                    <tr key={`${u.mobile}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{u.mobile}</td>
                      <td>{u.report_count || 0}</td>
                      <td>
                        {u.last_login
                          ? new Date(u.last_login).toLocaleString()
                          : "Never"}
                      </td>
                      <td>
                        {isActive ? (
                          <span className="badge-pill badge-active">
                            Active Contributor
                          </span>
                        ) : (
                          <span className="badge-pill badge-inactive">
                            Inactive
                          </span>
                        )}
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
