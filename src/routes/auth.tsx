import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Don't redirect during the password-recovery flow: verifyOtp(recovery)
    // establishes a recovery session which must land on the new-password screen.
    if (!loading && user && mode === "signin") nav({ to: "/dashboard" });
  }, [user, loading, mode, nav]);

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
    <div className="grid h-screen grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-background md:grid-cols-[45fr_55fr] md:grid-rows-1">
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

      {/* Mobile branding */}
      <div className="relative overflow-hidden border-b-4 border-warning bg-primary px-6 pb-3 pt-8 text-primary-foreground md:hidden">
        <div className="relative z-10 mx-auto max-w-[400px]">
          <div className="mb-7 inline-flex items-center bg-primary-foreground p-2 shadow-sm">
            <img
              src={logo}
              alt="ABJAD Engineering Works"
              className="h-12 w-auto object-contain"
            />
          </div>

          <p className="text-xs font-semibold uppercase text-primary-foreground/70">
            ABJAD Engineering Works
          </p>

          <p className="mt-2 max-w-[300px] text-xl font-semibold leading-snug">
            Billing and inventory, wherever work takes you.
          </p>
        </div>
        <div className="absolute -bottom-8 -right-8 h-28 w-28 rotate-12 border-2 border-primary-foreground/10" />
        <div className="absolute bottom-5 right-12 h-12 w-12 rotate-12 border border-primary-foreground/10" />
      </div>

      <div className="flex min-h-0 items-start justify-center overflow-hidden bg-background px-6 py-8 md:items-center md:p-10">
        <div className="w-full max-w-[400px]">
          {mode === "signin" && (
            <>
              <div className="mb-7 md:mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Sign in to continue to ABJAD ERP.</p>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="p1">Password</Label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot-email")}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="p1"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-lg pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="h-11 w-full rounded-lg text-base font-medium" disabled={busy}>
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </>
          )}

          {mode === "forgot-email" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your email address and we'll send you a verification code.
                </p>
              </div>
              <form onSubmit={sendOtp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fe">Email address</Label>
                  <Input
                    id="fe"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-lg"
                  />
                </div>
                <Button type="submit" className="h-11 w-full rounded-lg text-base font-medium" disabled={busy}>
                  {busy ? "Sending code…" : "Send verification code"}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="w-full text-center text-sm font-medium text-primary hover:underline"
                >
                  Back to sign in
                </button>
              </form>
            </>
          )}

          {mode === "forgot-otp" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  We sent a 6-digit verification code to <span className="font-medium text-foreground">{email}</span>.
                </p>
              </div>
              <form onSubmit={verifyOtp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="h-11 rounded-lg tracking-[0.3em]"
                  />
                </div>
                <Button type="submit" className="h-11 w-full rounded-lg text-base font-medium" disabled={busy || otp.length !== 6}>
                  {busy ? "Verifying…" : "Verify code"}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("forgot-email")}
                  className="w-full text-center text-sm font-medium text-primary hover:underline"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}

          {mode === "forgot-new" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
                <p className="mt-1 text-sm text-muted-foreground">Choose a strong password of at least 8 characters.</p>
              </div>
              <form onSubmit={updatePassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="np1">New password</Label>
                  <div className="relative">
                    <Input
                      id="np1"
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11 rounded-lg pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword((visible) => !visible)}
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      title={showNewPassword ? "Hide new password" : "Show new password"}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="np2">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="np2"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 rounded-lg pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                      title={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="h-11 w-full rounded-lg text-base font-medium" disabled={busy}>
                  {busy ? "Updating…" : "Update password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
