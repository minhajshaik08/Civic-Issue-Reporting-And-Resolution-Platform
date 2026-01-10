import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

function OfficerIssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // logged-in officer
  const storedUser = localStorage.getItem("loggedInUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const officerId = currentUser?.id;

  useEffect(() => {
    const loadIssue = async () => {
      if (!officerId) {
        setError("No logged-in officer found");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:5000/api/officer/issues/${id}?officer_id=${officerId}`
        );
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load issue");
          return;
        }

        setIssue(data.issue);
      } catch (err) {
        setError("Error loading issue");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id, officerId]);

  if (loading) {
    return (
      <div className="mb-3">
        <Spinner animation="border" size="sm" /> Loading issue...
      </div>
    );
  }

  if (error) return <div className="text-danger">{error}</div>;
  if (!issue) return <div>No issue found.</div>;

  // ---- build photo URL from JSON string (same as middle-admin) ----
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
  // ---------------------------------------------------------------

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
        <strong>Description:</strong> {issue.description}</p>
      <p>
        <strong>Location:</strong> {issue.location_text}
      </p>

      <p>
        <strong>Photo:</strong>
      </p>
      {photoUrl ? (
        <div>
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
    </div>
  );
}

export default OfficerIssueDetails;
