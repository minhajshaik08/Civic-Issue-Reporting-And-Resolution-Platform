// src/pages/middle-admin/settings/MiddleAdminAppearanceSettingsPage.jsx
import React, { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

function MiddleAdminAppearanceSettingsPage() {
  // logged‑in user
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const userKey =
    storedUser.username || storedUser.email || storedUser.id || "guest";

  // read theme for this user
  const initialTheme =
    (userKey && localStorage.getItem(`theme_${userKey}`)) || "light";

  const [theme, setTheme] = useState(initialTheme);
  const [pendingTheme, setPendingTheme] = useState(initialTheme);

  // apply theme to <body> and save to localStorage for THIS user only
  useEffect(() => {
    document.body.dataset.theme = theme; // data-theme="light" or "extra-dark"
    if (userKey) {
      localStorage.setItem(`theme_${userKey}`, theme);
    }
  }, [theme, userKey]);

  const handleApply = () => {
    setTheme(pendingTheme);
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="mb-3">Appearance</h4>
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
          className="mt-3"
          variant="success"
          onClick={handleApply}
          disabled={pendingTheme === theme}
        >
          Change theme
        </Button>
      </Form>
      <p className="mt-3 text-muted">
        Current theme: <strong>{theme}</strong>. This preference is stored for
        your account.
      </p>
    </Card>
  );
}

export default MiddleAdminAppearanceSettingsPage;
