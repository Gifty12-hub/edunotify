import { Link } from "react-router-dom";
import { BellRing, Mail, MessageCircle, Phone } from "lucide-react";
import { whatsAppLink } from "../lib/whatsapp";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-indigo-light bg-indigo text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-indigo">
              <BellRing size={18} strokeWidth={2.25} />
            </span>
            <span className="font-display text-lg font-700 text-white">EduNotify</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
            Digital school communication for Ghana. Results, fee reminders and
            school updates delivered to parents by SMS, WhatsApp, email or app,
            in the language they read best.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-600 uppercase tracking-wide text-gold">
            Product
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ivory/70">
            <li><Link to="/about" className="hover:text-gold">About EduNotify</Link></li>
            <li><Link to="/signup" className="hover:text-gold">Create an account</Link></li>
            <li><Link to="/login" className="hover:text-gold">Log in</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-600 uppercase tracking-wide text-gold">
            Reach us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ivory/70">
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-gold" />
              <a href="mailto:demo.edunotify@gmail.com" className="hover:text-gold focus-visible:text-gold focus-visible:outline-none focus-visible:underline">
                demo.edunotify@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-gold" />
              <a href="tel:+233534721702" className="hover:text-gold focus-visible:text-gold focus-visible:outline-none focus-visible:underline">
                +233 534721702
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={15} className="text-gold" />
              <a
                href={whatsAppLink("+233 534721702", "Hello, I need support with EduNotify.")}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold focus-visible:text-gold focus-visible:outline-none focus-visible:underline"
              >
                WhatsApp support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-indigo-light px-6 py-6 text-center text-xs text-ivory/50">
        © {year} EduNotify. Built in Kasoa, Ghana.
      </div>
    </footer>
  );
}