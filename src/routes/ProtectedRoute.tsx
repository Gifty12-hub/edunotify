import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Gate for every authenticated route. This is the compulsory condition:
 * if the user isn't logged in, they're redirected to /login instead of
 * seeing the protected page. Once logged in, <Outlet /> renders whatever
 * protected route matched (wrapped in AuthLayout).
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}