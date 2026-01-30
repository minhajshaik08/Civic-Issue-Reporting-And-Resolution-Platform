// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";


import { Container, Row, Col, Button } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import "./utils/axiosConfig";
import HamburgerSidebar from "./components/HamburgerSidebar";

// 1) Public / common
import ReportIssuePage from "./pages/ReportIssue/ReportIssuePage";
import ViewIssuePage from "./pages/ViewIssue/ViewIssuePage";
import ContactPage from "./pages/contact/ContactPage";
import MainGalleryPage from "./pages/gallary/MainGalleryPage";

// Login routes
import AdminLoginPage from "./pages/Login/AdminLoginPage";
import AdminForgotPassword from "./pages/Login/AdminForgotPassword";
import AdminResetPassword from "./pages/Login/AdminResetPassword";

// 2) ADMIN (super admin)
// Admin main dashboard
import WelcomePage from "./pages/admin/WelcomePage";

// Admin: middle admins
import MiddleAdminpageoptions from "./pages/admin/middleAdmins/MiddleAdminpageoptions";
import AddMiddleAdminForm from "./pages/admin/middleAdmins/AddMiddleAdminForm";
import ViewMiddleAdminsList from "./pages/admin/middleAdmins/ViewMiddleAdminsList";
import EditMiddleAdminForm from "./pages/admin/middleAdmins/EditMiddleAdminForm";
import EditMiddleAdminsList from "./pages/admin/middleAdmins/EditMiddleAdminsList";
import DeleteBlockUnblockMiddleAdmins from "./pages/admin/middleAdmins/DeleteBlockUnblockMiddleAdmins";

// Admin: officers
import OfficerOptionsPage from "./pages/admin/officers/OfficerOptionsPage";
import AddOfficerForm from "./pages/admin/officers/AddOfficerForm";
import OfficerListPage from "./pages/admin/officers/OfficerListPage";
import ManageOfficersPage from "./pages/admin/officers/ManageOfficersPage";
import OfficerListEdit from "./pages/admin/officers/OfficerListEdit";
import EditOfficerForm from "./pages/admin/officers/EditOfficerForm";

// Admin: users
import UserOptionsPage from "./pages/admin/users/UserOptionsPage";
import UserListPage from "./pages/admin/users/UserListPage";
import ManageUsersPage from "./pages/admin/users/ManageUsersPage";
import UserActivityPage from "./pages/admin/users/UserActivityPage";

// Admin: issues
import Issuesoptions from "./pages/admin/issues/Issuesoptions";
import Issueslist from "./pages/admin/issues/Issueslist";
import IssueDetails from "./pages/admin/issues/IssueDetails";

// Admin: settings
import AdminSettingsPage from "./pages/admin/settings/AdminSettingsPage";
import ProfileSettingsPage from "./pages/admin/settings/ProfileSettingsPage";
import SecuritySettingsPage from "./pages/admin/settings/SecuritySettingsPage";
import AppearanceSettingsPage from "./pages/admin/settings/AppearanceSettingsPage";

// Admin: reports
import ReportsHomePage from "./pages/admin/reports/ReportsHomePage";
import IssuesReportPage from "./pages/admin/reports/IssuesReportPage";
import AreasReportPage from "./pages/admin/reports/AreasReportPage";
import AreaDetailsPage from "./pages/admin/reports/AreaDetailsPage";
import OfficerPerformancePage from "./pages/admin/reports/OfficerPerformancePage";

// Middle admin dashboard
import MiddleAdminDashboardPage from "./pages/middle-admin/MiddleAdminDashboard";

// middle-admin-officers
import MiddleAdminOfficerOptionsPage from "./pages/middle-admin/officers/MiddleAdminOfficerOptionsPage";
import MiddleAdminAddOfficerForm from "./pages/middle-admin/officers/MiddleAdminAddOfficerForm";
import MiddleAdminEditOfficerForm from "./pages/middle-admin/officers/MiddleAdminEditOfficerForm";
import MiddleAdminManageOfficersPage from "./pages/middle-admin/officers/MiddleAdminManageOfficersPage";
import MiddleAdminOfficerListEdit from "./pages/middle-admin/officers/MiddleAdminOfficerListEdit";
import MiddleAdminOfficerListPage from "./pages/middle-admin/officers/MiddleAdminOfficerListPage";

// m-a-users
import MiddleAdminUserOptionsPage from "./pages/middle-admin/users/MiddleAdminUserOptionsPage";
import MiddleAdminManageUsersPage from "./pages/middle-admin/users/MiddleAdminManageUsersPage";
import MiddleAdminUserActivityPage from "./pages/middle-admin/users/MiddleAdminUserActivityPage";
import MiddleAdminUserListPage from "./pages/middle-admin/users/MiddleAdminUserListPage";

// m-a-issues
import MiddleAdminIssuesOptions from "./pages/middle-admin/issues/MiddleAdminIssuesOptions";
import MiddleAdminIssueDetails from "./pages/middle-admin/issues/MiddleAdminIssueDetails";
import MiddleAdminIssuesList from "./pages/middle-admin/issues/MiddleAdminIssuesList";
import MiddleAdminAssignIssuesPage from "./pages/middle-admin/issues/MiddleAdminAssignIssuesPage";

// m-a-reports
import MiddleAdminReportsHomePage from "./pages/middle-admin/reports/MiddleAdminReportsHomePage";
import MiddleAdminAreaDetailsPage from "./pages/middle-admin/reports/MiddleAdminAreaDetailsPage";
import MiddleAdminAreasReportPage from "./pages/middle-admin/reports/MiddleAdminAreasReportPage";
import MiddleAdminIssuesReportPage from "./pages/middle-admin/reports/MiddleAdminIssuesReportPage";
import MiddleAdminOfficerPerformancePage from "./pages/middle-admin/reports/MiddleAdminOfficerPerformancePage";

// m-a-settings
import MiddleAdminSettingsPage from "./pages/middle-admin/settings/MiddleAdminSettingsPage";
import MiddleAdminAppearanceSettingsPage from "./pages/middle-admin/settings/MiddleAdminAppearanceSettingsPage";
import MiddleAdminProfileSettingsPage from "./pages/middle-admin/settings/MiddleAdminProfileSettingsPage";
import MiddleAdminSecuritySettingsPage from "./pages/middle-admin/settings/MiddleAdminSecuritySettingsPage";

// officer dashboard
import OfficerDashboardPage from "./pages/officer/OfficerDashboardPage";
import OfficerIssuesList from "./pages/officer/issues/OfficerIssuesList";
import OfficerIssueDetails from "./pages/officer/issues/OfficerIssueDetails";

import OfficerSettingsPage from "./pages/officer/settings/OfficerSettingsPage";
import OfficerProfileSettingsPage from "./pages/officer/settings/OfficerProfileSettingsPage";
import OfficerSecuritySettingsPage from "./pages/officer/settings/OfficerSecuritySettingsPage";
import OfficerAppearanceSettingsPage from "./pages/officer/settings/OfficerAppearanceSettingsPage";

import OfficerIssuesReportPage from "./pages/officer/reports/OfficerIssuesReportPage";

import GalleryOptionsPage from "./pages/officer/gallary/GalleryOptionsPage";
import GalleryListPage from "./pages/officer/gallary/GalleryListPage";
import OfficerGalleryUploadPage from "./pages/officer/gallary/OfficerGalleryUploadPage";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section className="hero-wrapper">
        <Container fluid className="px-3 px-md-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="hero-title">
                Report Issues. Get Them Resolved. Build a Cleaner, Greener City
                Together.
              </h1>
              <p className="hero-subtitle">
                A smart platform that connects citizens and authorities to
                resolve civic problems like potholes, garbage, drainage, and
                streetlights with real-time updates and full transparency. By
                improving communication between the public and civic bodies, the
                platform helps reduce response time and enhances the overall
                quality of urban services. It encourages active citizen
                participation and supports the development of cleaner, safer,
                and more sustainable cities.
              </p>
              <div className="hero-actions">
                <Button
                  size="lg"
                  className="hero-primary-btn"
                  onClick={() => navigate("/report")}
                >
                  Report an Issue
                </Button>
                <Button
                  size="lg"
                  className="hero-secondary-btn"
                  onClick={() => navigate("/view-issues")}
                >
                  View Reported Issues
                </Button>
              </div>
              {/* RIGHT HERO HIGHLIGHT moved below buttons to match layout */}
              <div className="hero-right-highlight d-flex align-items-start mt-3">
                <div className="hero-highlight-icon me-3">
                  <span>✅</span>
                </div>
                <div className="hero-highlight-content">
                  <h4 className="mb-2 hero-highlight-title">
                    24/7 System Available. 100% Secure &amp; Private. Real‑Time Updates.
                  </h4>
                  <ul className="hero-highlight-list mb-0">
                    <li>Citizens can report any civic issue anytime.</li>
                    <li>Receive updates and track issue status in real time.</li>
                  </ul>
                </div>
              </div>
            </Col>
            
          </Row>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-wrapper how-works-section" id="how">
        <Container fluid className="px-3 px-md-4">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Our streamlined process ensures your civic issues are handled
            efficiently from report to resolution.
          </p>
          <Row className="g-4">
            {[
              {
                step: "01",
                title: "Report an Issue",
                text:
                  "Submit details with description, photo, and location through our simple form.",
                icon: "📝",
              },
              {
                step: "02",
                title: "Stored in System",
                text:
                  "Issue is recorded in a centralized database for tracking and management.",
                icon: "🗄️",
              },
              {
                step: "03",
                title: "Authorities Take Action",
                text:
                  "Concerned department is automatically notified and assigned the issue.",
                icon: "👤",
              },
              {
                step: "04",
                title: "Track & Resolve",
                text:
                  "Citizen receives real-time updates until the issue is completely resolved.",
                icon: "✅",
              },
            ].map((item) => (
              <Col md={3} sm={6} key={item.step}>
                <div className="feature-card text-center">
                  <div className="feature-icon">{item.icon}</div>
                  <div className="fw-bold text-success mb-2">{item.step}</div>
                  <h5>{item.title}</h5>
                  <p className="mb-0 text-muted">{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ABOUT OUR MISSION */}
      <section className="section-wrapper about-mission-section" id="about">
        <Container fluid className="px-3 px-md-4">
          <h2 className="section-title">About Our Mission</h2>
          {/* subtitle moved here so it shows centered under heading */}
          <p className="section-subtitle">
            We empower citizens to build cleaner, safer, and stronger
            communities.
          </p>
          <Row className="g-5">
            {[
              {
                title: "Clean & Green",
                text:
                  "Promoting environmental sustainability through technology-driven civic solutions.",
              },
              {
                title: "Trust & Transparency",
                text:
                  "Building accountability between citizens and authorities with full transparency.",
              },
              {
                title: "Community Driven",
                text:
                  "Empowering citizens to actively participate in making their city better.",
              },
              {
                title: "Efficient Resolution",
                text:
                  "Streamlined processes ensure issues are resolved quickly and effectively.",
              },
            ].map((item) => (
              <Col md={3} sm={6} key={item.title}>
                <div className="feature-card">
                  <h5>{item.title}</h5>
                  <p className="mb-0 text-muted">{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* WHY THIS MATTERS */}
      <section className="section-wrapper why-matters-section">
        <Container fluid className="px-3 px-md-4">
          <h2 className="section-title">Why This Matters</h2>
          {/* keep single-line variant here */}
          <p className="section-subtitle-single">
            A clean and well-managed city is every citizen&apos;s right.
          </p>
          <Row className="g-5">
            {[
              {
                title: "Quality of Life",
                text:
                  "Cleaner streets, better infrastructure, and safer neighborhoods improve daily life.",
              },
              {
                title: "Good Governance",
                text:
                  "Transparent communication between citizens and authorities builds trust.",
              },
              {
                title: "Environmental Impact",
                text:
                  "Quick resolution of environmental issues contributes to greener cities.",
              },
              {
                title: "Community Unity",
                text:
                  "Citizens and authorities working together create stronger communities.",
              },
            ].map((item) => (
              <Col md={3} sm={6} key={item.title}>
                <div className="feature-card">
                  <h5>{item.title}</h5>
                  <p className="mb-0 text-muted">{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="footer-section" id="contact">
        <Container fluid className="px-3 px-md-4">
          <Row className="g-5">
            <Col md={4}>
              <h5>Civic Report</h5>
              <p className="mb-2">
                Building cleaner, greener cities through transparent civic
                issue reporting and resolution.
              </p>
              <Button size="sm" variant="warning" className="footer-btn">
                Learn More
              </Button>
            </Col>
            <Col md={4}>
              <h6>Quick Links</h6>
              <ul className="list-unstyled footer-links">
                <li>Home</li>
                <li>Report Issue</li>
                <li>View Issues</li>
                <li>About</li>
              </ul>
            </Col>
            <Col md={4}>
              <h6>Contact Information</h6>
              <p className="mb-1 footer-contact">Municipal Office, City Hall</p>
              <p className="mb-1 footer-contact">support@civicreport.com</p>
              <p className="mb-0 footer-contact">+91-1234567890</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

// RedirectIfAuth: wrap public pages to prevent authenticated users
// from reaching public routes via browser back/forward buttons.
function RedirectIfAuth({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = (user && user.role) || null;

    if (token && role) {
      const normalizedRole = String(role).toLowerCase();

      if (normalizedRole === "super_admin") {
        navigate("/admin/welcome", { replace: true });
      } else if (normalizedRole === "middle_admin") {
        navigate("/middle-admin/dashboard", { replace: true });
      } else if (normalizedRole === "officer") {
        navigate("/officer/dashboard", { replace: true });
      }
    }
    // run on location change so back/forward will trigger this
  }, [navigate, location.pathname]);

  return children;
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname || "";
  const hideNav =
    path.startsWith("/officer/dashboard") ||
    path.startsWith("/middle-admin/dashboard") ||
    path.startsWith("/admin/welcome");

  // Public site menu (used on home/contact/report/view/gallery)
  const publicMenuItems = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/gallery", label: "Gallery", icon: "🖼️" },
    { to: "/report", label: "Report Issue", icon: "📝" },
    { to: "/view-issues", label: "View Issues", icon: "📋" },
    { to: "/contact", label: "Contact", icon: "📞" },
    { to: "/Login", label: "Login", icon: "🔐" },
  ];

  return (
    <>
      {/* Horizontal navbar - Desktop only */}
      {!hideNav && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm custom-navbar d-none d-lg-block">
          <div className="container-fluid px-3 px-md-4">
            <Link to="/" className="navbar-brand custom-navbar-brand">
              Civic Report
            </Link>

            <div className="collapse navbar-collapse">
              {/* Left nav links */}
              <div className="navbar-nav me-auto custom-nav-links">
                <Link to="/gallery" className="nav-link custom-nav-link">
                  Gallery
                </Link>
                <Link to="/report" className="nav-link custom-nav-link">
                  Report Issue
                </Link>
                <Link to="/view-issues" className="nav-link custom-nav-link">
                  View Reported Issues
                </Link>
                <Link to="/contact" className="nav-link custom-nav-link">
                  Contact
                </Link>
              </div>

              {/* Right side - Only Login button */}
              <div className="d-flex gap-2 custom-login-buttons">
                <Link to="/Login" className="btn btn-sm custom-login-btn">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Hamburger sidebar - Mobile only */}
      {!hideNav && (
        <div className="d-lg-none">
          <HamburgerSidebar
            user={""}
            photoUrl={null}
            initial={"U"}
            menuItems={publicMenuItems}
            onLogout={() => {}}
            role={null}
          />
        </div>
      )}

      <Routes>
        {/* Public routes (wrapped to prevent access when authenticated) */}
        <Route
          path="/"
          element={
            <RedirectIfAuth>
              <HomePage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/report"
          element={
            <RedirectIfAuth>
              <ReportIssuePage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/view-issues"
          element={
            <RedirectIfAuth>
              <ViewIssuePage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/contact"
          element={
            <RedirectIfAuth>
              <ContactPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/gallery"
          element={
            <RedirectIfAuth>
              <MainGalleryPage />
            </RedirectIfAuth>
          }
        />

        {/* Login routes using /Login */}
        <Route path="/Login" element={<AdminLoginPage />} />
        <Route path="/Login/login" element={<AdminLoginPage />} />
        <Route path="/Login/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/Login/reset-password" element={<AdminResetPassword />} />

        {/* MIDDLE ADMIN DASHBOARD (protected) */}
        <Route element={<RequireAuth allowedRoles={["middle_admin"]} />}>
          <Route
            path="/middle-admin/dashboard"
            element={<MiddleAdminDashboardPage />}
          >
            <Route index element={<></>} />

            {/* officers */}
            <Route path="officers" element={<MiddleAdminOfficerOptionsPage />} />
            <Route path="officers/add" element={<MiddleAdminAddOfficerForm />} />
            <Route
              path="officers/edit"
              element={<MiddleAdminOfficerListEdit />}
            />
            <Route
              path="officers/editform"
              element={<MiddleAdminEditOfficerForm />}
            />
            <Route
              path="officers/manage"
              element={<MiddleAdminManageOfficersPage />}
            />
            <Route
              path="officers/list"
              element={<MiddleAdminOfficerListPage />}
            />

            {/* users */}
            <Route path="users" element={<MiddleAdminUserOptionsPage />} />
            <Route path="users/manage" element={<MiddleAdminManageUsersPage />} />
            <Route
              path="users/activity"
              element={<MiddleAdminUserActivityPage />}
            />
            <Route path="users/list" element={<MiddleAdminUserListPage />} />

            {/* issues */}
            <Route path="issues" element={<MiddleAdminIssuesOptions />} />
            <Route path="issues/:id" element={<MiddleAdminIssueDetails />} />
            <Route path="issues/list" element={<MiddleAdminIssuesList />} />
            <Route
              path="issues/assign"
              element={<MiddleAdminAssignIssuesPage />}
            />

            {/* reports */}
            <Route path="reports" element={<MiddleAdminReportsHomePage />} />
            <Route
              path="reports/areas/details"
              element={<MiddleAdminAreaDetailsPage />}
            />
            <Route
              path="reports/areas"
              element={<MiddleAdminAreasReportPage />}
            />
            <Route
              path="reports/issues"
              element={<MiddleAdminIssuesReportPage />}
            />
            <Route
              path="reports/officers/performance"
              element={<MiddleAdminOfficerPerformancePage />}
            />

            {/* settings */}
            <Route path="settings" element={<MiddleAdminSettingsPage />} />
            <Route
              path="settings/appearance"
              element={<MiddleAdminAppearanceSettingsPage />}
            />
            <Route
              path="settings/profile"
              element={<MiddleAdminProfileSettingsPage />}
            />
            <Route
              path="settings/security"
              element={<MiddleAdminSecuritySettingsPage />}
            />
          </Route>
        </Route>

        {/* OFFICER DASHBOARD (protected) */}
        <Route element={<RequireAuth allowedRoles={["officer"]} />}>
          <Route path="/officer/dashboard" element={<OfficerDashboardPage />}>
            <Route index element={<div>Officer dashboard home</div>} />
            <Route path="issues" element={<OfficerIssuesList />} />
            <Route path="issues/:id" element={<OfficerIssueDetails />} />
            <Route path="reports" element={<OfficerIssuesReportPage />} />

            {/* Settings main page with 3 cards */}
            <Route path="settings" element={<OfficerSettingsPage />} />

            {/* Separate pages, not children of OfficerSettingsPage */}
            <Route
              path="settings/profile"
              element={<OfficerProfileSettingsPage />}
            />
            <Route
              path="settings/security"
              element={<OfficerSecuritySettingsPage />}
            />
            <Route
              path="settings/appearance"
              element={<OfficerAppearanceSettingsPage />}
            />
            <Route path="gallery-upload" element={<GalleryOptionsPage />} />
            <Route path="gallery-upload/list" element={<GalleryListPage />} />
            <Route
              path="gallery-upload/new"
              element={<OfficerGalleryUploadPage />}
            />
          </Route>
        </Route>

        {/* ADMIN DASHBOARD (protected) */}
        <Route element={<RequireAuth allowedRoles={["super_admin"]} />}>
          <Route path="/admin/welcome" element={<WelcomePage />}>
            <Route index element={<></>} />

            {/* Issues routes */}
            <Route path="issues" element={<Issuesoptions />} />
            <Route path="issues/list" element={<Issueslist />} />
            <Route path="issues/:id" element={<IssueDetails />} />

            {/* Middle admin routes */}
            <Route path="middle-admins" element={<MiddleAdminpageoptions />} />
            <Route path="middle-admins/add" element={<AddMiddleAdminForm />} />
            <Route
              path="middle-admins/list"
              element={<ViewMiddleAdminsList />}
            />
            <Route
              path="middle-admins/edit"
              element={<EditMiddleAdminForm />}
            />
            <Route
              path="middle-admins/edit-list"
              element={<EditMiddleAdminsList />}
            />
            <Route
              path="middle-admins/manage"
              element={<DeleteBlockUnblockMiddleAdmins />}
            />

            {/* Officer routes */}
            <Route path="officers" element={<OfficerOptionsPage />} />
            <Route path="officers/add" element={<AddOfficerForm />} />
            <Route path="officers/list" element={<OfficerListPage />} />
            <Route path="officers/manage" element={<ManageOfficersPage />} />
            <Route path="officers/edit" element={<OfficerListEdit />} />
            <Route path="officers/editform" element={<EditOfficerForm />} />

            {/* User routes */}
            <Route path="users" element={<UserOptionsPage />} />
            <Route path="users/list" element={<UserListPage />} />
            <Route path="users/manage" element={<ManageUsersPage />} />
            <Route path="users/activity" element={<UserActivityPage />} />

            {/* Settings routes */}
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="settings/profile" element={<ProfileSettingsPage />} />
            <Route
              path="settings/security"
              element={<SecuritySettingsPage />}
            />
            <Route
              path="settings/appearance"
              element={<AppearanceSettingsPage />}
            />

            {/* Reports routes */}
            <Route path="reports" element={<ReportsHomePage />} />
            <Route path="reports/issues" element={<IssuesReportPage />} />
            <Route path="reports/areas" element={<AreasReportPage />} />
            <Route
              path="reports/areas/details"
              element={<AreaDetailsPage />}
            />
            <Route
              path="reports/officers/performance"
              element={<OfficerPerformancePage />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
