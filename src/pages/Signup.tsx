import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import { FormShell, FormField, SubmitButton } from "../components/Form";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up to the registration endpoint once the backend exists.
    setTimeout(() => {
      setLoading(false);
      console.log("Signup submitted:", { role, ...values });
    }, 900);
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

        <p className="text-xs leading-relaxed text-ink/50">
          By creating an account you agree to be contacted on the channels
          above with school and account notifications.
        </p>

        <SubmitButton loading={loading}>Create account</SubmitButton>
      </FormShell>
    </section>
  );
}