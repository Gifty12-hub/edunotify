// src/lib/api.ts
// Shared fetch wrapper for every real call to edunotify-backend.
// Reads the stored session (written by AuthContext.setSession) and
// attaches it as a Bearer token automatically, so callers never have
// to think about auth headers.

import type {
  Channel, Language, NotificationRecord, PortalChild, PortalMessage, ResultsPreview, ParentAccount, ResultRecord, StatsResponse, StudentRecord, BulkSendSummary, ResultsNotifySummary,
} from "../types/api";

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

export function getStudents() {
  return apiFetch<{ students: StudentRecord[] }>("/students");
}

export function createStudent(body: {
  fullName: string;
  className: string;
  parent: { fullName: string; phone: string; email?: string; preferredChannel: Channel; preferredLanguage: Language };
}) {
  return apiFetch<{ student: StudentRecord }>("/students", { method: "POST", body });
}

export function sendNotification(studentId: string, message: string) {
  // sentBy is derived server-side from the authenticated user, not sent here.
  return apiFetch<{ notification: NotificationRecord }>("/notifications", {
    method: "POST",
    body: { studentId, message },
  });
}

export function broadcastNotification(message: string, className?: string, translate = false) {
  return apiFetch<BulkSendSummary>("/notifications/broadcast", {
    method: "POST",
    body: { message, className: className || undefined, translate },
  });
}

export function getNotifications() {
  return apiFetch<{ notifications: NotificationRecord[] }>("/notifications");
}

export function getStats() {
  return apiFetch<StatsResponse>("/stats");
}

export function getResults(params: { className?: string; term: string; academicYear: string }) {
  const q = new URLSearchParams(params as Record<string, string>);
  return apiFetch<{ results: ResultRecord[] }>(`/results?${q.toString()}`);
}

export function saveResults(body: {
  term: string;
  academicYear: string;
  entries: { studentId: string; subject: string; score: number }[];
}) {
  return apiFetch<{ saved: number }>("/results/bulk", { method: "POST", body });
}

export function notifyResults(body: { term: string; academicYear: string; className: string; useAi: boolean }) {
  return apiFetch<ResultsNotifySummary>("/results/notify", { method: "POST", body });
}

export function previewResults(body: { studentId: string; term: string; academicYear: string; useAi: boolean }) {
  return apiFetch<ResultsPreview>("/results/preview", { method: "POST", body });
}

export function createParentAccount(parentId: string, email?: string) {
  return apiFetch<ParentAccount>(`/parents/${parentId}/account`, { method: "POST", body: { email } });
}

export function getPortalChildren() {
  return apiFetch<{ children: PortalChild[] }>("/portal/children");
}

export function getPortalMessages() {
  return apiFetch<{ messages: PortalMessage[] }>("/portal/messages");
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiFetch<{ ok: boolean }>("/auth/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}
