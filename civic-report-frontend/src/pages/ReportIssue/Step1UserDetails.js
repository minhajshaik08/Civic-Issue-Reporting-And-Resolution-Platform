import React from "react";
import { Form, Button } from "react-bootstrap";

function Step1UserDetails({
  fullName,
  setFullName,
  phone,
  setPhone,
  phoneError,
  setPhoneError,
  otp,
  setOtp,
  otpError,
  setOtpError,
  otpSent,
  sending,
  verifying,
  canResendIn,
  onSendOtp,

  // ✅ NEW
  onVerifyOtp,
  otpVerified,
  otpVerifyMsg,

  // ✅ Next step
  onNext,
}) {
  return (
    <>
      <h5 className="mb-3">Your Information</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Full Name *</Form.Label>
          <Form.Control
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="e.g., 9876543210 or +91-9876543210"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError("");
            }}
            isInvalid={!!phoneError}
          />
          <Form.Control.Feedback type="invalid">
            {phoneError}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Verify Phone Number</Form.Label>

          <div className="d-flex gap-2 align-items-center">
            {/* Send OTP */}
            <Button
              variant="outline-success"
              type="button"
              onClick={onSendOtp}
              disabled={sending || canResendIn > 0}
            >
              {sending
                ? "Sending..."
                : canResendIn > 0
                ? `Resend OTP in ${canResendIn}s`
                : "Send OTP"}
            </Button>

            {/* OTP Input */}
            <Form.Control
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setOtp(v);
                setOtpError("");
              }}
              isInvalid={!!otpError}
              disabled={!otpSent || otpVerified}
            />

            {/* ✅ Verify OTP Button */}
            <Button
              variant="primary"
              type="button"
              onClick={onVerifyOtp}
              disabled={!otpSent || verifying || otpVerified}
            >
              {otpVerified ? "Verified " : verifying ? "Verifying..." : "Verify"}
            </Button>
          </div>

          {/* OTP Error */}
          {otpError && <div className="invalid-feedback d-block">{otpError}</div>}

          {/* OTP Sent */}
          {otpSent && !otpError && !otpVerified && (
            <small className="text-success">
              OTP sent successfully to your mobile number.
            </small>
          )}

          {/* ✅ Verified Message */}
          {otpVerified && otpVerifyMsg && (
            <small className="text-success d-block mt-1">{otpVerifyMsg}</small>
          )}
        </Form.Group>

        {/* ✅ Next Button */}
        <div className="text-end mt-4">
          <Button
            variant="success"
            type="button"
            onClick={onNext}
            disabled={!otpVerified}
          >
            Next →
          </Button>
        </div>
      </Form>
    </>
  );
}

export default Step1UserDetails;
