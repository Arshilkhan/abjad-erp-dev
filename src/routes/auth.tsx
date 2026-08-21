import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/aew-logo.jpg";

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
    <div className="grid min-h-screen md:grid-cols-[45fr_55fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex">
        <div className="absolute inset-0">
          <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.30 0.10 255)" />
                <stop offset="100%" stopColor="oklch(0.22 0.08 255)" />
              </linearGradient>
              <linearGradient id="orb1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.55 0.13 255 / 0.35)" />
                <stop offset="100%" stopColor="oklch(0.55 0.13 255 / 0)" />
              </linearGradient>
              <linearGradient id="orb2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.70 0.08 240 / 0.25)" />
                <stop offset="100%" stopColor="oklch(0.70 0.08 240 / 0)" />
              </linearGradient>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="oklch(1 0 0 / 0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#bgGrad)" />
            <rect width="800" height="800" fill="url(#grid)" />
            <circle cx="150" cy="200" r="320" fill="url(#orb1)" />
            <circle cx="650" cy="650" r="380" fill="url(#orb2)" />
            <g stroke="oklch(1 0 0 / 0.06)" strokeWidth="1.5" fill="none">
              <line x1="100" y1="100" x2="250" y2="220" />
              <line x1="250" y1="220" x2="220" y2="420" />
              <line x1="220" y1="420" x2="420" y2="480" />
              <line x1="420" y1="480" x2="520" y2="320" />
              <line x1="520" y1="320" x2="700" y2="380" />
              <circle cx="250" cy="220" r="5" fill="oklch(1 0 0 / 0.12)" />
              <circle cx="220" cy="420" r="5" fill="oklch(1 0 0 / 0.12)" />
              <circle cx="420" cy="480" r="5" fill="oklch(1 0 0 / 0.12)" />
              <circle cx="520" cy="320" r="5" fill="oklch(1 0 0 / 0.12)" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-primary/40" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="ABJAD logo" className="h-10 w-10 rounded-lg object-contain shadow-sm" />
          <span className="text-xl font-semibold tracking-tight">ABJAD</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl font-semibold leading-tight">Billing and inventory, in one place.</h2>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Invoices, challans, purchases and payments — managed end to end for your engineering works.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to access your account.</p>
          </div>
          <form onSubmit={signIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="e1">Email address</Label>
              <Input id="e1" type="email" required placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1">Password</Label>
              <Input id="p1" type="password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-lg" />
            </div>
            <Button type="submit" className="h-11 w-full rounded-lg text-base font-medium" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

