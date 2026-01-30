const express = require("express");
const router = express.Router();
const axios = require("axios");

const otpStore = new Map();

router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: "Invalid phone" });
    }

    // Generate OTP (6 digits)
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    
    // Store OTP
    otpStore.set(phone, otp);

    // Print OTP in terminal only when no SMS provider configured (development)
    if (!process.env.FAST2SMS_KEY) {
      console.log(`✅ Dev OTP for ${phone}: ${otp}`);
    }

    // Send real SMS (if Fast2SMS key exists)
    if (process.env.FAST2SMS_KEY) {
      await axios.post("https://www.fast2sms.in/sms", {
        authorization: process.env.FAST2SMS_KEY,
        sender_id: "CIVICX",
        message: `Your OTP is ${otp}. Valid for 10 minutes.`,
        numbers: phone
      });
      // Optionally log that an SMS request was sent (without OTP)
      console.log(`📱 SMS request sent to ${phone}`);
    }

    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore.get(phone) === otp) {
    otpStore.delete(phone);
    return res.json({ success: true, message: "OTP verified" });
  }

  res.status(400).json({ success: false, message: "Invalid OTP" });
});

module.exports = router;
