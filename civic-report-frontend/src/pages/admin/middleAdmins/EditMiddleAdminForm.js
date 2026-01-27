import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditMiddleAdminForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingAdmin = location.state?.admin || null;

  const [username, setUsername] = useState(existingAdmin?.username || "");
  const [email] = useState(existingAdmin?.email || ""); // ✅ read-only
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
    return (
      <div style={{ padding: "20px", color: "red", fontWeight: "600" }}>
        {error || "No admin selected."}
      </div>
    );
  }

  return (
    <>
      {/* ✅ CSS inside same file */}
      <style>{`
        .edit-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f6fbfb;
          padding: 10px;
        }

        .edit-form-card {
          width: 100%;
          max-width: 480px;
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.08);
        }

        .edit-title {
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          color: #111827;
          margin-bottom: 6px;
        }

        .edit-subtitle {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .edit-label {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 6px;
          display: block;
          color: #111827;
        }

        .edit-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
        }

        .edit-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .helper-text {
          font-size: 12px;
          color: #6b7280;
          margin-top: 6px;
        }

        .error-box {
          background: #fee2e2;
          color: #991b1b;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .btn-row {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }

        .btn-save {
          width: 50%;
          background: #16a34a;
          color: white;
          border: none;
          padding: 10px 12px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-save:hover {
          opacity: 0.9;
        }

        .btn-cancel {
          width: 50%;
          background: transparent;
          border: 1px solid #9ca3af;
          padding: 10px 12px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          color: #111827;
        }

        .btn-cancel:hover {
          background: #f3f4f6;
        }

        .btn-save:disabled,
        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      {/* ✅ Center Form */}
      <div className="edit-wrapper">
        <form className="edit-form-card" onSubmit={handleSubmit}>
          <div className="edit-title">Edit Middle Admin</div>
          <div className="edit-subtitle">
            Update username or password (optional)
          </div>

          {error && <div className="error-box">{error}</div>}

          {/* ✅ Username */}
          <div style={{ marginBottom: "14px" }}>
            <label className="edit-label">Username *</label>
            <input
              type="text"
              className="edit-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* ✅ Email */}
          <div style={{ marginBottom: "14px" }}>
            <label className="edit-label">Email (Read-only)</label>
            <input type="email" className="edit-input" value={email} disabled />
          </div>

          {/* ✅ New Password */}
          <div style={{ marginBottom: "6px" }}>
            <label className="edit-label">New Password (Optional)</label>
            <input
              type="password"
              className="edit-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              minLength={6}
              placeholder="Leave blank to keep existing password"
              autoComplete="new-password"
            />
            <div className="helper-text">
              Leave blank to keep the current password.
            </div>
          </div>

          {/* ✅ Buttons */}
          <div className="btn-row">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className="btn-cancel"
              disabled={loading}
              onClick={() => navigate("/admin/welcome/middle-admins/list")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
