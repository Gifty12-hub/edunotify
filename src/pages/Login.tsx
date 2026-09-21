import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, GraduationCap, School } from "lucide-react";
import { FormShell, FormField, SubmitButton } from "../components/Form";
import { useApiRequest } from "../hooks/useApiRequest";
import { loginRequest } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import type { AuthResponse } from "../types/auth";

interface LoginValues {
  email: string;
  password: string;
}

type LoginMode = "school" | "parent";

export default function Login() {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [mode, setMode] = useState<LoginMode>("school");
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const { loading, isError, errMessage, request } = useApiRequest<AuthResponse>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await request(
      () => loginRequest(values.email, values.password),
      "Logged in"
    );

    if (result) {
      setSession(result.user, { accessToken: result.token });
      navigate(result.user.role === "parent" ? "/dashboard" : "/dashboard", {
        state: { justLoggedIn: true },
      });
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <FormShell
        title="Log in"
        subtitle={mode === "parent" ? "Check your child’s latest progress and school updates." : "Welcome back to your school workspace."}
        onSubmit={handleSubmit}
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo hover:text-indigo-light">
              Sign up
            </Link>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-ivory-deep p-1.5">
          <button
            type="button"
            onClick={() => setMode("school")}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              mode === "school" ? "bg-white text-indigo shadow-sm" : "text-ink/55 hover:text-ink"
            }`}
          >
            <School size={16} /> School account
          </button>
          <button
            type="button"
            onClick={() => setMode("parent")}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              mode === "parent" ? "bg-white text-indigo shadow-sm" : "text-ink/55 hover:text-ink"
            }`}
          >
            <GraduationCap size={16} /> Parent portal
          </button>
        </div>

        {mode === "parent" && (
          <p className="rounded-lg bg-sage/10 px-3 py-2 text-xs leading-relaxed text-sage">
            Use the email and password provided by your child&apos;s school.
          </p>
        )}

        <FormField
          label="Email address"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="you@example.com"
          icon={Mail}
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Your password"
          icon={Lock}
        />

        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-medium text-indigo hover:text-indigo-light">
            Forgot password?
          </Link>
        </div>

        {isError && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{errMessage}</p>
        )}

        <SubmitButton loading={loading}>{mode === "parent" ? "Open parent portal" : "Log in"}</SubmitButton>
      </FormShell>
    </section>
  );
}