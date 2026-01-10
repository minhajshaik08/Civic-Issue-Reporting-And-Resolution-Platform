// src/pages/admin/issues/IssueDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");

  // Read logged-in user saved at login
  const storedUser = localStorage.getItem("loggedInUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const loadIssue = async () => {
      try {
        setError("");
        const res = await fetch(`http://localhost:5000/api/admin/issues/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load issue");
          return;
        }

        setIssue(data.issue);
      } catch (err) {
        setError("Error loading issue");
      }
    };

    loadIssue();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (!currentUser) {
      alert("No logged-in user found");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/issues/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            officerId: currentUser.id,
            officerName: currentUser.full_name,
            officerEmail: currentUser.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to update status");
        return;
      }

      setIssue((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (error) return <div className="text-danger">{error}</div>;
  if (!issue) return <div>Loading...</div>;

  // ---- build photo URL from JSON string ----
  let photoUrl = null;
  if (issue.photo_paths) {
    try {
      // photo_paths is like '["1764508650704-682556347.png"]'
      const arr = JSON.parse(issue.photo_paths);
      const firstFile = Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
      if (firstFile) {
        // files are stored under backend-node/uploads/issues/<filename>
        photoUrl = `http://localhost:5000/uploads/issues/${firstFile}`;
      }
    } catch (e) {
      console.error("Error parsing photo_paths JSON", e);
    }
  }
  // -----------------------------------------

  return (
    <div style={{ padding: "20px" }}>
      <h2>Issue #{issue.id}</h2>

      <p>
        <strong>Full Name:</strong> {issue.full_name}
      </p>
      <p>
        <strong>Phone Number:</strong> {issue.phone}
      </p>
      <p>
        <strong>Issue Type:</strong> {issue.issue_type}
      </p>
      <p>
        <strong>Description:</strong> {issue.description}
      </p>
      <p>
        <strong>Location:</strong> {issue.location_text}
      </p>

      <p>
        <strong>Photo:</strong>
      </p>
      {photoUrl ? (
        <div>
          {/* small thumbnail */}
          <img
            src={photoUrl}
            alt="Issue"
            style={{
              maxWidth: "200px",
              maxHeight: "150px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => window.open(photoUrl, "_blank")}
          />
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            Click the photo to view full size in a new tab.
          </p>
        </div>
      ) : (
        <p>No photo</p>
      )}

      <div style={{ marginTop: "16px" }}>
        <strong>Status:</strong>{" "}
        <select value={issue.status} onChange={handleStatusChange}>
          <option value="NEW">New</option>
          <option value="VIEWED">Viewed</option>
          <option value="VERIFIED">Verified</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SOLVED">Solved</option>
        </select>
      </div>
    </div>
  );
};

export default IssueDetails;
