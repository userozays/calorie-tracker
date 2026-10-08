import { randomUUID } from "node:crypto";
import { after } from "node:test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
 * Database tests run against the hosted Supabase dev project (no Docker on the dev machine; see
 * specs/001-mobile-foundation/research.md §7). They need SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY and
 * SUPABASE_SERVICE_ROLE_KEY; without them every suite is skipped, not failed.
 */

const url = process.env.SUPABASE_URL ?? "";
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Pass as `{ skip }` to describe() so the suite reports "skipped" without the dev project. */
export const skip = !url || !publishableKey || !serviceKey ? "SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY / SUPABASE_SERVICE_ROLE_KEY not set" : false;

const noSession = { auth: { persistSession: false, autoRefreshToken: false } };

/** Service-role client: bypasses RLS; used only to set up and clean up test data. */
export const admin = (): SupabaseClient => createClient(url, serviceKey, noSession);

export interface TestUser {
  id: string;
  email: string;
  client: SupabaseClient;
}

const created: string[] = [];

/** A throwaway confirmed user, signed in through the publishable key like the app; deleted after the suite. */
export async function createTestUser(): Promise<TestUser> {
  const email = `test-${randomUUID()}@example.com`;
  const password = `pw-${randomUUID()}`;
  const { data, error } = await admin().auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) throw error ?? new Error("createUser returned no user");
  created.push(data.user.id);

  const client = createClient(url, publishableKey, noSession);
  const signIn = await client.auth.signInWithPassword({ email, password });
  if (signIn.error) throw signIn.error;
  return { id: data.user.id, email, client };
}

/** An anonymous client (publishable key, no session). */
export const anonymous = (): SupabaseClient => createClient(url, publishableKey, noSession);

after(async () => {
  if (skip) return;
  for (const id of created.splice(0)) await admin().auth.admin.deleteUser(id);
});
