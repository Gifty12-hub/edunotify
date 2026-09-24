import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save, Send } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import { getResults, getStudents, notifyResults, previewResults, saveResults } from "../lib/api";
import type { ResultsNotifySummary, ResultsPreview, StudentRecord } from "../types/api";

const inputClass =
  "rounded-md border border-line bg-ivory px-3 py-2 text-sm text-ink outline-none focus:border-indigo focus:bg-white";

const thisYear = new Date().getFullYear();

/**
 * Enter one subject's scores for a whole class, save them, then send each
 * parent a results summary on their preferred channel.
 */
export default function Results() {
  const roster = useApiRequest<{ students: StudentRecord[] }>();
  const save = useApiRequest<{ saved: number }>();
  const notify = useApiRequest<ResultsNotifySummary>();
  const preview = useApiRequest<ResultsPreview>();
  const [useAi, setUseAi] = useState(true);
  const [previewFor, setPreviewFor] = useState<string | null>(null);

  const [className, setClassName] = useState("");
  const [term, setTerm] = useState("Term 1");
  const [academicYear, setAcademicYear] = useState(`${thisYear - 1}/${thisYear}`);
  const [subject, setSubject] = useState("");
  const [scores, setScores] = useState<Record<string, string>>({});

  const students = useMemo(
    () => (roster.data?.students ?? []).filter((s) => s.className === className),
    [roster.data, className]
  );
  const classNames = useMemo(
    () => [...new Set((roster.data?.students ?? []).map((s) => s.className))].sort(),
    [roster.data]
  );

  useEffect(() => {
    roster.request(() => getStudents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the subject changes, prefill any scores already saved for it.
  const prefill = async (nextSubject: string) => {
    setSubject(nextSubject);
    setScores({});
    if (!className || !nextSubject.trim()) return;
    try {
      const { results } = await getResults({ className, term, academicYear });
      const next: Record<string, string> = {};
      results
        .filter((r) => r.subject.toLowerCase() === nextSubject.trim().toLowerCase())
        .forEach((r) => (next[r.student._id] = String(r.score)));
      setScores(next);
    } catch {
      // Prefill is a convenience. Ignore errors here.
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    notify.reset();
    const entries = students
      .filter((s) => scores[s._id] !== undefined && scores[s._id] !== "")
      .map((s) => ({ studentId: s._id, subject: subject.trim(), score: Number(scores[s._id]) }));
    if (entries.length === 0) return;
    await save.request(() => saveResults({ term, academicYear, entries }));
  };

  const handleNotify = async () => {
    await notify.request(() => notifyResults({ term, academicYear, className, useAi }));
  };

  const handlePreview = async (studentId: string) => {
    setPreviewFor(studentId);
    await preview.request(() => previewResults({ studentId, term, academicYear, useAi }));
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-700 text-indigo">Results</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
        Record scores for a class, then send every parent a summary of their child's results.
      </p>

      {roster.isError && <p className="mt-4 text-sm text-clay">{roster.errMessage}</p>}

      <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-white p-5 md:grid-cols-4">
        <select className={inputClass} value={className} onChange={(e) => { setClassName(e.target.value); setScores({}); }}>
          <option value="">Choose class</option>
          {classNames.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={inputClass} value={term} onChange={(e) => setTerm(e.target.value)}>
          <option>Term 1</option><option>Term 2</option><option>Term 3</option>
        </select>
        <input className={inputClass} value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="2025/2026" />
        <input className={inputClass} value={subject} onChange={(e) => prefill(e.target.value)} placeholder="Subject, e.g. Mathematics" />
      </div>

      {className && (
        <form onSubmit={handleSave} className="mt-6 rounded-2xl border border-line bg-white p-5">
          {students.map((s) => (
            <div key={s._id} className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-ink">{s.fullName}</span>
                <button type="button" onClick={() => handlePreview(s._id)} className="ml-3 text-xs font-semibold text-indigo hover:text-indigo-light">
                  Preview message
                </button>
                {previewFor === s._id && (
                  <p className="mt-1 text-xs text-ink/60">
                    {preview.loading && "Writing preview…"}
                    {preview.isError && <span className="text-clay">{preview.errMessage}</span>}
                    {preview.data && `${preview.data.message}${preview.data.aiGenerated ? " (AI written, language: " + preview.data.language + ")" : ""}`}
                  </p>
                )}
              </div>
              <input
                type="number" min={0} max={100} step="0.1"
                value={scores[s._id] ?? ""}
                onChange={(e) => setScores((v) => ({ ...v, [s._id]: e.target.value }))}
                placeholder="Score /100"
                className={`${inputClass} w-32`}
              />
            </div>
          ))}
          {save.isError && <p className="mt-3 text-sm text-clay">{save.errMessage}</p>}
          {save.isSuccess && <p className="mt-3 text-sm text-sage">Saved {save.data?.saved} scores.</p>}
          <label className="mt-4 flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} />
            Write a short summary for each parent in their own language (AI)
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button disabled={save.loading || !subject.trim()} className="inline-flex items-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-ivory disabled:opacity-60">
              <Save size={16} /> {save.loading ? "Saving…" : "Save scores"}
            </button>
            <button type="button" onClick={handleNotify} disabled={notify.loading} className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-indigo disabled:opacity-60">
              <Send size={16} /> {notify.loading ? "Sending…" : "Send results to parents"}
            </button>
          </div>
          {notify.isError && <p className="mt-3 text-sm text-clay">{notify.errMessage}</p>}
          {notify.data && (
            <p className="mt-3 text-sm text-ink/70">
              {notify.data.sent} sent, {notify.data.failed} failed, {notify.data.skippedNoResults} skipped (no scores saved yet).
            </p>
          )}
        </form>
      )}
    </div>
  );
}
