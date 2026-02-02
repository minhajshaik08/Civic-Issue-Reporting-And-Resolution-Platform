require("dotenv").config();
// Loads environment variables from .env file

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= GLOBAL MIDDLEWARE ================= */

app.use(cors()); 
// Enables CORS so frontend (React) can access backend APIs

app.use(express.json()); 
// Parses incoming JSON request bodies

/* ================= STATIC FILES ================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Serves uploaded images/files
// Example: http://localhost:5000/uploads/gallary/image.jpg

/* ================= AUTH / LOGIN ================= */

const loginRoutes = require("./routes/login");
app.use("/api/login", loginRoutes);
// Handles login, JWT generation, authentication

/* ================= OTP AUTH ================= */

const phoneOtpRoutes = require("./routes/auth/phoneOtp");
app.use("/api/auth", phoneOtpRoutes);
// Handles phone OTP verification APIs

/* ================= ADMIN DASHBOARD ================= */

const dashboardRoute = require("./routes/admin/dashboard");
app.use("/api/admin/dashboard", dashboardRoute);
// Admin dashboard statistics & summary APIs

/* ================= CONTACT FORM ================= */

const contactPageRoutes = require("./routes/contact/contactpage");
app.use("/api/contact", contactPageRoutes);
// Public contact-us form submission APIs

/* ================= ADMIN → MIDDLE ADMINS ================= */

const middleAdminsRouter = require("./routes/admin/middleadmins/middleAdmins");
const viewMiddleAdminsListRouter = require("./routes/admin/middleadmins/viewMiddleAdminsList");
const editMiddleAdminRouter = require("./routes/admin/middleadmins/editMiddleAdmin");
const blockDeleteMiddleAdminRouter = require("./routes/admin/middleadmins/blockDeleteMiddleAdmin");

app.use("/api/admin/middle-admins", middleAdminsRouter);
// Create middle admins

app.use("/api/admin/middle-admins", viewMiddleAdminsListRouter);
// View middle admin list

app.use("/api/admin/middle-admins", editMiddleAdminRouter);
// Edit middle admin details

app.use("/api/admin/middle-admins", blockDeleteMiddleAdminRouter);
// Block or delete middle admins

/* ================= ADMIN → OFFICERS ================= */

const addOfficerRouter = require("./routes/admin/officers/addOfficer");
const listOfficersRouter = require("./routes/admin/officers/listOfficers");
const manageOfficersRouter = require("./routes/admin/officers/manageOfficers");
const editOfficerRouter = require("./routes/admin/officers/editOfficer");

app.use("/api/admin/officers", addOfficerRouter);
// Add new officers

app.use("/api/admin/officers", listOfficersRouter);
// List all officers

app.use("/api/admin/officers", manageOfficersRouter);
// Activate / deactivate / manage officers

app.use("/api/admin/officers", editOfficerRouter);
// Edit officer details

/* ================= ADMIN → USERS ================= */

const listUsersRouter = require("./routes/admin/users/listUsers");
const blockUsersRouter = require("./routes/admin/users/blockUsers");

app.use("/api/admin/users", listUsersRouter);
// List all users

app.use("/api/admin/users", blockUsersRouter);
// Block or unblock users

/* ================= ADMIN → ISSUES ================= */

const adminIssuesRoutes = require("./routes/admin/issues/issueslist");
const issuesRouter = require("./routes/admin/issues/issuesDetails");

app.use("/api/admin/issues", adminIssuesRoutes);
// List reported issues

app.use("/api/admin/issues", issuesRouter);
// View issue details

/* ================= CITIZEN ISSUE REPORT ================= */

const reportIssuesRoutes = require("./routes/reportIssues");
app.use("/api/issues", reportIssuesRoutes);
// Citizens report civic issues

/* ================= ADMIN → REPORTS ================= */

const issuesReportRouter = require("./routes/admin/reports/issuesReport");
const issuesReportDownloadRouter = require("./routes/admin/reports/issuesReportDownload");
const topAreasReportRouter = require("./routes/admin/reports/topAreasReport");
const areaDetailsReportRouter = require("./routes/admin/reports/areaDetailsReport");
const officerPerformanceRouter = require("./routes/admin/reports/officerPerformance");

app.use("/api/admin/reports/issues", issuesReportRouter);
// Issues summary report

app.use("/api/admin/reports/issues", issuesReportDownloadRouter);
// Download issues report

app.use("/api/admin/reports/areas", topAreasReportRouter);
// Top affected areas report

app.use("/api/admin/reports/areas", areaDetailsReportRouter);
// Area-wise issue details

app.use("/api/admin/reports/officers", officerPerformanceRouter);
// Officer performance report

/* ================= ADMIN SETTINGS ================= */

const profileSettingsRoutes = require("./routes/admin/settings/Profilesettingpage");
app.use("/api/admin/settings/profile", profileSettingsRoutes);
// Admin profile settings

const securityRoutes = require("./routes/admin/settings/SecuritySettingsPage");
app.use("/api/admin/settings", securityRoutes);
// Admin security settings (password, etc.)

/* ================= MIDDLE ADMIN DASHBOARD ================= */

const middleAdminDashboardRoutes = require("./routes/middle-admin/dashboard");
app.use("/api/middle-admin/dashboard", middleAdminDashboardRoutes);
// Middle admin dashboard APIs

/* ================= MIDDLE ADMIN SETTINGS ================= */

const middleAdminProfileRoutes = require("./routes/middle-admin/settings/Middle_adminProfileSettingPage");
app.use("/api/middle-admin/settings/profile", middleAdminProfileRoutes);
// Middle admin profile settings

const middleAdminSecuritySettingsRoute = require("./routes/middle-admin/settings/Middle_adminSecuritySettingsPage");
app.use("/api/middle-admin/settings", middleAdminSecuritySettingsRoute);
// Middle admin security settings

/* ================= OFFICER SETTINGS ================= */

const officerProfileRoutes = require("./routes/officer/settings/Officerprofile");
app.use("/api/officer/settings/profile", officerProfileRoutes);
// Officer profile settings

const officerSecurityRoutes = require("./routes/officer/settings/Officersecurityseting");
app.use("/api/officer/settings", officerSecurityRoutes);
// Officer security settings

/* ================= OFFICER GALLERY ================= */

const officerGalleryRoutes = require("./routes/officer/gallary/uploadimages");
app.use("/api/officer/gallary", officerGalleryRoutes);
// Officer gallery: upload, list, delete (PRIVATE)

/* ================= PUBLIC GALLERY ================= */

const publicGalleryRoutes = require("./routes/gallary/gallerypublic");
app.use("/api/gallary/public", publicGalleryRoutes);

// Public read-only gallery APIs

/* ================= MIDDLE ADMIN → OFFICERS ================= */

const middleAdminAddOfficer = require("./routes/middle-admin/officers/addOfficer");
const middleAdminEditOfficer = require("./routes/middle-admin/officers/editOfficer");
const maListOfficers = require("./routes/middle-admin/officers/listOfficers");
const maOfficerStatus = require("./routes/middle-admin/officers/officerStatus");

app.use("/api/middle-admin/officers", middleAdminAddOfficer);
// Middle admin adds officers

app.use("/api/middle-admin/officers", middleAdminEditOfficer);
// Middle admin edits officer details

app.use("/api/middle-admin/officers", maListOfficers);
// Middle admin lists officers

app.use("/api/middle-admin/officers", maOfficerStatus);
// Middle admin changes officer status

/* ================= MIDDLE ADMIN → USERS ================= */

const maListUsers = require("./routes/middle-admin/users/listUsers");
const maBlockUser = require("./routes/middle-admin/users/blockUser");

app.use("/api/middle-admin/users", maListUsers);
// Middle admin list users

app.use("/api/middle-admin/users", maBlockUser);
// Middle admin block users

/* ================= MIDDLE ADMIN → ISSUES ================= */

const maIssuesList = require("./routes/middle-admin/issues/issueslist");
const maIssueDetails = require("./routes/middle-admin/issues/issuedetails");

app.use("/api/middle-admin/issues", maIssuesList);
// Middle admin issue list

app.use("/api/middle-admin/issues", maIssueDetails);
// Middle admin issue details

/* ================= MIDDLE ADMIN → REPORTS ================= */

const maAreaDetails = require("./routes/middle-admin/reports/areaDetails");
const maIssuesReport = require("./routes/middle-admin/reports/issuesreport");
const maIssuesDownload = require("./routes/middle-admin/reports/issuesDownload");
const maOfficerPerformance = require("./routes/middle-admin/reports/officerPerformance");
const maAreasReport = require("./routes/middle-admin/reports/topareasreport");

app.use("/api/middle-admin/reports/areas", maAreaDetails);
// Middle admin area details report

app.use("/api/middle-admin/reports/issues", maIssuesReport);
// Middle admin issues report

app.use("/api/middle-admin/reports/issues", maIssuesDownload);
// Middle admin download issues report

app.use("/api/middle-admin/reports/officers", maOfficerPerformance);
// Middle admin officer performance report

app.use("/api/middle-admin/reports/areas", maAreasReport);
// Middle admin top areas report

/* ================= OFFICER → ISSUES & REPORTS ================= */

const officerIssuesRoutes = require("./routes/officer/issues/issueslist");
const officerUpdateStatusRoutes = require("./routes/officer/issues/updatestatus");
const officerIssueDetailsRoutes = require("./routes/officer/issues/issuedetails");

app.use("/api/officer/issues", officerIssuesRoutes);
// Officer issue list

app.use("/api/officer/issues", officerUpdateStatusRoutes);
// Officer update issue status

app.use("/api/officer/issues", officerIssueDetailsRoutes);
// Officer issue details

const officerIssuesReportsRouter = require("./routes/officer/reports/officerIssuesReports");
const officerIssuesReportsDownloadRouter = require("./routes/officer/reports/officerIssuesReportsDownload");

app.use("/api/officer/reports", officerIssuesReportsRouter);
// Officer issue reports

app.use("/api/officer/reports", officerIssuesReportsDownloadRouter);
// Officer download reports

/* ================= ERROR HANDLING MIDDLEWARE ================= */

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Global Error Handler (must be last)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error("Stack:", err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
