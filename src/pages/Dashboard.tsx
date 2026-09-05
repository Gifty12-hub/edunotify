import { useLocation } from "react-router-dom";

interface LoginNavState {
  justLoggedIn?: boolean;
}

/**
 * Placeholder for the school dashboard — the authenticated area where
 * results get uploaded and delivery status gets tracked. This page exists
 * mainly to prove the authenticated-route pattern (ProtectedRoute +
 * AuthLayout + Sidebar) works end to end; the real dashboard UI is a
 * later build phase.
 */
export default function Dashboard() {
  const location = useLocation();
  const state = location.state as LoginNavState | null;

  return (
    <div>
      {state?.justLoggedIn && (
        <div className="mb-6 rounded-lg border border-sage/40 bg-sage/10 px-4 py-3 text-sm text-sage">
          Welcome back — you just logged in.
        </div>
      )}
      <h1 className="font-display text-2xl font-700 text-indigo">Welcome back</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/60">
        This is where a school administrator will upload results, publish
        announcements, and see notification delivery status once the
        backend is connected.
      </p>
    </div>
  );
}