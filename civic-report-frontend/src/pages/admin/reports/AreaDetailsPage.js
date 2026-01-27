import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const AreaDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area");

  const [counts, setCounts] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!area) return;

    const loadDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:5000/api/admin/reports/areas/details?area=${encodeURIComponent(
            area
          )}`
        );
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load area details");
          setCounts(null);
          return;
        }

        setCounts(data.counts || null);
      } catch (err) {
        setError("Error loading area details");
        setCounts(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [area]);

  const safeCount = (val) => {
    if (val === null || val === undefined) return 0;
    return Number(val) || 0;
  };

  if (!area) {
    return (
      <div style={{ padding: "16px", fontWeight: 700, color: "#6b7280" }}>
        No area selected.
      </div>
    );
  }

  return (
    <>
      {/* ✅ CSS INSIDE SAME FILE */}
      <style>{`
        .area-details-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 8px;
        }

        .area-name {
          font-size: 16px;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 14px;
        }

        .error-box {
          padding: 12px;
          border-radius: 12px;
          background: #fee2e2;
          color: #991b1b;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .loading-box {
          font-weight: 800;
          color: #111827;
          padding: 10px 0;
        }

        .details-card {
          background: #fff;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.06);
          max-width: 520px;
        }

        .status-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .status-left {
          font-weight: 900;
          color: #111827;
          font-size: 14px;
        }

        .count-pill {
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 13px;
          min-width: 60px;
          text-align: center;
        }

        .pill-new {
          background: #dbeafe;
          color: #1e40af;
        }

        .pill-viewed {
          background: #e0e7ff;
          color: #3730a3;
        }

        .pill-verified {
          background: #dcfce7;
          color: #166534;
        }

        .pill-progress {
          background: #fef9c3;
          color: #854d0e;
        }

        .pill-solved {
          background: #e9fff2;
          color: #15803d;
        }
      `}</style>

      <div className="area-details-page">
        <h2 className="page-title">Area Details</h2>
        <div className="area-name">{area}</div>

        {error && <div className="error-box">{error}</div>}

        {loading && <div className="loading-box">Loading...</div>}

        {!loading && counts && (
          <div className="details-card">
            <ul className="status-list">
              <li className="status-item">
                <span className="status-left">New</span>
                <span className="count-pill pill-new">
                  {safeCount(counts.NEW)}
                </span>
              </li>

              <li className="status-item">
                <span className="status-left">Viewed</span>
                <span className="count-pill pill-viewed">
                  {safeCount(counts.VIEWED)}
                </span>
              </li>

              <li className="status-item">
                <span className="status-left">Verified</span>
                <span className="count-pill pill-verified">
                  {safeCount(counts.VERIFIED)}
                </span>
              </li>

              <li className="status-item">
                <span className="status-left">In Progress</span>
                <span className="count-pill pill-progress">
                  {safeCount(counts.IN_PROGRESS)}
                </span>
              </li>

              <li className="status-item">
                <span className="status-left">Solved</span>
                <span className="count-pill pill-solved">
                  {safeCount(counts.SOLVED)}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default AreaDetailsPage;
