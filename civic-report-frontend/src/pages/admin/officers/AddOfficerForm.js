import React, { useState } from "react";

export default function AddOfficerForm() {
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

    // simple frontend validation (can improve later)
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setError("Name, Email and Mobile are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    // TODO: call backend API later
    // for now just console.log
    console.log("Officer form submit:", form);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded shadow-sm bg-white"
      style={{ maxWidth: "600px" }}
    >
      <h3 className="mb-3">Add Officer</h3>

      {error && <p className="text-danger mb-2">{error}</p>}

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
        <label className="form-label">Employee ID</label>
        <input
          type="text"
          className="form-control"
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          disabled={loading}
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
          onClick={() => console.log("Cancel add officer")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
