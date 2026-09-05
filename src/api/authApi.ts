import userRecord from "./json/user.json";
import type { AuthResponse } from "../types/auth";

/**
 * Everything in this file is a stand-in for real HTTP calls to a backend.
 * loginRequest / signupRequest both return a Promise so they behave the
 * same way `fetch` would — components using them (via useApiRequest)
 * don't need to change when a real API replaces this file. Just swap the
 * body of each function for an actual request.
 */

// Demo-only mock credential. In a real app, passwords are never compared
// on the frontend — the server hashes and checks them.
const MOCK_PASSWORD = "password123";
const NETWORK_DELAY_MS = 900;

const record = userRecord as AuthResponse;

export function loginRequest(email: string, password: string): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const knownEmail = record.data.user.email.toLowerCase();
      if (email.trim().toLowerCase() === knownEmail && password === MOCK_PASSWORD) {
        resolve(record);
      } else {
        reject(new Error("Incorrect email or password."));
      }
    }, NETWORK_DELAY_MS);
  });
}

export function signupRequest(firstName: string, email: string): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const knownEmail = record.data.user.email.toLowerCase();
      if (email.trim().toLowerCase() === knownEmail) {
        reject(new Error("An account with that email already exists."));
        return;
      }
      // Demo only: "create" the account by handing back the same mock
      // record, with the name they actually typed swapped in.
      resolve({
        ...record,
        message: "Account created successfully",
        data: {
          ...record.data,
          user: { ...record.data.user, firstName, email },
        },
      });
    }, NETWORK_DELAY_MS);
  });
}