import React, { useEffect, useState } from "react";

export default function DeleteBlockUnblockMiddleAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/middle-admins/list");
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to fetch middle admins");
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

  const highlightMatch = (text) => {
    if (!search.trim()) return text;
    const lower = String(text).toLowerCase();
    const term = search.toLowerCase();
    const index = lower.indexOf(term);
    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + term.length);
    const after = text.slice(index + term.length);

    return (
      <>
        {before}
        <mark>{match}</mark>
        {after}
      </>
    );
  };

  const filteredAdmins = admins.filter((admin) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      admin.username.toLowerCase().includes(s) ||
      admin.email.toLowerCase().includes(s)
    );
  });

  // Toggle Block / Unblock
  const toggleBlock = async (admin) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/middle-admins/block/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: !admin.is_blocked }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to change block status");
      } else {
        setAdmins((prev) =>
          prev.map((a) =>
            a.id === admin.id ? { ...a, is_blocked: !a.is_blocked } : a
          )
        );
      }
    } catch {
      alert("Network error");
    }
  };

  // Delete admin
  const deleteAdmin = async (admin) => {
    if (!window.confirm(`Are you sure to delete ${admin.username}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/middle-admins/${admin.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to delete admin");
      } else {
        setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      }
    } catch {
      alert("Network error");
    }
  };

  if (loading) return <p>Loading middle admins...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Middle Admins</h2>

      <input
        type="text"
        placeholder="Search by username or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "10px",
          fontSize: "1rem",
          width: "300px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {filteredAdmins.length === 0 ? (
        <p>No match found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f7f7f7" }}>
              <th style={{ padding: "8px" }}>ID</th>
              <th style={{ padding: "8px" }}>Username</th>
              <th style={{ padding: "8px" }}>Email</th>
              <th style={{ padding: "8px" }}>Created At</th>
              <th style={{ padding: "8px" }}>Status</th>
              <th style={{ padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>{admin.id}</td>
                <td style={{ padding: "8px" }}>{highlightMatch(admin.username)}</td>
                <td style={{ padding: "8px" }}>{highlightMatch(admin.email)}</td>
                <td style={{ padding: "8px" }}>
                  {admin.created_at ? new Date(admin.created_at).toLocaleString() : ""}
                </td>
                <td style={{ padding: "8px" }}>
                  {admin.is_blocked ? "Blocked" : "Active"}
                </td>
                <td style={{ padding: "8px" }}>
                  <button
                    style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      backgroundColor: admin.is_blocked ? "#f44336" : "#008CBA",
                      border: "none",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleBlock(admin)}
                  >
                    {admin.is_blocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#d9534f",
                      border: "none",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => deleteAdmin(admin)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
