import { supabase } from "@/integrations/supabase/client";
import { getInitials } from "@/lib/avatar";

export interface ProfileInput {
  display_name: string;
  country: string;
  favorite_team: string;
}

export interface Profile {
  id: string;
  display_name: string;
  country: string;
  favorite_team: string;
  avatar_initials: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export async function getMyProfile(): Promise<Profile | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function createProfile(input: ProfileInput): Promise<Profile> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("Not signed in");
  const payload = {
    id: user.id,
    display_name: input.display_name.trim(),
    country: input.country,
    favorite_team: input.favorite_team,
    avatar_initials: getInitials(input.display_name),
    onboarding_completed: true,
  };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateMyProfile(input: ProfileInput): Promise<Profile> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("Not signed in");
  const payload = {
    display_name: input.display_name.trim(),
    country: input.country,
    favorite_team: input.favorite_team,
    avatar_initials: getInitials(input.display_name),
  };
  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const profile = await getMyProfile();
  return !!profile?.onboarding_completed;
}
