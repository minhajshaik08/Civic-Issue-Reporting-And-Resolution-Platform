require('dotenv').config(); // ✅ LOAD .env FIRST
console.log('✅ JWT_SECRET loaded:', !!process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ CRITICAL: STATIC FILES MUST BE FIRST (before any API routes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * AUTH / LOGIN APIs
 */
const loginRoutes = require("./routes/login");
app.use("/api/login", loginRoutes);
// Add this line with other routes (around line 20-30)
const phoneOtpRoutes = require('./routes/auth/phoneOtp');
app.use('/api/auth', phoneOtpRoutes);


/**
 * CONTACT FORM
 */
const contactPageRoutes = require("./routes/contact/contactpage");
app.use("/api/contact", contactPageRoutes);

/**
 * MIDDLE ADMIN ROUTES
 */
const middleAdminsRouter = require("./routes/admin/middleadmins/middleAdmins");
const viewMiddleAdminsListRouter = require("./routes/admin/middleadmins/viewMiddleAdminsList");
const editMiddleAdminRouter = require("./routes/admin/middleadmins/editMiddleAdmin");
const blockDeleteMiddleAdminRouter = require("./routes/admin/middleadmins/blockDeleteMiddleAdmin");

app.use("/api/admin/middle-admins", middleAdminsRouter);
app.use("/api/admin/middle-admins", viewMiddleAdminsListRouter);
app.use("/api/admin/middle-admins", editMiddleAdminRouter);
app.use("/api/admin/middle-admins", blockDeleteMiddleAdminRouter);

/**
 * OFFICER ROUTES (Admin side)
 */
const addOfficerRouter = require("./routes/admin/officers/addOfficer");
const listOfficersRouter = require("./routes/admin/officers/listOfficers");
const manageOfficersRouter = require("./routes/admin/officers/manageOfficers");
const editOfficerRouter = require("./routes/admin/officers/editOfficer");

app.use("/api/admin/officers", addOfficerRouter);
app.use("/api/admin/officers", listOfficersRouter);
app.use("/api/admin/officers", manageOfficersRouter);
app.use("/api/admin/officers", editOfficerRouter);

/**
 * USER ROUTES
 */
const listUsersRouter = require("./routes/admin/users/listUsers");
const blockUsersRouter = require("./routes/admin/users/blockUsers");

app.use("/api/admin/users", listUsersRouter);
app.use("/api/admin/users", blockUsersRouter);

/**
 * ISSUE ROUTES
 */
const adminIssuesRoutes = require("./routes/admin/issues/issueslist");
const issuesRouter = require("./routes/admin/issues/issuesDetails");

app.use("/api/admin/issues", adminIssuesRoutes);
app.use("/api/admin/issues", issuesRouter);

/**
 * CITIZEN REPORT ROUTES
 */
const reportIssuesRoutes = require("./routes/reportIssues");
app.use("/api/issues", reportIssuesRoutes);

/**
 * REPORTS ROUTES
 */
const issuesReportRouter = require("./routes/admin/reports/issuesReport");
const issuesReportDownloadRouter = require("./routes/admin/reports/issuesReportDownload");
const topAreasReportRouter = require("./routes/admin/reports/topAreasReport");
const areaDetailsReportRouter = require("./routes/admin/reports/areaDetailsReport");
const officerPerformanceRouter = require("./routes/admin/reports/officerPerformance");

app.use("/api/admin/reports/issues", issuesReportRouter);
app.use("/api/admin/reports/issues", issuesReportDownloadRouter);
app.use("/api/admin/reports/areas", topAreasReportRouter);
app.use("/api/admin/reports/areas", areaDetailsReportRouter);
app.use("/api/admin/reports/officers", officerPerformanceRouter);

/**
 * ✅ OFFICER GALLERY ROUTES
 */
const officerGalleryRoutes = require("./routes/officer/gallary/uploadimages");
app.use("/api/officer/gallary", officerGalleryRoutes);

/**
 * MIDDLE ADMIN - OFFICER ROUTES
 */
const middleAdminAddOfficer = require("./routes/middle-admin/officers/addOfficer");
const middleAdminEditOfficer = require("./routes/middle-admin/officers/editOfficer");
const maListOfficers = require("./routes/middle-admin/officers/listOfficers");
const maOfficerStatus = require("./routes/middle-admin/officers/officerStatus");

app.use("/api/middle-admin/officers", middleAdminAddOfficer);
app.use("/api/middle-admin/officers", middleAdminEditOfficer);
app.use("/api/middle-admin/officers", maListOfficers);
app.use("/api/middle-admin/officers", maOfficerStatus);

/**
 * MIDDLE ADMIN - USER ROUTES
 */
const maListUsers = require("./routes/middle-admin/users/listUsers");
const maBlockUser = require("./routes/middle-admin/users/blockUser");

app.use("/api/middle-admin/users", maListUsers);
app.use("/api/middle-admin/users", maBlockUser);

/**
 * MIDDLE ADMIN - ISSUE ROUTES
 */
const maIssuesList = require("./routes/middle-admin/issues/issueslist");
const maIssueDetails = require("./routes/middle-admin/issues/issuedetails");

app.use("/api/middle-admin/issues", maIssuesList);
app.use("/api/middle-admin/issues", maIssueDetails);

/**
 * MIDDLE ADMIN - REPORTS ROUTES
 */
const maAreaDetails = require("./routes/middle-admin/reports/areaDetails");
const maIssuesReport = require("./routes/middle-admin/reports/issuesreport");
const maIssuesDownload = require("./routes/middle-admin/reports/issuesDownload");
const maOfficerPerformance = require("./routes/middle-admin/reports/officerPerformance");
const maAreasReport = require("./routes/middle-admin/reports/topareasreport");

app.use("/api/middle-admin/reports/areas", maAreaDetails);
app.use("/api/middle-admin/reports/issues", maIssuesReport);
app.use("/api/middle-admin/reports/issues", maIssuesDownload);
app.use("/api/middle-admin/reports/officers", maOfficerPerformance);
app.use("/api/middle-admin/reports/areas", maAreasReport);

/**
 * OFFICER - ISSUES & REPORTS
 */
const officerIssuesRoutes = require("./routes/officer/issues/issueslist");
const officerUpdateStatusRoutes = require("./routes/officer/issues/updatestatus");
const officerIssueDetailsRoutes = require("./routes/officer/issues/issuedetails");

app.use("/api/officer/issues", officerIssuesRoutes);
app.use("/api/officer/issues", officerUpdateStatusRoutes);
app.use("/api/officer/issues", officerIssueDetailsRoutes);

const officerIssuesReportsRouter = require("./routes/officer/reports/officerIssuesReports");
const officerIssuesReportsDownloadRouter = require("./routes/officer/reports/officerIssuesReportsDownload");

app.use("/api/officer/reports", officerIssuesReportsRouter);
app.use("/api/officer/reports", officerIssuesReportsDownloadRouter);

/**
 * ✅ JWT AUTH MIDDLEWARE - Test Protected Route
 */
const { authMiddleware } = require("./middleware/authMiddleware");
app.get("/api/test-auth", authMiddleware, (req, res) => {
  res.json({ success: true, message: "Token valid!", user: req.user });


});


const galleryRoutes = require('./routes/gallery/galleryRoutes');
// ...
app.use('/api/gallery', galleryRoutes);


/**
 * HEALTH CHECK
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Backend running at http://localhost:${PORT}`);
});
