import { Link } from "react-router-dom";
import { BellRing, Mail, MessageCircle, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ivory-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo text-gold">
              <BellRing size={18} strokeWidth={2.25} />
            </span>
            <span className="font-display text-lg font-700 text-indigo">EduNotify</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/65">
            Digital school communication for Ghana. Results, fee reminders and
            school updates delivered to parents by SMS, WhatsApp, email or app,
            in the language they read best.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-600 uppercase tracking-wide text-indigo">
            Product
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink/65">
            <li><Link to="/about" className="hover:text-indigo">About EduNotify</Link></li>
            <li><Link to="/signup" className="hover:text-indigo">Create an account</Link></li>
            <li><Link to="/login" className="hover:text-indigo">Log in</Link></li>
            <li><Link to="/contact" className="hover:text-indigo">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-600 uppercase tracking-wide text-indigo">
            Reach us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink/65">
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-gold" /> hello@edunotify.gh
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-gold" /> +233 20 000 0000
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={15} className="text-gold" /> WhatsApp support
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-6 py-6 text-center text-xs text-ink/50">
        © {year} EduNotify. Built in Kasoa, Ghana.
      </div>
    </footer>
  );
}