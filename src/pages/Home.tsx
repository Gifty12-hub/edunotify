import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  Languages,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import NotificationShowcase from "../components/NotificationShowcase";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const highlights = [
  "Clear report updates",
  "One parent dashboard",
  "Language-aware messaging",
];

const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Built for schools",
    body: "From results to fee reminders, every update is shaped around the real rhythm of school communication.",
  },
  {
    icon: Languages,
    title: "Parents understand it",
    body: "Messages can be sent in English, Twi, Ga, Ewe and other local languages so families never feel left out.",
  },
  {
    icon: BarChart3,
    title: "Teachers stay informed",
    body: "Quick summaries and alerts help staff spot students who need support before small issues grow into bigger ones.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted and dependable",
    body: "Reliable delivery through SMS, WhatsApp and email keeps key updates reaching families without confusion.",
  },
];

const steps: Feature[] = [
  {
    icon: BookOpen,
    title: "Upload academic updates",
    body: "Teachers and school admins add results, announcements or reminders in a few clicks from a familiar dashboard.",
  },
  {
    icon: Users,
    title: "Parents join once",
    body: "Families register with their phone number or email and choose how they want to receive updates.",
  },
  {
    icon: CheckCircle2,
    title: "Everyone stays informed",
    body: "Parents get the information they need on time, in their preferred language, without repeated follow-up calls.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-gold-light/35 via-gold-light/10 to-transparent" />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-3 py-1.5 text-xs font-semibold text-indigo shadow-sm">
              <Sparkles size={14} className="text-clay" />
              Made for schools, parents and teachers
            </span>

            <h1 className="mt-5 max-w-xl font-display text-4xl font-800 leading-[1.02] tracking-[-0.04em] text-indigo sm:text-5xl lg:text-[4rem]">
              Better communication.<br />
              Stronger school-home connection.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/75">
              EduNotify helps schools share student results, reminders and announcements in a way families can understand and trust.
              Updates reach parents on time, through the channels they already use.
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
                Learn more
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink/80"
                >
                  <CheckCircle2 size={14} className="text-sage" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              {[
                { value: "24k+", label: "updates" },
                { value: "94%", label: "trusted" },
                { value: "3x", label: "faster" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-line bg-white/80 p-3 shadow-[0_10px_24px_rgba(31,70,99,0.04)] backdrop-blur-sm">
                  <p className="font-display text-xl font-700 text-indigo">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-ink/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <NotificationShowcase />
        </div>
      </section>

      <section className="border-t border-line bg-ivory-deep">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo/70">
                Why schools choose EduNotify
              </p>
              <h2 className="mt-2 font-display text-3xl font-700 text-indigo">
                Better communication for every school day
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink/75">
              <Clock3 size={14} className="text-clay" />
              Simple for busy school teams
            </div>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_28px_rgba(31,70,99,0.04)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-main text-indigo">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-xl font-700 text-indigo">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-700 text-indigo">
          From result to parent in three simple steps
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_24px_rgba(31,70,99,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-indigo font-display font-700">
                  {i + 1}
                </span>
                <Icon size={20} className="text-indigo/45" />
              </div>
              <h3 className="mt-5 font-display text-xl font-700 text-indigo">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-indigo">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
                Parent experience
              </p>
              <h2 className="mt-3 font-display text-3xl font-700 text-white">
                Parents feel informed, not overwhelmed.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
                Communication that is clear, timely and respectful makes it easier for families to stay connected with their children’s learning journey.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_20px_45px_rgba(10,28,38,0.18)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/60">School update</p>
                  <p className="mt-1 font-display text-xl font-700 text-white">Term 2 report card</p>
                </div>
                <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo">
                  live
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-xs text-white/60">From Headteacher</p>
                  <p className="mt-2 text-sm leading-relaxed text-white">
                    “Your child’s report card is ready. Please check the parent dashboard or WhatsApp for the full summary.”
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/8 p-3 text-sm text-white/80">
                  <span>Delivered in English & Twi</span>
                  <CheckCircle2 size={16} className="text-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-line bg-ivory p-8 shadow-[0_10px_26px_rgba(31,70,99,0.04)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo/70">
                What schools say
              </p>
              <h2 className="mt-2 font-display text-3xl font-700 text-indigo">
                Real feedback from school leaders
              </h2>
            </div>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-indigo px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-light"
            >
              Start with your school <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "Parents are getting updates without us chasing them. It feels more personal and far less stressful.",
                name: "Mrs. Adjei",
                role: "Headteacher",
              },
              {
                quote: "We used to send notices in different ways. Now one clear message reaches families in a format they actually read.",
                name: "Mr. Appiah",
                role: "Academic Coordinator",
              },
              {
                quote: "The system feels organized, trustworthy and warm — exactly what a school communication tool should be.",
                name: "Ms. Owusu",
                role: "School Administrator",
              },
            ].map((item) => (
              <div key={item.name} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-sm leading-relaxed text-ink/75">“{item.quote}”</p>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="font-display text-base font-700 text-indigo">{item.name}</p>
                  <p className="text-xs text-ink/60">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ivory-deep">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo/70">
              Ready to begin?
            </p>
            <h2 className="mt-2 font-display text-3xl font-700 text-indigo">
              Make school communication feel personal again.
            </h2>
          </div>

          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-indigo transition-colors hover:bg-gold-light"
          >
            Create your school account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}