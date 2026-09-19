import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { AuthTokens, User } from "../types/auth";
import { AuthContext, type AuthContextValue } from "./auth-context";

interface StoredSession {
  user: User;
  tokens: AuthTokens;
}

const STORAGE_KEY = "edunotify_session";

function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<StoredSession | null>(() => readStoredSession());

  const setSession = useCallback((user: User, tokens: AuthTokens) => {
    const next: StoredSession = { user, tokens };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSessionState(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSessionState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      tokens: session?.tokens ?? null,
      isAuthenticated: session !== null,
      setSession,
      logout,
    }),
    [session, setSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
