// civic-report-frontend/src/pages/admin/reports/OfficerPerformancePage.js
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";

const OfficerPerformancePage = () => {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/reports/officers/performance"
        );

        // support either {success,data:[...]} or plain [...], or {success:true, rows:[...]}
        const raw = Array.isArray(res.data)
          ? res.data
          : res.data.data || res.data.rows || [];

        const safeData = (raw || []).map((row) => ({
          changed_by_email: row.changed_by_email || "",
          total_actions: row.total_actions || 0,
          viewed_count: row.viewed_count || 0,
          verified_count: row.verified_count || 0,
          in_progress_count: row.in_progress_count || 0,
          solved_count: row.solved_count || 0,
        }));

        setRows(safeData);
        setFiltered(safeData);
      } catch (e) {
        console.error("Load performance failed", e);
        setRows([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      rows.filter((r) => (r.changed_by_email || "").toLowerCase().includes(s))
    );
  }, [search, rows]);

  if (loading) {
    return (
      <>
        <style>{`
          .loading-center {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            font-weight: 800;
          }
        `}</style>

        <div className="loading-center">
          <Spinner animation="border" size="sm" />
          <span style={{ marginLeft: "10px" }}>Loading performance...</span>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ✅ CSS INSIDE SAME FILE */}
      <style>{`
        .performance-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 14px;
        }

        .search-box {
          width: 340px;
          max-width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
          margin-bottom: 14px;
        }

        .search-box:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
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
          min-width: 900px;
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

        .pill {
          
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          min-width: 70px;
          text-align: center;
        }

        .pill-viewed {
          background: #dbeafe;
          color: #1e40af;
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

        .pill-total {
          background: #e5e7eb;
          color: #111827;
        }

        .no-data {
          padding: 10px;
          color: #6b7280;
          font-weight: 800;
        }
      `}</style>

      <div className="performance-page">
        <h3 className="page-title">Officer Performance</h3>

        <input
          className="search-box"
          placeholder="Search by officer email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-card">
          {filtered.length === 0 ? (
            <div className="no-data">No officer performance found.</div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Email</th>
                  <th>Total Actions</th>
                  <th>Viewed</th>
                  <th>Verified</th>
                  <th>In Progress</th>
                  <th>Solved</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((o, index) => (
                  <tr key={o.changed_by_email || index}>
                    <td>{index + 1}</td>
                    <td>{o.changed_by_email || "-"}</td>

                    <td>
                      <span className="pill pill-total">{o.total_actions}</span>
                    </td>

                    <td>
                      <span className="pill pill-viewed">{o.viewed_count}</span>
                    </td>

                    <td>
                      <span className="pill pill-verified">
                        {o.verified_count}
                      </span>
                    </td>

                    <td>
                      <span className="pill pill-progress">
                        {o.in_progress_count}
                      </span>
                    </td>

                    <td>
                      <span className="pill pill-solved">{o.solved_count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default OfficerPerformancePage;
