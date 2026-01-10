import React, { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AreasReportPage = () => {
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
          "http://localhost:5000/api/admin/reports/areas"
        );
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load top areas");
          setAreas([]);
          return;
        }

        setAreas(data.areas || []);
      } catch (err) {
        setError("Error loading top areas");
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    loadAreas();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Top Problem Areas</h2>

      {loading && (
        <div className="mb-3">
          <Spinner animation="border" size="sm" /> Loading...
        </div>
      )}

      {error && <div className="text-danger mb-3">{error}</div>}

      {!loading && !error && areas.length === 0 && (
        <p>No areas found.</p>
      )}

      {areas.length > 0 && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Area</th>
              <th>Total Issues</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area, index) => (
              <tr key={area.area}>
                <td>{index + 1}</td>
                <td>{area.area}</td>
                <td>{area.total_issues}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(
                        `/admin/welcome/reports/areas/details?area=${encodeURIComponent(
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
        </Table>
      )}
    </div>
  );
};

export default AreasReportPage;
