import { useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import { getStudents } from "../lib/api";

interface ParentInfo {
  fullName: string;
  phone: string;
  email?: string;
  preferredChannel: "sms" | "whatsapp" | "email";
}

interface StudentRecord {
  _id: string;
  fullName: string;
  className: string;
  parent: ParentInfo;
}

interface StudentsResponse {
  students: StudentRecord[];
}

const channelIcon = {
  sms: Phone,
  whatsapp: Phone,
  email: Mail,
};

const channelLabel = {
  sms: "SMS",
  whatsapp: "WhatsApp",
  email: "Email",
};

/**
 * Second authenticated page. Pulls the school's real student roster from
 * GET /api/students (populated with each student's parent) instead of the
 * old placeholder array.
 */
export default function Students() {
  const { data, loading, isError, errMessage, request } = useApiRequest<StudentsResponse>();

  useEffect(() => {
    request(() => getStudents() as Promise<StudentsResponse>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const students = data?.students ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-700 text-indigo">Students</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/60">
        Every student linked to a parent or guardian contact.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-ink/50">Loading students…</p>
      )}

      {isError && (
        <p className="mt-6 text-sm text-clay">
          Couldn't load students: {errMessage}
        </p>
      )}

      {!loading && !isError && students.length === 0 && (
        <p className="mt-6 text-sm text-ink/50">
          No students yet. Add your first student to get started.
        </p>
      )}

      {!loading && !isError && students.length > 0 && (
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
                const channel = s.parent.preferredChannel;
                const Icon = channelIcon[channel];
                const contact = channel === "email" ? s.parent.email ?? "—" : s.parent.phone;
                return (
                  <tr key={s._id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{s.fullName}</td>
                    <td className="px-4 py-3 text-ink/65">{s.className}</td>
                    <td className="px-4 py-3 text-ink/65">{s.parent.fullName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-ink/65">
                        <Icon size={14} className="text-gold" />
                        {channelLabel[channel]} · {contact}
                      </span>
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