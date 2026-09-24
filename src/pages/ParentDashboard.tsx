import { useEffect, useState, type FormEvent } from "react";
import { BellRing, GraduationCap, KeyRound } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import { changePassword, getPortalChildren, getPortalMessages } from "../lib/api";
import { useAuth } from "../context/useAuth";
import type { PortalChild, PortalMessage } from "../types/api";

const inputClass =
  "w-full rounded-md border border-line bg-ivory px-3 py-2 text-sm text-ink outline-none focus:border-indigo focus:bg-white";

/** What a parent sees. Every number comes from the school's saved results. */
export default function ParentDashboard() {
  const { user } = useAuth();
  const kids = useApiRequest<{ children: PortalChild[] }>();
  const msgs = useApiRequest<{ messages: PortalMessage[] }>();
  const pw = useApiRequest<{ ok: boolean }>();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  useEffect(() => {
    kids.request(() => getPortalChildren());
    msgs.request(() => getPortalMessages());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await pw.request(() => changePassword(current, next), "Password changed.");
    if (ok) {
      setCurrent("");
      setNext("");
    }
  };

  const children = kids.data?.children ?? [];
  const messages = msgs.data?.messages ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Parent portal</p>
      <h1 className="mt-2 font-display text-3xl font-800 tracking-[-0.02em] text-indigo">
        Hello, {user?.fullName ?? "parent"}.
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
        See your child's results and the messages your school sent you.
      </p>

      {kids.isError && <p className="mt-6 text-sm text-clay">{kids.errMessage}</p>}
      {!kids.loading && children.length === 0 && !kids.isError && (
        <p className="mt-6 text-sm text-ink/50">No children are linked to your account yet.</p>
      )}

      {children.map((child) => (
        <section key={child.id} className="mt-8 rounded-xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
              <GraduationCap size={20} />
            </span>
            <div>
              <h2 className="font-display text-xl font-700 text-indigo">{child.fullName}</h2>
              <p className="text-xs text-ink/50">{child.className}{child.school ? ` · ${child.school}` : ""}</p>
            </div>
          </div>

          {child.terms.length === 0 && <p className="mt-5 text-sm text-ink/50">No results have been shared yet.</p>}

          {child.terms.map((t) => (
            <div key={`${t.academicYear}${t.term}`} className="mt-6">
              <div className="flex items-center justify-between text-sm font-semibold text-indigo">
                <span>{t.term}, {t.academicYear}</span>
                <span>Average {t.average}%</span>
              </div>
              <div className="mt-3 space-y-4">
                {t.results.map((r) => (
                  <div key={r.subject}>
                    <div className="flex items-center justify-between text-sm text-ink">
                      <span>{r.subject}</span>
                      <span className="font-semibold">{r.score}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ivory-deep">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, r.score)}%` }} />
                    </div>
                    {r.remarks && <p className="mt-1 text-xs text-ink/50">{r.remarks}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      <section className="mt-8 rounded-xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
        <div className="flex items-center gap-2">
          <BellRing size={18} className="text-gold" />
          <h2 className="font-display text-xl font-700 text-indigo">Messages from school</h2>
        </div>
        <div className="mt-4 divide-y divide-line">
          {messages.length === 0 && <p className="text-sm text-ink/50">No messages yet.</p>}
          {messages.map((m) => (
            <div key={m._id} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm text-ink">{m.message}</p>
              <p className="mt-1 text-xs text-ink/40">
                {m.student?.fullName ? `${m.student.fullName} · ` : ""}{new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handlePassword} className="mt-8 grid max-w-md gap-3 rounded-xl border border-line bg-white p-6">
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-gold" />
          <h2 className="font-display text-lg font-700 text-indigo">Change your password</h2>
        </div>
        <input className={inputClass} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current password" required />
        <input className={inputClass} type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="New password, at least 8 characters" minLength={8} required />
        {pw.isError && <p className="text-sm text-clay">{pw.errMessage}</p>}
        {pw.isSuccess && <p className="text-sm text-sage">{pw.successMessage}</p>}
        <button disabled={pw.loading} className="rounded-md bg-indigo px-4 py-2.5 text-sm font-semibold text-ivory disabled:opacity-60">
          {pw.loading ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
