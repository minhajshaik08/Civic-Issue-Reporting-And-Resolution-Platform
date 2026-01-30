import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";

function RequireAuth({ allowedRoles }) {

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

  const location = useLocation();

  useEffect(() => {

    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = storedUser.role
      ? String(storedUser.role).toLowerCase()
      : "";

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole("");
    }

    setIsLoading(false);

  }, [location.key]);   // 👈 reacts on back / forward also

  // loading
  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  /* ----------------------------------------
     PUBLIC ROUTES  (NO allowedRoles)
  ---------------------------------------- */
  if (!allowedRoles) {

    if (isAuthenticated && role) {

      if (role === "super_admin") {
        return <Navigate to="/admin/welcome" replace />;
      }

      if (role === "middle_admin") {
        return <Navigate to="/middle-admin/dashboard" replace />;
      }

      if (role === "officer") {
        return <Navigate to="/officer/dashboard" replace />;
      }
    }

    return <Outlet />;
  }

  /* ----------------------------------------
     PROTECTED ROUTES  (allowedRoles present)
  ---------------------------------------- */

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  if (!allowedRoles.includes(role)) {

    if (role === "super_admin") {
      return <Navigate to="/admin/welcome" replace />;
    }

    if (role === "middle_admin") {
      return <Navigate to="/middle-admin/dashboard" replace />;
    }

    if (role === "officer") {
      return <Navigate to="/officer/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export default RequireAuth;
