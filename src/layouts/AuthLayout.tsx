import { Outlet } from "react-router-dom";
import Wrapper from "./Wrapper";
import Sidebar from "../components/Sidebar";

/**
 * Layout for every authenticated page (the school dashboard area).
 * Renders a persistent Sidebar and hands the routed page to <Outlet />.
 * Only reachable once ProtectedRoute (see src/routes) confirms the user
 * is logged in.
 */
export default function AuthLayout() {
  return (
    <Wrapper>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-ivory-deep p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </Wrapper>
  );
}