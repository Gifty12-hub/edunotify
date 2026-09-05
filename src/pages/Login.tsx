import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon, Mail, Phone, Lock } from "lucide-react";
import { FormShell, FormField, SubmitButton } from "../components/Form";
import { useApiRequest } from "../hooks/useApiRequest";
import { signupRequest } from "../api/authApi";
import type { AuthResponse } from "../types/auth";

type Role = "parent" | "school";
interface RoleOption {
  value: Role;
  label: string;
}

const roles: RoleOption[] = [
  { value: "parent", label: "Parent / Guardian" },
  { value: "school", label: "School administrator" },
];

interface SignupValues {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function Signup() {
  const [role, setRole] = useState<Role>("parent");
  const [values, setValues] = useState<SignupValues>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();

  const { loading, isError, errMessage, isSuccess, successMessage, request } =
    useApiRequest<AuthResponse>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await request(
      () => signupRequest(values.name, values.email),
      "Account created — you can now log in"
    );

    if (result) {
      setTimeout(() => navigate("/login"), 1200);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <FormShell
        title="Create your account"
        subtitle="Tell us who you are so we can set up the right dashboard."
        onSubmit={handleSubmit}
        footer={
          <>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo hover:text-indigo-light">
              Log in
            </Link>
          </>
        }
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink/80">I am signing up as a</span>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                type="button"
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  role === r.value
                    ? "border-indigo bg-indigo text-ivory"
                    : "border-line bg-white text-ink/70 hover:border-indigo/50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <FormField
          label="Full name"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder={role === "school" ? "e.g. Kasoa Presby Basic School" : "e.g. Abena Owusu"}
          icon={UserIcon}
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
        <FormField
          label="Phone number"
          type="tel"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          placeholder="0XX XXX XXXX"
          icon={Phone}
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          icon={Lock}
        />

        {isError && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{errMessage}</p>
        )}
        {isSuccess && (
          <p className="rounded-lg bg-sage/10 px-3 py-2 text-sm text-sage">{successMessage}</p>
        )}

        <p className="text-xs leading-relaxed text-ink/50">
          By creating an account you agree to be contacted on the channels
          above with school and account notifications.
        </p>

        <SubmitButton loading={loading}>Create account</SubmitButton>
      </FormShell>
    </section>
  );
}