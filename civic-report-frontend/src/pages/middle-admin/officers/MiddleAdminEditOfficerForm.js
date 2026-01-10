// src/pages/middle-admin/officers/MiddleAdminEditOfficerForm.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      <p style={{ padding: "1rem", color: "red" }}>
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

    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setError("Name, Email and Mobile are required.");
      return;
    }

    if (form.password && form.password.length > 0 && form.password.length < 6) {
      setError("Password must be at least 6 characters if provided.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/middle-admin/officers/edit/${officer.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to update officer.");
      } else {
        alert("Officer updated successfully.");
        navigate("/middle-admin/dashboard/officers/edit");
      }
    } catch {
      setError("Network error while updating officer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded shadow-sm bg-white"
      style={{ maxWidth: "600px" }}
    >
      <h3 className="mb-3">Edit Officer Details (Middle Admin)</h3>

      {error && <p className="text-danger mb-2">{error}</p>}

      <div className="mb-3">
        <label className="form-label">Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="form-control"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Designation</label>
        <input
          name="designation"
          value={form.designation}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Department</label>
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Zone</label>
        <input
          name="zone"
          value={form.zone}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Mobile *</label>
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          className="form-control"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email *</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="form-control"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Employee ID</label>
        <input
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Role</label>
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">New Password (Optional)</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
          placeholder="Leave blank to keep current password"
        />
        <small className="text-muted">Minimum 6 characters if changing.</small>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={loading}
          onClick={() =>
            navigate("/middle-admin/dashboard/officers/edit")
          }
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
