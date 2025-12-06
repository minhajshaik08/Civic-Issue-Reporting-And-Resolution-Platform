import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMiddleAdminForm({ existingAdmin, onSave, onCancel }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState(existingAdmin?.username || "");
  const [email, setEmail] = useState(existingAdmin?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingAdmin) {
      setUsername(existingAdmin.username);
      setEmail(existingAdmin.email);
    } else {
      setUsername("");
      setEmail("");
      setPassword("");
    }
    setError("");
    setSuccess("");
  }, [existingAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !email.trim()) {
      setError("Username and Email are required.");
      return;
    }
    if (!existingAdmin && password.trim().length < 6) {
      setError("Password of at least 6 characters is required.");
      return;
    }

    setLoading(true);

    try {
      const url = existingAdmin
        ? `http://localhost:5000/api/admin/middle-admins/${existingAdmin.id}`
        : "http://localhost:5000/api/admin/middle-admins";

      const method = existingAdmin ? "PUT" : "POST";

      const body = {
        username: username.trim(),
        email: email.trim(),
      };
      if (!existingAdmin || password.trim()) {
        body.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to save");
      } else {
        setSuccess("Middle admin saved successfully.");
        onSave && onSave();

        // Redirect to middle admin options page
        navigate("/admin/welcome/middle-admins");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded shadow-sm bg-white"
      style={{ maxWidth: "450px" }}
    >
      <h3 className="mb-3">
        {existingAdmin ? "Edit Middle Admin" : "Add Middle Admin"}
      </h3>

      {error && <p className="text-danger mb-2">{error}</p>}
      {success && <p className="text-success mb-2">{success}</p>}

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
        <label className="form-label">Email *</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={existingAdmin || loading}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          {existingAdmin ? "New Password (optional)" : "Password *"}
        </label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required={!existingAdmin}
          minLength={6}
        />
        {!existingAdmin && (
          <small className="text-muted">Minimum 6 characters.</small>
        )}
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
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
