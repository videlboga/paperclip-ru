import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyPatternIcon } from "@/components/CompanyPatternIcon";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";
import {
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  FlaskConical,
  KeyRound,
  Link2,
  Loader2,
  MailPlus,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

const inviteRoleOptions = [
  {
    value: "viewer",
    label: "Viewer",
    description: "Can view company work and follow along.",
    gets: "View-only company membership.",
  },
  {
    value: "operator",
    label: "Operator",
    description: "Recommended for people who need to help run work without managing access.",
    gets: "Can assign tasks.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Recommended for operators who need to invite people, create agents, and approve joins.",
    gets: "Can create agents, invite users, assign tasks, and approve join requests.",
  },
  {
    value: "owner",
    label: "Owner",
    description: "Full company access, including membership management.",
    gets: "Everything in Admin, plus managing members.",
  },
] as const;

const inviteHistory = [
  {
    id: "invite-active",
    state: "Active",
    humanRole: "operator",
    invitedBy: "Board User 25",
    email: "board25@paperclip.local",
    createdAt: "Apr 25, 2026, 9:00 AM",
    action: "Revoke",
    relatedLabel: "Review request",
  },
  {
    id: "invite-accepted",
    state: "Accepted",
    humanRole: "viewer",
    invitedBy: "Board User 24",
    email: "board24@paperclip.local",
    createdAt: "Apr 24, 2026, 8:15 AM",
    action: "Inactive",
    relatedLabel: "—",
  },
  {
    id: "invite-revoked",
    state: "Revoked",
    humanRole: "admin",
    invitedBy: "Board User 20",
    email: "board20@paperclip.local",
    createdAt: "Apr 20, 2026, 2:45 PM",
    action: "Inactive",
    relatedLabel: "—",
  },
  {
    id: "invite-expired",
    state: "Expired",
    humanRole: "owner",
    invitedBy: "Board User 19",
    email: "board19@paperclip.local",
    createdAt: "Apr 19, 2026, 7:10 PM",
    action: "Inactive",
    relatedLabel: "—",
  },
] as const;

const fieldClassName =
  "w-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500";
const panelClassName = "border border-zinc-800 bg-zinc-950/95 p-6";

function LabSection({
  eyebrow,
  title,
  description,
  accentClassName,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accentClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-border/70 bg-background/80 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5",
        accentClassName,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function StatusCard({
  icon,
  title,
  body,
  tone = "default",
}: {
  icon: ReactNode;
  title: string;
  body: string;
  tone?: "default" | "warn" | "success" | "error";
}) {
  const toneClassName = {
    default: "border-border/70 bg-background/85",
    warn: "border-amber-400/40 bg-amber-500/[0.08]",
    success: "border-emerald-400/40 bg-emerald-500/[0.08]",
    error: "border-rose-400/40 bg-rose-500/[0.08]",
  }[tone];

  return (
    <Card className={cn("rounded-[24px] shadow-none", toneClassName)}>
      <CardHeader className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current/10 bg-background/70 text-muted-foreground">
          {icon}
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="mt-2 text-sm leading-6">{body}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

function InviteLandingShell({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 shadow-[0_30px_80px_rgba(2,6,23,0.55)]">
      <div className="grid gap-px bg-zinc-800 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className={cn(panelClassName, "space-y-6 bg-zinc-950")}>{left}</section>
        <section className={cn(panelClassName, "h-full bg-zinc-950")}>{right}</section>
      </div>
    </div>
  );
}

function InviteSummaryPanel({
  title,
  description,
  inviteMessage,
  requestedAccess,
  signedInLabel,
}: {
  title: string;
  description: string;
  inviteMessage?: string;
  requestedAccess: string;
  signedInLabel?: string;
}) {
  return (
    <>
      <div className="flex items-start gap-4">
        <CompanyPatternIcon
          companyName="Acme Robotics"
          logoUrl="/api/invites/pcp_invite_test/logo"
          brandColor="#114488"
          className="h-16 w-16 rounded-none border border-zinc-800"
        />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t("ppages_InviteUxLab.youaposve_been_invited_to_join_paperclip", {defaultValue: "You&apos;ve been invited to join Paperclip"})}</p>
          <h3 className="mt-2 text-2xl font-semibold text-zinc-100">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">{description}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetaCard label={t("ppages_InviteUxLab.company", {defaultValue: "Company"})} value="Acme Robotics" />
        <MetaCard label={t("ppages_InviteUxLab.invited_by", {defaultValue: "Invited by"})} value="Board User" />
        <MetaCard label={t("ppages_InviteUxLab.requested_access", {defaultValue: "Requested access"})} value={requestedAccess} />
        <MetaCard label={t("ppages_InviteUxLab.invite_expires", {defaultValue: "Invite expires"})} value="Mar 7, 2027" />
      </div>

      {inviteMessage ? (
        <div className="border border-amber-500/40 bg-amber-500/10 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-amber-200/80">{t("ppages_InviteUxLab.message_from_inviter", {defaultValue: "Message from inviter"})}</div>
          <p className="mt-2 text-sm leading-6 text-amber-50">{inviteMessage}</p>
        </div>
      ) : null}

      {signedInLabel ? (
        <div className="border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-50">
          Signed in as <span className="font-medium">{signedInLabel}</span>.
        </div>
      ) : null}
    </>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-800 p-3">
      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</div>
      <div className="mt-1 text-sm text-zinc-100">{value}</div>
    </div>
  );
}

function InlineAuthPreview({
  mode,
  feedback,
  working,
}: {
  mode: "sign_up" | "sign_in";
  feedback?: { tone: "info" | "error"; text: string };
  working?: boolean;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">
          {mode === "sign_up" ? "Create your account" : "Sign in to continue"}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          {mode === "sign_up"
            ? "Start with a Paperclip account. After that, you'll come right back here to accept the invite for Acme Robotics."
            : "Use the Paperclip account that already matches this invite. If you do not have one yet, switch back to create account."}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={cn(
            "flex-1 border px-3 py-2 text-sm transition-colors",
            mode === "sign_up"
              ? "border-zinc-100 bg-zinc-100 text-zinc-950"
              : "border-zinc-800 text-zinc-300 hover:border-zinc-600",
          )}
        >
          Create account
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 border px-3 py-2 text-sm transition-colors",
            mode === "sign_in"
              ? "border-zinc-100 bg-zinc-100 text-zinc-950"
              : "border-zinc-800 text-zinc-300 hover:border-zinc-600",
          )}
        >
          I already have an account
        </button>
      </div>

      <form className="space-y-4">
        {mode === "sign_up" ? (
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-400">{t("ppages_InviteUxLab.name", {defaultValue: "Name"})}</span>
            <input name="name" className={fieldClassName} defaultValue="Jane Example" readOnly />
          </label>
        ) : null}
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">{t("ppages_InviteUxLab.email", {defaultValue: "Email"})}</span>
          <input name="email" type="email" className={fieldClassName} defaultValue="jane@example.com" readOnly />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">{t("ppages_InviteUxLab.password", {defaultValue: "Password"})}</span>
          <input name="password" type="password" className={fieldClassName} defaultValue="supersecret" readOnly />
        </label>
        {feedback ? (
          <p className={cn("text-xs", feedback.tone === "info" ? "text-amber-300" : "text-red-400")}>
            {feedback.text}
          </p>
        ) : null}
        <Button type="button" className="w-full rounded-none" disabled={working}>
          {working ? "Working..." : mode === "sign_in" ? "Sign in and continue" : "Create account and continue"}
        </Button>
      </form>

      <p className="text-xs leading-5 text-zinc-500">
        {mode === "sign_up"
          ? "Already signed up before? Use the existing-account option instead so the invite lands on the right Paperclip user."
          : "No account yet? Switch back to create account so you can accept the invite with a new login."}
      </p>
    </div>
  );
}

function AgentRequestPreview() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{t("ppages_InviteUxLab.submit_agent_details", {defaultValue: "Submit agent details"})}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          This invite will create an approval request for a new agent in Acme Robotics.
        </p>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{t("ppages_InviteUxLab.agent_name", {defaultValue: "Agent name"})}</span>
        <input className={fieldClassName} defaultValue="Acme Ops Agent" readOnly />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{t("ppages_InviteUxLab.adapter_type", {defaultValue: "Adapter type"})}</span>
        <select className={fieldClassName} defaultValue="codex_local" disabled>
          <option value="codex_local">{t("ppages_InviteUxLab.codex", {defaultValue: "Codex"})}</option>
          <option value="claude_local">{t("ppages_InviteUxLab.claude_code", {defaultValue: "Claude Code"})}</option>
          <option value="cursor">{t("ppages_InviteUxLab.cursor", {defaultValue: "Cursor"})}</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{t("ppages_InviteUxLab.capabilities", {defaultValue: "Capabilities"})}</span>
        <textarea
          className={fieldClassName}
          rows={4}
          defaultValue="Reviews invites, triages requests, and keeps the board queue moving."
          readOnly
        />
      </label>
      <Button type="button" className="w-full rounded-none">
        Submit request
      </Button>
    </div>
  );
}

function AcceptInvitePreview({
  autoAccept,
  isCurrentMember,
  error,
}: {
  autoAccept?: boolean;
  isCurrentMember?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{t("ppages_InviteUxLab.accept_company_invite", {defaultValue: "Accept company invite"})}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {autoAccept
            ? "Granting your access to Acme Robotics."
            : isCurrentMember
              ? "This account already belongs to Acme Robotics."
              : "This will grant or complete your access to Acme Robotics."}
        </p>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {autoAccept ? (
        <div className="text-sm text-zinc-400">{t("ppages_InviteUxLab.submitting_request", {defaultValue: "Submitting request..."})}</div>
      ) : (
        <Button type="button" className="w-full rounded-none" disabled={isCurrentMember}>
          Accept invite
        </Button>
      )}
    </div>
  );
}

function InviteResultPreview({
  title,
  description,
  claimSecret,
  onboardingTextUrl,
  joinedNow = false,
}: {
  title: string;
  description: string;
  claimSecret?: string;
  onboardingTextUrl?: string;
  joinedNow?: boolean;
}) {
  return (
    <div className="mx-auto max-w-md border border-zinc-800 bg-zinc-950 p-6 text-zinc-100">
      <div className="flex items-center gap-3">
        <CompanyPatternIcon
          companyName="Acme Robotics"
          logoUrl="/api/invites/pcp_invite_test/logo"
          brandColor="#114488"
          className="h-12 w-12 rounded-none border border-zinc-800"
        />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        <p className="text-sm text-zinc-400">{description}</p>
        {joinedNow ? (
          <Button type="button" className="w-full rounded-none">
            Open board
          </Button>
        ) : (
          <>
            <div className="border border-zinc-800 p-3">
              <p className="mb-1 text-xs text-zinc-500">{t("ppages_InviteUxLab.approval_page", {defaultValue: "Approval page"})}</p>
              <a className="text-sm text-zinc-200 underline underline-offset-2" href="/company/settings/members">
                Company Settings → Members
              </a>
            </div>
            <p className="text-xs text-zinc-500">
              Refresh this page after you&apos;ve been approved — you&apos;ll be redirected automatically.
            </p>
          </>
        )}
        {claimSecret ? (
          <div className="space-y-1 border border-zinc-800 p-3 text-xs text-zinc-400">
            <div className="text-zinc-200">{t("ppages_InviteUxLab.claim_secret", {defaultValue: "Claim secret"})}</div>
            <div className="font-mono break-all">{claimSecret}</div>
            <div className="font-mono break-all">{t("ppages_InviteUxLab.post_apiagentsclaimapikey", {defaultValue: "POST /api/agents/claim-api-key"})}</div>
          </div>
        ) : null}
        {onboardingTextUrl ? (
          <div className="text-xs text-zinc-400">
            Onboarding: <span className="font-mono break-all">{onboardingTextUrl}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AuthScreenPreview({ mode, error }: { mode: "sign_in" | "sign_up"; error?: string }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-border/70 bg-background shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-px bg-border/60 md:grid-cols-2">
        <div className="flex min-h-[420px] flex-col justify-center bg-background px-8 py-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("ppages_InviteUxLab.paperclip", {defaultValue: "Paperclip"})}</span>
            </div>
            <h3 className="text-xl font-semibold">
              {mode === "sign_in" ? "Sign in to Paperclip" : "Create your Paperclip account"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "sign_in"
                ? "Use your email and password to access this instance."
                : "Create an account for this instance. Email confirmation is not required in v1."}
            </p>
            <div className="mt-6 space-y-4">
              {mode === "sign_up" ? (
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{t("ppages_InviteUxLab.name", {defaultValue: "Name"})}</span>
                  <input
                    className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                    defaultValue="Jane Example"
                    readOnly
                  />
                </label>
              ) : null}
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{t("ppages_InviteUxLab.email", {defaultValue: "Email"})}</span>
                <input
                  className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  defaultValue="jane@example.com"
                  readOnly
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{t("ppages_InviteUxLab.password", {defaultValue: "Password"})}</span>
                <input
                  className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  defaultValue="supersecret"
                  readOnly
                />
              </label>
              {error ? <p className="text-xs text-destructive">{error}</p> : null}
              <Button type="button" className="w-full">
                {mode === "sign_in" ? "Sign In" : "Create Account"}
              </Button>
            </div>
            <div className="mt-5 text-sm text-muted-foreground">
              {mode === "sign_in" ? "Need an account?" : "Already have an account?"}{" "}
              <span className="font-medium text-foreground underline underline-offset-2">
                {mode === "sign_in" ? "Create one" : "Sign in"}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden min-h-[420px] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.18),transparent_48%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,1))] px-8 py-10 md:flex">
          <div className="max-w-sm space-y-4 text-zinc-200">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cyan-200">
              Auth preview
            </div>
            <div className="text-2xl font-semibold">{t("ppages_InviteUxLab.sidebyside_signup_styling_review", {defaultValue: "Side-by-side signup styling review"})}</div>
            <p className="text-sm leading-6 text-zinc-400">
              This frame mirrors the production auth surface so spacing, label density, button treatments, and desktop composition are easy to compare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyInvitesPreview() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <Card className="rounded-[28px] shadow-none">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MailPlus className="h-4 w-4" />
            Company Invites
          </div>
          <div>
            <CardTitle>{t("ppages_InviteUxLab.create_invite", {defaultValue: "Create invite"})}</CardTitle>
            <CardDescription className="mt-2">
              Generate a human invite link and choose the default access it should request.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{t("ppages_InviteUxLab.choose_a_role", {defaultValue: "Choose a role"})}</legend>
            <div className="rounded-2xl border border-border">
              {inviteRoleOptions.map((option, index) => (
                <label
                  key={option.value}
                  className={cn("flex cursor-default gap-3 px-4 py-4", index > 0 && "border-t border-border")}
                >
                  <input
                    type="radio"
                    readOnly
                    checked={option.value === "operator"}
                    className="mt-1 h-4 w-4 border-border text-foreground"
                  />
                  <span className="min-w-0 space-y-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{option.label}</span>
                      {option.value === "operator" ? (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          Default
                        </span>
                      ) : null}
                    </span>
                    <span className="block max-w-2xl text-sm text-muted-foreground">{option.description}</span>
                    <span className="block text-sm text-foreground">{option.gets}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
            Each invite link is single-use. Human invitees get the selected role immediately after sign-in; agent invites still create a join request for approval.
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button">{t("ppages_InviteUxLab.create_invite", {defaultValue: "Create invite"})}</Button>
            <span className="text-sm text-muted-foreground">{t("ppages_InviteUxLab.invite_history_below_keeps_the_audit_trail", {defaultValue: "Invite history below keeps the audit trail."})}</span>
          </div>

          <div className="space-y-3 rounded-2xl border border-border px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{t("ppages_InviteUxLab.latest_invite_link", {defaultValue: "Latest invite link"})}</div>
                <div className="text-sm text-muted-foreground">
                  This URL includes the current Paperclip domain returned by the server.
                </div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                <Check className="h-3.5 w-3.5" />
                Copied
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-md border border-border bg-muted/60 px-3 py-2 text-left text-sm break-all"
            >
              https://paperclip.local/invite/new-token
            </button>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline">
                <ExternalLink className="h-4 w-4" />
                Open invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] shadow-none">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{t("ppages_InviteUxLab.invite_history", {defaultValue: "Invite history"})}</CardTitle>
              <CardDescription className="mt-2">
                Review invite status, role, inviter, and any linked join request.
              </CardDescription>
            </div>
            <a href="/inbox/requests" className="text-sm underline underline-offset-4">
              Open join request queue
            </a>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("ppages_InviteUxLab.state", {defaultValue: "State"})}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("ppages_InviteUxLab.role", {defaultValue: "Role"})}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("ppages_InviteUxLab.invited_by", {defaultValue: "Invited by"})}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("ppages_InviteUxLab.created", {defaultValue: "Created"})}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("ppages_InviteUxLab.join_request", {defaultValue: "Join request"})}</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">{t("ppages_InviteUxLab.action", {defaultValue: "Action"})}</th>
                </tr>
              </thead>
              <tbody>
                {inviteHistory.map((invite) => (
                  <tr key={invite.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 align-top">
                      <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {invite.state}
                      </span>
                    </td>
                    <td className="px-5 py-3 align-top">{invite.humanRole}</td>
                    <td className="px-5 py-3 align-top">
                      <div>{invite.invitedBy}</div>
                      <div className="text-xs text-muted-foreground">{invite.email}</div>
                    </td>
                    <td className="px-5 py-3 align-top text-muted-foreground">{invite.createdAt}</td>
                    <td className="px-5 py-3 align-top">
                      {invite.relatedLabel === "Review request" ? (
                        <a href="/inbox/requests" className="underline underline-offset-4">
                          {invite.relatedLabel}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{invite.relatedLabel}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right align-top">
                      {invite.action === "Revoke" ? (
                        <Button type="button" size="sm" variant="outline">
                          Revoke
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("ppages_InviteUxLab.inactive", {defaultValue: "Inactive"})}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-4">
              <div className="text-sm font-medium">{t("ppages_InviteUxLab.empty_history_state", {defaultValue: "Empty history state"})}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                No invites have been created for this company yet.
              </div>
            </div>
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/[0.07] p-4">
              <div className="text-sm font-medium text-foreground">{t("ppages_InviteUxLab.permission_error", {defaultValue: "Permission error"})}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                You do not have permission to manage company invites.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InviteUxLab() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,rgba(8,145,178,0.10),transparent_28%),linear-gradient(180deg,rgba(245,158,11,0.10),transparent_44%),var(--background)] shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="p-6 sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
              <FlaskConical className="h-3.5 w-3.5" />
              Invite UX Lab
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{t("ppages_InviteUxLab.invite_and_signup_ux_review_surface", {defaultValue: "Invite and signup UX review surface"})}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              This page collects the current invite landing, signup, approval-result, and company invite-management states in one place so styling changes can be reviewed without recreating each backend condition by hand.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                /tests/ux/invites
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                signup + invite states
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                fixture-backed preview
              </Badge>
            </div>
          </div>

          <aside className="border-t border-border/60 bg-background/70 p-6 lg:border-l lg:border-t-0">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Covered states
            </div>
            <div className="space-y-3">
              {[
                "Invite loading, access-check, missing-token, and unavailable states",
                "Inline account creation and sign-in variants, including feedback/error copy",
                "Human accept, agent request, and auto-accept transitions",
                "Pending approval, joined-now, claim secret, and onboarding result screens",
                "Company invite creation, copied-link, history, empty, and permission-error states",
              ].map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <LabSection
        eyebrow="Top-level states"
        title={t("ppages_InviteUxLab.landing_state_coverage", {defaultValue: "Landing state coverage"})}
        description={t("ppages_InviteUxLab.small_cards_for_the_fastreturn_invite_states_that", {defaultValue: "Small cards for the fast-return invite states that do not render the full split-screen layout."})}
        accentClassName="bg-[linear-gradient(180deg,rgba(59,130,246,0.05),transparent_30%),var(--background)]"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            icon={<Loader2 className="h-4 w-4 animate-spin" />}
            title={t("ppages_InviteUxLab.loading_invite", {defaultValue: "Loading invite"})}
            body="Shown while invite summary, deployment mode, or auth session data is still loading."
          />
          <StatusCard
            icon={<Clock3 className="h-4 w-4" />}
            title={t("ppages_InviteUxLab.checking_your_access", {defaultValue: "Checking your access"})}
            body="Shown after sign-in while the app verifies whether the current user already belongs to the invited company."
          />
          <StatusCard
            icon={<KeyRound className="h-4 w-4" />}
            title={t("ppages_InviteUxLab.invalid_invite_token", {defaultValue: "Invalid invite token"})}
            body="The token is missing entirely, so the page short-circuits before any invite lookup."
            tone="error"
          />
          <StatusCard
            icon={<Link2 className="h-4 w-4" />}
            title={t("ppages_InviteUxLab.invite_not_available", {defaultValue: "Invite not available"})}
            body="Used for expired, revoked, already-consumed, or otherwise missing invites."
            tone="warn"
          />
          <StatusCard
            icon={<ShieldCheck className="h-4 w-4" />}
            title={t("ppages_InviteUxLab.bootstrap_complete", {defaultValue: "Bootstrap complete"})}
            body="Result screen for bootstrap CEO invites after setup has been accepted successfully."
            tone="success"
          />
          <StatusCard
            icon={<ArrowRight className="h-4 w-4" />}
            title={t("ppages_InviteUxLab.autoaccept_in_progress", {defaultValue: "Auto-accept in progress"})}
            body="Signed-in human users skip the extra button click and move straight into join submission."
          />
          <StatusCard
            icon={<Users className="h-4 w-4" />}
            title={t("ppages_InviteUxLab.already_a_member", {defaultValue: "Already a member"})}
            body="Acceptance stays disabled and the page redirects into the company once membership is confirmed."
          />
          <StatusCard
            icon={<UserPlus className="h-4 w-4" />}
            title={t("ppages_InviteUxLab.invite_result_surfaces", {defaultValue: "Invite result surfaces"})}
            body="Both pending-approval and joined-now confirmations are included below with claim and onboarding extras."
            tone="success"
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow="Invite landing"
        title={t("ppages_InviteUxLab.splitscreen_invite_flows", {defaultValue: "Split-screen invite flows"})}
        description={t("ppages_InviteUxLab.these_frames_mirror_the_production_invite_surface", {defaultValue: "These frames mirror the production invite surface closely enough to review spacing, hierarchy, and control states while keeping data fixture-driven."})}
        accentClassName="bg-[linear-gradient(180deg,rgba(234,179,8,0.06),transparent_28%),var(--background)]"
      >
        <div className="space-y-5">
          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={t("ppages_InviteUxLab.join_acme_robotics", {defaultValue: "Join Acme Robotics"})}
                description={t("ppages_InviteUxLab.create_your_paperclip_account_first_if_you_already", {defaultValue: "Create your Paperclip account first. If you already have one, switch to sign in and continue the invite with the same email."})}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
              />
            }
            right={<InlineAuthPreview mode="sign_up" />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={t("ppages_InviteUxLab.join_acme_robotics", {defaultValue: "Join Acme Robotics"})}
                description={t("ppages_InviteUxLab.create_your_paperclip_account_first_if_you_already", {defaultValue: "Create your Paperclip account first. If you already have one, switch to sign in and continue the invite with the same email."})}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
              />
            }
            right={
              <InlineAuthPreview
                mode="sign_in"
                feedback={{
                  tone: "info",
                  text: "An account already exists for jane@example.com. Sign in below to continue with this invite.",
                }}
              />
            }
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={t("ppages_InviteUxLab.join_acme_robotics", {defaultValue: "Join Acme Robotics"})}
                description={t("ppages_InviteUxLab.your_account_is_ready_review_the_invite_details_th", {defaultValue: "Your account is ready. Review the invite details, then accept it to continue."})}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
                signedInLabel="Jane Example"
              />
            }
            right={<AcceptInvitePreview autoAccept />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={t("ppages_InviteUxLab.join_acme_robotics", {defaultValue: "Join Acme Robotics"})}
                description={t("ppages_InviteUxLab.review_the_invite_details_then_submit_the_agent_in", {defaultValue: "Review the invite details, then submit the agent information below to start the join request."})}
                requestedAccess="Agent join request"
              />
            }
            right={<AgentRequestPreview />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={t("ppages_InviteUxLab.join_acme_robotics", {defaultValue: "Join Acme Robotics"})}
                description={t("ppages_InviteUxLab.your_account_is_ready_review_the_invite_details_th", {defaultValue: "Your account is ready. Review the invite details, then accept it to continue."})}
                requestedAccess="Operator"
                signedInLabel="Jane Example"
              />
            }
            right={<AcceptInvitePreview error="This account already belongs to the company." isCurrentMember />}
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow="Result states"
        title={t("ppages_InviteUxLab.approval_and_completion_screens", {defaultValue: "Approval and completion screens"})}
        description={t("ppages_InviteUxLab.these_are_the_postsubmit_states_returned_from_invi", {defaultValue: "These are the post-submit states returned from invite acceptance, including optional claim and onboarding metadata."})}
        accentClassName="bg-[linear-gradient(180deg,rgba(16,185,129,0.06),transparent_30%),var(--background)]"
      >
        <div className="grid gap-5 xl:grid-cols-3">
          <InviteResultPreview
            title={t("ppages_InviteUxLab.request_to_join_acme_robotics", {defaultValue: "Request to join Acme Robotics"})}
            description={t("ppages_InviteUxLab.board_user_must_approve_your_request_to_join", {defaultValue: "Board User must approve your request to join."})}
            claimSecret="pcp_claim_secret_demo"
            onboardingTextUrl="/api/invites/pcp_invite_test/onboarding.txt"
          />
          <InviteResultPreview
            title={t("ppages_InviteUxLab.you_joined_the_company", {defaultValue: "You joined the company"})}
            description={t("ppages_InviteUxLab.your_account_already_matched_the_approved_invite_s", {defaultValue: "Your account already matched the approved invite, so the board can be opened immediately."})}
            joinedNow
          />
          <InviteResultPreview
            title={t("ppages_InviteUxLab.request_to_join_acme_robotics", {defaultValue: "Request to join Acme Robotics"})}
            description={t("ppages_InviteUxLab.ask_them_to_visit_company_settings_members_to_appr", {defaultValue: "Ask them to visit Company Settings → Members to approve your request."})}
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow="Standalone auth"
        title={t("ppages_InviteUxLab.auth_page_states", {defaultValue: "Auth page states"})}
        description={t("ppages_InviteUxLab.the_general_auth_page_uses_a_different_composition", {defaultValue: "The general `/auth` page uses a different composition from invite landing. These previews keep both sign-in and sign-up variants visible."})}
        accentClassName="bg-[linear-gradient(180deg,rgba(168,85,247,0.06),transparent_28%),var(--background)]"
      >
        <div className="space-y-5">
          <AuthScreenPreview mode="sign_in" error="Invalid email or password" />
          <AuthScreenPreview mode="sign_up" />
        </div>
      </LabSection>

      <LabSection
        eyebrow="Company settings"
        title={t("ppages_InviteUxLab.company_invite_management", {defaultValue: "Company invite management"})}
        description={t("ppages_InviteUxLab.this_section_captures_the_boardside_invite_creatio", {defaultValue: "This section captures the board-side invite creation flow, copied-link state, audit table, and the edge states that are otherwise tedious to stage."})}
        accentClassName="bg-[linear-gradient(180deg,rgba(244,114,182,0.06),transparent_28%),var(--background)]"
      >
        <CompanyInvitesPreview />
      </LabSection>
    </div>
  );
}
