import React from "react";
import { Link } from "react-router-dom";

const MiddleAdminReportsHomePage = () => {
  return (
    <>
      {/* ✅ SAME CSS AS ADMIN */}
      <style>{`
        .reports-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .reports-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 16px;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          max-width: 1000px;
        }

        .report-card {
          display: block;
          text-decoration: none;
          background: #fff;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
          border: 1px solid #eef2f7;
          transition: 0.2s ease-in-out;
          color: inherit;
        }

        .report-card:hover {
          transform: translateY(-3px);
          box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.12);
          border-color: #c7d2fe;
        }

        .report-card h4 {
          margin: 0 0 6px 0;
          font-size: 18px;
          font-weight: 900;
          color: #111827;
        }

        .report-card p {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          line-height: 1.5;
        }

        @media (max-width: 992px) {
          .reports-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .reports-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="reports-page">
        <h2 className="reports-title">Reports & Analytics</h2>

        <div className="reports-grid">
          {/* ✅ TOTAL ISSUES */}
          <Link
            to="/middle-admin/dashboard/reports/issues"
            className="report-card"
          >
            <h4>Total Issues</h4>
            <p>Daily, weekly, and monthly issue trends.</p>
          </Link>

          {/* ✅ TOP AREAS */}
          <Link
            to="/middle-admin/dashboard/reports/areas"
            className="report-card"
          >
            <h4>Top Areas</h4>
            <p>Most problematic areas based on complaints.</p>
          </Link>

          {/* ✅ OFFICER PERFORMANCE */}
          <Link
            to="/middle-admin/dashboard/reports/officers/performance"
            className="report-card"
          >
            <h4>Officer Performance</h4>
            <p>Issues handled, resolved, and efficiency metrics.</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MiddleAdminReportsHomePage;
