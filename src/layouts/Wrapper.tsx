import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Wrapper is the outermost layout every single page shares, public or
 * authenticated. Anything that truly applies everywhere lives here, e.g.
 * scrolling to the top on every route change, or (later) a global toast/
 * notification host. UnauthLayout and AuthLayout each wrap their own
 * Navbar/Footer or Sidebar around this.
 */
export default function Wrapper({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <div className="flex min-h-screen flex-col bg-ivory">{children}</div>;
}