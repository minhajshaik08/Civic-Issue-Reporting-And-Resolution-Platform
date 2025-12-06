import React, { useEffect, useState } from "react";

export default function UserActivityPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      // This route needs to return users with stats (report_count, last_login)
      const res = await fetch("http://localhost:5000/api/admin/users/list");
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

  if (loading) return <div className="p-4">Loading activity data...</div>;

  return (
    <div className="p-4">
      <h3 className="mb-3">User Activity Summary</h3>
      <p className="text-muted">Track issue submissions and login history.</p>

      <table className="table table-striped border">
        <thead className="table-light">
          <tr>
            <th>User ID</th>
            <th>Mobile</th>
            <th>Total Reports</th>
            <th>Last Active</th>
            <th>Activity Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            // Simple logic to determine if Active/Inactive based on report count
            const isActive = (u.report_count && u.report_count > 0);
            
            return (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.mobile}</td>
                <td>{u.report_count || 0}</td>
                <td>{u.last_login ? new Date(u.last_login).toLocaleString() : "Never"}</td>
                <td>
                  <span className={`badge ${isActive ? "bg-info" : "bg-secondary"}`}>
                    {isActive ? "Active Contributor" : "Inactive"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
