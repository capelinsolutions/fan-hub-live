import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Avatar } from "@/components/Avatar";
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
import { getMyProfile, updateMyProfile } from "@/services/profileService";
import { signOut } from "@/services/authService";
import { friendlyError } from "@/lib/errors";
import { LogOut, Mail } from "lucide-react";

const schema = z.object({
  display_name: z.string().trim().min(2, "Min 2 characters").max(40, "Max 40 characters"),
  country: z.string().min(1, "Select your country"),
  favorite_team: z.string().min(1, "Select your team"),
});

type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState<string>("");
  const [signingOut, setSigningOut] = useState(false);

  const profileQuery = useQuery({ queryKey: ["profile", "me"], queryFn: getMyProfile });

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { display_name: "", country: "", favorite_team: "" },
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        display_name: profileQuery.data.display_name,
        country: profileQuery.data.country,
        favorite_team: profileQuery.data.favorite_team,
      });
    }
  }, [profileQuery.data, form]);

  const mutation = useMutation({
    mutationFn: (values: Values) => updateMyProfile(values),
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      qc.invalidateQueries({ queryKey: ["profile", "me"] });
      qc.invalidateQueries({ queryKey: ["support"] });
      qc.invalidateQueries({ queryKey: ["fans"] });
    },
    onError: (e) => toast.error(friendlyError((e as Error).message)),
  });

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    qc.clear();
    navigate({ to: "/", replace: true });
  }

  if (profileQuery.isLoading || !profileQuery.data) {
    return (
      <ScreenContainer withBottomNav className="items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer withBottomNav className="px-5 pt-6">
      <header className="flex flex-col items-center text-center">
        <Avatar initials={profileQuery.data.avatar_initials} size="xl" />
        <h1 className="mt-4 text-2xl font-bold">{profileQuery.data.display_name}</h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="h-3 w-3" /> {email}
        </p>
      </header>

      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="mt-8 flex flex-col gap-4"
      >
        <div>
          <Label htmlFor="display_name">Display name</Label>
          <Input
            id="display_name"
            className="mt-1 h-12 rounded-xl"
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
            value={form.watch("country")}
            onValueChange={(v) => form.setValue("country", v, { shouldValidate: true })}
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
        </div>

        <div>
          <Label>Favorite team</Label>
          <Select
            value={form.watch("favorite_team")}
            onValueChange={(v) => form.setValue("favorite_team", v, { shouldValidate: true })}
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
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="pitch-gradient mt-4 h-14 rounded-2xl text-base font-semibold text-primary-foreground"
        >
          {mutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <Button
        onClick={handleSignOut}
        disabled={signingOut}
        variant="ghost"
        className="mt-6 h-12 rounded-2xl text-sm font-medium text-destructive hover:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" /> {signingOut ? "Signing out…" : "Logout"}
      </Button>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
        Fifa Fan Hub is an independent fan community app and is not affiliated with or endorsed by FIFA.
      </p>
    </ScreenContainer>
  );
}
