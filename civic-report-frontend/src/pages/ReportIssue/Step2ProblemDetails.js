import React from "react";
import { Form, Button } from "react-bootstrap";

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
      alert("Please select the type of issue.");
      return;
    }
    if (!description.trim()) {
      alert("Please enter the problem description.");
      return;
    }
    onNext(); // go to Step 3 only if both are valid
  };

  return (
    <>
      <h5 className="mb-3">Problem Details</h5>
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
          <Form.Label>Problem Description *</Form.Label>
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
