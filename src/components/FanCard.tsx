import { Avatar } from "./Avatar";
import { MapPin } from "lucide-react";

interface Props {
  initials: string;
  displayName: string;
  country: string;
  team: string;
}

export function FanCard({ initials, displayName, country, team }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <Avatar initials={initials} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> From {country}
        </p>
        <p className="mt-1 truncate text-xs text-pitch">⚽ Supporting {team}</p>
      </div>
    </div>
  );
}
