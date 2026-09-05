import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { FormShell, FormField, SubmitButton } from "../components/Form";
import { useAuth } from "../context/AuthContext";

interface LoginValues {
  email: string;
  password: string;
}

export default function Login() {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  navigate("/dashboard", { state: { justLoggedIn: true } });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: replace with a real authentication request once the backend
    // (auth service / API) is available. For now, any submit "logs in"
    // so the authenticated route pattern can be demoed end to end.
    setTimeout(() => {
      setLoading(false);
      login();
      navigate("/dashboard");
    }, 900);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <FormShell
        title="Welcome back"
        subtitle="Log in to your EduNotify dashboard."
        onSubmit={handleSubmit}
        footer={
          <>
            New to EduNotify?{" "}
            <Link to="/signup" className="font-semibold text-indigo hover:text-indigo-light">
              Create an account
            </Link>
          </>
        }
      >
        <FormField
          label="Email address"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="you@school.edu.gh"
          icon={Mail}
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="••••••••"
          icon={Lock}
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink/65">
            <input type="checkbox" className="h-4 w-4 rounded border-line accent-indigo" />
            Remember me
          </label>
          <Link to="/contact" className="font-medium text-indigo hover:text-indigo-light">
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={loading}>Log in</SubmitButton>
      </FormShell>
    </section>
  );
}