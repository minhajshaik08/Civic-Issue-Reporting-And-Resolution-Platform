const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// Gmail that sends AND receives the email
const EMAIL_USER = "civicreport.resolutionplatform@gmail.com";
// App password from Google (no spaces)
const EMAIL_PASS = "ahfstukpwqnlgsov";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Removed console.log so form data is NOT shown in backend logs
    // console.log("CONTACT BODY:", req.body);

    const info = await transporter.sendMail({
      from: `"Civic Report Contact" <${EMAIL_USER}>`,
      to: "civicreport.resolutionplatform@gmail.com", // receive here
      subject: `Civic Report Contact: ${subject}`,     // email subject line
      text: `Subject: ${subject}
From: ${name}
Email: ${email}

Message:
${message}`,
    });

    // Also remove this if you don't want to see email IDs in logs
    // console.log("EMAIL SENT:", info.messageId);

    res.json({ success: true, message: "Email sent" });
  } catch (err) {
    // Keep error log (useful if something breaks)
    console.error("Contact email error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;
