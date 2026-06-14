import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/services/authService";
import { hasCompletedOnboarding } from "@/services/profileService";
import { friendlyAuthError } from "@/lib/errors";
import { ChevronLeft } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: Values) {
    setLoading(true);
    const { error } = await signIn(values.email.trim(), values.password);
    if (error) {
      setLoading(false);
      toast.error(friendlyAuthError(error.message));
      return;
    }
    try {
      const done = await hasCompletedOnboarding();
      navigate({ to: done ? "/home" : "/onboarding", replace: true });
    } catch {
      navigate({ to: "/onboarding", replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer className="px-6 pb-8">
      <Link to="/" className="-ml-2 mt-2 inline-flex items-center text-sm text-muted-foreground">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className="mt-1 h-12 rounded-xl"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1 h-12 rounded-xl"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="pitch-gradient mt-4 h-14 rounded-2xl text-base font-semibold text-primary-foreground"
        >
          {loading ? "Signing in…" : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-pitch">
          Create an account
        </Link>
      </p>
    </ScreenContainer>
  );
}
