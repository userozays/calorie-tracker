import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type { Session };

/** The stored session, if any (restored from encrypted storage at startup). */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Calls `listener` whenever the user signs in, signs out or the token refreshes; returns an unsubscribe. */
export function onSessionChange(listener: (session: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => listener(session));
  return () => data.subscription.unsubscribe();
}
