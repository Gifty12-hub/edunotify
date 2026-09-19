import {
  ArrowUpRight,
  BellRing,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

export default function ParentDashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-sage/30 bg-sage/10 px-4 py-3 text-sm text-sage">
        <CheckCircle2 size={17} />
        Your child’s latest updates are ready to review.
      </div>

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Parent portal</p>
          <h1 className="mt-2 font-display text-3xl font-800 tracking-[-0.02em] text-indigo">
            Hello, parent.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
            Keep track of your child&apos;s performance, school updates and important notices from one place.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-indigo-light">
          <BookOpenCheck size={17} /> View report card
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Latest score", value: "87%", detail: "Mathematics", icon: GraduationCap, tone: "bg-indigo/10 text-indigo" },
          { label: "Class rank", value: "4th", detail: "In JHS 2A", icon: Sparkles, tone: "bg-gold/20 text-[#b85f12]" },
          { label: "Unread updates", value: "3", detail: "2 from school", icon: BellRing, tone: "bg-sage/15 text-sage" },
          { label: "Messages sent", value: "12", detail: "This term", icon: MessageSquareText, tone: "bg-clay/10 text-clay" },
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">Child snapshot</p>
              <h2 className="mt-1 font-display text-xl font-700 text-indigo">Ama Boateng — JHS 2A</h2>
            </div>
            <span className="rounded-full bg-sage/10 px-3 py-1 text-xs font-semibold text-sage">On track</span>
          </div>

          <div className="mt-7 space-y-5">
            {[
              ["Mathematics", "87%", "Strong improvement from last term"],
              ["Science", "82%", "Consistent performance"],
              ["English", "90%", "Excellent reading progress"],
            ].map(([subject, score, note]) => (
              <div key={subject}>
                <div className="flex items-center justify-between text-sm font-semibold text-indigo">
                  <span>{subject}</span>
                  <span>{score}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ivory-deep">
                  <div className="h-full rounded-full bg-gold" style={{ width: score }} />
                </div>
                <p className="mt-2 text-xs text-ink/50">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-indigo p-6 text-ivory shadow-[0_8px_24px_rgba(38,50,56,0.08)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-indigo">
            <BellRing size={20} />
          </div>
          <h2 className="mt-5 font-display text-xl font-700">Latest school update</h2>
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">
            The school has shared a reminder that parent-teacher meeting will take place on Friday at 4:00 PM.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light">
            View details <ArrowUpRight size={16} />
          </button>
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(38,50,56,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">Recent activity</p>
            <h2 className="mt-1 font-display text-xl font-700 text-indigo">What is new for your family</h2>
          </div>
          <button className="text-sm font-semibold text-indigo hover:text-indigo-light">See all</button>
        </div>

        <div className="mt-5 divide-y divide-line">
          {[
            ["Math assessment released", "Your child scored 87% in the latest assessment.", "Today"],
            ["School fee reminder", "The term fee reminder was sent to your preferred channel.", "2 days ago"],
            ["School event update", "Inter-house sports will be held on Wednesday.", "This week"],
          ].map(([title, detail, time]) => (
            <div key={title} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
              <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-sage" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-1 text-xs text-ink/55">{detail}</p>
              </div>
              <span className="shrink-0 text-xs text-ink/40">{time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
