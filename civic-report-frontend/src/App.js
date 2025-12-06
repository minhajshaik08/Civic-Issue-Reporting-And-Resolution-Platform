// App.js
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import ReportIssuePage from "./pages/ReportIssue/ReportIssuePage";
import OfficerPage from "./pages/Officers/OfficerPage";
import AdminLoginPage from "./pages/Login/AdminLoginPage";
import AdminForgotPassword from "./pages/Login/AdminForgotPassword";
import AdminResetPassword from "./pages/Login/AdminResetPassword";
import WelcomePage from "./pages/admin/WelcomePage";
import ViewIssuePage from "./pages/ViewIssue/ViewIssuePage";

// Middle admin (managed by super admin)
import MiddleAdminpageoptions from "./pages/admin/middleAdmins/MiddleAdminpageoptions";
import AddMiddleAdminForm from "./pages/admin/middleAdmins/AddMiddleAdminForm";
import ViewMiddleAdminsList from "./pages/admin/middleAdmins/ViewMiddleAdminsList";
import EditMiddleAdminForm from "./pages/admin/middleAdmins/EditMiddleAdminForm";
import EditMiddleAdminsList from "./pages/admin/middleAdmins/EditMiddleAdminsList";
import DeleteBlockUnblockMiddleAdmins from "./pages/admin/middleAdmins/DeleteBlockUnblockMiddleAdmins";

// Officers
import OfficerOptionsPage from "./pages/admin/officers/OfficerOptionsPage";
import AddOfficerForm from "./pages/admin/officers/AddOfficerForm";
import OfficerListPage from "./pages/admin/officers/OfficerListPage";
import ManageOfficersPage from "./pages/admin/officers/ManageOfficersPage";
import OfficerListEdit from "./pages/admin/officers/OfficerListEdit";
import EditOfficerForm from "./pages/admin/officers/EditOfficerForm";

// Users
import UserOptionsPage from "./pages/admin/users/UserOptionsPage";
import UserListPage from "./pages/admin/users/UserListPage";
import ManageUsersPage from "./pages/admin/users/ManageUsersPage";
import UserActivityPage from "./pages/admin/users/UserActivityPage";

// Middle admin own dashboard
import MiddleAdminWelcomePage from "./pages/middle-admin/MiddleAdminWelcomePage";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section id="home" className="hero-wrapper">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="hero-title">
                Report Issues. Get Them Resolved. Build a Cleaner, Greener City
                Together.
              </h1>
              <p className="hero-subtitle">
                A smart platform that connects citizens and authorities to
                resolve civic problems like potholes, garbage, drainage, and
                streetlights with real-time updates and full transparency.
              </p>
              <div className="d-flex gap-3 mt-3 flex-wrap">
                <Button
                  size="lg"
                  variant="success"
                  onClick={() => navigate("/report")}
                >
                  Report an Issue Now
                </Button>
                <Button
                  size="lg"
                  variant="outline-secondary"
                  onClick={() => navigate("/view-issues")}
                >
                  View Reported Issues
                </Button>
              </div>
            </Col>

            <Col md={5} className="mt-4 mt-md-0">
              <div className="feature-card text-center">
                <h4 className="mb-3">
                  24/7 System Available. 100% Secure &amp; Private. Real‑Time
                  Status Updates.
                </h4>
                <p className="mb-0 text-muted">
                  Citizens can report any civic issue anytime and track the
                  status from submission to resolution with complete
                  transparency.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-wrapper" id="how">
        <Container>
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
              },
              {
                step: "02",
                title: "Stored in System",
                text:
                  "Issue is recorded in a centralized database for tracking and management.",
              },
              {
                step: "03",
                title: "Authorities Take Action",
                text:
                  "Concerned department is automatically notified and assigned the issue.",
              },
              {
                step: "04",
                title: "Track & Resolve",
                text:
                  "Citizen receives real-time updates until the issue is completely resolved.",
              },
            ].map((item) => (
              <Col md={3} sm={6} key={item.step}>
                <div className="feature-card text-center">
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
      <section className="section-wrapper" id="about">
        <Container>
          <h2 className="section-title">About Our Mission</h2>
          <p className="section-subtitle">
            Our Civic Issue Reporting &amp; Resolution System is designed to
            promote clean and green cities by enabling citizens to report
            problems online and helping authorities resolve them efficiently.
          </p>
          <Row className="g-4">
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
      <section className="section-wrapper">
        <Container>
          <h2 className="section-title">Why This Matters</h2>
          <p className="section-subtitle">
            A clean and well-managed city is every citizen&apos;s right. This
            platform reduces the gap between people and government by creating a
            transparent and efficient complaint resolution process.
          </p>
          <Row className="g-4">
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

      {/* POWERFUL FEATURES */}
      <section className="section-wrapper" id="features">
        <Container>
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to report, track, and resolve civic issues
            efficiently and transparently.
          </p>
          <Row className="g-4">
            {[
              "Simple Reporting Form",
              "Location & Photo Submissions",
              "Real-Time Status Tracking",
              "Admin Dashboard",
              "Smart Notifications",
              "Secure & Reliable",
            ].map((title) => (
              <Col md={4} sm={6} key={title}>
                <div className="feature-card">
                  <h5>{title}</h5>
                  <p className="mb-0 text-muted">
                    Short description about how this feature helps citizens and
                    authorities work better.
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* LIVE STATISTICS + QUOTE */}
      <section className="section-wrapper" id="stats">
        <Container>
          <h2 className="section-title">Live Statistics</h2>
          <p className="section-subtitle">
            Real-time data showing the impact of our civic reporting system in
            building a better community.
          </p>
          <Row className="g-4 mb-4">
            {[
              { value: "120", label: "Total Issues Reported" },
              { value: "85", label: "Issues Resolved" },
              { value: "25", label: "Issues In Progress" },
              { value: "10", label: "Pending Issues" },
            ].map((item) => (
              <Col md={3} sm={6} key={item.label}>
                <div className="stat-card">
                  <h3>{item.value}</h3>
                  <p className="mb-0">{item.label}</p>
                </div>
              </Col>
            ))}
          </Row>

          <div
            className="feature-card text-center"
            style={{
              background: "linear-gradient(90deg,#059669,#16a34a)",
              color: "#ffffff",
            }}
          >
            <h4 className="mb-2">
              When citizens and government work together transparently,
              extraordinary things happen for our communities.
            </h4>
            <p className="mb-0">Join thousands of citizens making a difference.</p>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <Container>
          <Row className="gy-4">
            <Col md={4}>
              <h5>Civic Report</h5>
              <p className="mb-2">
                Building cleaner, greener cities through transparent civic issue
                reporting and resolution.
              </p>
              <Button size="small" variant="warning">
                Learn More
              </Button>
            </Col>
            <Col md={4}>
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li>Home</li>
                <li>Report Issue</li>
                <li>View Issues</li>
                <li>About</li>
              </ul>
            </Col>
            <Col md={4}>
              <h6>Contact Information</h6>
              <p className="mb-1">Municipal Office, City Hall</p>
              <p className="mb-1">support@civicreport.com</p>
              <p className="mb-0">+91-1234567890</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Civic Report
          </Link>

          <div className="collapse navbar-collapse">
            {/* Left nav links */}
            <div className="navbar-nav me-auto">
              <Link to="/gallery" className="nav-link">
                Gallery
              </Link>
              <Link to="/report" className="nav-link">
                Report Issue
              </Link>
              <Link to="/view-issues" className="nav-link">
                View Issues
              </Link>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </div>

            {/* Right side Officer / Admin buttons */}
            <div className="d-flex gap-2">
              <Link
                to="/officer"
                className="btn btn-sm"
                style={{
                  backgroundColor: "#e6f9ec",
                  borderColor: "#22c55e",
                  color: "#15803d",
                  fontWeight: 600,
                }}
              >
                Officer
              </Link>
              <Link
                to="/Login"
                className="btn btn-sm"
                style={{
                  backgroundColor: "#e6f9ec",
                  borderColor: "#22c55e",
                  color: "#15803d",
                  fontWeight: 600,
                }}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportIssuePage />} />
        <Route path="/officer" element={<OfficerPage />} />
        <Route path="/view-issues" element={<ViewIssuePage />} />

        {/* Login routes using /Login */}
        <Route path="/Login" element={<AdminLoginPage />} />
        <Route path="/Login/login" element={<AdminLoginPage />} />
        <Route path="/Login/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/Login/reset-password" element={<AdminResetPassword />} />

        {/* Middle admin own dashboard */}
        <Route
          path="/middle-admin/welcome"
          element={<MiddleAdminWelcomePage />}
        />

        {/* Admin dashboard with nested routes */}
        <Route path="/admin/welcome" element={<WelcomePage />}>
          <Route index element={<></>} />

          {/* Middle admin routes */}
          <Route path="middle-admins" element={<MiddleAdminpageoptions />} />
          <Route path="middle-admins/add" element={<AddMiddleAdminForm />} />
          <Route path="middle-admins/list" element={<ViewMiddleAdminsList />} />
          <Route path="middle-admins/edit" element={<EditMiddleAdminForm />} />
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
