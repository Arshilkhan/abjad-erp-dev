import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — ABJAD ERP" },
      { name: "description", content: "Sign in to the ABJAD billing and inventory ERP." },
      { property: "og:title", content: "Sign in — ABJAD ERP" },
      { property: "og:description", content: "Sign in to the ABJAD billing and inventory ERP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) nav({ to: "/dashboard" }); }, [user, loading, nav]);

  const describe = (error: unknown) => {
    const err = error as { message?: string; status?: number } | null;
    const msg = err?.message?.trim();
    if (!msg || msg === "{}" || /fetch|network|failed to fetch/i.test(msg) || (err?.status ?? 0) >= 500) {
      return "Can't reach the server right now. Please try again in a moment.";
    }
    return msg;
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(describe(error));
    toast.success("Signed in");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary to-primary/70 p-10 text-primary-foreground md:flex">
        <div className="text-2xl font-semibold tracking-tight">ABJAD</div>
        <div>
          <h2 className="text-3xl font-semibold leading-tight">Billing and inventory, in one place.</h2>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Invoices, challans, purchases and payments — managed end to end for your engineering works.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-card p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to access your account</p>
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="e1">Email address</Label>
              <Input id="e1" type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p1">Password</Label>
              <Input id="p1" type="password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

