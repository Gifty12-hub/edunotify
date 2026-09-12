import { useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  FileUp,
  GraduationCap,
  MessageCircle,
  Users,
} from "lucide-react";

interface LoginNavState {
  justLoggedIn?: boolean;
}

/**
 * Placeholder for the school dashboard, the authenticated area where
 * results get uploaded and delivery status gets tracked. This page exists
 * mainly to prove the authenticated-route pattern (ProtectedRoute +
 * AuthLayout + Sidebar) works end to end; the real dashboard UI is a
 * later build phase.
 */
export default function Dashboard() {
  const location = useLocation();
  const state = location.state as LoginNavState | null;

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
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Monday, 12 August 2024</p>
          <h1 className="mt-2 font-display text-3xl font-800 tracking-[-0.02em] text-indigo">Good morning, {state?.justLoggedIn ? "welcome" : "school team"}.</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
            Keep families close to the learning happening in your classrooms. Here is your school communication pulse for this term.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-indigo-light">
          <FileUp size={17} /> Upload results
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active students", value: "248", detail: "+12 this term", icon: Users, tone: "bg-indigo/10 text-indigo" },
          { label: "Reports shared", value: "186", detail: "75% of students", icon: BookOpenCheck, tone: "bg-gold/20 text-[#b85f12]" },
          { label: "Parent reach", value: "94%", detail: "+6% this month", icon: MessageCircle, tone: "bg-sage/15 text-sage" },
          { label: "Need attention", value: "8", detail: "Follow up today", icon: Clock3, tone: "bg-clay/10 text-clay" },
        ].map(({ label, value, detail, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-line bg-white p-5 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
            <div className="flex items-start justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon size={18} /></span>
              <ArrowUpRight size={16} className="text-ink/25" />
            </div>
            <p className="mt-5 text-2xl font-800 text-indigo">{value}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
            <p className="mt-1 text-xs text-ink/50">{detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">Learning snapshot</p>
              <h2 className="mt-1 font-display text-xl font-700 text-indigo">Term 2 report progress</h2>
            </div>
            <span className="rounded-full bg-sage/10 px-3 py-1 text-xs font-semibold text-sage">On track</span>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {[
              ["JHS 1", "92%", "48 of 52 reports"],
              ["JHS 2", "78%", "61 of 78 reports"],
              ["JHS 3", "64%", "77 of 118 reports"],
            ].map(([className, progress, detail]) => (
              <div key={className}>
                <div className="flex items-center justify-between text-sm font-semibold text-indigo"><span>{className}</span><span>{progress}</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ivory-deep"><div className="h-full rounded-full bg-gold" style={{ width: progress }} /></div>
                <p className="mt-2 text-xs text-ink/50">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-indigo p-6 text-ivory shadow-[0_8px_24px_rgba(38,50,56,0.08)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-indigo"><GraduationCap size={21} /></div>
          <h2 className="mt-5 font-display text-xl font-700">Make the next conversation count</h2>
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">Share a learner&apos;s progress while it is still fresh. Families are most likely to respond when updates are clear and timely.</p>
          <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light">View students needing follow-up <ArrowUpRight size={16} /></button>
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">Recent activity</p>
            <h2 className="mt-1 font-display text-xl font-700 text-indigo">Your school, in motion</h2>
          </div>
          <button className="text-sm font-semibold text-indigo hover:text-indigo-light">See all</button>
        </div>
        <div className="mt-5 divide-y divide-line">
          {[
            ["JHS 2A results shared", "42 parents notified via WhatsApp", "18 min ago"],
            ["New student added", "Adjoa Asante joined JHS 1B", "2 hours ago"],
            ["Weekly delivery report", "94% of notifications were opened", "Yesterday"],
          ].map(([title, detail, time]) => (
            <div key={title} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
              <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-sage" />
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">{title}</p><p className="mt-1 text-xs text-ink/55">{detail}</p></div>
              <span className="shrink-0 text-xs text-ink/40">{time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}