import React, { useState } from "react";

function ViewIssuePage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [canResendIn, setCanResendIn] = useState(0);

  const normalizeIndianPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
    if (digits.startsWith("0") && digits.length === 11) return digits.slice(1);
    return digits;
  };

  const isValidIndianMobile = (value) => {
    const ten = normalizeIndianPhone(value);
    const re = /^[6-9]\d{9}$/;
    return re.test(ten);
  };

  const startResendTimer = () => {
    setCanResendIn(60);
    const id = setInterval(() => {
      setCanResendIn((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (!isValidIndianMobile(phone)) {
      setError("Please enter a valid Indian mobile number starting with 6/7/8/9");
      return;
    }

    setSending(true);
    try {
      const normalized = normalizeIndianPhone(phone);
      console.log("📤 Sending OTP to:", normalized);

      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const data = await res.json();
      console.log("📥 Response:", data);

      if (!data.success) {
        setError(data.message || "Failed to send OTP");
        setOtpSent(false);
        return;
      }

      setOtpSent(true);
      startResendTimer();
      console.log("✅ OTP sent successfully");
    } catch (e) {
      console.error("❌ OTP Error:", e);
      setError("Failed to send OTP. Check backend connection.");
    } finally {
      setSending(false);
    }
  };

  const verifyOtpAndFetch = async () => {
    setError("");
    if (!otp.match(/^\d{6}$/)) {
      setError("OTP must be 6 digits");
      return;
    }

    setVerifying(true);
    try {
      const normalized = normalizeIndianPhone(phone);
      console.log("🔐 Verifying OTP for:", normalized);

      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, otp }),
      });

      const data = await res.json();
      console.log("📥 Verify Response:", data);

      if (!data.success) {
        setError("OTP is invalid or expired");
        return;
      }

      console.log("✅ OTP verified!");

      console.log("📤 Fetching issues...");

      const issuesRes = await fetch(
        `http://localhost:5000/api/issues?phone=${normalized}`
      );

      const issuesData = await issuesRes.json();
      console.log("📥 Issues Response:", issuesData);

      if (issuesData.success) {
        setIssues(issuesData.issues || []);
        if (!issuesData.issues || issuesData.issues.length === 0) {
          setError("No issues found for this phone number");
        }
      } else {
        setError(issuesData.message || "Failed to fetch issues");
      }
    } catch (e) {
      console.error("❌ Error:", e);
      setError("Network error. Check backend connection.");
    } finally {
      setVerifying(false);
    }
  };

  const resetForm = () => {
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setIssues([]);
    setError("");
    setCanResendIn(0);
  };

  return (
    <div className="view-issue-container">
      <div className="view-issue-card">
        <h2>View Your Reported Issues</h2>

        {!otpSent && issues.length === 0 && (
          <div className="auth-section">
            <p className="subtitle">
              Enter your phone number to view your reported issues
            </p>

            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit phone number"
                disabled={sending}
              />
              <small className="input-hint">
                Format: 10-digit Indian mobile number
              </small>
            </div>

            <button
              onClick={sendOtp}
              className="btn-primary"
              disabled={sending || !phone.trim()}
            >
              {sending ? (
                <>
                  <span className="spinner"></span>
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        )}

        {otpSent && issues.length === 0 && (
          <div className="auth-section">
            <div className="otp-info">
              <p className="phone-display">
                📱 OTP sent to <strong>{normalizeIndianPhone(phone)}</strong>
              </p>
              <p className="otp-hint">
                Check your mobile for the OTP code
              </p>
            </div>

            <div className="input-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                placeholder="000000"
                disabled={verifying}
                className="otp-input"
              />
              <small className="input-hint">6-digit code from mobile</small>
            </div>

            {canResendIn > 0 && (
              <p className="resend-timer">⏱️ Resend in {canResendIn} seconds</p>
            )}

            {canResendIn === 0 && (
              <button
                onClick={sendOtp}
                className="btn-secondary"
                disabled={sending}
              >
                🔄 Resend OTP
              </button>
            )}

            <button
              onClick={verifyOtpAndFetch}
              className="btn-primary"
              disabled={verifying || otp.length !== 6}
            >
              {verifying ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                "Verify OTP & View Issues"
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {issues.length > 0 && (
          <div className="issues-section">
            <div className="issues-header">
              <h3>Your Reported Issues ({issues.length})</h3>
              <button onClick={resetForm} className="btn-logout">
                🔄 Check Another Number
              </button>
            </div>

            <div className="issues-table-wrapper">
              <table className="issues-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                    <th>Photos</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id}>
                      <td className="id-cell">#{issue.id}</td>
                      <td>
                        <span className="issue-type-badge">
                          {issue.issue_type}
                        </span>
                      </td>
                      <td className="description-cell">
                        {issue.description || "N/A"}
                      </td>
                      <td className="location-cell">
                        {issue.location_text || "N/A"}
                      </td>
                      <td className="date-cell">
                        {new Date(issue.created_at).toLocaleDateString("en-IN")}
                        <br />
                        <small>
                          {new Date(issue.created_at).toLocaleTimeString(
                            "en-IN"
                          )}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${
                            (issue.status || "pending").toLowerCase()
                          }`}
                        >
                          {issue.status || "Pending"}
                        </span>
                      </td>
                      <td className="photos-cell">
                        {issue.photo_paths && issue.photo_paths.length > 0 ? (
                          <div className="photos-grid">
                            {(Array.isArray(issue.photo_paths)
                              ? issue.photo_paths
                              : JSON.parse(issue.photo_paths)
                            ).map((filename) => (
                              <img
                                key={filename}
                                src={`http://localhost:5000/uploads/issues/${filename}`}
                                alt="issue-photo"
                                className="issue-photo"
                                title={filename}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="no-photos">No photos</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
       * {
  box-sizing: border-box;
  }

/* ===== Page Animation ===== */
@keyframes fadeInPage {
from {
opacity: 0;
transform: translateY(20px);
}
to {
opacity: 1;
transform: translateY(0);
}
}

.view-issue-container {
min-height: 100vh;
background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
padding: 20px;
display: flex;
align-items: flex-start;
justify-content: center;
padding-top: 40px;
animation: fadeInPage 0.6s ease-out;
}

/* ===== Card Animation ===== */
@keyframes cardPop {
from {
opacity: 0;
transform: scale(0.96);
}
to {
opacity: 1;
transform: scale(1);
}
}

.view-issue-card {
background: white;
border-radius: 12px;
box-shadow: 0 8px 30px rgba(34, 197, 94, 0.12);
padding: 40px;
width: 100%;
max-width: 1100px;
animation: cardPop 0.5s ease-out;
}

h2 {
text-align: center;
color: #166534;
margin-bottom: 10px;
font-size: 28px;
font-weight: 700;
}

h3 {
color: #166534;
margin-bottom: 20px;
font-size: 20px;
margin-top: 0;
}

.subtitle {
text-align: center;
color: #666;
margin-bottom: 30px;
font-size: 14px;
}

.auth-section {
max-width: 450px;
margin: 0 auto;
animation: fadeInPage 0.5s ease;
}

.input-group {
margin-bottom: 20px;
display: flex;
flex-direction: column;
}

label {
margin-bottom: 8px;
font-weight: 600;
color: #333;
font-size: 14px;
}

input {
padding: 12px 14px;
font-size: 16px;
border: 2px solid #d1fae5;
border-radius: 8px;
outline: none;
transition: all 0.3s ease;
font-family: inherit;
}

input:focus {
border-color: #22c55e;
box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
}

input:disabled {
background-color: #f5f5f5;
cursor: not-allowed;
opacity: 0.7;
}

.otp-input {
letter-spacing: 0.5em;
text-align: center;
font-size: 22px;
font-weight: bold;
font-family: "Courier New", monospace;
}

.input-hint {
color: #888;
font-size: 12px;
margin-top: 4px;
}

.otp-info {
background-color: #ecfdf5;
border-left: 4px solid #22c55e;
padding: 12px;
border-radius: 6px;
margin-bottom: 20px;
}

.phone-display {
color: #333;
font-size: 14px;
margin: 0 0 6px 0;
}

.otp-hint {
color: #666;
font-size: 13px;
margin: 0;
font-style: italic;
}

.resend-timer {
text-align: center;
color: #166534;
font-size: 14px;
margin: 12px 0;
font-weight: 500;
}

/* ===== Button Animations ===== */
button {
display: flex;
align-items: center;
justify-content: center;
gap: 8px;
border: none;
padding: 12px 24px;
font-size: 16px;
font-weight: 600;
border-radius: 8px;
cursor: pointer;
transition: all 0.25s ease;
width: 100%;
margin-bottom: 12px;
}

button:active {
transform: scale(0.98);
}

.btn-primary {
background: linear-gradient(135deg, #22c55e, #15803d);
color: white;
}

.btn-primary:hover:not(:disabled) {
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35);
}

.btn-secondary {
background-color: #16a34a;
color: white;
}

.btn-secondary:hover:not(:disabled) {
background-color: #15803d;
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(22, 163, 74, 0.35);
}

.btn-logout {
background-color: #6b7280;
color: white;
width: auto;
margin-bottom: 0;
margin-left: auto;
}

.spinner {
display: inline-block;
width: 12px;
height: 12px;
border: 2px solid rgba(255, 255, 255, 0.3);
border-radius: 50%;
border-top-color: white;
animation: spin 0.8s linear infinite;
}

@keyframes spin {
to {
transform: rotate(360deg);
}
}

.error-message {
background-color: #fee2e2;
color: #991b1b;
padding: 14px;
border-radius: 8px;
margin-bottom: 20px;
border-left: 4px solid #dc2626;
display: flex;
align-items: center;
gap: 10px;
font-size: 14px;
font-weight: 500;
animation: fadeInPage 0.4s ease;
}

/* ===== Table Animation ===== */
.issues-section {
margin-top: 40px;
animation: fadeInPage 0.5s ease;
}

.issues-table thead {
background: linear-gradient(135deg, #15803d, #166534);
color: white;
}

.issues-table tbody tr {
transition: background 0.2s ease, transform 0.15s ease;
}

.issues-table tbody tr:hover {
background-color: #f0fdf4;
transform: scale(1.01);
}

.issue-photo {
width: 70px;
height: 70px;
object-fit: cover;
border-radius: 6px;
border: 1px solid #d1fae5;
box-shadow: 0 2px 6px rgba(34, 197, 94, 0.15);
transition: all 0.25s ease;
cursor: pointer;
}

.issue-photo:hover {
transform: scale(1.2) rotate(1deg);
box-shadow: 0 8px 18px rgba(34, 197, 94, 0.35);
z-index: 100;
}

      `}</style>
    </div>
  );
}

export default ViewIssuePage;
