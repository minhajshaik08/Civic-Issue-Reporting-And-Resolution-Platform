import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";

function RequireAuth({ allowedRoles }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    // ✅ READ JWT TOKEN + USER (with small delay to ensure localStorage is ready)
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = storedUser.role ? String(storedUser.role).toLowerCase() : "";

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole("");
    }
    
    setIsLoading(false);
  }, []);

  // Still loading - show spinner
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

  // not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  // logged in but role not allowed for this area
  if (allowedRoles && !allowedRoles.includes(role)) {
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

  // allowed → render nested routes
  return <Outlet />;
}

export default RequireAuth;
