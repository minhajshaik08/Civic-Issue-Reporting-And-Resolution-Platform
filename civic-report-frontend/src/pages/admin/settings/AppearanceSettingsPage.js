// src/pages/admin/settings/AppearanceSettingsPage.jsx
import React, { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

function AppearanceSettingsPage() {
  // ✅ logged-in user (use "user" because your login page stores as "user")
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const userKey =
    storedUser.username || storedUser.email || storedUser.id || "guest";

  // ✅ read theme for this user
  const initialTheme =
    (userKey && localStorage.getItem(`theme_${userKey}`)) || "light";

  const [theme, setTheme] = useState(initialTheme);
  const [pendingTheme, setPendingTheme] = useState(initialTheme);

  // ✅ apply theme to body + save theme per user
  useEffect(() => {
    document.body.dataset.theme = theme;
    if (userKey) {
      localStorage.setItem(`theme_${userKey}`, theme);
    }
  }, [theme, userKey]);

  const handleApply = () => {
    setTheme(pendingTheme);
  };

  return (
    <>
      {/* ✅ CSS inside SAME file */}
      <style>{`
        .appearance-page {
          background: #f6fbfb;
          min-height: 100vh;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .appearance-card {
          width: 100%;
          max-width: 520px;
          border: none;
          border-radius: 16px;
          background: #fff;
          padding: 22px;
          box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.08);
        }

        .appearance-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 4px;
        }

        .appearance-subtitle {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .form-label {
          font-weight: 800;
          color: #111827;
          font-size: 14px;
        }

        .form-select {
          border-radius: 12px;
          padding: 10px;
          font-weight: 600;
        }

        .form-select:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
        }

        .apply-btn {
          border-radius: 12px !important;
          font-weight: 800 !important;
          padding: 10px 12px !important;
        }

        .theme-info {
          margin-top: 14px;
          padding: 10px 12px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #111827;
          font-size: 13px;
          font-weight: 600;
        }

        .theme-value {
          font-weight: 900;
          color: #2563eb;
        }
      `}</style>

      <div className="appearance-page">
        <Card className="appearance-card">
          <div className="appearance-title">Appearance</div>
          <div className="appearance-subtitle">
            Change theme for your admin dashboard.
          </div>

          <Form>
            <Form.Group>
              <Form.Label>Theme</Form.Label>
              <Form.Select
                value={pendingTheme}
                onChange={(e) => setPendingTheme(e.target.value)}
              >
                <option value="light">Light mode</option>
                <option value="extra-dark">Extra dark mode</option>
              </Form.Select>
            </Form.Group>

            <Button
              className="mt-3 apply-btn w-100"
              variant="success"
              onClick={handleApply}
              disabled={pendingTheme === theme}
            >
              {pendingTheme === theme ? "Theme Applied ✅" : "Apply Theme"}
            </Button>
          </Form>

          <div className="theme-info">
            Current theme: <span className="theme-value">{theme}</span>
            <br />
            This preference is saved for your account.
          </div>
        </Card>
      </div>
    </>
  );
}

export default AppearanceSettingsPage;
