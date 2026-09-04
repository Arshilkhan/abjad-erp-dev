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

type Mode = "signin" | "forgot-email" | "forgot-otp" | "forgot-new";

function AuthPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [user, loading, nav]);

  const describe = (error: unknown) => {
    const err = error as { message?: string; status?: number } | null;
    const msg = err?.message?.trim();
    if (!msg || msg === "{}" || /fetch|network|failed to fetch/i.test(msg) || (err?.status ?? 0) >= 500) {
      return "Can't reach the server right now. Please try again in a moment.";
    }
    return msg;
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(describe(error));
    toast.success("Signed in");
    nav({ to: "/dashboard" });
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(describe(error));
    toast.success("Verification code sent to your email");
    setMode("forgot-otp");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: "recovery" });
    setBusy(false);
    if (error) return toast.error(describe(error));
    toast.success("Code verified");
    setMode("forgot-new");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setBusy(false);
      return toast.error(describe(error));
    }
    await supabase.auth.signOut();
    setBusy(false);
    toast.success("Password updated. Please sign in.");
    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMode("signin");
  };

  return (
    <div className="grid min-h-screen md:grid-cols-[45fr_55fr]">
      <div className="relative hidden flex-col overflow-hidden bg-primary px-14 py-12 text-primary-foreground md:flex">
        <div className="absolute inset-0">
          <svg
            className="h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.32 0.10 255)" />
                <stop offset="55%" stopColor="oklch(0.24 0.09 255)" />
                <stop offset="100%" stopColor="oklch(0.20 0.08 255)" />
              </linearGradient>
              <radialGradient id="glowTop" cx="80%" cy="20%" r="60%">
                <stop offset="0%" stopColor="oklch(0.58 0.12 255 / 0.22)" />
                <stop offset="100%" stopColor="oklch(0.58 0.12 255 / 0)" />
              </radialGradient>
              <radialGradient id="glowBottom" cx="20%" cy="90%" r="55%">
                <stop offset="0%" stopColor="oklch(0.50 0.10 240 / 0.18)" />
                <stop offset="100%" stopColor="oklch(0.50 0.10 240 / 0)" />
              </radialGradient>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(1 0 0 / 0.08)" />
                <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
              </linearGradient>
              <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M 72 0 L 0 0 0 72" fill="none" stroke="oklch(1 0 0 / 0.035)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#bgGrad)" />
            <rect width="800" height="800" fill="url(#grid)" />
            <circle cx="640" cy="160" r="360" fill="url(#glowTop)" />
            <circle cx="160" cy="680" r="320" fill="url(#glowBottom)" />
            <path d="M -40 600 Q 200 480 400 560 T 840 520" fill="none" stroke="url(#arcGrad)" strokeWidth="2" />
            <path d="M -40 680 Q 220 560 440 640 T 840 600" fill="none" stroke="url(#arcGrad)" strokeWidth="1.5" />
            <g stroke="oklch(1 0 0 / 0.05)" strokeWidth="1.5" fill="none">
              <circle cx="720" cy="280" r="90" />
              <circle cx="720" cy="280" r="130" />
              <line x1="120" y1="120" x2="240" y2="220" />
              <line x1="240" y1="220" x2="220" y2="380" />
              <circle cx="240" cy="220" r="4" fill="oklch(1 0 0 / 0.10)" />
              <circle cx="220" cy="380" r="4" fill="oklch(1 0 0 / 0.10)" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-primary/25" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center pt-10">
          <div className="max-w-[380px] space-y-4">
            <h2 className="text-3xl font-semibold leading-tight">Billing and inventory, in one place.</h2>
            <p className="text-base leading-relaxed text-primary-foreground/80">
              Invoices, challans, purchases and payments — managed end to end for your engineering works.
            </p>
          </div>
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
              <Input
                id="e1"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1">Password</Label>
              <Input
                id="p1"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg"
              />
            </div>
            <Button type="submit" className="h-11 w-full rounded-lg text-base font-medium" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
