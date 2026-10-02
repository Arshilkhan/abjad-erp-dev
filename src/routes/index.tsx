import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ABJAD ERP — Workspace" },
    { name: "description", content: "Open the ABJAD Engineering Works ERP workspace." },
    { property: "og:title", content: "ABJAD ERP — Workspace" },
    { property: "og:description", content: "Open the ABJAD Engineering Works ERP workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  return <Navigate to={user ? "/dashboard" : "/auth"} />;
}
