import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast";
import { confirm } from "../../components/Confirm";

import Step1UserDetails from "./Step1UserDetails";
import Step2ProblemDetails from "./Step2ProblemDetails";
import Step3LocationPhoto from "./Step3LocationPhoto";

function ReportIssuePage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // step 1 – user
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);

  const [verifying, setVerifying] = useState(false);

  // ✅ NEW: OTP Verified Status
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpVerifyMsg, setOtpVerifyMsg] = useState("");

  const [canResendIn, setCanResendIn] = useState(0);

  // step 2 – problem
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");

  // step 3 – location & photos
  const [locationText, setLocationText] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [mapPosition, setMapPosition] = useState(null);

  const normalizeIndianPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
    if (digits.startsWith("0") && digits.length === 11) return digits.slice(1);
    return digits;
  };

  const isValidIndianMobile = (value) => {
    const ten = normalizeIndianPhone(value);
    const re = /^[6-9]\d{9}$/;
    return re.test(ten);
  };

  const startResendTimer = () => {
    setCanResendIn(60);
    const id = setInterval(() => {
      setCanResendIn((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ✅ SEND OTP
  const handleSendOtp = async () => {
    if (!fullName.trim()) {
      showToast("Please enter your full name before continuing.", "error");
      return;
    }

    if (!isValidIndianMobile(phone)) {
      setPhoneError(
        "Please enter a valid Indian mobile number starting with 6/7/8/9."
      );
      return;
    }

    setPhoneError("");
    setOtpError("");

    // ✅ reset verification status when sending OTP again
    setOtpVerified(false);
    setOtpVerifyMsg("");

    setSending(true);

    try {
      const normalized = normalizeIndianPhone(phone);

      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const data = await res.json();

      if (!data.success) {
        setPhoneError(data.message || "Unable to send OTP. Please try again.");
        setOtpSent(false);
        return;
      }

      setOtpSent(true);
      startResendTimer();
    } catch (e) {
      setPhoneError("Unable to send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // ✅ VERIFY OTP BUTTON
  const handleVerifyOtp = async () => {
    if (!fullName.trim()) {
      showToast("Please enter your full name before continuing.", "error");
      return;
    }

    if (!isValidIndianMobile(phone)) {
      setPhoneError("Please enter a valid Indian mobile number.");
      return;
    }

    if (!otp) {
      setOtpError("Please enter the 6-digit OTP sent to your phone.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("OTP must be 6 digits.");
      return;
    }

    setOtpError("");
    setVerifying(true);

    try {
      const normalized = normalizeIndianPhone(phone);

      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, otp }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpVerified(true);
        setOtpVerifyMsg("✅ Successfully Verified");
      } else {
        setOtpVerified(false);
        setOtpVerifyMsg("");
        setOtpError(
          "❌ Incorrect or expired OTP. Please try again or resend OTP."
        );
      }
    } catch (e) {
      setOtpVerified(false);
      setOtpVerifyMsg("");
      setOtpError("❌ Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // ✅ NEXT BUTTON (only after verified)
  const handleNextStep = () => {
    if (!otpVerified) {
      setOtpError("Please verify OTP before going to next step.");
      return;
    }
    setStep(2);
  };

  const handleSubmitAll = async () => {
    const normalized = normalizeIndianPhone(phone);

    if (!mapPosition) {
      showToast("Please select the location on the map.", "error");
      return;
    }
    if (!photoFiles || photoFiles.length === 0) {
      showToast("Please upload at least one photo.", "error");
      return;
    }

    // ✅ Confirm before submitting
    const confirmed = await confirm(
      "Are you sure you want to submit this issue report?",
      "Submit Report"
    );
    if (!confirmed) return;

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", normalized);
    formData.append("issueType", issueType);
    formData.append("description", description);
    formData.append("locationText", locationText);
    formData.append("locationLat", mapPosition.lat);
    formData.append("locationLng", mapPosition.lng);
    photoFiles.forEach((file) => formData.append("photos", file));

    try {
      const res = await fetch("http://localhost:5000/api/issues/report", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Failed to save issue", "error");
        return;
      }
    } catch (e) {
      showToast("Network error while saving issue", "error");
      return;
    }

    showToast("Report submitted successfully!", "success");

    // reset everything
    setFullName("");
    setPhone("");
    setPhoneError("");
    setOtp("");
    setOtpError("");
    setOtpSent(false);
    setSending(false);
    setVerifying(false);
    setCanResendIn(0);

    setOtpVerified(false);
    setOtpVerifyMsg("");

    setIssueType("");
    setDescription("");
    setLocationText("");
    setPhotoFiles([]);
    setMapPosition(null);

    setStep(1);
    navigate("/");
  };

  return (
    <>

      {/* inline CSS for this page only */}
      <style>{`
        .report-wrapper {
          background-color: #e0f4ef;
          min-height: 90vh;
          padding: 40px 0 40px;
        }

        .report-container {
          max-width: 760px;
          
        }

        .report-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 28px 24px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
          border: 1px solid #dbeafe;
        }

        .report-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .report-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 1.3rem;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .step-indicator-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.85rem;
        }

        .step-indicator-dot {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          border: 2px solid #cbd5e1;
          background-color: #ffffff;
          color: #64748b;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .step-indicator-label {
          color: #94a3b8;
        }

        .step-indicator-item.active .step-indicator-dot {
          border-color: #16a34a;
          background-color: #22c55e;
          color: #ffffff;
        }

        .step-indicator-item.active .step-indicator-label {
          color: #16a34a;
          font-weight: 600;
        }
          /* Global gradient heading for all steps */
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
  text-align: center;
}


        .report-inner {
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .report-wrapper {
            padding: 40px 0 30px;
          }
          .report-card {
            padding: 22px 18px;
            border-radius: 14px;
          }
          .report-title {
            font-size: 1.5rem;
          }
          .step-indicator {
            gap: 8px;
          }
          .step-indicator-label {
            font-size: 0.8rem;
          }
        }
          /* ================= PAGE ANIMATIONS ================= */

/* Floating background */
.floating-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  width: 260px;
  height: 260px;
  background: rgba(22, 163, 74, 0.12);
  border-radius: 50%;
  filter: blur(40px);
  animation: float 8s infinite ease-in-out;
}

.shape1 { top: 10%; left: 5%; }
.shape2 { bottom: 10%; right: 5%; animation-delay: 2s; }

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-25px); }
  100% { transform: translateY(0); }
}

/* Card entrance */
.report-card {
  animation: cardFadeIn 0.6s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(25px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Step transition animation */
.step-animate {
  animation: stepFade 0.45s ease;
}

@keyframes stepFade {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Step indicator pulse */
.step-indicator-item.active .step-indicator-dot {
  animation: pulse 1.6s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* Button hover animation */
button {
  transition: all 0.25s ease;
}

button:hover {
  transform: translateY(-2px);
}
/* ===== CONTACT STYLE BACKGROUND (for ReportIssue) ===== */

.contact-bg {
  min-height: 100vh;
  padding: 80px 0;
  background: linear-gradient(135deg, #c7f9cc, #e0f4ef);
  position: relative;
  overflow: hidden;
}

/* Floating background shapes */

.shape {
  position: absolute;
  width: 250px;
  height: 250px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  animation: float 8s infinite ease-in-out;
}

.shape1 {
  top: 10%;
  left: 5%;
}

.shape2 {
  bottom: 10%;
  right: 5%;
  animation-delay: 2s;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-25px); }
  100% { transform: translateY(0px); }
}

      `}</style>

      <main className="report-wrapper">
        <div className="floating-bg">
  <div className="shape shape1"></div>
  <div className="shape shape2"></div>
</div>

        <Container className="report-container">
          <div className="report-card">
        <h2 className="gradient-heading text-center">
  Report a Community Issue
</h2>


            <p className="text-center report-subtitle">
              keep your city clean and safe by reporting problems directly to the
              authorities in just three steps.
            </p>

            <div className="step-indicator">
              <div
                className={
                  step === 1
                    ? "step-indicator-item active"
                    : "step-indicator-item"
                }
              >
                <div className="step-indicator-dot">1</div>
                <div className="step-indicator-label">User Details</div>
              </div>

              <div
                className={
                  step === 2
                    ? "step-indicator-item active"
                    : "step-indicator-item"
                }
              >
                <div className="step-indicator-dot">2</div>
                <div className="step-indicator-label">Problem Details</div>
              </div>

              <div
                className={
                  step === 3
                    ? "step-indicator-item active"
                    : "step-indicator-item"
                }
              >
                <div className="step-indicator-dot">3</div>
                <div className="step-indicator-label">Location &amp; Photo</div>
              </div>
            </div>

            <div key={step} className="report-inner step-animate">
              {step === 1 && (
                <Step1UserDetails
                  fullName={fullName}
                  setFullName={setFullName}
                  phone={phone}
                  setPhone={setPhone}
                  phoneError={phoneError}
                  setPhoneError={setPhoneError}
                  otp={otp}
                  setOtp={(val) => {
                    setOtp(val);
                    setOtpError("");
                    setOtpVerified(false);
                    setOtpVerifyMsg("");
                  }}
                  otpError={otpError}
                  setOtpError={setOtpError}
                  otpSent={otpSent}
                  sending={sending}
                  verifying={verifying}
                  canResendIn={canResendIn}
                  onSendOtp={handleSendOtp}
                  onVerifyOtp={handleVerifyOtp}
                  otpVerified={otpVerified}
                  otpVerifyMsg={otpVerifyMsg}
                  onNext={handleNextStep}
                />
              )}

              {step === 2 && (
                <Step2ProblemDetails
                  issueType={issueType}
                  setIssueType={setIssueType}
                  description={description}
                  setDescription={setDescription}
                  onPrev={() => setStep(1)}
                  onNext={() => setStep(3)}
                />
              )}

              {step === 3 && (
                <Step3LocationPhoto
                  locationText={locationText}
                  setLocationText={setLocationText}
                  photoFiles={photoFiles}
                  setPhotoFiles={setPhotoFiles}
                  mapPosition={mapPosition}
                  setMapPosition={setMapPosition}
                  onPrev={() => setStep(2)}
                  onSubmit={handleSubmitAll}
                />
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default ReportIssuePage;
