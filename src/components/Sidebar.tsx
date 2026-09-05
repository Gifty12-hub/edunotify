import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import { LayoutDashboard, LogOut, BellRing } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [{ to: "/dashboard", label: "Overview", icon: LayoutDashboard }];

export default function Sidebar() {
  const { logout } = useAuth();

  const linkClass = ({ isActive }: NavLinkRenderProps) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-indigo text-ivory" : "text-ink/65 hover:bg-white"
    }`;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-ivory px-4 py-6">
      <div className="flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo text-gold">
          <BellRing size={18} strokeWidth={2.25} />
        </span>
        <span className="font-display text-lg font-700 text-indigo">EduNotify</span>
      </div>

      {/* Add more links here as dashboard pages are built, e.g. Students, Settings */}
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={linkClass}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-clay transition-colors hover:bg-white"
      >
        <LogOut size={17} />
        Log out
      </button>
    </aside>
  );
}