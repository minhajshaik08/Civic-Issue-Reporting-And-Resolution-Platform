// civic-report-frontend/src/pages/ReportIssue/ReportIssuePage.js

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
  const [photoFiles, setPhotoFiles] = useState([]); // multiple photos
  const [mapPosition, setMapPosition] = useState(null);

  // phone helpers
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
      const res = await fetch("http://localhost:8080/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const data = await res.json();

      if (!data.success) {
        // Shows "Access denied. Your number is blocked by admin." for blocked mobiles
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
      const res = await fetch("http://localhost:8080/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, otp }),
      });
      const data = await res.json();
      if (data.valid) {
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

  // FINAL SUBMIT: send to Node backend + MySQL
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

    photoFiles.forEach((file) => {
      formData.append("photos", file); // must be "photos" to match backend
    });

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

    // reset form + go home
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
    <main className="py-5">
      <Container style={{ maxWidth: "720px" }}>
        <h2 className="text-center mb-4">Report a Community Issue</h2>

        <p className="text-center text-success fw-semibold">
          Step {step} of 3
        </p>

        <Row className="text-center mb-4">
          <Col>
            <div
              className={
                step === 1 ? "fw-semibold text-success" : "text-muted"
              }
            >
              User Details
            </div>
          </Col>
          <Col>
            <div
              className={
                step === 2 ? "fw-semibold text-success" : "text-muted"
              }
            >
              Problem Details
            </div>
          </Col>
          <Col>
            <div
              className={
                step === 3 ? "fw-semibold text-success" : "text-muted"
              }
            >
              Location &amp; Photo
            </div>
          </Col>
        </Row>

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
      </Container>
    </main>
  );
}

export default ReportIssuePage;
