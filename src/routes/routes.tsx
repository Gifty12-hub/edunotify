import type { ReactNode } from "react";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";

export interface AppRoute {
  path: string;
  element: ReactNode;
}

/**
 * Public pages. Anyone can view these, logged in or not. Rendered inside
 * UnauthLayout (Navbar + Footer). Add a new public page by adding one line
 * here; AppRoutes.tsx maps over this array so nothing else needs to change.
 */
export const publicRoutes: AppRoute[] = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
];

/**
 * Protected pages. Only reachable once ProtectedRoute confirms the user
 * is authenticated. Rendered inside AuthLayout (Sidebar). Add new
 * dashboard pages here as they're built.
 */
export const protectedRoutes: AppRoute[] = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/students", element: <Students /> },
];