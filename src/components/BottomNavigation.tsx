import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/fans", label: "Fans", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] safe-bottom">
      <div className="mx-3 mb-3 rounded-2xl border border-border bg-card/95 px-2 py-2 shadow-lg backdrop-blur">
        <ul className="grid grid-cols-3">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium transition-colors active:scale-95",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", active && "stroke-[2.5]")}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
