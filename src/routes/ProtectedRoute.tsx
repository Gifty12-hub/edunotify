import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { User } from "../types/auth";

interface ProtectedRouteProps {
  /** If set, only these roles may see the routes inside. Others go to the dashboard. */
  roles?: User["role"][];
}

/**
 * Gate for every authenticated route. Not logged in means back to /login.
 * With `roles`, a logged in user with the wrong role goes to /dashboard,
 * so a parent can never open the staff pages.
 */
export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
