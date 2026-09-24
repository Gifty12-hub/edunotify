import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, School as SchoolIcon, MapPin } from "lucide-react";
import { FormShell, FormField, SubmitButton } from "../components/Form";
import { useApiRequest } from "../hooks/useApiRequest";
import { registerSchoolRequest } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import type { AuthResponse } from "../types/auth";

/**
 * The backend only supports one kind of self-serve signup: a school admin
 * registering their school (POST /api/auth/register). There is no endpoint
 * for a parent to create their own account — parent contacts are added by
 * a school admin from the Students page, not signed up directly. So this
 * form collects what /register actually needs, instead of the role picker
 * the old placeholder had.
 */
interface SignupValues {
  fullName: string;
  email: string;
  password: string;
  schoolName: string;
  region: string;
  town: string;
  contactEmail: string;
  contactPhone: string;
}

const initialValues: SignupValues = {
  fullName: "",
  email: "",
  password: "",
  schoolName: "",
  region: "",
  town: "",
  contactEmail: "",
  contactPhone: "",
};

export default function Signup() {
  const [values, setValues] = useState<SignupValues>(initialValues);
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const { loading, isError, errMessage, request } = useApiRequest<AuthResponse>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await request(
      () =>
        registerSchoolRequest(values.fullName, values.email, values.password, {
          name: values.schoolName,
          region: values.region,
          town: values.town,
          contactEmail: values.contactEmail,
          contactPhone: values.contactPhone,
        }),
      "Account created"
    );

    if (result) {
      setSession(result.user, { accessToken: result.token });
      navigate("/dashboard", { state: { justLoggedIn: true } });
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <FormShell
        title="Register your school"
        subtitle="Create the school's workspace and your admin account."
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
        <FormField
          label="Your full name"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          placeholder="e.g. Abena Owusu"
          icon={User}
        />
        <FormField
          label="Your email address"
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
          placeholder="At least 8 characters"
          icon={Lock}
        />

        <div className="mt-2 border-t border-line pt-5">
          <span className="text-sm font-medium text-ink/80">School details</span>
        </div>

        <FormField
          label="School name"
          name="schoolName"
          value={values.schoolName}
          onChange={handleChange}
          placeholder="e.g. Kasoa Presby Basic School"
          icon={SchoolIcon}
        />
        <FormField
          label="Region"
          name="region"
          value={values.region}
          onChange={handleChange}
          placeholder="e.g. Central Region"
          icon={MapPin}
        />
        <FormField
          label="Town"
          name="town"
          value={values.town}
          onChange={handleChange}
          placeholder="e.g. Kasoa"
          icon={MapPin}
        />
        <FormField
          label="School contact email"
          type="email"
          name="contactEmail"
          value={values.contactEmail}
          onChange={handleChange}
          placeholder="office@school.edu.gh"
          icon={Mail}
        />
        <FormField
          label="School contact phone"
          type="tel"
          name="contactPhone"
          value={values.contactPhone}
          onChange={handleChange}
          placeholder="0XX XXX XXXX"
          icon={Phone}
        />

        {isError && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{errMessage}</p>
        )}

        <p className="text-xs leading-relaxed text-ink/50">
          By creating an account you agree to be contacted on the channels
          above with school and account notifications.
        </p>

        <p className="rounded-lg bg-sage/10 px-3 py-2 text-xs leading-relaxed text-sage">
          Are you a parent? Your school creates your login. Ask the school office for your email and password, then log in on the login page.
        </p>

        <SubmitButton loading={loading}>Create account</SubmitButton>
      </FormShell>
    </section>
  );
}