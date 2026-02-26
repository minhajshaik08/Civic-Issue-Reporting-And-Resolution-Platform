// src/pages/admin/issues/IssueDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { showToast } from "../../../components/Toast";

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // ✅ modal state
  const [showModal, setShowModal] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  // ✅ Correct key used in your project
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const loadIssue = async () => {
      try {
        setError("");
        const res = await fetch(`http://13.201.16.142:5000/api/admin/issues/${id}`);
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
      showToast("No logged-in user found", "error");
      return;
    }

    try {
      setUpdating(true);

      const res = await fetch(
        `http://13.201.16.142:5000/api/admin/issues/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            officerId: currentUser.id,
            officerName: currentUser.full_name || currentUser.username || "",
            officerEmail: currentUser.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to update status", "error");
        return;
      }

      setIssue((prev) => ({ ...prev, status: newStatus }));
      showToast("Status updated successfully", "success");
    } catch (err) {
      showToast("Error updating status", "error");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Parse all images (multiple)
  const photoUrls = useMemo(() => {
    if (!issue?.photo_paths) return [];

    try {
      const arr = JSON.parse(issue.photo_paths); // ["file1.png","file2.png"]
      if (!Array.isArray(arr)) return [];

      return arr
        .filter(Boolean)
        .map((file) => `http://13.201.16.142:5000/uploads/issues/${file}`);
    } catch (e) {
      console.error("Error parsing photo_paths JSON", e);
      return [];
    }
  }, [issue]);

  // ✅ open modal
  const openImageModal = (url) => {
    setActiveImage(url);
    setShowModal(true);
  };

  const closeImageModal = () => {
    setShowModal(false);
    setActiveImage("");
  };

  if (error) return <div className="issue-error">{error}</div>;
  if (!issue) return <div className="issue-loading">Loading issue...</div>;

  return (
    <>
      {/* ✅ CSS IN SAME FILE */}
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
          color: #111827;
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

        .photo-title {
          font-size: 13px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 10px;
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
          transition: 0.2s ease-in-out;
        }

        .thumb-img:hover {
          transform: scale(1.03);
          border-color: #2563eb;
        }

        .photo-note {
          font-size: 12px;
          color: #6b7280;
          margin-top: 8px;
          font-weight: 600;
        }

        .status-box {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .status-label {
          font-weight: 900;
          color: #111827;
        }

        .status-select {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          font-weight: 700;
          min-width: 220px;
        }

        .status-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .saving-text {
          font-weight: 800;
          color: #2563eb;
          font-size: 13px;
        }

        /* ✅ MODAL */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-box {
          background: white;
          border-radius: 16px;
          max-width: 700px;
          width: 100%;
          padding: 14px;
          box-shadow: 0px 10px 26px rgba(0, 0, 0, 0.25);
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          border: none;
          background: #111827;
          color: white;
          font-weight: 900;
          cursor: pointer;
          border-radius: 10px;
          padding: 6px 10px;
        }

        .modal-img {
          width: 100%;
          max-height: 450px;
          object-fit: contain;
          border-radius: 12px;
        }

        .issue-loading {
          padding: 20px;
          font-weight: 800;
          color: #111827;
        }

        .issue-error {
          padding: 20px;
          font-weight: 900;
          color: red;
        }

        @media (max-width: 768px) {
          .issue-grid {
            grid-template-columns: 1fr;
          }
          .issue-description {
            grid-column: span 1;
          }
          .issue-card {
            padding: 14px;
          }
          .modal-img {
            max-height: 350px;
          }
        }
      `}</style>

      <div className="issue-page">
        <div className="issue-card">
          <h2 className="issue-title">Issue #{issue.id}</h2>

          <div className="issue-grid">
            <div className="issue-field">
              <div className="issue-label">Full Name</div>
              <div className="issue-value">{issue.full_name || "-"}</div>
            </div>

            <div className="issue-field">
              <div className="issue-label">Phone Number</div>
              <div className="issue-value">{issue.phone || "-"}</div>
            </div>

            <div className="issue-field">
              <div className="issue-label">Issue Type</div>
              <div className="issue-value">{issue.issue_type || "-"}</div>
            </div>

            <div className="issue-field">
              <div className="issue-label">Status</div>
              <div className="issue-value">{issue.status || "-"}</div>
            </div>

            <div className="issue-field issue-description">
              <div className="issue-label">Description</div>
              <div className="issue-value">{issue.description || "-"}</div>
            </div>

            <div className="issue-field issue-description">
              <div className="issue-label">Location</div>
              <div className="issue-value">{issue.location_text || "-"}</div>
            </div>
          </div>

          {/* ✅ MULTIPLE PHOTOS */}
          <div className="photo-box">
            <div className="photo-title">Uploaded Photos</div>

            {photoUrls.length > 0 ? (
              <>
                <div className="thumb-row">
                  {photoUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Issue ${i + 1}`}
                      className="thumb-img"
                      onClick={() => openImageModal(url)}
                    />
                  ))}
                </div>

                <div className="photo-note">
                  Click any image to preview inside this page.
                </div>
              </>
            ) : (
              <div className="photo-note">No photo uploaded.</div>
            )}
          </div>

          {/* ✅ Status Update */}
          <div className="status-box">
            <div className="status-label">Update Status:</div>

            <select
              className="status-select"
              value={issue.status}
              onChange={handleStatusChange}
              disabled={updating}
            >
              <option value="NEW">New</option>
              <option value="VIEWED">Viewed</option>
              <option value="VERIFIED">Verified</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SOLVED">Solved</option>
            </select>

            {updating && <div className="saving-text">Saving...</div>}
          </div>
        </div>
      </div>

      {/* ✅ IMAGE MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>
              ✕
            </button>

            <img src={activeImage} alt="Preview" className="modal-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default IssueDetails;
