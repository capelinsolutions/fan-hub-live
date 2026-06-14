import { supabase } from "@/integrations/supabase/client";
import { todayISO } from "@/lib/date";
import type { Profile } from "./profileService";

export interface DailySupport {
  id: string;
  user_id: string;
  team_name: string;
  support_date: string;
  created_at: string;
}

export async function getTodaySupport(): Promise<DailySupport | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;
  const { data, error } = await supabase
    .from("daily_supports")
    .select("*")
    .eq("user_id", user.id)
    .eq("support_date", todayISO())
    .maybeSingle();
  if (error) throw error;
  return data as DailySupport | null;
}

export async function supportFavoriteTeamToday(teamName: string): Promise<DailySupport> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("Not signed in");
  const payload = {
    user_id: user.id,
    team_name: teamName,
    support_date: todayISO(),
  };
  const { data, error } = await supabase
    .from("daily_supports")
    .upsert(payload, { onConflict: "user_id,support_date" })
    .select()
    .single();
  if (error) throw error;
  return data as DailySupport;
}

export interface FanRow {
  user_id: string;
  team_name: string;
  profile: Pick<Profile, "display_name" | "country" | "avatar_initials" | "favorite_team">;
}

export async function getFansSupportingTeamToday(teamName: string): Promise<FanRow[]> {
  const { data, error } = await supabase
    .from("daily_supports")
    .select(
      "user_id, team_name, profiles:profiles!daily_supports_user_id_fkey(display_name, country, avatar_initials, favorite_team)",
    )
    .eq("team_name", teamName)
    .eq("support_date", todayISO());
  if (error) throw error;
  return ((data ?? []) as Array<{
    user_id: string;
    team_name: string;
    profiles: FanRow["profile"] | null;
  }>)
    .filter((r) => r.profiles)
    .map((r) => ({ user_id: r.user_id, team_name: r.team_name, profile: r.profiles! }));
}

export async function getSupporterCountToday(teamName: string): Promise<number> {
  const { count, error } = await supabase
    .from("daily_supports")
    .select("id", { count: "exact", head: true })
    .eq("team_name", teamName)
    .eq("support_date", todayISO());
  if (error) throw error;
  return count ?? 0;
}
