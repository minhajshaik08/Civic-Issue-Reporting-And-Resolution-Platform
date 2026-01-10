import React, { useEffect, useState } from "react";

export default function MiddleAdminManageOfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/middle-admin/officers/list"
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to fetch officers");
      } else {
        setOfficers(data.officers || []);
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

  const filteredOfficers = officers.filter((o) => {
    const s = search.toLowerCase();
    if (!s) return true;
    return (
      o.name.toLowerCase().includes(s) ||
      o.mobile.includes(s) ||
      o.email.toLowerCase().includes(s) ||
      o.employee_id.toLowerCase().includes(s)
    );
  });

  const toggleBlock = async (officer) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/middle-admin/officers/block/${officer.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block: officer.status !== "Blocked" }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to change block status");
      } else {
        setOfficers((prev) =>
          prev.map((o) =>
            o.id === officer.id
              ? { ...o, status: o.status === "Blocked" ? "Active" : "Blocked" }
              : o
          )
        );
      }
    } catch {
      alert("Network error");
    }
  };

  const deleteOfficer = async (officer) => {
    if (!window.confirm(`Are you sure to delete ${officer.name}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/middle-admin/officers/${officer.id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to delete officer");
      } else {
        setOfficers((prev) => prev.filter((o) => o.id !== officer.id));
      }
    } catch {
      alert("Network error");
    }
  };

  if (loading) return <p>Loading officers...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Officers (Middle Admin)</h2>

      <input
        type="text"
        placeholder="Search by name, mobile, email, employee ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "10px",
          fontSize: "1rem",
          width: "320px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {filteredOfficers.length === 0 ? (
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
              <th style={{ padding: "8px" }}>Name</th>
              <th style={{ padding: "8px" }}>Dept</th>
              <th style={{ padding: "8px" }}>Zone</th>
              <th style={{ padding: "8px" }}>Mobile</th>
              <th style={{ padding: "8px" }}>Email</th>
              <th style={{ padding: "8px" }}>Status</th>
              <th style={{ padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>{o.id}</td>
                <td style={{ padding: "8px" }}>{highlightMatch(o.name)}</td>
                <td style={{ padding: "8px" }}>{o.department}</td>
                <td style={{ padding: "8px" }}>{o.zone}</td>
                <td style={{ padding: "8px" }}>{highlightMatch(o.mobile)}</td>
                <td style={{ padding: "8px" }}>{highlightMatch(o.email)}</td>
                <td style={{ padding: "8px" }}>{o.status}</td>
                <td style={{ padding: "8px" }}>
                  <button
                    style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      backgroundColor:
                        o.status === "Blocked" ? "#f44336" : "#008CBA",
                      border: "none",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleBlock(o)}
                  >
                    {o.status === "Blocked" ? "Unblock" : "Block"}
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
                    onClick={() => deleteOfficer(o)}
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
