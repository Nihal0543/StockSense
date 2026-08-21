import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user } = useCurrentUserState();
  if (user) return <Navigate to="/dashboard" />;
  return <LoginForm />;
}
