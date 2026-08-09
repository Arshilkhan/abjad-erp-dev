import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Factory } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — ABJAD ERP" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

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

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) return toast.error(describe(error));
    toast.success("Account created");
    nav({ to: "/dashboard" });
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(describe(error));
    toast.success("Password reset link sent. Check your email.");
    setShowForgot(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Factory className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ABJAD Engineering Works</h1>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Billing & Inventory ERP</p>
          </div>
        </div>
        <Card className="border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to manage invoices, inventory, and reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={signIn} className="space-y-3 pt-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="e1">Email</Label>
                    <Input id="e1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p1">Password</Label>
                    <Input id="p1" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
                  <button
                    type="button"
                    onClick={() => { setResetEmail(email); setShowForgot(true); }}
                    className="w-full text-center text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={signUp} className="space-y-3 pt-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="n2">Full name</Label>
                    <Input id="n2" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="e2">Email</Label>
                    <Input id="e2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p2">Password</Label>
                    <Input id="p2" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Min 8 characters. First user becomes Super Admin.</p>
                  </div>
                  <Button className="w-full" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button>
                </form>
              </TabsContent>
            </Tabs>
            {showForgot && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForgot(false)}>
                <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                  <CardHeader>
                    <CardTitle>Reset password</CardTitle>
                    <CardDescription>We'll email you a link to set a new password.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={sendReset} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="er">Email</Label>
                        <Input id="er" type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForgot(false)}>Cancel</Button>
                        <Button className="flex-1" disabled={busy}>{busy ? "Sending…" : "Send link"}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}