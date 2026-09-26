import { useState } from "react";
import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import { Menu, X, BellRing } from "lucide-react";
import { useAuth } from "../context/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const linkClass = ({ isActive }: NavLinkRenderProps) =>
    `relative text-sm font-medium transition-colors ${
      isActive
        ? "text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-gold"
        : "text-ivory/80 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1f4663] shadow-[0_8px_30px_rgba(31,70,99,0.15)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2b85c] text-[#183b57] shadow-sm">
            <BellRing size={18} strokeWidth={2.3} />
          </span>
          <span className="font-display text-lg font-700 tracking-tight text-white">EduNotify</span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}

          {isAuthenticated && user ? (
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2b85c] text-xs font-700 text-[#183b57]">
                {user.fullName[0]}
              </span>
              {user.fullName.split(" ")[0]}
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-medium text-ivory/80 transition-colors hover:text-white">
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-full bg-[#f2b85c] px-5 py-2.5 text-sm font-semibold text-[#1f4663] transition-colors hover:bg-[#f7d087]"
              >
                Get started
              </NavLink>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#1f4663] px-6 pb-6 md:hidden">
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
                className="flex items-center gap-2 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f2b85c] text-xs font-700 text-[#183b57]">
                  {user.fullName[0]}
                </span>
                {user.fullName.split(" ")[0]}
              </NavLink>
            ) : (
              <>
                <NavLink to="/login" className="text-sm font-medium text-ivory/80" onClick={() => setOpen(false)}>
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-full bg-[#f2b85c] px-5 py-2.5 text-center text-sm font-semibold text-[#1f4663]"
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