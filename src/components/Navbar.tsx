import { useState } from "react";
import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import { Menu, X, BellRing } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const linkClass = ({ isActive }: NavLinkRenderProps) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-indigo" : "text-ink/70 hover:text-indigo"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo text-gold">
            <BellRing size={18} strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-700 text-indigo">EduNotify</span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}

          {isAuthenticated && user ? (
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 rounded-full bg-indigo/10 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-indigo transition-colors hover:bg-indigo/15"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo text-xs font-700 text-ivory">
                {user.firstName[0]}
              </span>
              {user.firstName}
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-medium text-ink/70 transition-colors hover:text-indigo">
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-full bg-indigo px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-indigo-light"
              >
                Get started
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-indigo md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-line bg-ivory px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}

            {isAuthenticated && user ? (
              <NavLink
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-semibold text-indigo"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo text-xs font-700 text-ivory">
                  {user.firstName[0]}
                </span>
                {user.firstName}
              </NavLink>
            ) : (
              <>
                <NavLink to="/login" className="text-sm font-medium text-ink/70" onClick={() => setOpen(false)}>
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-full bg-indigo px-5 py-2.5 text-center text-sm font-semibold text-ivory"
                  onClick={() => setOpen(false)}
                >
                  Get started
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}