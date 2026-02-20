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
  onVerifyOtp,
  otpVerified,
  otpVerifyMsg,
  onNext,
}) {
  return (

    <>

      <style><style>{`
:root {
  --primary-green: #16a34a;
  --primary-green-dark: #15803d;
  --primary-green-light: #22c55e;
  --accent-green: #059669;
  --accent-green-light: #10b981;
  --text-dark: #0f172a;
  --border-light: #e2e8f0;
}

/* ================= ENTRANCE ANIMATION ================= */

.step1-card-content {
  padding: 28px;
  animation: fadeSlideUp 0.6s ease-out;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ================= GRADIENT HEADING ================= */

.gradient-heading {
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
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ================= INPUT ANIMATIONS ================= */

.step1-label {
  font-weight: 600;
  margin-bottom: 6px;
}

.step1-input {
  border-radius: 10px;
  padding: 10px 14px;
  border: 1px solid var(--border-light);
  transition: all 0.25s ease;
}

.step1-input:focus {
  border-color: var(--primary-green);
  box-shadow: 0 0 0 0.2rem rgba(22, 163, 74, 0.18);
  transform: scale(1.01);
}

/* ================= OTP ROW SLIDE ================= */

.otp-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.otp-row .form-control {
  flex: 1;
  min-width: 140px;
}

/* ================= BUTTON ANIMATIONS ================= */

.step1-btn {
  border-radius: 10px;
  font-weight: 600;
  padding: 9px 14px;
  transition: all 0.25s ease;
}

.step1-btn:hover {
  transform: translateY(-2px);
}

/* Send button */

.btn-send {
  border: 1px solid var(--primary-green);
  color: var(--primary-green);
  background: white;
}

.btn-send:hover {
  background: var(--primary-green);
  color: white;
}

/* Verify button */

.btn-verify {
  background: var(--accent-green);
  border: none;
}

.btn-verify:hover {
  background: var(--primary-green-dark);
}

/* Next button glow */

.btn-next {
  background: linear-gradient(
    135deg,
    var(--primary-green),
    var(--primary-green-light)
  );
  border: none;
  padding: 10px 24px;
}

.btn-next:hover {
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.25);
}

/* ================= SUCCESS PULSE ================= */

.text-success {
  animation: pulseSuccess 1.2s ease;
}

@keyframes pulseSuccess {
  0% { opacity: 0; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* ================= ERROR SHAKE ================= */

.invalid-feedback {
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* ================= NEXT BUTTON CONTAINER ================= */

.next-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
  animation: fadeIn 0.8s ease;
}

/* ================= MOBILE ================= */

@media (max-width: 576px) {
  .otp-row {
    flex-direction: column;
    align-items: stretch;
  }

  .next-btn-container {
    justify-content: center;
  }
}
  /* ================= SOFT EMBASSY BLOBS BACKGROUND ================= */

.embassy-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
  background: #e0f4ef;
}

/* Blob base style */

.blob {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  animation: floatBlob 14s infinite ease-in-out;
}

/* Different blob colors */

.blob1 {
  background: #22c55e;
  top: 8%;
  left: 6%;
}

.blob2 {
  background: #10b981;
  bottom: 10%;
  right: 8%;
  animation-delay: 4s;
}

.blob3 {
  background: #34d399;
  top: 55%;
  left: 40%;
  animation-delay: 8s;
}

@keyframes floatBlob {
  0% {
    transform: translateY(0) translateX(0) scale(1);
  }
  50% {
    transform: translateY(-40px) translateX(25px) scale(1.05);
  }
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }
}

`}</style>
</style>

      <div className="step1-card-content">

        {/* ✅ Single gradient heading */}
        <h5 className="step1-title gradient-heading">
          Your Information
        </h5>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="step1-label">
              Full Name 
            </Form.Label>
            <Form.Control
              className="step1-input"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="step1-label">
              Phone Number
            </Form.Label>
            <Form.Control
              className="step1-input"
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
            <Form.Label className="step1-label">
              Verify Phone Number
            </Form.Label>

            <div className="otp-row">
              <Button
                className="step1-btn btn-send"
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

              <Form.Control
                className="step1-input"
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

              <Button
                className="step1-btn btn-verify"
                type="button"
                onClick={onVerifyOtp}
                disabled={!otpSent || verifying || otpVerified}
              >
                {otpVerified
                  ? "Verified ✓"
                  : verifying
                  ? "Verifying..."
                  : "Verify"}
              </Button>
            </div>

            {otpError && (
              <div className="invalid-feedback d-block">
                {otpError}
              </div>
            )}

            {otpSent && !otpError && !otpVerified && (
              <small className="text-success">
                OTP sent successfully to your mobile number.
              </small>
            )}

            {otpVerified && otpVerifyMsg && (
              <small className="text-success d-block mt-1">
                {otpVerifyMsg}
              </small>
            )}
          </Form.Group>

          <div className="next-btn-container">
            <Button
              className="step1-btn btn-next"
              type="button"
              onClick={onNext}
              disabled={!otpVerified}
            >
              Next →
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Step1UserDetails;
