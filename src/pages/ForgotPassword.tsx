import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { FormShell, FormField, SubmitButton } from "../components/Form";

/**
 * Step 1 of password recovery: the user requests a reset link by email.
 * There's no backend yet, so submitting just simulates the request and
 * shows a confirmation — see the TODO below for what a real integration
 * needs.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: POST { email } to a real "request password reset" endpoint,
    // which should email the user a link like /reset-password?token=...
    // (the backend generates and stores that token). Always show the same
    // "check your email" message whether or not the address exists, so
    // this page can't be used to find out which emails are registered.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {sent ? (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white/60 p-8 text-center shadow-sm shadow-indigo/5">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage">
            ✓
          </span>
          <h1 className="mt-4 font-display text-xl font-700 text-indigo">Check your email</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            If an account exists for <strong>{email}</strong>, a password
            reset link is on its way. It'll expire in an hour.
          </p>
          <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-indigo hover:text-indigo-light">
            Back to log in
          </Link>
        </div>
      ) : (
        <FormShell
          title="Forgot your password?"
          subtitle="Enter the email on your account and we'll send you a reset link."
          onSubmit={handleSubmit}
          footer={
            <>
              Remembered it?{" "}
              <Link to="/login" className="font-semibold text-indigo hover:text-indigo-light">
                Log in
              </Link>
            </>
          }
        >
          <FormField
            label="Email address"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="you@school.edu.gh"
            icon={Mail}
          />
          <SubmitButton loading={loading}>Send reset link</SubmitButton>
        </FormShell>
      )}
    </section>
  );
}