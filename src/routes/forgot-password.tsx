import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter the email you use to sign in.");
      return;
    }
    setError(null);
    setSent(true);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Logo />
        <h1 className="mt-8 font-display text-2xl font-semibold text-navy">
          Forgot password
        </h1>
        {sent ? (
          <div className="mt-6 rounded-xl bg-safe-bg p-4 text-sm text-safe">
            <p className="flex items-start gap-2 font-medium">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              Request received
            </p>
            <p className="mt-2 text-foreground/80">
              Self-serve reset is not available in this version. If you signed in
              with Google or X, go back and use that button. Otherwise ask your
              StockSense administrator to restore access for{" "}
              <span className="font-medium">{email}</span>.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email. We will tell you how to get back in.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@store.in"
                  required
                />
              </div>
              {error ? <p className="text-sm text-critical">{error}</p> : null}
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </>
        )}
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
