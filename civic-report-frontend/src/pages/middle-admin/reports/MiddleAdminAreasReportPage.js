import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MiddleAdminAreasReportPage = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadAreas = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "http://13.201.16.142:5000/api/middle-admin/reports/areas"
        );
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load top areas");
          setAreas([]);
          return;
        }

        setAreas(data.areas || []);
      } catch {
        setError("Error loading top areas");
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    loadAreas();
  }, []);

  return (
    <>
      {/* ✅ SAME CSS AS ADMIN */}
      <style>{`
        .areas-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .areas-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 16px;
        }

        .loading-box {
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
        }

        .error-box {
          font-weight: 900;
          color: red;
          margin-bottom: 12px;
        }

        .table-card {
          background: #fff;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.06);
          overflow-x: auto;
        }

        .styled-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .styled-table thead tr {
          background: #111827;
          color: white;
          text-align: left;
        }

        .styled-table th,
        .styled-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          white-space: nowrap;
        }

        .styled-table tbody tr:nth-child(even) {
          background: #fafafa;
        }

        .styled-table tbody tr:hover {
          background: #f1f5f9;
          transition: 0.2s;
        }

        .btn-details {
          border: none;
          background: #2563eb;
          color: white;
          font-weight: 800;
          font-size: 13px;
          padding: 7px 12px;
          border-radius: 10px;
          cursor: pointer;
        }

        .btn-details:hover {
          opacity: 0.9;
        }

        .no-data {
          padding: 10px;
          color: #6b7280;
          font-weight: 700;
        }
      `}</style>

      <div className="areas-page">
        <h2 className="areas-title">Top Problem Areas</h2>

        {loading && (
          <div className="loading-box">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {!loading && !error && areas.length === 0 && (
          <div className="table-card">
            <div className="no-data">No areas found.</div>
          </div>
        )}

        {areas.length > 0 && (
          <div className="table-card">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Area</th>
                  <th>Total Issues</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {areas.map((area, index) => (
                  <tr key={area.area || index}>
                    <td>{index + 1}</td>
                    <td>{area.area}</td>
                    <td>{area.total_issues}</td>
                    <td>
                      <button
                        className="btn-details"
                        onClick={() =>
                          navigate(
                            `/middle-admin/dashboard/reports/areas/details?area=${encodeURIComponent(
                              area.area
                            )}`
                          )
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MiddleAdminAreasReportPage;
