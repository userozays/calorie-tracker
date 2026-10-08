import { profileRowSchema, type Profile } from "@calorie/core/schemas/rows";
import { toAppError } from "./errors";
import { supabase } from "./supabase";

export type { Profile };

/** The signed-in user's profile (created by the database when the account was made). */
export async function getMyProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw toAppError(error);
  return profileRowSchema.parse(data);
}
