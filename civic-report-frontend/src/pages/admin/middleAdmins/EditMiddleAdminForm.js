import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditMiddleAdminForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingAdmin = location.state?.admin || null;

  const [username, setUsername] = useState(existingAdmin?.username || "");
  const [email] = useState(existingAdmin?.email || ""); // usually not editable
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!existingAdmin) {
      setError("No middle admin data provided for edit.");
    }
  }, [existingAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!existingAdmin) {
      setError("No admin to edit.");
      return;
    }

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (password && password.trim().length > 0 && password.trim().length < 6) {
      setError("New password must be at least 6 characters if provided.");
      return;
    }

    setLoading(true);

    try {
      const body = { username: username.trim() };
      if (password.trim()) {
        body.password = password.trim();
      }

      const res = await fetch(
        `http://localhost:5000/api/admin/middle-admins/edit/${existingAdmin.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to update middle admin.");
      } else {
        navigate("/admin/welcome/middle-admins/list");
      }
    } catch {
      setError("Network error.");
    }

    setLoading(false);
  };

  if (!existingAdmin) {
    return <p style={{ color: "red" }}>{error || "No admin selected."}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded shadow-sm bg-white"
      style={{ maxWidth: "450px" }}
    >
      <h3 className="mb-3">Edit Middle Admin</h3>
      {error && <p className="text-danger mb-2">{error}</p>}

      <div className="mb-3">
        <label className="form-label">Username *</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email (read-only)</label>
        <input type="email" className="form-control" value={email} disabled />
      </div>

      <div className="mb-3">
        <label className="form-label">New Password (optional)</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          minLength={6}
        />
        <small className="text-muted">
          Leave blank to keep the current password.
        </small>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={loading}
          onClick={() => navigate("/admin/welcome/middle-admins/edit-list")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
