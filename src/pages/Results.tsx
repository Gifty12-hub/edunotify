import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save, Send, Plus, X } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import { getResults, getStudents, notifyResults, previewResults, saveResults } from "../lib/api";
import { whatsAppLink } from "../lib/whatsapp";
import ListenButton from "../components/ListenButton";
import { previewVoice } from "../lib/api";
import type { ResultsNotifySummary, ResultsPreview, StudentRecord } from "../types/api";

const inputClass =
  "rounded-md border border-line bg-ivory px-3 py-2 text-sm text-ink outline-none focus:border-indigo focus:bg-white";

const thisYear = new Date().getFullYear();

// A starting set of common subjects, so a teacher isn't typing every column
// from scratch. More can be added, and any of these can be removed if unused.
const DEFAULT_SUBJECTS = ["English Language", "Mathematics", "Integrated Science", "Social Studies", "R.M.E."];

// scores[studentId][subject] = the text currently in that cell
type ScoreGrid = Record<string, Record<string, string>>;

/**
 * Gradebook for one class, one term. A teacher picks the class, term and
 * year, keys in every subject's score for every student in one grid, saves
 * it all at once, then sends each parent their child's results.
 */
export default function Results() {
  const roster = useApiRequest<{ students: StudentRecord[] }>();
  const existing = useApiRequest<{ results: import("../types/api").ResultRecord[] }>();
  const save = useApiRequest<{ saved: number }>();
  const notify = useApiRequest<ResultsNotifySummary>();
  const preview = useApiRequest<ResultsPreview>();

  const [className, setClassName] = useState("");
  const [term, setTerm] = useState("Term 1");
  const [academicYear, setAcademicYear] = useState(`${thisYear - 1}/${thisYear}`);
  const [subjects, setSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [newSubject, setNewSubject] = useState("");
  const [scores, setScores] = useState<ScoreGrid>({});
  const [useAi, setUseAi] = useState(true);
  const [previewFor, setPreviewFor] = useState<string | null>(null);

  useEffect(() => {
    roster.request(() => getStudents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const students = useMemo(
    () => (roster.data?.students ?? []).filter((s) => s.className === className),
    [roster.data, className]
  );
  const classNames = useMemo(
    () => [...new Set((roster.data?.students ?? []).map((s) => s.className))].sort(),
    [roster.data]
  );

  // When the class, term or year changes, load whatever scores are already
  // saved and fill the grid with them. Any subject already in the saved
  // data is added as a column, even if it wasn't in the default list.
  useEffect(() => {
    if (!className) return;
    let cancelled = false;
    (async () => {
      const result = await existing.request(() => getResults({ className, term, academicYear }));
      if (cancelled) return;
      const grid: ScoreGrid = {};
      const found = new Set<string>();
      for (const r of result?.results ?? []) {
        found.add(r.subject);
        grid[r.student._id] = { ...grid[r.student._id], [r.subject]: String(r.score) };
      }
      setScores(grid);
      setSubjects((current) => [...current, ...[...found].filter((s) => !current.includes(s))]);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className, term, academicYear]);

  const setScore = (studentId: string, subject: string, value: string) =>
    setScores((grid) => ({ ...grid, [studentId]: { ...grid[studentId], [subject]: value } }));

  const addSubject = () => {
    const name = newSubject.trim();
    if (!name || subjects.includes(name)) return;
    setSubjects((s) => [...s, name]);
    setNewSubject("");
  };
  const removeSubject = (name: string) => setSubjects((s) => s.filter((x) => x !== name));

  const filledCount = students.reduce(
    (sum, s) => sum + subjects.filter((subj) => scores[s._id]?.[subj]?.trim()).length,
    0
  );

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    notify.reset();
    const entries = students.flatMap((s) =>
      subjects
        .filter((subject) => scores[s._id]?.[subject]?.trim())
        .map((subject) => ({ studentId: s._id, subject, score: Number(scores[s._id][subject]) }))
    );
    if (entries.length === 0) return;
    await save.request(() => saveResults({ term, academicYear, entries }));
  };

  const handleNotify = async () => {
    await notify.request(() => notifyResults({ term, academicYear, className, useAi }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-700 text-indigo">Results</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
        Enter every subject's scores for a class, save them, then send each parent a summary of their child's results.
      </p>

      {roster.isError && <p className="mt-4 text-sm text-clay">{roster.errMessage}</p>}

      <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-white p-5 md:grid-cols-3">
        <select className={inputClass} value={className} onChange={(e) => { setClassName(e.target.value); setNewSubject(""); }}>
          <option value="">Choose class</option>
          {classNames.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={inputClass} value={term} onChange={(e) => setTerm(e.target.value)}>
          <option>Term 1</option><option>Term 2</option><option>Term 3</option>
        </select>
        <input className={inputClass} value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="2025/2026" />
      </div>

      {className && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">Subjects:</span>
            {subjects.map((subj) => (
              <span key={subj} className="inline-flex items-center gap-1 rounded-full bg-ivory-deep px-3 py-1 text-xs text-ink">
                {subj}
                <button type="button" onClick={() => removeSubject(subj)} aria-label={`Remove ${subj}`} className="text-ink/40 hover:text-clay">
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
              placeholder="Add a subject"
              className="w-40 rounded-md border border-line bg-ivory px-2 py-1 text-xs outline-none focus:border-indigo"
            />
            <button type="button" onClick={addSubject} className="inline-flex items-center gap-1 rounded-md bg-indigo/10 px-2 py-1 text-xs font-semibold text-indigo hover:bg-indigo/20">
              <Plus size={12} /> Add
            </button>
          </div>

          {existing.loading && <p className="mt-4 text-sm text-ink/50">Loading any saved scores…</p>}

          <form onSubmit={handleSave} className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-ivory-deep text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="sticky left-0 bg-ivory-deep px-4 py-3 font-medium">Student</th>
                  {subjects.map((subj) => (
                    <th key={subj} className="px-3 py-3 font-medium">{subj}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr><td colSpan={subjects.length + 1} className="px-4 py-6 text-center text-ink/50">No students in this class yet.</td></tr>
                )}
                {students.map((s) => (
                  <tr key={s._id} className="border-b border-line last:border-0">
                    <td className="sticky left-0 bg-white px-4 py-2 font-medium text-ink">{s.fullName}</td>
                    {subjects.map((subj) => (
                      <td key={subj} className="px-2 py-2">
                        <input
                          type="number" min={0} max={100} step="0.1"
                          value={scores[s._id]?.[subj] ?? ""}
                          onChange={(e) => setScore(s._id, subj, e.target.value)}
                          placeholder="—"
                          className={`${inputClass} w-20`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {students.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
                <p className="text-xs text-ink/50">{filledCount} score{filledCount === 1 ? "" : "s"} entered</p>
                {save.isError && <p className="text-sm text-clay">{save.errMessage}</p>}
                {save.isSuccess && <p className="text-sm text-sage">Saved {save.data?.saved} scores.</p>}
                <button disabled={save.loading || filledCount === 0} className="inline-flex items-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-ivory disabled:opacity-60">
                  <Save size={16} /> {save.loading ? "Saving…" : "Save all scores"}
                </button>
              </div>
            )}
          </form>

          {students.length > 0 && (
            <div className="mt-4 rounded-2xl border border-line bg-white p-5">
              <p className="text-sm font-semibold text-indigo">Send results to parents</p>
              <p className="mt-1 text-xs text-ink/60">
                Sends every student in {className} their saved scores for {term}, {academicYear}. A student with no scores saved yet is skipped.
              </p>
              <label className="mt-3 flex items-center gap-2 text-sm text-ink/70">
                <input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} />
                Write a short summary for each parent in their own language (AI)
              </label>
              <div className="mt-3 flex flex-wrap gap-3">
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

              <div className="mt-4 border-t border-line pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Preview one student's message</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {students.map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={async () => { setPreviewFor(s._id); await preview.request(() => previewResults({ studentId: s._id, term, academicYear, useAi })); }}
                      className="rounded-full border border-line px-3 py-1 text-xs text-ink/70 hover:border-indigo hover:text-indigo"
                    >
                      {s.fullName}
                    </button>
                  ))}
                </div>
                {previewFor && (
                  <div className="mt-3 rounded-lg bg-ivory p-3">
                    {preview.loading && <p className="text-xs text-ink/60">Writing preview…</p>}
                    {preview.isError && <p className="text-xs text-clay">{preview.errMessage}</p>}
                    {preview.data && (
                      <>
                        <p className="text-xs text-ink/70">
                          {preview.data.message}
                          {preview.data.aiGenerated ? ` (AI written, language: ${preview.data.language})` : ""}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <ListenButton load={() => previewVoice(previewFor, preview.data!.message)} label="Hear it" />
                          <a
                            href={whatsAppLink(students.find((s) => s._id === previewFor)?.parent.phone ?? "", preview.data.message)}
                            target="_blank" rel="noopener noreferrer"
                            className="text-xs font-semibold text-sage hover:underline"
                          >
                            Open in WhatsApp (free)
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
