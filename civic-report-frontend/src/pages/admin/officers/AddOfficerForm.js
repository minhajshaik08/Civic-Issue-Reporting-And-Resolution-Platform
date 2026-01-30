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

  /* ================= VALIDATIONS ================= */

  // ✅ Gmail-only validation
  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  // ✅ Strong password validation
  const isStrongPassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Required fields
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

    // ✅ Gmail validation
    if (!isValidGmail(form.email.trim())) {
      setError("Please enter a valid Gmail address (example@gmail.com).");
      return;
    }

    // ✅ Strong password validation
    if (!isStrongPassword(form.password.trim())) {
      setError(
        "Password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/admin/officers/add", form);

      setSuccess("✅ Officer added successfully!");

      // ✅ Clear form
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
      {/* ✅ CSS */}
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

        .btn-save:disabled,
        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="officer-page">
        <form className="officer-card" onSubmit={handleSubmit} autoComplete="off">
          {/* 🔒 Block Chrome autofill */}
          <input type="text" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          <div className="officer-title">Add Officer</div>
          <div className="officer-subtitle">
            Create a new officer account in the system
          </div>

          {error && <div className="error-box">{error}</div>}
          {success && <div className="success-box">{success}</div>}

          <div className="form-grid">
            <div className="field">
              <label className="label">Name *</label>
              <input className="input" name="name" value={form.name} onChange={handleChange} disabled={loading} required />
            </div>

            <div className="field">
              <label className="label">Designation</label>
              <input className="input" name="designation" value={form.designation} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label className="label">Department *</label>
              <input className="input" name="department" value={form.department} onChange={handleChange} disabled={loading} required />
            </div>

            <div className="field">
              <label className="label">Zone</label>
              <input className="input" name="zone" value={form.zone} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label className="label">Mobile *</label>
              <input className="input" name="mobile" value={form.mobile} onChange={handleChange} disabled={loading} required />
            </div>

            <div className="field">
              <label className="label">Gmail *</label>
              <input
                type="email"
                className="input"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
                pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                title="Only Gmail addresses are allowed"
              />
            </div>

            <div className="field">
              <label className="label">Employee ID *</label>
              <input className="input" name="employeeId" value={form.employeeId} onChange={handleChange} disabled={loading} required />
            </div>

            <div className="field">
              <label className="label">Role</label>
              <input className="input" name="role" value={form.role} onChange={handleChange} disabled={loading} />
            </div>
          </div>

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
              autoComplete="new-password"
            />
            <div className="helper">
              Min 6 chars, 1 uppercase, 1 number, 1 special character.
            </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

            <button type="button" className="btn-cancel" disabled={loading} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
