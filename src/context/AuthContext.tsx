import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthTokens, User } from "../types/auth";

interface StoredSession {
  user: User;
  tokens: AuthTokens;
}

interface AuthContextValue {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setSession: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "edunotify_session";

function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    // Corrupt or missing localStorage data. Treat as logged out.
    return null;
  }
}

/**
 * Global store for "who is logged in." The user + tokens live in React
 * state (so the app re-renders when they change) and are mirrored into
 * localStorage (so a page refresh doesn't log the person out. The
 * lazy useState initializer below reads localStorage exactly once, on
 * first mount).
 *
 * TODO: once a real backend exists, setSession should also be called
 * after verifying the accessToken is still valid, and logout should call
 * a real "invalidate this token" endpoint.
 */
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

  // useMemo keeps this object's identity stable across renders unless
  // session/setSession/logout actually changed. Without it, every render
  // of AuthProvider would create a brand-new object, and every component
  // reading useAuth() would re-render even when nothing meaningful changed.
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}