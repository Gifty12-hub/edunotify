import { useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { FormShell, FormField, FormTextarea, SubmitButton } from "../components/Form";
import { sendContactMessage } from "../lib/api";

interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = values.message.trim();
    if (!values.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || !message) {
      setError("Enter your name, a valid email address, and a message.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await sendContactMessage({ ...values, name: values.name.trim(), email: values.email.trim(), message });
      setLoading(false);
      setSent(true);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-3xl font-800 text-indigo">Talk to us</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/65">
          Whether you're a school interested in piloting EduNotify or a
          parent with a question, we'd like to hear from you.
        </p>

        <ul className="mt-8 flex flex-col gap-5 text-sm text-ink/70">
          <li className="flex items-start gap-3">
            <Mail size={17} className="mt-0.5 text-gold" />
            <span>demo.edunotify@gmail.com</span>
          </li>
          <li className="flex items-start gap-3">
            <Phone size={17} className="mt-0.5 text-gold" />
            <span>+233 534721702</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin size={17} className="mt-0.5 text-gold" />
            <span>Kasoa, Central Region, Ghana</span>
          </li>
        </ul>
      </div>

      {sent ? (
        <div className="flex flex-col items-start justify-center rounded-2xl border border-line bg-white p-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage">
            ✓
          </span>
          <h2 className="mt-4 font-display text-xl font-700 text-indigo">Message sent</h2>
          <p className="mt-2 text-sm text-ink/60">
            Thanks for reaching out. A confirmation email is on its way, and we'll get back to you within a couple of days.
          </p>
        </div>
      ) : (
        <FormShell title="Send a message" onSubmit={handleSubmit}>
          <FormField
            label="Full name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Your name"
            icon={User}
          />
          <FormField
            label="Email address"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={Mail}
          />
          <FormTextarea
            label="Message"
            name="message"
            value={values.message}
            onChange={handleChange}
            placeholder="How can we help?"
          />
          {error && <p role="alert" className="text-sm text-clay">{error}</p>}
          <SubmitButton loading={loading}>Send message</SubmitButton>
        </FormShell>
      )}
    </section>
  );
}