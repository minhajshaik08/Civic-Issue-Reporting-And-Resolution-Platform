import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MiddleAdminIssuesOptions() {
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ SAME CSS AS ADMIN */}
      <style>{`
        .issues-wrapper {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
        }

        .issues-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 16px;
        }

        .issues-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          max-width: 900px;
        }

        .issues-card {
          border: none;
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
          background: white;
        }

        .issues-card-title {
          font-size: 18px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
        }

        .issues-card-text {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .issues-btn {
          border-radius: 12px;
          font-weight: 800;
          padding: 10px 16px;
        }
      `}</style>

      <div className="issues-wrapper">
        <h3 className="issues-title">Issues Management</h3>

        <div className="issues-grid">
          {/* ✅ CARD 1: VIEW / MANAGE ISSUES */}
          <Card className="issues-card">
            <Card.Body>
              <div className="issues-card-title">View / Manage Issues</div>

              <div className="issues-card-text">
                View all complaints, filter by status (New, In-Progress, Solved)
                and update issue details or status.
              </div>

              <Button
                variant="success"
                className="issues-btn"
                onClick={() =>
                  navigate("/middle-admin/dashboard/issues/list")
                }
              >
                Open Issues List
              </Button>
            </Card.Body>
          </Card>

          {/* ✅ CARD 2: ASSIGN ISSUES */}
          <Card className="issues-card">
            <Card.Body>
              <div className="issues-card-title">
                Assign Issues to Officers
              </div>

              <div className="issues-card-text">
                Assign each issue to a specific officer so they can view and
                resolve only their assigned tasks.
              </div>

              <Button
                variant="outline-success"
                className="issues-btn"
                onClick={() =>
                  navigate("/middle-admin/dashboard/issues/assign")
                }
              >
                Assign Issues
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default MiddleAdminIssuesOptions;
