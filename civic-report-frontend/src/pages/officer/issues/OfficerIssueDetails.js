import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const OfficerIssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // image modal
  const [showModal, setShowModal] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const officerId = storedUser?.id;

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
      } catch {
        setError("Error loading issue");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id, officerId]);

  // parse multiple images (same as middle admin)
  const photoUrls = useMemo(() => {
    if (!issue?.photo_paths) return [];

    try {
      const arr = JSON.parse(issue.photo_paths);
      if (!Array.isArray(arr)) return [];
      return arr.map(
        (f) => `http://localhost:5000/uploads/issues/${f}`
      );
    } catch {
      return [];
    }
  }, [issue]);

  if (loading) return <div className="issue-loading">Loading issue...</div>;
  if (error) return <div className="issue-error">{error}</div>;
  if (!issue) return null;

  return (
    <>
      {/* ✅ SAME CSS AS MIDDLE ADMIN */}
      <style>{`
        .issue-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .issue-card {
          background: white;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
          max-width: 950px;
          margin: auto;
        }

        .issue-title {
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 14px;
        }

        .issue-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .issue-field {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
        }

        .issue-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 800;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .issue-value {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          word-break: break-word;
        }

        .issue-description {
          grid-column: span 2;
        }

        .photo-box {
          margin-top: 16px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #fff;
        }

        .thumb-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .thumb-img {
          width: 120px;
          height: 90px;
          object-fit: cover;
          border-radius: 10px;
          cursor: pointer;
          border: 2px solid #e5e7eb;
        }

        .thumb-img:hover {
          border-color: #2563eb;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-box {
          background: white;
          border-radius: 16px;
          max-width: 700px;
          padding: 14px;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #111827;
          color: white;
          border-radius: 10px;
          padding: 6px 10px;
          border: none;
          cursor: pointer;
        }

        .modal-img {
          width: 100%;
          max-height: 450px;
          object-fit: contain;
          border-radius: 12px;
        }

        .issue-loading,
        .issue-error {
          padding: 20px;
          font-weight: 800;
        }

        .issue-error {
          color: red;
        }

        @media (max-width: 768px) {
          .issue-grid {
            grid-template-columns: 1fr;
          }
          .issue-description {
            grid-column: span 1;
          }
        }
      `}</style>

      <div className="issue-page">
        <div className="issue-card">
          <h2 className="issue-title">Issue #{issue.id}</h2>

          <div className="issue-grid">
            <div className="issue-field">
              <div className="issue-label">Full Name</div>
              <div className="issue-value">{issue.full_name}</div>
            </div>

            <div className="issue-field">
              <div className="issue-label">Phone</div>
              <div className="issue-value">{issue.phone}</div>
            </div>

            <div className="issue-field">
              <div className="issue-label">Issue Type</div>
              <div className="issue-value">{issue.issue_type}</div>
            </div>

            <div className="issue-field">
              <div className="issue-label">Status</div>
              <div className="issue-value">{issue.status}</div>
            </div>

            <div className="issue-field issue-description">
              <div className="issue-label">Description</div>
              <div className="issue-value">{issue.description}</div>
            </div>

            <div className="issue-field issue-description">
              <div className="issue-label">Location</div>
              <div className="issue-value">{issue.location_text}</div>
            </div>
          </div>

          <div className="photo-box">
            <div className="issue-label">Uploaded Photos</div>

            {photoUrls.length > 0 ? (
              <div className="thumb-row">
                {photoUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    className="thumb-img"
                    alt="Issue"
                    onClick={() => {
                      setActiveImage(url);
                      setShowModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="issue-value">No photo uploaded</div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <img src={activeImage} className="modal-img" alt="Preview" />
          </div>
        </div>
      )}
    </>
  );
};

export default OfficerIssueDetails;
