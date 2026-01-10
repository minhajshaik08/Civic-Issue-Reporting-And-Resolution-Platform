import React, { useEffect, useState } from "react";
import { Table, Form, Spinner } from "react-bootstrap";
import axios from "axios";

const MiddleAdminOfficerPerformancePage = () => {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/middle-admin/reports/officers/performance"
        );

        const data = Array.isArray(res.data) ? res.data : res.data.data;

        const safeData = (data || []).map((row) => ({
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
      rows.filter((r) =>
        (r.changed_by_email || "").toLowerCase().includes(s)
      )
    );
  }, [search, rows]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <h3>Officer Performance</h3>
      <Form.Control
        className="my-3"
        placeholder="Search by email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Email</th>
            <th>Total Actions</th>
            <th>Viewed</th>
            <th>Verified</th>
            <th>In Progress</th>
            <th>Solved</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.changed_by_email || Math.random()}>
              <td>{o.changed_by_email}</td>
              <td>{o.total_actions}</td>
              <td>{o.viewed_count}</td>
              <td>{o.verified_count}</td>
              <td>{o.in_progress_count}</td>
              <td>{o.solved_count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MiddleAdminOfficerPerformancePage;
