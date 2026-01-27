import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Issuesoptions() {
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ CSS INSIDE SAME FILE */}
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

        .issues-card {
          border: none;
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
          background: white;
          max-width: 650px;
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
          margin-bottom: 14px;
        }

        .issues-btn {
          border-radius: 12px;
          font-weight: 800;
          padding: 10px 14px;
        }
      `}</style>

      <div className="issues-wrapper">
        <h3 className="issues-title">Issues Management</h3>

        <Card className="issues-card">
          <Card.Body>
            <div className="issues-card-title">View / Manage Issues</div>

            <div className="issues-card-text">
              See all complaints, filter by status (Pending, In-Progress,
              Resolved) and open details to update status or assignment.
            </div>

            <Button
              variant="success"
              className="issues-btn"
              onClick={() => navigate("/admin/welcome/issues/list")}
            >
              Open Issues List
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Issuesoptions;
