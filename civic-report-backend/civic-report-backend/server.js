const express = require("express");
const cors = require("cors");
const path = require("path");

// LOGIN / AUTH routes (multi-table login, signup, forgot, reset)
const loginRoutes = require("./routes/login");

// middle admin routes
const middleAdminsRouter = require("./routes/admin/middleadmins/middleAdmins");

// view middle admins list
const viewMiddleAdminsListRouter = require("./routes/admin/middleadmins/viewMiddleAdminsList");

// edit middle admin
const editMiddleAdminRouter = require("./routes/admin/middleadmins/editMiddleAdmin");

// block/delete middle admin
const blockDeleteMiddleAdminRouter = require("./routes/admin/middleadmins/blockDeleteMiddleAdmin");

// citizen report routes
const reportIssuesRoutes = require("./routes/reportIssues");

// Officer routes
const addOfficerRouter = require("./routes/admin/officers/addOfficer");
const listOfficersRouter = require("./routes/admin/officers/listOfficers");
const manageOfficersRouter = require("./routes/admin/officers/manageOfficers");
const editOfficerRouter = require("./routes/admin/officers/editOfficer");

// User routes
const listUsersRouter = require("./routes/admin/users/listUsers");
const blockUsersRouter = require("./routes/admin/users/blockUsers");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * AUTH / LOGIN APIs
 * Frontend calls:
 *   POST http://localhost:5000/api/login/login
 *   POST http://localhost:5000/api/login/forgot-password
 *   POST http://localhost:5000/api/login/reset-password
 */
app.use("/api/login", loginRoutes);

// middle admin APIs
// POST     /api/admin/middle-admins           -> add
// GET      /api/admin/middle-admins/list      -> view list
// PUT      /api/admin/middle-admins/edit/:id  -> edit
// PATCH    /api/admin/middle-admins/block/:id -> block/unblock
// DELETE   /api/admin/middle-admins/:id       -> delete
app.use("/api/admin/middle-admins", middleAdminsRouter);
app.use("/api/admin/middle-admins", viewMiddleAdminsListRouter);
app.use("/api/admin/middle-admins", editMiddleAdminRouter);
app.use("/api/admin/middle-admins", blockDeleteMiddleAdminRouter);

// Officer APIs
app.use("/api/admin/officers", addOfficerRouter);
app.use("/api/admin/officers", listOfficersRouter);
app.use("/api/admin/officers", manageOfficersRouter);
app.use("/api/admin/officers", editOfficerRouter);

// User APIs
app.use("/api/admin/users", listUsersRouter);
app.use("/api/admin/users", blockUsersRouter);

// citizen issue report APIs
app.use("/api/issues", reportIssuesRoutes);

// simple test API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
