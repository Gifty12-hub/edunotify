import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, FileUp, MessageCircle, Users, BookOpenCheck, AlertTriangle } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import { getStats } from "../lib/api";
import type { StatsResponse } from "../types/api";
import { useAuth } from "../context/useAuth";
import ParentDashboard from "./ParentDashboard";

interface LoginNavState {
  justLoggedIn?: boolean;
}

const statusDot = { sent: "bg-sage", failed: "bg-clay", pending: "bg-gold" };

/** Staff see the school overview. Parents see their own children. */
export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === "parent" ? <ParentDashboard /> : <SchoolDashboard />;
}

/** School dashboard. Every number comes from GET /api/stats. */
function SchoolDashboard() {
  const location = useLocation();
  const state = location.state as LoginNavState | null;
  const { data, loading, isError, errMessage, request } = useApiRequest<StatsResponse>();

  useEffect(() => {
    request(() => getStats());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    { label: "Students", value: data?.students, detail: `${data?.parents ?? 0} parents on file`, icon: Users, tone: "bg-indigo/10 text-indigo" },
    { label: "Scores recorded", value: data?.resultsRecorded, detail: "Across all classes", icon: BookOpenCheck, tone: "bg-gold/20 text-[#b85f12]" },
    { label: "Messages delivered", value: data?.notifications.sent, detail: data ? `SMS ${data.sentByChannel.sms} · WhatsApp ${data.sentByChannel.whatsapp} · Email ${data.sentByChannel.email}` : "", icon: MessageCircle, tone: "bg-sage/15 text-sage" },
    { label: "Failed messages", value: data?.notifications.failed, detail: "Check the Notifications page", icon: AlertTriangle, tone: "bg-clay/10 text-clay" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {state?.justLoggedIn && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-sage/30 bg-sage/10 px-4 py-3 text-sm text-sage">
          <CheckCircle2 size={17} />
          Welcome back. Your school workspace is ready.
        </div>
      )}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-3xl font-800 tracking-[-0.02em] text-indigo">Overview</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
            Keep families close to the learning happening in your classrooms.
          </p>
        </div>
        <Link to="/dashboard/results" className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-indigo-light">
          <FileUp size={17} /> Upload results
        </Link>
      </div>

      {loading && <p className="mt-6 text-sm text-ink/50">Loading…</p>}
      {isError && <p className="mt-6 text-sm text-clay">Couldn't load your numbers: {errMessage}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-line bg-white p-5 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon size={18} /></span>
            <p className="mt-5 text-2xl font-800 text-indigo">{value ?? 0}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
            <p className="mt-1 text-xs text-ink/50">{detail}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-700 text-indigo">Recent activity</h2>
          <Link to="/dashboard/notifications" className="text-sm font-semibold text-indigo hover:text-indigo-light">See all</Link>
        </div>
        <div className="mt-5 divide-y divide-line">
          {(data?.recent ?? []).length === 0 && <p className="text-sm text-ink/50">No messages sent yet.</p>}
          {(data?.recent ?? []).map((n) => (
            <div key={n._id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${statusDot[n.status]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{n.student?.fullName ?? "Student"} · {n.channel}</p>
                <p className="mt-1 line-clamp-1 text-xs text-ink/55">{n.message}</p>
              </div>
              <span className="shrink-0 text-xs text-ink/40">{new Date(n.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
