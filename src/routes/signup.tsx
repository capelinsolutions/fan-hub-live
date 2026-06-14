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
import { signUp } from "@/services/authService";
import { friendlyAuthError } from "@/lib/errors";
import { ChevronLeft } from "lucide-react";

const schema = z
  .object({
    email: z.string().email("Enter a valid email").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(128),
    confirm: z.string().min(6, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", confirm: "" },
  });

  async function onSubmit(values: Values) {
    setLoading(true);
    const { data, error } = await signUp(values.email.trim(), values.password);
    setLoading(false);
    if (error) {
      toast.error(friendlyAuthError(error.message));
      return;
    }
    if (!data.session) {
      // Auto-confirm should be on for POC; if not, ask user to log in.
      toast.success("Account created! Please log in.");
      navigate({ to: "/login", replace: true });
      return;
    }
    toast.success("Welcome!");
    navigate({ to: "/onboarding", replace: true });
  }

  return (
    <ScreenContainer className="px-6 pb-8">
      <Link to="/" className="-ml-2 mt-2 inline-flex items-center text-sm text-muted-foreground">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join the fan hub in seconds.</p>
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
            autoComplete="new-password"
            className="mt-1 h-12 rounded-xl"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            className="mt-1 h-12 rounded-xl"
            {...form.register("confirm")}
          />
          {form.formState.errors.confirm && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.confirm.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="pitch-gradient mt-4 h-14 rounded-2xl text-base font-semibold text-primary-foreground"
        >
          {loading ? "Creating…" : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-pitch">
          Login
        </Link>
      </p>
    </ScreenContainer>
  );
}
