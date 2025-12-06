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
        const res = await fetch("http://localhost:5000/api/admin/officers/list");
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
    const matchStatus =
      !statusFilter ||
      (statusFilter === "Active" && o.status === 0) ||
      (statusFilter === "Blocked" && o.status === 1);

    return matchSearch && matchZone && matchDept && matchStatus;
  });

  if (loading) {
    return <div style={{ padding: "1rem" }}>Loading officers...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Officer List</h2>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, mobile, email, employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px", minWidth: "260px" }}
        />
        <select
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
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Roads">Roads</option>
          <option value="Streetlights">Streetlights</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f7f7f7" }}>
            <th style={{ padding: "6px" }}>ID</th>
            <th style={{ padding: "6px" }}>Name</th>
            <th style={{ padding: "6px" }}>Designation</th>
            <th style={{ padding: "6px" }}>Dept</th>
            <th style={{ padding: "6px" }}>Zone</th>
            <th style={{ padding: "6px" }}>Mobile</th>
            <th style={{ padding: "6px" }}>Email</th>
            <th style={{ padding: "6px" }}>Status</th>
            <th style={{ padding: "6px" }}>Created At</th>
            <th style={{ padding: "6px" }}>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {filteredOfficers.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "8px" }}>
                No officers found.
              </td>
            </tr>
          ) : (
            filteredOfficers.map((o) => (
              <tr key={o.id}>
                <td style={{ padding: "6px" }}>{o.id}</td>
                <td style={{ padding: "6px" }}>{o.name}</td>
                <td style={{ padding: "6px" }}>{o.designation}</td>
                <td style={{ padding: "6px" }}>{o.department}</td>
                <td style={{ padding: "6px" }}>{o.zone}</td>
                <td style={{ padding: "6px" }}>{o.mobile}</td>
                <td style={{ padding: "6px" }}>{o.email}</td>
                <td style={{ padding: "6px" }}>
                  {o.status === 1 ? "Blocked" : "Active"}
                </td>
                <td style={{ padding: "6px" }}>
                  {o.created_at
                    ? new Date(o.created_at).toLocaleString()
                    : ""}
                </td>
                <td style={{ padding: "6px" }}>
                  {o.last_login
                    ? new Date(o.last_login).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
