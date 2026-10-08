import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { getSession, onSessionChange, type Session } from "@/services/authService";
import { getMyProfile, type Profile } from "@/services/profileService";

/**
 * Where the user is in the app's lifecycle; the root layout routes on this alone
 * (contracts/screens.md): signed out → welcome, set-up incomplete → setup, else the tabs.
 */
type SessionStatus = "loading" | "signedOut" | "needsSetup" | "ready" | "error";

export interface SessionState {
  status: SessionStatus;
  session: Session | null;
  profile: Profile | null;
  /** Shown on the error screen when the profile could not be loaded. */
  error: Error | null;
  retry: () => void;
}

/** Used once, by SessionProvider. */
export function useSessionController(): SessionState {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    void getSession().then((s) => active && setSession(s));
    const unsubscribe = onSessionChange((s) => setSession(s));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const userId = session?.user.id ?? null;
  const profile = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getMyProfile(userId as string),
    enabled: userId !== null,
  });

  let status: SessionStatus;
  if (session === undefined) status = "loading";
  else if (session === null) status = "signedOut";
  else if (profile.isError) status = "error";
  else if (!profile.data) status = "loading";
  else status = profile.data.onboardingCompleted ? "ready" : "needsSetup";

  return {
    status,
    session: session ?? null,
    profile: profile.data ?? null,
    error: profile.error,
    retry: () => void profile.refetch(),
  };
}

export const SessionContext = createContext<SessionState | null>(null);

export function useSession(): SessionState {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}
