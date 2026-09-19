// src/lib/api.ts
// Shared fetch wrapper for every real call to edunotify-backend.
// Reads the stored session (written by AuthContext.setSession) and
// attaches it as a Bearer token automatically, so callers never have
// to think about auth headers.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const STORAGE_KEY = "edunotify_session";

interface StoredSession {
  tokens?: { accessToken?: string };
}

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    return parsed.tokens?.accessToken ?? null;
  } catch {
    // Corrupt localStorage. Treat as "no token" rather than crash the call.
    return null;
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the Authorization header (login/register calls). */
  skipAuth?: boolean;
}

/**
 * Wraps fetch() with: the API base URL, JSON headers, automatic Bearer
 * token attachment, and consistent error handling (the backend's
 * `{ error: "..." }` shape becomes a thrown Error with that message).
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { skipAuth, body, headers, ...rest } = options;
  const token = skipAuth ? null : getStoredToken();

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Couldn't reach the server. Check your connection and try again.", 0);
  }

  // 204 No Content has no body to parse.
  const payload = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message = (payload as { error?: string } | null)?.error || `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export function sendNotification(studentId: string, message: string) {
  // sentBy is derived server-side from the authenticated user, not sent here.
  return apiFetch<{ notification: unknown; providerResult: unknown }>("/notifications", {
    method: "POST",
    body: { studentId, message },
  });
}

export function login(email: string, password: string) {
  return apiFetch<{ tokens: { accessToken: string }; user: unknown }>("/auth/login", {
    method: "POST",
    body: { email, password },
    skipAuth: true,
  });
}

export function getStudents() {
  return apiFetch<{ students: unknown[] }>("/students");
}

export function getParents() {
  return apiFetch<{ parents: unknown[] }>("/parents");
}

export function getSchool() {
  return apiFetch<{ school: unknown }>("/school");
}