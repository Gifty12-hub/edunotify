import { Mail, Phone } from "lucide-react";

interface StudentRow {
  name: string;
  className: string;
  guardian: string;
  contact: string;
  channel: "SMS" | "WhatsApp" | "Email";
}

// Placeholder data — this table gets replaced by a real fetch to the
// backend once it exists (e.g. GET /api/schools/:id/students).
const students: StudentRow[] = [
  { name: "Ama Boateng", className: "JHS 2A", guardian: "Efua Boateng", contact: "024 xxx xxxx", channel: "WhatsApp" },
  { name: "Kojo Mensah", className: "JHS 1B", guardian: "Kwame Mensah", contact: "020 xxx xxxx", channel: "SMS" },
  { name: "Efua Owusu", className: "JHS 3A", guardian: "Abena Owusu", contact: "owusu@example.com", channel: "Email" },
];

const channelIcon = {
  SMS: Phone,
  WhatsApp: Phone,
  Email: Mail,
};

/**
 * Second authenticated page, proving the sidebar/route pattern supports
 * more than one protected page. This is a placeholder table — the real
 * version will pull the school's actual roster from the backend.
 */
export default function Students() {
  return (
    <div>
      <h1 className="font-display text-2xl font-700 text-indigo">Students</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/60">
        Every student linked to a parent or guardian contact. This is
        placeholder data — bulk upload and live roster syncing are on the
        backend roadmap.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-ivory-deep text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Class</th>
              <th className="px-4 py-3 font-medium">Guardian</th>
              <th className="px-4 py-3 font-medium">Preferred channel</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const Icon = channelIcon[s.channel];
              return (
                <tr key={s.name} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
                  <td className="px-4 py-3 text-ink/65">{s.className}</td>
                  <td className="px-4 py-3 text-ink/65">{s.guardian}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-ink/65">
                      <Icon size={14} className="text-gold" />
                      {s.channel} · {s.contact}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}