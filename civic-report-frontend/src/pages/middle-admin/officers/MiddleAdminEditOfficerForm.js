// src/pages/middle-admin/officers/MiddleAdminEditOfficerForm.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../../components/Toast";

export default function MiddleAdminEditOfficerForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { officer } = location.state || {};

  const [form, setForm] = useState({
    name: "",
    designation: "",
    department: "",
    zone: "",
    mobile: "",
    email: "",
    employeeId: "",
    role: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (officer) {
      setForm({
        name: officer.name || "",
        designation: officer.designation || "",
        department: officer.department || "",
        zone: officer.zone || "",
        mobile: officer.mobile || "",
        email: officer.email || "",
        employeeId: officer.employee_id || "",
        role: officer.role || "",
        password: "",
      });
    }
  }, [officer]);

  if (!officer) {
    return (
      <p style={{ padding: "1rem", color: "red", fontWeight: 700 }}>
        No officer data to edit.
      </p>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.mobile.trim() || !form.department.trim()) {
      setError("Name, Mobile and Department are required.");
      return;
    }

    if (form.password.trim() && form.password.trim().length < 6) {
      setError("Password must be at least 6 characters if provided.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        designation: form.designation.trim(),
        department: form.department.trim(),
        zone: form.zone.trim(),
        mobile: form.mobile.trim(),

        // ✅ protect role
        role: form.role.includes("@") ? "" : form.role.trim(),
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      const res = await fetch(
        `http://13.201.16.142:5000/api/middle-admin/officers/edit/${officer.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to update officer.");
      } else {
        showToast("✅ Officer updated successfully.", "success");
        navigate("/middle-admin/dashboard/officers/edit");
      }
    } catch {
      setError("Network error while updating officer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ YOUR SAME CSS */}
      <style>{`
        .edit-wrapper {
          min-height: 100vh;
          background: #f6fbfb;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .edit-card {
          width: 100%;
          max-width: 680px;
          background: #ffffff;
          padding: 22px;
          border-radius: 16px;
          box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.08);
        }

        .edit-title {
          margin: 0;
          font-weight: 900;
          font-size: 22px;
          color: #111827;
          text-align: center;
        }

        .edit-subtitle {
          margin-top: 6px;
          font-size: 13px;
          color: #6b7280;
          text-align: center;
          margin-bottom: 18px;
          font-weight: 600;
        }

        .error-box {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 10px 12px;
          border-radius: 12px;
          font-weight: 700;
          margin-bottom: 14px;
          font-size: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 700;
          color: #111827;
          font-size: 13px;
        }

        .form-group input {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .form-group input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .readonly {
          background: #f3f4f6 !important;
          cursor: not-allowed;
          color: #6b7280;
          font-weight: 700;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .hint {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
        }

        .actions-row {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary-custom {
          border: none;
          background: #2563eb;
          color: #fff;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          min-width: 150px;
        }

        .btn-secondary-custom {
          border: 1px solid #d1d5db;
          background: #ffffff;
          color: #111827;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          min-width: 150px;
        }

        .btn-primary-custom:disabled,
        .btn-secondary-custom:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="edit-wrapper">
        <form className="edit-card" onSubmit={handleSubmit}>
          <h3 className="edit-title">Edit Officer Details (Middle Admin)</h3>
          <p className="edit-subtitle">
            Email & Employee ID are read-only ✅ | Department is mandatory ✅
          </p>

          {error && <div className="error-box">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Zone</label>
              <input
                name="zone"
                value={form.zone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Mobile *</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email (Read Only)</label>
              <input value={form.email} disabled className="readonly" />
            </div>

            <div className="form-group">
              <label>Employee ID (Read Only)</label>
              <input value={form.employeeId} disabled className="readonly" />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                name="role"
                value={form.role.includes("@") ? "" : form.role}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label>New Password (Optional)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Leave blank to keep current password"
              />
              <div className="hint">Minimum 6 characters if changing.</div>
            </div>
          </div>

          <div className="actions-row">
            <button
              type="submit"
              className="btn-primary-custom"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="btn-secondary-custom"
              disabled={loading}
              onClick={() =>
                navigate("/middle-admin/dashboard/officers/edit")
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}