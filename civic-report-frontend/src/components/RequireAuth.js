import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
  // ✅ READ JWT TOKEN + USER (not loggedInUser)
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const role = storedUser.role ? String(storedUser.role).toLowerCase() : "";

  // not logged in → go to login
  if (!token || !role) {
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
