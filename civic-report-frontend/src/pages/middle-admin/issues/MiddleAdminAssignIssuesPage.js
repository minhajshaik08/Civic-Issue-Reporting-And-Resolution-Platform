import React, { useEffect, useState } from "react";
import { Table, Form, Button, Spinner } from "react-bootstrap";

function MiddleAdminAssignIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoading(true);

        // 1) load only NEW issues
        const issuesRes = await fetch(
          "http://localhost:5000/api/middle-admin/issues?status=NEW"
        );
        const issuesData = await issuesRes.json();

        // 2) load officers (adjust URL if your API is different)
        const officersRes = await fetch(
          "http://localhost:5000/api/middle-admin/officers/list"
        );
        const officersData = await officersRes.json();

        if (!issuesRes.ok || !issuesData.success) {
          throw new Error(issuesData.message || "Failed to load issues");
        }
        if (!officersRes.ok || !officersData.success) {
          throw new Error(officersData.message || "Failed to load officers");
        }

        setIssues(issuesData.issues || []);
        setOfficers(officersData.officers || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load issues or officers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOfficerChange = (issueId, officerId) => {
    setSelectedOfficer((prev) => ({
      ...prev,
      [issueId]: officerId,
    }));
  };

  const handleAssign = async (issueId) => {
    const officerId = selectedOfficer[issueId];
    if (!officerId) return;

    try {
      setSavingId(issueId);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/middle-admin/issues/${issueId}/assign-officer`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ officer_id: officerId }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to assign officer.");
      }

      // remove this issue from list (not NEW anymore, or at least assigned)
      setIssues((prev) => prev.filter((i) => i.id !== issueId));
    } catch (err) {
      console.error(err);
      setError(err.message || "Error assigning officer. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" /> <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-3">Assign Issues to Officers</h3>
      <p className="text-muted">
        Showing only issues with status <strong>NEW</strong>.
      </p>

      {error && <p className="text-danger">{error}</p>}

      {issues.length === 0 ? (
        <p>No new issues to assign.</p>
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue</th>
              <th>Area / Location</th>
              <th>Assign Officer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.issue_type}</td>
                <td>{issue.location_text}</td>
                <td>
                  {(() => {
                    const deptKey = issue.issue_type
                      ? issue.issue_type.toLowerCase()
                      : "";

                    const matchingOfficers = officers.filter(
                      (off) =>
                        off.department &&
                        off.department.toLowerCase() === deptKey
                    );

                    const optionsToShow =
                      matchingOfficers.length > 0 ? matchingOfficers : officers;

                    return (
                      <Form.Select
                        value={selectedOfficer[issue.id] || ""}
                        onChange={(e) =>
                          handleOfficerChange(issue.id, e.target.value)
                        }
                      >
                        <option value="">Select officer</option>
                        {optionsToShow.map((off) => (
                          <option key={off.id} value={off.id}>
                            {off.name}
                            {off.zone ? ` - ${off.zone}` : ""}
                            {off.department ? ` (${off.department})` : ""}
                          </option>
                        ))}
                      </Form.Select>
                    );
                  })()}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="success"
                    disabled={
                      !selectedOfficer[issue.id] || savingId === issue.id
                    }
                    onClick={() => handleAssign(issue.id)}
                  >
                    {savingId === issue.id ? "Assigning..." : "Assign"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default MiddleAdminAssignIssuesPage;
