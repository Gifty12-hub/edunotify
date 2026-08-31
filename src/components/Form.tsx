import type { ChangeEvent, FormEvent, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Small, composable form primitives shared across Login, Signup and Contact.
 * Kept dependency-free (no form library) since the current scope is UI-only —
 * swap the onSubmit handlers for real API calls once the backend is ready.
 */

interface FormShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  footer?: ReactNode;
}

export function FormShell({ title, subtitle, children, onSubmit, footer }: FormShellProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white/60 p-8 shadow-sm shadow-indigo/5">
      <h1 className="font-display text-2xl font-700 text-indigo">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-ink/60">{subtitle}</p>}
      <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5" noValidate>
        {children}
      </form>
      {footer && <div className="mt-6 text-center text-sm text-ink/65">{footer}</div>}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: LucideIcon;
}

export function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = true,
  error,
  icon: Icon,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink/80">{label}</span>
      <span className="relative flex items-center">
        {Icon && (
          <Icon size={16} className="pointer-events-none absolute left-3.5 text-ink/40" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-indigo ${
            Icon ? "pl-10" : ""
          } ${error ? "border-clay" : "border-line"}`}
        />
      </span>
      {error && <span className="text-xs text-clay">{error}</span>}
    </label>
  );
}

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export function FormTextarea({ label, name, value, onChange, placeholder, required = true }: FormTextareaProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink/80">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={5}
        className="w-full resize-none rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-indigo"
      />
    </label>
  );
}

interface SubmitButtonProps {
  children: ReactNode;
  loading?: boolean;
}

export function SubmitButton({ children, loading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-1 rounded-lg bg-indigo px-5 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-indigo-light disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}