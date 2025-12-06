import React, { useEffect, useState } from "react";

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

  const toggleBlock = async (user) => {
    const action = user.is_blocked ? "Unblock" : "Block";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/block/${user.mobile}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block: !user.is_blocked }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.mobile === user.mobile ? { ...u, is_blocked: !u.is_blocked } : u
          )
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch {
      alert("Network error");
    }
  };

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      !s ||
      (u.mobile && u.mobile.includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s))
    );
  });

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger">{error}</div>;
  }

  return (
    <div className="p-4">
      <h3 className="mb-3">Block / Unblock Users</h3>

      <input
        type="text"
        placeholder="Search by mobile or email..."
        className="form-control mb-3"
        style={{ maxWidth: "300px" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.mobile}</td>
              <td>{u.email || "-"}</td>
              <td>
                <span
                  className={`badge ${
                    u.is_blocked ? "bg-danger" : "bg-success"
                  }`}
                >
                  {u.is_blocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td>
                <button
                  className={`btn btn-sm ${
                    u.is_blocked ? "btn-success" : "btn-danger"
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
    </div>
  );
}
