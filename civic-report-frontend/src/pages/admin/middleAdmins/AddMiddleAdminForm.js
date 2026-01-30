import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMiddleAdminForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATIONS ================= */

  // ✅ Gmail only validation
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

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Username, Email and Password are required.");
      return;
    }

    if (!isValidGmail(email.trim())) {
      setError("Please enter a valid Gmail address (example@gmail.com).");
      return;
    }

    if (!isStrongPassword(password.trim())) {
      setError(
        "Password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/middle-admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to create middle admin");
      } else {
        setSuccess("✅ Middle admin created successfully!");

        setUsername("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/admin/welcome/middle-admins");
        }, 1000);
      }
    } catch (err) {
      setError("❌ Network error. Please try again.");
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f6fbfb", padding: "20px" }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-4 shadow bg-white"
        style={{ width: "100%", maxWidth: "480px" }}
        autoComplete="off"
      >
        {/* 🔒 Hidden fields to block Chrome autofill */}
        <input type="text" name="fakeuser" style={{ display: "none" }} />
        <input type="password" name="fakepass" style={{ display: "none" }} />

        <h3 className="fw-bold text-center mb-2">Add Middle Admin</h3>
        <p className="text-muted text-center mb-4" style={{ fontSize: "14px" }}>
          Create a new middle admin account
        </p>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success py-2" role="alert">
            {success}
          </div>
        )}

        {/* Username */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Username *</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            placeholder="Enter username"
            required
            autoComplete="off"
            name="middle_admin_username"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Gmail *</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="example@gmail.com"
            required
            autoComplete="off"
            name="middle_admin_email"
            pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
            title="Only Gmail addresses are allowed"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Password *</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="Enter strong password"
            required
            autoComplete="new-password"
            name="middle_admin_new_password"
            minLength={6}
          />
          <small className="text-muted">
            Min 6 chars, 1 uppercase, 1 number, 1 special character.
          </small>
        </div>

        {/* Buttons */}
        <div className="mt-4 d-flex gap-2">
          <button
            type="submit"
            className="btn btn-success w-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary w-50"
            disabled={loading}
            onClick={() => navigate("/admin/welcome/middle-admins")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
