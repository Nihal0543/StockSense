import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Logo, LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

export function LoginForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (mode === "up" && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!authEnabled) {
      setError("Sign-in is currently disabled.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim(),
          callbackURL: "/dashboard",
        });
        if (err) throw new Error(err.message || "Could not create account.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
          rememberMe: remember,
          callbackURL: "/dashboard",
        });
        if (err) throw new Error(err.message || "Invalid email or password.");
      }
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-navy text-navy-fg lg:flex lg:flex-col lg:justify-between p-10 xl:p-14">
        <Logo inverted />
        <div className="max-w-md">
          <p className="font-display text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Know what runs out — before it does.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-navy-muted">
            StockSense watches your sales and stock, then tells you which items
            need a reorder today — in plain language, not spreadsheets.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-navy-fg/90">
            <li className="flex gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              Shortage risk for every product — Safe, Watch, Critical
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              7, 14 and 30-day demand forecasts
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              Alerts with how much to reorder, and who to call
            </li>
          </ul>
        </div>
        <p className="text-xs text-navy-muted">
          Built for small retailers who still run the shop from memory or Excel.
        </p>
        <div className="pointer-events-none absolute -right-16 -bottom-16 opacity-20">
          <LogoMark className="h-64 w-64" />
        </div>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-2xl font-semibold text-navy">
            {mode === "in" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "in"
              ? "Welcome back. Check what needs attention today."
              : "Set up StockSense for your shop in a minute."}
          </p>

          {error ? (
            <div className="mt-4 flex gap-2 rounded-lg bg-critical-bg px-3 py-2 text-sm text-critical">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "up" ? (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
                />
              </div>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@store.in"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "in" ? (
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                ) : null}
              </div>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "in" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </div>
            {mode === "in" ? (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                Remember me on this device
              </label>
            ) : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "in"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          {authEnabled ? (
            <>
              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={Boolean(oauthBusy)}
                    onClick={() => {
                      setOauthBusy(p.providerId);
                      void signIn(p.providerId, { callbackURL: "/dashboard" }).catch((err) => {
                        setError(err instanceof Error ? err.message : "Sign-in failed.");
                        setOauthBusy(null);
                      });
                    }}
                  >
                    Continue with {p.label}
                    {oauthBusy === p.providerId ? "…" : ""}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "in" ? "New to StockSense?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => {
                setMode(mode === "in" ? "up" : "in");
                setError(null);
              }}
            >
              {mode === "in" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
