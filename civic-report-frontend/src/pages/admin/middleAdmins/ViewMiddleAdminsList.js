import React, { useEffect, useState } from "react";

export default function ViewMiddleAdminsList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
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

    fetchAdmins();
  }, []);

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
        <span style={{ backgroundColor: "yellow" }}>{match}</span>
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

  if (loading) return <p>Loading middle admins...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Middle Admin List</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px", width: "260px" }}
        />
      </div>

      {filteredAdmins.length === 0 ? (
        <p>No match found.</p>
      ) : (
        <table
          border="1"
          cellPadding={6}
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{highlightMatch(admin.username)}</td>
                <td>{highlightMatch(admin.email)}</td>
                <td>
                  {admin.created_at
                    ? new Date(admin.created_at).toLocaleString()
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
