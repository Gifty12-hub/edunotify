import { Target, Heart, Users2, Sparkles, type LucideIcon } from "lucide-react";

interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
}

const pillars: Pillar[] = [
  {
    icon: Target,
    title: "The problem",
    body: "In many Ghanaian schools, report cards and school updates still travel home in a child's bag, and often don't arrive at all. Parents miss results, fee deadlines and events, and schools have no reliable way to confirm a message was received.",
  },
  {
    icon: Sparkles,
    title: "Our approach",
    body: "EduNotify digitises the school to parent link. Once a school uploads results or an update, EduNotify delivers it automatically over whichever channel a parent has chosen, SMS, WhatsApp, email or the app, in the language they understand best.",
  },
  {
    icon: Users2,
    title: "Who it's for",
    body: "Basic and second cycle schools that want a dependable, low effort way to reach every household, and parents and guardians who want to know how their child is doing without waiting on a paper slip.",
  },
  {
    icon: Heart,
    title: "Why it matters",
    body: "A parent who sees a struggling grade early can act on it early. Consistent communication is one of the simplest, most overlooked levers for improving student outcomes across Ghana.",
  },
];

export default function About() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <span className="inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-indigo">
          About EduNotify
        </span>
        <h1 className="mt-5 font-display text-4xl font-800 leading-tight text-indigo sm:text-5xl">
          Closing the gap between the classroom and home
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/65">
          EduNotify is a web based platform that helps schools digitally
          manage student academic records and keep parents informed through
          SMS, WhatsApp and email notifications, built for the realities of
          Ghanaian schools, where a smartphone and a stable internet
          connection can't always be assumed.
        </p>
      </section>

      <section className="border-t border-line bg-ivory-deep">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
                <Icon size={18} />
              </span>
              <h2 className="mt-4 font-display text-lg font-700 text-indigo">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-display text-2xl font-700 text-indigo">Where we're headed</h2>
        <p className="mt-4 text-sm leading-relaxed text-ink/65">
          EduNotify started as an idea to solve a problem seen firsthand in
          Ghanaian communities: results and school news that never reach the
          people who need them most. The platform is being built with AI powered
          features on the roadmap, including early warning flags for
          students who may need extra support, and automatic translation so
          language is never a barrier between a school and a parent.
        </p>
      </section>
    </>
  );
}