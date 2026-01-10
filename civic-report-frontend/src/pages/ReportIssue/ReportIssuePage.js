// civic-report-frontend/src/pages/ReportIssue/ReportIssuePage.js

import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

  const handleSendOtp = async () => {
    if (!fullName.trim()) {
      alert("Please enter your full name before continuing.");
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

  const handleVerifyAndNext = async () => {
    if (!fullName.trim()) {
      alert("Please enter your full name before continuing.");
      return;
    }
    if (!isValidIndianMobile(phone)) {
      setPhoneError(
        "Please enter a valid Indian mobile number starting with 6/7/8/9."
      );
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
        setStep(2);
      } else {
        setOtpError(
          "Incorrect or expired OTP. Please check the code and try again, or request a new OTP."
        );
      }
    } catch (e) {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmitAll = async () => {
    const normalized = normalizeIndianPhone(phone);

    if (!mapPosition) {
      alert("Please select the location on the map.");
      return;
    }
    if (!photoFiles || photoFiles.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }

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
        alert(data.message || "Failed to save issue");
        return;
      }
    } catch (e) {
      alert("Network error while saving issue");
      return;
    }

    alert("Report submitted successfully!");

    setFullName("");
    setPhone("");
    setPhoneError("");
    setOtp("");
    setOtpError("");
    setOtpSent(false);
    setSending(false);
    setVerifying(false);
    setCanResendIn(0);
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
          min-height: 100vh;
          padding: 60px 0 40px;
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
      `}</style>

      <main className="report-wrapper">
        <Container className="report-container">
          <div className="report-card">
            <h2 className="text-center report-title">
              Report a Community Issue
            </h2>
            <p className="text-center report-subtitle">
              Help keep your city clean and safe by reporting problems directly
              to the authorities in just three simple steps.
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

            <div className="report-inner">
              {step === 1 && (
                <Step1UserDetails
                  fullName={fullName}
                  setFullName={setFullName}
                  phone={phone}
                  setPhone={setPhone}
                  phoneError={phoneError}
                  setPhoneError={setPhoneError}
                  otp={otp}
                  setOtp={setOtp}
                  otpError={otpError}
                  setOtpError={setOtpError}
                  otpSent={otpSent}
                  sending={sending}
                  verifying={verifying}
                  canResendIn={canResendIn}
                  onSendOtp={handleSendOtp}
                  onVerifyNext={handleVerifyAndNext}
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
