import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const MiddleAdminAreaDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area");
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!area) return;

    const loadDetails = async () => {
      try {
        setError("");
        const res = await fetch(
          `http://localhost:5000/api/middle-admin/reports/areas/details?area=${encodeURIComponent(
            area
          )}`
        );
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load area details");
          return;
        }

        setCounts(data.counts);
      } catch (err) {
        setError("Error loading area details");
      }
    };

    loadDetails();
  }, [area]);

  if (!area) return <p>No area selected.</p>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!counts) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4">Area Details</h2>
      <h4 className="mb-3">{area}</h4>

      <ul>
        <li>New: {counts.NEW}</li>
        <li>Viewed: {counts.VIEWED}</li>
        <li>Verified: {counts.VERIFIED}</li>
        <li>In Progress: {counts.IN_PROGRESS}</li>
        <li>Solved: {counts.SOLVED}</li>
      </ul>
    </div>
  );
};

export default MiddleAdminAreaDetailsPage;
