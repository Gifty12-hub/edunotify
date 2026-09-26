import { useEffect, useState, type FormEvent } from "react";
import { Megaphone } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import { broadcastNotification, getNotificationAudio, getNotifications } from "../lib/api";
import ListenButton from "../components/ListenButton";
import type { BulkSendSummary, NotificationRecord } from "../types/api";

const statusStyle = {
  sent: "bg-sage/10 text-sage",
  failed: "bg-clay/10 text-clay",
  pending: "bg-gold/20 text-[#b85f12]",
};

/** Delivery history, plus a form to message every parent (or one class). */
export default function Notifications() {
  const history = useApiRequest<{ notifications: NotificationRecord[] }>();
  const broadcast = useApiRequest<BulkSendSummary>();
  const [message, setMessage] = useState("");
  const [className, setClassName] = useState("");
  const [translate, setTranslate] = useState(false);

  const load = () => history.request(() => getNotifications());

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBroadcast = async (e: FormEvent) => {
    e.preventDefault();
    const result = await broadcast.request(() => broadcastNotification(message, className.trim(), translate));
    if (result) {
      setMessage("");
      load();
    }
  };

  const items = history.data?.notifications ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-700 text-indigo">Notifications</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
        Message all parents at once, and see what was delivered.
      </p>

      <form onSubmit={handleBroadcast} className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class (leave empty for the whole school)"
          className="rounded-md border border-line bg-ivory px-3 py-2 text-sm outline-none focus:border-indigo focus:bg-white"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
          placeholder="e.g. PTA meeting on Friday at 4:00 PM"
          className="rounded-md border border-line bg-ivory px-3 py-2 text-sm outline-none focus:border-indigo focus:bg-white"
        />
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={translate} onChange={(e) => setTranslate(e.target.checked)} />
          Translate for each parent's language (AI). Check important notices with a native speaker first.
        </label>
        {broadcast.isError && <p className="text-sm text-clay">{broadcast.errMessage}</p>}
        {broadcast.data && (
          <p className="text-sm text-ink/70">{broadcast.data.sent} sent, {broadcast.data.failed} failed.</p>
        )}
        <button disabled={broadcast.loading} className="inline-flex items-center gap-2 self-start rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-ivory disabled:opacity-60">
          <Megaphone size={16} /> {broadcast.loading ? "Sending…" : "Send to parents"}
        </button>
      </form>

      {history.isError && <p className="mt-6 text-sm text-clay">{history.errMessage}</p>}
      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
        {items.length === 0 && !history.loading && <p className="p-5 text-sm text-ink/50">Nothing sent yet.</p>}
        {items.map((n) => (
          <div key={n._id} className="flex items-start gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">
                {n.student?.fullName ?? "Student"} · {n.parent?.fullName ?? "Parent"}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-ink/60">{n.message}</p>
              {n.error && <p className="mt-1 text-xs text-clay">{n.error}</p>}
              <div className="mt-2">
                <ListenButton load={() => getNotificationAudio(n._id)} label="Hear it" showText />
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[n.status]}`}>{n.status}</span>
              <p className="mt-1 text-xs text-ink/40">{n.channel}{n.aiGenerated ? " · AI" : ""} · {new Date(n.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
