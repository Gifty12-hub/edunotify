import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="font-display text-5xl font-800 text-indigo">404</h1>
      <p className="mt-4 text-sm text-ink/60">This page doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-indigo px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-indigo-light"
      >
        Back home
      </Link>
    </div>
  );
}