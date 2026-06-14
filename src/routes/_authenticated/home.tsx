import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { getMyProfile } from "@/services/profileService";
import {
  getTodaySupport,
  getSupporterCountToday,
  supportFavoriteTeamToday,
} from "@/services/dailySupportService";
import { friendlyError } from "@/lib/errors";
import { MapPin, Users, Trophy, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", "me"],
    queryFn: getMyProfile,
  });

  useEffect(() => {
    if (profileQuery.data && !profileQuery.data.onboarding_completed) {
      navigate({ to: "/onboarding", replace: true });
    }
    if (profileQuery.isSuccess && !profileQuery.data) {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [profileQuery.data, profileQuery.isSuccess, navigate]);

  const team = profileQuery.data?.favorite_team;

  const supportQuery = useQuery({
    queryKey: ["support", "today"],
    queryFn: getTodaySupport,
    enabled: !!profileQuery.data,
  });

  const countQuery = useQuery({
    queryKey: ["support", "count", team],
    queryFn: () => getSupporterCountToday(team!),
    enabled: !!team,
  });

  const mutation = useMutation({
    mutationFn: () => supportFavoriteTeamToday(team!),
    onSuccess: () => {
      toast.success(`You are now supporting ${team} today!`);
      qc.invalidateQueries({ queryKey: ["support"] });
    },
    onError: (e) => toast.error(friendlyError((e as Error).message)),
  });

  if (profileQuery.isLoading || !profileQuery.data) {
    return (
      <ScreenContainer withBottomNav className="items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your fan profile…</p>
      </ScreenContainer>
    );
  }

  const profile = profileQuery.data;
  const isSupporting = supportQuery.data?.team_name === team;

  return (
    <ScreenContainer withBottomNav className="px-5 pt-6">
      <header className="flex items-center gap-3">
        <Avatar initials={profile.avatar_initials} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Welcome</p>
          <h1 className="truncate text-2xl font-bold">{profile.display_name}</h1>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {profile.country}
          </p>
        </div>
      </header>

      <section className="pitch-gradient mt-8 rounded-3xl p-6 text-primary-foreground shadow-xl shadow-pitch/20">
        <div className="flex items-center gap-2 text-sm font-medium opacity-90">
          <Trophy className="h-4 w-4" /> Your team
        </div>
        <p className="mt-2 text-3xl font-extrabold">{profile.favorite_team}</p>
        <p className="mt-1 text-sm opacity-90">Your favorite team is {profile.favorite_team}.</p>

        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          size="lg"
          className="mt-5 h-14 w-full rounded-2xl bg-background text-base font-semibold text-foreground hover:bg-background/90"
        >
          {isSupporting ? (
            <span className="inline-flex items-center gap-2">
              <Check className="h-5 w-5 text-pitch" /> Supporting today
            </span>
          ) : mutation.isPending ? (
            "Saving…"
          ) : (
            "I support this team today"
          )}
        </Button>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" /> Today's fan count
        </div>
        <p className="mt-2 text-lg font-semibold">
          <span className="text-3xl font-extrabold text-pitch">
            {countQuery.isLoading ? "…" : (countQuery.data ?? 0)}
          </span>{" "}
          fans are supporting {profile.favorite_team} today
        </p>
        <Button
          asChild
          variant="secondary"
          className="mt-4 h-12 w-full rounded-xl text-sm font-semibold"
        >
          <Link to="/fans">View Fans</Link>
        </Button>
      </section>
    </ScreenContainer>
  );
}
