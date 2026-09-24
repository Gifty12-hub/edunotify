import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { KeyRound, Mail, MessageCircle, Phone, Send, UserPlus } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import { createParentAccount, createStudent, getStudents, sendNotification } from "../lib/api";
import { languageLabel, type Channel, type Language, type ParentAccount, type StudentRecord } from "../types/api";
import { useAuth } from "../context/useAuth";
import { whatsAppLink } from "../lib/whatsapp";

const channelIcon = { sms: Phone, whatsapp: MessageCircle, email: Mail };
const channelLabel = { sms: "SMS", whatsapp: "WhatsApp", email: "Email" };

interface NewStudent {
  fullName: string;
  className: string;
  parentName: string;
  phone: string;
  email: string;
  channel: Channel;
  language: Language;
}

const emptyForm: NewStudent = { fullName: "", className: "", parentName: "", phone: "", email: "", channel: "sms", language: "en" };

const inputClass =
  "w-full rounded-md border border-line bg-ivory px-3 py-2 text-sm text-ink outline-none focus:border-indigo focus:bg-white";

/** Lets an admin create or reset a parent's portal login. The password shows once. */
function PortalAccess({ student }: { student: StudentRecord }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(student.parent.email ?? "");
  const account = useApiRequest<ParentAccount>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    account.request(() => createParentAccount(student.parent._id, email || undefined));
  };

  return (
    <div className="mt-2">
      <button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo hover:text-indigo-light">
        <KeyRound size={14} /> Portal login
      </button>
      {open && (
        <form onSubmit={submit} className="mt-2 flex flex-col gap-2 text-left">
          <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Parent email for login" />
          {account.isError && <p className="text-xs text-clay">{account.errMessage}</p>}
          {account.data && (
            <p className="rounded-md bg-sage/10 p-2 text-xs text-sage">
              {account.data.reset ? "Password reset." : "Login created."} Email: {account.data.email}. Temporary password: <strong>{account.data.tempPassword}</strong>. Share it with the parent now. It will not show again.
            </p>
          )}
          <button disabled={account.loading} className="rounded-md bg-indigo px-3 py-2 text-xs font-semibold text-ivory disabled:opacity-60">
            {account.loading ? "Working…" : "Create or reset login"}
          </button>
        </form>
      )}
    </div>
  );
}

/**
 * School roster. Staff can add a student with a parent contact and send
 * that parent a message, which goes out on the parent's preferred channel.
 */
export default function Students() {
  const { user } = useAuth();
  const list = useApiRequest<{ students: StudentRecord[] }>();
  const add = useApiRequest<{ student: StudentRecord }>();
  const send = useApiRequest<unknown>();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewStudent>(emptyForm);
  const [messagingId, setMessagingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  const load = () => list.request(() => getStudents());

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const result = await add.request(() =>
      createStudent({
        fullName: form.fullName,
        className: form.className,
        parent: {
          fullName: form.parentName,
          phone: form.phone,
          email: form.email || undefined,
          preferredChannel: form.channel,
          preferredLanguage: form.language,
        },
      })
    );
    if (result) {
      setForm(emptyForm);
      setShowForm(false);
      setNotice(`${result.student.fullName} was added.`);
      load();
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!messagingId) return;
    const result = await send.request(() => sendNotification(messagingId, message));
    if (result) {
      setNotice("Message sent.");
      setMessage("");
      setMessagingId(null);
    }
  };

  const students = list.data?.students ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-2xl font-700 text-indigo">Students</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/60">
            Every student linked to a parent or guardian contact.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-ivory hover:bg-indigo-light"
        >
          <UserPlus size={17} /> Add student
        </button>
      </div>

      {notice && <p className="mt-4 rounded-lg bg-sage/10 px-3 py-2 text-sm text-sage">{notice}</p>}

      {showForm && (
        <form onSubmit={handleAdd} className="mt-6 grid gap-4 rounded-2xl border border-line bg-white p-6 md:grid-cols-2">
          <input className={inputClass} name="fullName" value={form.fullName} onChange={onChange} placeholder="Student full name" required />
          <input className={inputClass} name="className" value={form.className} onChange={onChange} placeholder="Class, e.g. Basic 4" required />
          <input className={inputClass} name="parentName" value={form.parentName} onChange={onChange} placeholder="Parent full name" required />
          <input className={inputClass} name="phone" value={form.phone} onChange={onChange} placeholder="Parent phone, e.g. 0244123456" required />
          <input className={inputClass} name="email" type="email" value={form.email} onChange={onChange} placeholder="Parent email (needed for email)" />
          <select className={inputClass} name="channel" value={form.channel} onChange={onChange}>
            <option value="sms">Send by SMS</option>
            <option value="whatsapp">Send by WhatsApp</option>
            <option value="email">Send by email</option>
          </select>
          <select className={inputClass} name="language" value={form.language} onChange={onChange}>
            {(Object.keys(languageLabel) as Language[]).map((l) => (
              <option key={l} value={l}>Messages in {languageLabel[l]}</option>
            ))}
          </select>
          {add.isError && <p className="text-sm text-clay md:col-span-2">{add.errMessage}</p>}
          <button disabled={add.loading} className="rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-indigo disabled:opacity-60 md:col-span-2">
            {add.loading ? "Saving…" : "Save student"}
          </button>
        </form>
      )}

      {list.loading && <p className="mt-6 text-sm text-ink/50">Loading students…</p>}
      {list.isError && <p className="mt-6 text-sm text-clay">Couldn't load students: {list.errMessage}</p>}
      {!list.loading && !list.isError && students.length === 0 && (
        <p className="mt-6 text-sm text-ink/50">No students yet. Add your first student to get started.</p>
      )}

      {students.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-ivory-deep text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Guardian</th>
                <th className="px-4 py-3 font-medium">Preferred channel</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const channel = s.parent.preferredChannel;
                const Icon = channelIcon[channel];
                const contact = channel === "email" ? s.parent.email ?? "No email" : s.parent.phone;
                return (
                  <tr key={s._id} className="border-b border-line align-top last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{s.fullName}</td>
                    <td className="px-4 py-3 text-ink/65">{s.className}</td>
                    <td className="px-4 py-3 text-ink/65">{s.parent.fullName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-ink/65">
                        <Icon size={14} className="text-gold" />
                        {channelLabel[channel]} · {contact} · {languageLabel[s.parent.preferredLanguage ?? "en"]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setMessagingId(messagingId === s._id ? null : s._id); send.reset(); }}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo hover:text-indigo-light"
                      >
                        <Send size={14} /> Message
                      </button>
                      {messagingId === s._id && (
                        <form onSubmit={handleSend} className="mt-3 flex flex-col gap-2 text-left">
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            required
                            placeholder={`Message to ${s.parent.fullName}`}
                            className={inputClass}
                          />
                          {send.isError && <p className="text-xs text-clay">{send.errMessage}</p>}
                          <button disabled={send.loading} className="rounded-md bg-indigo px-3 py-2 text-xs font-semibold text-ivory disabled:opacity-60">
                            {send.loading ? "Sending…" : "Send"}
                          </button>
                          <a
                            href={whatsAppLink(s.parent.phone, message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-sage px-3 py-2 text-xs font-semibold text-sage hover:bg-sage/10"
                          >
                            <MessageCircle size={14} /> Open in WhatsApp (free)
                          </a>
                        </form>
                      )}
                      {user?.role === "admin" && <PortalAccess student={s} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
