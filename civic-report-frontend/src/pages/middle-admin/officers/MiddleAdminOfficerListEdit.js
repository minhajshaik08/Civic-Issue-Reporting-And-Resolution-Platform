// src/pages/middle-admin/officers/MiddleAdminOfficerListEdit.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MiddleAdminOfficerListEdit() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "http://localhost:5000/api/middle-admin/officers/list"
        );
        const data = await res.json();
        if (!data.success) {
          setError(data.message || "Failed to fetch officers");
        } else {
          setOfficers(data.officers || []);
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  const filteredOfficers = officers.filter((o) => {
    const s = search.toLowerCase();
    return (
      !s ||
      (o.name && o.name.toLowerCase().includes(s)) ||
      (o.mobile && o.mobile.includes(s)) ||
      (o.email && o.email.toLowerCase().includes(s)) ||
      (o.employee_id && o.employee_id.toLowerCase().includes(s))
    );
  });

  const handleEditClick = (officer) => {
    navigate("/middle-admin/dashboard/officers/editform", {
      state: { officer }, // IMPORTANT: send officer
    });
  };

  if (loading) return <p>Loading officers...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (officers.length === 0) return <p>No officers found.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Edit Officers (Middle Admin)</h2>
      <input
        type="text"
        placeholder="Search by name, mobile, email, employee ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "6px", minWidth: "260px", marginBottom: "10px" }}
      />
      <table
        style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f7f7f7" }}>
            <th style={{ padding: "6px" }}>ID</th>
            <th style={{ padding: "6px" }}>Name</th>
            <th style={{ padding: "6px" }}>Mobile</th>
            <th style={{ padding: "6px" }}>Email</th>
            <th style={{ padding: "6px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOfficers.map((o) => (
            <tr key={o.id}>
              <td style={{ padding: "6px" }}>{o.id}</td>
              <td style={{ padding: "6px" }}>{o.name}</td>
              <td style={{ padding: "6px" }}>{o.mobile}</td>
              <td style={{ padding: "6px" }}>{o.email}</td>
              <td style={{ padding: "6px" }}>
                <button onClick={() => handleEditClick(o)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
