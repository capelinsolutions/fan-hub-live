import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/ScreenContainer";
import { FanCard } from "@/components/FanCard";
import { Button } from "@/components/ui/button";
import { getMyProfile } from "@/services/profileService";
import {
  getTodaySupport,
  getFansSupportingTeamToday,
} from "@/services/dailySupportService";
import { ChevronLeft, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/fans")({
  component: FansList,
});

function FansList() {
  const profileQuery = useQuery({ queryKey: ["profile", "me"], queryFn: getMyProfile });
  const supportQuery = useQuery({
    queryKey: ["support", "today"],
    queryFn: getTodaySupport,
    enabled: !!profileQuery.data,
  });

  const team = supportQuery.data?.team_name;

  const fansQuery = useQuery({
    queryKey: ["fans", team],
    queryFn: () => getFansSupportingTeamToday(team!),
    enabled: !!team,
  });

  const loading = profileQuery.isLoading || supportQuery.isLoading;

  return (
    <ScreenContainer withBottomNav className="px-5 pt-6">
      <Link to="/home" className="-ml-2 inline-flex items-center text-sm text-muted-foreground">
        <ChevronLeft className="h-4 w-4" /> Home
      </Link>

      <header className="mt-2 flex items-center gap-2">
        <Users className="h-5 w-5 text-pitch" />
        <h1 className="text-2xl font-bold">Fans today</h1>
      </header>
      {team && (
        <p className="mt-1 text-sm text-muted-foreground">Supporting {team}</p>
      )}

      <div className="mt-6 flex-1">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading fans…</p>
        ) : !team ? (
          <EmptyState
            title="No team selected today"
            description="Choose your team support for today first."
            actionTo="/home"
            actionLabel="Go to Home"
          />
        ) : fansQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading fans…</p>
        ) : fansQuery.error ? (
          <p className="text-sm text-destructive">Couldn't load fans. Try again.</p>
        ) : (fansQuery.data ?? []).length === 0 ? (
          <EmptyState
            title="No fans yet"
            description="No other fans are supporting this team yet. You are one of the first!"
            actionTo="/home"
            actionLabel="Back to Home"
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {fansQuery.data!.map((f) => (
              <li key={f.user_id}>
                <FanCard
                  initials={f.profile.avatar_initials}
                  displayName={f.profile.display_name}
                  country={f.profile.country}
                  team={f.team_name}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </ScreenContainer>
  );
}

function EmptyState({
  title,
  description,
  actionTo,
  actionLabel,
}: {
  title: string;
  description: string;
  actionTo: "/home";
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
      <div className="text-4xl">⚽</div>
      <p className="mt-3 text-base font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <Button asChild className="pitch-gradient mt-5 h-11 rounded-xl px-6 text-sm font-semibold text-primary-foreground">
        <Link to={actionTo}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
