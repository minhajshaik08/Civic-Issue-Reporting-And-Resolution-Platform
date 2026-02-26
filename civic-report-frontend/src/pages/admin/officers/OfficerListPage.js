import React, { useEffect, useState } from "react";

export default function OfficerListPage() {
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOfficers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("http://13.201.16.142:5000/api/admin/officers/list");
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch officers.");
        } else {
          setOfficers(data.officers || []);
        }
      } catch (e) {
        setError("Network error while loading officers.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  const filteredOfficers = officers.filter((o) => {
    const s = search.toLowerCase();

    const matchSearch =
      !s ||
      (o.name && o.name.toLowerCase().includes(s)) ||
      (o.mobile && o.mobile.includes(s)) ||
      (o.email && o.email.toLowerCase().includes(s)) ||
      (o.employee_id && o.employee_id.toLowerCase().includes(s));

    const matchZone = !zoneFilter || o.zone === zoneFilter;
    const matchDept = !deptFilter || o.department === deptFilter;

    // ✅ status mapping
    // status=0 => Active
    // status=1 => Blocked
    const matchStatus =
      !statusFilter ||
      (statusFilter === "Active" && o.status === 0) ||
      (statusFilter === "Blocked" && o.status === 1);

    return matchSearch && matchZone && matchDept && matchStatus;
  });

  if (loading) {
    return <div className="loading-text">Loading officers...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <>
      {/* ✅ CSS inside SAME FILE */}
      <style>{`
        .page-wrapper {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .page-title {
          margin: 0 0 14px 0;
          font-weight: 800;
          color: #111827;
        }

        .filters-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .input-search {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          min-width: 280px;
          flex: 1;
        }

        .input-search:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .filter-select {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          background: #fff;
          min-width: 170px;
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
          min-width: 1100px;
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

        .empty-row {
          text-align: center;
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
          font-weight: 700;
        }
      `}</style>

      <div className="page-wrapper">
        <h2 className="page-title">Officer List</h2>

        {/* ✅ Filters */}
        <div className="filters-row">
          <input
            type="text"
            className="input-search"
            placeholder="Search by name, mobile, email, employee ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
          >
            <option value="">All Zones</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>

          <select
            className="filter-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Roads">Roads</option>
            <option value="Streetlights">Streetlights</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        {/* ✅ Table */}
        <div className="table-card">
          <table className="styled-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Dept</th>
                <th>Zone</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Last Login</th>
              </tr>
            </thead>

            <tbody>
              {filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="empty-row">
                    No officers found.
                  </td>
                </tr>
              ) : (
                filteredOfficers.map((o, index) => (
                  <tr key={o.id}>
                    <td>{index + 1}</td>
                    <td>{o.id}</td>
                    <td>{o.name}</td>
                    <td>{o.designation || "-"}</td>
                    <td>{o.department || "-"}</td>
                    <td>{o.zone || "-"}</td>
                    <td>{o.mobile || "-"}</td>
                    <td>{o.email || "-"}</td>

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
                      {o.created_at
                        ? new Date(o.created_at).toLocaleString("en-IN")
                        : "-"}
                    </td>

                    <td>
                      {o.last_login
                        ? new Date(o.last_login).toLocaleString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
