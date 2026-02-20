import React from "react";
import { Form, Button } from "react-bootstrap";
import { showToast } from "../../components/Toast";

function Step2ProblemDetails({
  issueType,
  setIssueType,
  description,
  setDescription,
  onPrev,
  onNext,
}) {
  const handleNext = () => {
    if (!issueType) {
      showToast("Please select the type of issue.", "error");
      return;
    }
    if (!description.trim()) {
      showToast("Please enter the problem description.", "error");
      return;
    }
    onNext();
  };

  return (
    <>
      {/* ✅ CSS */}
      <style>{`
        /* Gradient main heading */
        .problem-heading {
          background: linear-gradient(
            135deg,
            #0bbf7a,
            #0a9f6e,
            #067a58,
            #065f46
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          text-align: center;
        }

        /* ✅ Dark side headings (labels) */
        .form-label {
          color: #0f172a;
          font-weight: 600;
        }

        /* Green hover & focus */
        .form-select:focus,
        .form-control:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 0.15rem rgba(22, 163, 74, 0.25);
        }

        .form-select:hover,
        .form-control:hover {
          border-color: #16a34a;
        }
      `}</style>

      <h5 className="mb-3 problem-heading">Problem Details</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Select the type of issue</Form.Label>
          <Form.Select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            <option value="">Select issue type</option>
            <option value="Garbage">Garbage</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Street Light">Street Light</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Problem Description </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Describe the issue in detail, including severity, safety concerns, or impact on the community."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-secondary" type="button" onClick={onPrev}>
            ← Previous
          </Button>
          <Button variant="success" type="button" onClick={handleNext}>
            Next →
          </Button>
        </div>
      </Form>
    </>
  );
}

export default Step2ProblemDetails;
