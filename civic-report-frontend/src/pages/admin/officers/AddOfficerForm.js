import React, { useState } from "react";
import axios from "axios";

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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ validation (Department mandatory)
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.mobile.trim() ||
      !form.employeeId.trim() ||
      !form.department.trim()
    ) {
      setError("Name, Email, Mobile, Employee ID and Department are required.");
      return;
    }

    if (form.password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/admin/officers/add", form);

      setSuccess("✅ Officer added successfully!");

      // ✅ clear form on success
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
    } catch (err) {
      console.error("Add officer error:", err);
      setError("❌ Failed to add officer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError("");
    setSuccess("");
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
  };

  return (
    <>
      {/* ✅ CSS inside same file */}
      <style>{`
        .officer-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f6fbfb;
          padding: 20px;
        }

        .officer-card {
          width: 100%;
          max-width: 620px;
          background: #ffffff;
          border-radius: 18px;
          padding: 26px;
          box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.08);
        }

        .officer-title {
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          color: #111827;
          margin-bottom: 6px;
        }

        .officer-subtitle {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 18px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 650px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label {
          font-weight: 700;
          font-size: 14px;
          color: #111827;
        }

        .input {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
        }

        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .helper {
          font-size: 12px;
          color: #6b7280;
        }

        .error-box {
          background: #fee2e2;
          color: #991b1b;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .success-box {
          background: #dcfce7;
          color: #166534;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .btn-row {
          display: flex;
          gap: 12px;
          margin-top: 18px;
        }

        .btn-save {
          width: 50%;
          background: #16a34a;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-cancel {
          width: 50%;
          background: transparent;
          border: 1px solid #9ca3af;
          border-radius: 12px;
          padding: 11px;
          font-weight: 800;
          cursor: pointer;
          color: #111827;
        }

        .btn-save:hover,
        .btn-cancel:hover {
          opacity: 0.9;
        }

        .btn-save:disabled,
        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="officer-page">
        <form
          className="officer-card"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* ✅ Hidden inputs to stop Chrome autofill */}
          <input
            type="text"
            name="fakeusernameremembered"
            style={{ display: "none" }}
          />
          <input
            type="password"
            name="fakepasswordremembered"
            style={{ display: "none" }}
          />

          <div className="officer-title">Add Officer</div>
          <div className="officer-subtitle">
            Create a new officer account in the system
          </div>

          {error && <div className="error-box">{error}</div>}
          {success && <div className="success-box">{success}</div>}

          <div className="form-grid">
            {/* ✅ Name */}
            <div className="field">
              <label className="label">Name *</label>
              <input
                type="text"
                className="input"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>

            {/* ✅ Designation */}
            <div className="field">
              <label className="label">Designation</label>
              <input
                type="text"
                className="input"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
              />
            </div>

            {/* ✅ Department (MANDATORY ✅) */}
            <div className="field">
              <label className="label">Department *</label>
              <input
                type="text"
                className="input"
                name="department"
                value={form.department}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>

            {/* ✅ Zone */}
            <div className="field">
              <label className="label">Zone</label>
              <input
                type="text"
                className="input"
                name="zone"
                value={form.zone}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
              />
            </div>

            {/* ✅ Mobile */}
            <div className="field">
              <label className="label">Mobile *</label>
              <input
                type="tel"
                className="input"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>

            {/* ✅ Email */}
            <div className="field">
              <label className="label">Email *</label>
              <input
                type="email"
                className="input"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>

            {/* ✅ Employee ID */}
            <div className="field">
              <label className="label">Employee ID *</label>
              <input
                type="text"
                className="input"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>

            {/* ✅ Role */}
            <div className="field">
              <label className="label">Role</label>
              <input
                type="text"
                className="input"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
              />
            </div>
          </div>

          {/* ✅ Password full row */}
          <div className="field" style={{ marginTop: "14px" }}>
            <label className="label">Password *</label>
            <input
              type="password"
              className="input"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <div className="helper">Minimum 6 characters.</div>
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
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
