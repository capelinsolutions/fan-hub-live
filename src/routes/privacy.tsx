import { createFileRoute, Link } from "@tanstack/react-router";
import { ScreenContainer } from "@/components/ScreenContainer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Fifa Fan Hub" },
      {
        name: "description",
        content:
          "Privacy policy for Fifa Fan Hub: what data we collect, how we use it, and your rights.",
      },
      { property: "og:title", content: "Privacy Policy — Fifa Fan Hub" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <ScreenContainer className="px-6 pb-10 pt-8">
      <header className="mb-6">
        <Link to="/" className="text-xs text-muted-foreground">
          ← Back
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: June 14, 2026
        </p>
      </header>

      <div className="space-y-5 text-sm leading-relaxed text-foreground/90">
        <p>
          Fifa Fan Hub ("we", "us") is an independent football fan community
          app. This policy explains what we collect and how we use it. We are
          not affiliated with or endorsed by FIFA.
        </p>

        <section>
          <h2 className="mb-1 text-base font-semibold">Information we collect</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Account info: email address and password (encrypted).</li>
            <li>Profile info: display name, country, favorite team, initials.</li>
            <li>Activity: which team you support on a given day.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-1 text-base font-semibold">How we use it</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>To create your account and let you sign in.</li>
            <li>To show your profile to other fans.</li>
            <li>To show daily fan counts for each team.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-1 text-base font-semibold">Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell your personal data. Your display name, country,
            favorite team, and initials are visible to other signed-in fans.
            We use a hosted backend provider to store data securely.
          </p>
        </section>

        <section>
          <h2 className="mb-1 text-base font-semibold">Your rights</h2>
          <p className="text-muted-foreground">
            You can edit your profile, log out, or request deletion of your
            account at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-1 text-base font-semibold">Children</h2>
          <p className="text-muted-foreground">
            Fifa Fan Hub is not directed to children under 13.
          </p>
        </section>

        <section>
          <h2 className="mb-1 text-base font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            Questions? Email support@fifafanhub.app.
          </p>
        </section>
      </div>
    </ScreenContainer>
  );
}
