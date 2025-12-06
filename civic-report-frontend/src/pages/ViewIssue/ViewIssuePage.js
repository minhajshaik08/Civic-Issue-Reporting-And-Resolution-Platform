import React, { useState } from "react";

function ViewIssuePage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");

  const normalizeIndianPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
    if (digits.startsWith("0") && digits.length === 11) return digits.slice(1);
    return digits;
  };

  const sendOtp = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    try {
      await fetch("http://localhost:8080/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizeIndianPhone(phone) }),
      });
      setOtpSent(true);
    } catch {
      setError("Failed to send OTP");
    }
  };

  const verifyOtpAndFetch = async () => {
    setError("");
    if (!otp.match(/^\d{6}$/)) {
      setError("OTP must be 6 digits");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizeIndianPhone(phone), otp }),
      });
      const data = await res.json();
      if (!data.valid) {
        setError("OTP is invalid or expired");
        return;
      }
      // OTP valid, fetch issues
      const issuesRes = await fetch(
        `http://localhost:5000/api/issues?phone=${normalizeIndianPhone(phone)}`
      );
      const issuesData = await issuesRes.json();
      if (issuesData.success) {
        setIssues(issuesData.issues);
      } else {
        setError("Failed to fetch issues");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="view-issue-container">
      <h2>View Your Reported Issues</h2>

      <div className="input-group">
        <label>Phone Number:</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      {otpSent && (
        <div className="input-group otp-group">
          <label>Enter OTP:</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="6-digit OTP"
          />
        </div>
      )}

      <div className="button-group">
        {!otpSent ? (
          <button onClick={sendOtp} className="btn-primary">
            Send OTP
          </button>
        ) : (
          <button onClick={verifyOtpAndFetch} className="btn-primary">
            Verify OTP and View Issues
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {issues.length > 0 && (
        <div className="issues-table-wrapper">
          <h3>Your Reported Issues</h3>
          <table className="issues-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue Type</th>
                <th>Description</th>
                <th>Location</th>
                <th>Submitted On</th>
                <th>Photos</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.id}</td>
                  <td>{issue.issue_type}</td>
                  <td>{issue.description}</td>
                  <td>{issue.location_text}</td>
                  <td>{new Date(issue.created_at).toLocaleString()}</td>
                  <td className="photos-cell">
                    {JSON.parse(issue.photo_paths).map((filename) => (
                      <img
                        key={filename}
                        src={`http://localhost:5000/uploads/issues/${filename}`}
                        alt="issue"
                        className="issue-photo"
                      />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .view-issue-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        h2, h3 {
          text-align: center;
          color: #155724;
        }
        .input-group {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        label {
          margin-bottom: 5px;
          font-weight: 600;
          color: #155724;
        }
        input {
          padding: 8px 12px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline-color: #22c55e;
        }
        .otp-group input {
          letter-spacing: 0.3em;
        }
        .button-group {
          text-align: center;
          margin: 10px 0 25px;
        }
        button.btn-primary {
          background-color: #22c55e;
          border: none;
          padding: 10px 25px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button.btn-primary:hover {
          background-color: #15803d;
        }
        .error-message {
          color: #b91c1c;
          font-weight: 600;
          text-align: center;
          margin-top: 10px;
        }
        .issues-table-wrapper {
          overflow-x:auto;
        }
        table.issues-table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
        }
        table.issues-table th,
        table.issues-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
          vertical-align: middle;
        }
        table.issues-table thead {
          background-color: #22c55e;
          color: white;
        }
        table.issues-table tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .photos-cell {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          max-width: 200px;
        }
        .issue-photo {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #ccc;
          box-shadow: 0 1px 4px rgb(0 0 0 / 0.1);
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .issue-photo:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 10px rgb(0 0 0 / 0.3);
          z-index: 10;
        }
        @media (max-width: 600px) {
          .view-issue-container {
            padding: 10px;
          }
          table.issues-table th,
          table.issues-table td {
            font-size: 0.9rem;
            padding: 8px 10px;
          }
          .photos-cell {
            max-width: 140px;
          }
          .issue-photo {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
}

export default ViewIssuePage;
