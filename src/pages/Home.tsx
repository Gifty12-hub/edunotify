import { Link } from "react-router-dom";
import {
  Languages,
  ShieldCheck,
  BarChart3,
  School,
  UserPlus,
  Send,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import NotificationShowcase from "../components/NotificationShowcase";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const features: Feature[] = [
  {
    icon: Send,
    title: "Multi-channel delivery",
    body: "Results and school updates go out over SMS, WhatsApp, email and the EduNotify app — whichever a parent actually checks.",
  },
  {
    icon: Languages,
    title: "Multilingual by default",
    body: "Notifications can be sent in English, Twi, Ga, Ewe and more, so language is never the reason a parent misses a report.",
  },
  {
    icon: BarChart3,
    title: "AI-powered insights",
    body: "Flags at-risk students early and summarises class performance for teachers, so follow-up happens before it's too late.",
  },
  {
    icon: ShieldCheck,
    title: "Built for Ghanaian schools",
    body: "Bulk uploads from the systems schools already use, offline-friendly SMS fallback, and pricing that fits real school budgets.",
  },
];

const steps: Feature[] = [
  {
    icon: School,
    title: "The school uploads results",
    body: "A teacher or administrator uploads term results, or a single score, from the dashboard — no new spreadsheet to learn.",
  },
  {
    icon: UserPlus,
    title: "Parents are already connected",
    body: "Parents register once with a phone number or email and choose how they'd like to be reached.",
  },
  {
    icon: Send,
    title: "EduNotify delivers it",
    body: "The moment results are published, every linked parent gets a notification on their preferred channel, in their preferred language.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <span className="inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-indigo">
            Now piloting with schools in the Greater Accra Region
          </span>
          <h1 className="mt-5 font-display text-4xl font-800 leading-[1.1] text-indigo sm:text-5xl">
            Every report card should reach a parent.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">
            EduNotify helps Ghanaian schools manage student academic records
            digitally and keep parents informed automatically — by SMS,
            WhatsApp, email or the EduNotify app, in the language they read
            best.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-indigo px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-indigo-light"
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo hover:text-indigo-light"
            >
              How it works
            </Link>
          </div>
        </div>
        <NotificationShowcase />
      </section>

      {/* Features */}
      <section className="border-t border-line bg-ivory-deep">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-700 text-indigo">
            Built for how Ghanaian schools actually run
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
            Every feature answers one question a school administrator or a
            parent has asked us directly.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-line bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-lg font-700 text-indigo">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-700 text-indigo">From result to phone in three steps</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-indigo font-display font-700">
                  {i + 1}
                </span>
                <Icon size={18} className="text-indigo/40" />
              </div>
              <h3 className="mt-4 font-display text-base font-700 text-indigo">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-indigo">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-700 text-ivory sm:text-3xl">
              Ready to keep every parent in the loop?
            </h2>
            <p className="mt-2 max-w-md text-sm text-ivory/70">
              Set up your school's EduNotify account in minutes — no credit
              card required for the pilot programme.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-indigo transition-colors hover:bg-gold-light"
          >
            Create your school account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}