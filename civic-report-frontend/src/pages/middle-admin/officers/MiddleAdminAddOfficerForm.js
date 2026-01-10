import React, { useState } from "react";
import axios from "axios";

export default function MiddleAdminAddOfficerForm() {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.mobile.trim() ||
      !form.employeeId.trim()
    ) {
      setError("Name, Email, Mobile and Employee ID are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // ✅ middle-admin endpoint (change to your real backend path)
      const res = await axios.post(
        "http://localhost:5000/api/middle-admin/officers/add",
        form
      );

      setForm({
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

      alert("Officer added successfully");
    } catch (err) {
      console.error("Add officer error:", err);
      setError("Failed to add officer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="w-100" style={{ maxWidth: "600px" }}>
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded shadow-sm bg-white"
        >
          <h3 className="mb-3 text-center">Add Officer (Middle Admin)</h3>

          {error && <p className="text-danger mb-2">{error}</p>}

          {/* all your same fields */}
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Designation</label>
            <input
              type="text"
              className="form-control"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={form.department}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Zone</label>
            <input
              type="text"
              className="form-control"
              name="zone"
              value={form.zone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile *</label>
            <input
              type="tel"
              className="form-control"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Employee ID *</label>
            <input
              type="text"
              className="form-control"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <input
              type="text"
              className="form-control"
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <small className="text-muted">Minimum 6 characters.</small>
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
              onClick={() =>
                setForm({
                  name: "",
                  designation: "",
                  department: "",
                  zone: "",
                  mobile: "",
                  email: "",
                  employeeId: "",
                  role: "",
                  password: "",
                })
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
