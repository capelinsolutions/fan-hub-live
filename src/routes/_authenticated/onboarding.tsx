import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, TEAMS } from "@/lib/constants";
import { createProfile, getMyProfile } from "@/services/profileService";
import { friendlyError } from "@/lib/errors";

const schema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, "Min 2 characters")
    .max(40, "Max 40 characters"),
  country: z.string().min(1, "Select your country"),
  favorite_team: z.string().min(1, "Select your team"),
});

type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { display_name: "", country: "", favorite_team: "" },
  });

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        if (p?.onboarding_completed) navigate({ to: "/home", replace: true });
      } catch {
        /* ignore */
      }
    })();
  }, [navigate]);

  async function onSubmit(values: Values) {
    setSubmitting(true);
    try {
      await createProfile(values);
      toast.success("Profile created!");
      navigate({ to: "/home", replace: true });
    } catch (e) {
      toast.error(friendlyError((e as Error).message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer className="px-6 pb-8">
      <div className="mt-6">
        <h1 className="text-3xl font-bold">Tell us about you</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick your team and join the fan hub.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
          <Label htmlFor="display_name">Display name</Label>
          <Input
            id="display_name"
            className="mt-1 h-12 rounded-xl"
            placeholder="Ali Khan"
            maxLength={40}
            {...form.register("display_name")}
          />
          {form.formState.errors.display_name && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.display_name.message}
            </p>
          )}
        </div>

        <div>
          <Label>Country</Label>
          <Select
            onValueChange={(v) => form.setValue("country", v, { shouldValidate: true })}
            value={form.watch("country")}
          >
            <SelectTrigger className="mt-1 h-12 rounded-xl">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.country && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.country.message}</p>
          )}
        </div>

        <div>
          <Label>Favorite team</Label>
          <Select
            onValueChange={(v) => form.setValue("favorite_team", v, { shouldValidate: true })}
            value={form.watch("favorite_team")}
          >
            <SelectTrigger className="mt-1 h-12 rounded-xl">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {TEAMS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.favorite_team && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.favorite_team.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="pitch-gradient mt-4 h-14 rounded-2xl text-base font-semibold text-primary-foreground"
        >
          {submitting ? "Saving…" : "Continue"}
        </Button>
      </form>
    </ScreenContainer>
  );
}
