import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth({ allowedRoles }) {

  const location = useLocation();

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const role = storedUser?.role
    ? String(storedUser.role).toLowerCase()
    : "";

  const isAuthenticated = !!(token && role);

  const roleHome = (() => {
    if (role === "super_admin") return "/admin/welcome";
    if (role === "middle_admin") return "/middle-admin/dashboard";
    if (role === "officer") return "/officer/dashboard";
    return null;
  })();

  /* ------------------ PUBLIC ------------------ */
  if (!allowedRoles) {

    if (isAuthenticated && roleHome && location.pathname !== roleHome) {
      return <Navigate to={roleHome} replace />;
    }

    return <Outlet />;
  }

  /* ------------------ PROTECTED ------------------ */

  if (!isAuthenticated) {

    if (location.pathname !== "/Login") {
      return <Navigate to="/Login" replace state={{ from: location }} />;
    }

    return null;
  }

  if (!allowedRoles.includes(role)) {

    if (roleHome && location.pathname !== roleHome) {
      return <Navigate to={roleHome} replace />;
    }

    return null;
  }

  return <Outlet />;
}

export default RequireAuth;
