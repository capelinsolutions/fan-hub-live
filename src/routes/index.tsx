import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        navigate({ to: "/home", replace: true });
      } else {
        setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (checking) {
    return (
      <ScreenContainer className="items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-6 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="pitch-gradient mb-6 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl shadow-2xl shadow-pitch/30">
          ⚽
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Fifa <span className="text-pitch">Fan Hub</span>
        </h1>
        <p className="mt-4 text-lg font-medium text-foreground/90">
          Find football fans supporting your team.
        </p>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          Join the fan hub, choose your team, and discover supporters from around the world.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button asChild size="lg" className="pitch-gradient h-14 rounded-2xl text-base font-semibold text-primary-foreground shadow-lg">
          <Link to="/signup">Get Started</Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="h-12 rounded-2xl text-sm font-medium text-foreground/90">
          <Link to="/login">I already have an account</Link>
        </Button>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
          Fifa Fan Hub is an independent fan community app and is not affiliated with or endorsed by FIFA.
        </p>
      </div>
    </ScreenContainer>
  );
}
