import React from "react";
import { Container, Table, Badge } from "react-bootstrap";

function OfficerPage() {
  // later you can replace this with data from backend
  const sampleIssues = [
    { id: 1, title: "Garbage near main road", status: "Open" },
    { id: 2, title: "Street light not working", status: "In Progress" },
    { id: 3, title: "Pothole near school", status: "Resolved" }
  ];

  return (
    <main className="py-5">
      <Container>
        <h2 className="mb-3">Officer Portal</h2>
        <p className="text-muted mb-4">
          View and manage issues reported by citizens in your jurisdiction.
        </p>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Issue Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleIssues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.title}</td>
                <td>
                  <Badge
                    bg={
                      issue.status === "Resolved"
                        ? "success"
                        : issue.status === "In Progress"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {issue.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </main>
  );
}

export default OfficerPage;
