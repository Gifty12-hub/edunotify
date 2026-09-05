import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { FormShell, FormField, SubmitButton } from "../components/Form";

interface ResetValues {
  password: string;
  confirmPassword: string;
}

/**
 * Step 2 of password recovery: the user arrives here from the link sent
 * by ForgotPassword, e.g. /reset-password?token=abc123. The token is read
 * from the URL with useSearchParams and would be sent along with the new
 * password to the backend to verify it's valid and not expired.
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [values, setValues] = useState<ResetValues>({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (values.password !== values.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (values.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    // TODO: POST { token, password: values.password } to a real
    // "reset password" endpoint. The backend verifies the token is valid
    // and not expired, updates the password, and invalidates the token.
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 900);
  };

  if (!token) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white/60 p-8 text-center shadow-sm shadow-indigo/5">
          <h1 className="font-display text-xl font-700 text-indigo">Invalid or missing link</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            This reset link is missing its token. Request a new one below.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-indigo-light"
          >
            Request a new link
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {done ? (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white/60 p-8 text-center shadow-sm shadow-indigo/5">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage">
            ✓
          </span>
          <h1 className="mt-4 font-display text-xl font-700 text-indigo">Password updated</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            You can now log in with your new password.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-indigo-light"
          >
            Go to log in
          </Link>
        </div>
      ) : (
        <FormShell title="Set a new password" subtitle="Choose a password with at least 8 characters." onSubmit={handleSubmit}>
          <FormField
            label="New password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            icon={Lock}
            error={error && !values.confirmPassword ? error : undefined}
          />
          <FormField
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your new password"
            icon={Lock}
            error={error ? error : undefined}
          />
          <SubmitButton loading={loading}>Reset password</SubmitButton>
        </FormShell>
      )}
    </section>
  );
}