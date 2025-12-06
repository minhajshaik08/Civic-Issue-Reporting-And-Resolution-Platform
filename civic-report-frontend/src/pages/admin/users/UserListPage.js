import React, { useEffect, useState } from "react";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // You will create this backend route later
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

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    // Search by mobile or email
    const matchSearch = !s || 
      (u.mobile && u.mobile.includes(s)) || 
      (u.email && u.email.toLowerCase().includes(s));

    // Filter by city
    const matchCity = !cityFilter || (u.city && u.city.toLowerCase() === cityFilter.toLowerCase());

    // Filter by registered date (simple string match for now)
    const matchDate = !dateFilter || (u.created_at && u.created_at.startsWith(dateFilter));

    return matchSearch && matchCity && matchDate;
  });

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  // Get unique cities for filter dropdown
  const uniqueCities = [...new Set(users.map(u => u.city).filter(Boolean))];

  return (
    <div className="p-4">
      <h3 className="mb-3">All Users</h3>

      {/* Filters Section */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          placeholder="Search mobile or email..."
          className="form-control"
          style={{ maxWidth: "250px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select 
          className="form-select" 
          style={{ maxWidth: "200px" }}
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {uniqueCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input
          type="date"
          className="form-control"
          style={{ maxWidth: "200px" }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>City</th>
            <th>Registered Date</th>
            <th>Reports Submitted</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr><td colSpan="8" className="text-center">No users found.</td></tr>
          ) : (
            filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name || "N/A"}</td>
                <td>{u.mobile}</td>
                <td>{u.email || "-"}</td>
                <td>{u.city || "-"}</td>
                <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td>
                {/* Placeholder for report count until backend sends it */}
                <td>{u.report_count || 0}</td>
                <td>
                  <span className={`badge ${u.is_blocked ? "bg-danger" : "bg-success"}`}>
                    {u.is_blocked ? "Blocked" : "Active"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
