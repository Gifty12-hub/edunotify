import { apiFetch } from "../lib/api";
import type { AuthResponse } from "../types/auth";

export interface SchoolDetails {
  name: string;
  region: string;
  town: string;
  contactEmail: string;
  contactPhone: string;
}

export function loginRequest(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: { email, password },
  });
}

/**
 * Registers a new school and its first admin user in one call — this is
 * the only self-serve signup the backend supports today (see
 * backend/routes/auth.js: POST /register). There is no endpoint for a
 * parent to create their own account; parent contacts are added by a
 * school admin via the students API.
 */
export function registerSchoolRequest(
  fullName: string,
  email: string,
  password: string,
  school: SchoolDetails
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    skipAuth: true,
    body: { fullName, email, password, school },
  });
}