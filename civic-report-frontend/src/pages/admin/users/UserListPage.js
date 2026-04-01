import React, { useEffect, useMemo, useState } from "react";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/users/list");
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

  // ✅ Merge duplicates only if BOTH name + mobile match
  const mergedUsers = useMemo(() => {
    const map = new Map();

    users.forEach((u) => {
      const nameKey = (u.name || "N/A").trim().toLowerCase();
      const mobileKey = String(u.mobile || "").trim();

      const key = `${nameKey}__${mobileKey}`;

      if (!map.has(key)) {
        map.set(key, {
          name: u.name || "N/A",
          mobile: u.mobile || "-",
          city: u.city || "-",
          report_count: u.report_count || 0,
          is_blocked: Boolean(u.is_blocked),
          count: 1,
        });
      } else {
        const existing = map.get(key);

        existing.count += 1;
        existing.report_count =
          existing.report_count + (Number(u.report_count) || 0);

        // ✅ If ANY user active -> show Active
        const existingBlocked = Boolean(existing.is_blocked);
        const currentBlocked = Boolean(u.is_blocked);
        existing.is_blocked = existingBlocked && currentBlocked;

        if (existing.city === "-" && u.city && u.city !== "-") {
          existing.city = u.city;
        }

        map.set(key, existing);
      }
    });

    return Array.from(map.values());
  }, [users]);

  // ✅ Filters
  const filteredUsers = mergedUsers.filter((u) => {
    const s = search.toLowerCase().trim();

    const matchSearch =
      !s ||
      (u.mobile && String(u.mobile).includes(s)) ||
      (u.name && String(u.name).toLowerCase().includes(s));

    const matchCity =
      !cityFilter ||
      (u.city && u.city.toLowerCase() === cityFilter.toLowerCase());

    return matchSearch && matchCity;
  });

  // ✅ Unique city list
  const uniqueCities = useMemo(() => {
    const cities = mergedUsers.map((u) => u.city).filter(Boolean);
    return [...new Set(cities)].filter((c) => c !== "-");
  }, [mergedUsers]);

  if (loading) return <div className="users-loading">Loading users...</div>;
  if (error) return <div className="users-error">{error}</div>;

  return (
    <>
      {/* ✅ CSS INSIDE SAME FILE */}
      <style>{`
        .users-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .users-title {
          margin: 0 0 14px 0;
          font-size: 22px;
          font-weight: 900;
          color: #111827;
        }

        .filters-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .filter-input,
        .filter-select {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          background: white;
          min-width: 240px;
          max-width: 100%;
        }

        .filter-input:focus,
        .filter-select:focus {
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
          background: #dcfce7;
          color: #166534;
        }

        .badge-inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .count-pill {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          background: #e0f2fe;
          color: #075985;
        }

        .users-loading {
          padding: 20px;
          font-weight: 700;
          color: #111827;
        }

        .users-error {
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

      <div className="users-page">
        <h3 className="users-title">All Users</h3>

        {/* ✅ Filters */}
        <div className="filters-row">
          <input
            type="text"
            placeholder="Search name / mobile..."
            className="filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Table */}
        <div className="table-card">
          {filteredUsers.length === 0 ? (
            <div className="no-data">No users found.</div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Count</th>
                  <th>Reports Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u, index) => (
                  <tr key={`${u.mobile}-${u.name}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.mobile}</td>
                    <td>{u.city}</td>

                    <td>
                      <span className="count-pill">{u.count}</span>
                    </td>

                    <td>{u.report_count || 0}</td>

                    <td>
                      {u.is_blocked ? (
                        <span className="badge-pill badge-inactive">
                          Inactive
                        </span>
                      ) : (
                        <span className="badge-pill badge-active">Active</span>
                      )}
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
