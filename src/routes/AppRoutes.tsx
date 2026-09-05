import { Routes, Route } from "react-router-dom";
import UnauthLayout from "../layouts/UnauthLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import { publicRoutes, protectedRoutes } from "./routes";
import NotFound from "../pages/NotFound";

/**
 * Single source of truth for how every route in the app is served.
 * - Public routes render inside UnauthLayout (Navbar + Footer).
 * - Protected routes sit behind ProtectedRoute (the auth condition) and
 *   render inside AuthLayout (Sidebar) only once the user is logged in.
 * Both groups are generated with .map() from routes.tsx, so adding a page
 * never means touching this file.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<UnauthLayout />}>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthLayout />}>
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}