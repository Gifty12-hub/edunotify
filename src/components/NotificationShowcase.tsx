import { MessageCircle, Mail, Smartphone, type LucideIcon } from "lucide-react";

interface Channel {
  icon: LucideIcon;
  label: string;
  time: string;
  message: string;
  accent: string;
}

const channels: Channel[] = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    time: "Just now",
    message: '"Ama scored 87% in Mathematics this term. Full report card is ready, tap to view."',
    accent: "bg-sage",
  },
  {
    icon: Smartphone,
    label: "SMS",
    time: "Just now",
    message: "EDUNOTIFY: Kojo's report card for Term 2 is out. Overall: A. Reply STOP to opt out.",
    accent: "bg-gold",
  },
  {
    icon: Mail,
    label: "Email",
    time: "Just now",
    message: "Term 2 Progress Report. Efua Mensah is now available in your parent dashboard.",
    accent: "bg-clay",
  },
];

export default function NotificationShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* stacked phone card */}
      <div className="rounded-[-2rem] border border-line bg-indigo p-2 shadow-xl shadow-indigo/20">
        <div className="rounded-[1.6rem] bg-ivory p-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="font-display text-sm font-700 text-indigo">
              One result, three channels
            </span>
            <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {channels.map(({ icon: Icon, label, time, message, accent }, i) => (
              <li
                key={label}
                className="notif-in flex gap-3 rounded-xl border border-line bg-white p-3"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${accent}`}
                >
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-indigo">{label}</span>
                    <span className="text-[11px] text-ink/40">{time}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-snug text-ink/70">{message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes notif-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .notif-in {
          opacity: 0;
          animation: notif-in 0.5s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .notif-in { opacity: 1; animation: none; transform: none; }
        }
      `}</style>
    </div>
  );
}