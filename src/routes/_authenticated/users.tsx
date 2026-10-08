import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { PANELS } from "@/lib/panels";
import { listAppUsers, createAppUser, setUserPanels, deleteAppUser } from "@/lib/admin-users.functions";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/users")({
  head: () => ({
    meta: [
      { title: "Users & Permissions — ABJAD ERP" },
      { name: "description", content: "Create users and control which ERP panels each user can access." },
      { property: "og:title", content: "Users & Permissions — ABJAD ERP" },
      { property: "og:description", content: "Create users and control which ERP panels each user can access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UsersPanel,
});

function UsersPanel() {
  const { isAdmin, loading, organizationId } = useAuth();
  const qc = useQueryClient();
  const fetchUsers = useServerFn(listAppUsers);
  const createFn = useServerFn(createAppUser);
  const saveFn = useServerFn(setUserPanels);
  const delFn = useServerFn(deleteAppUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [newPanels, setNewPanels] = useState<string[]>([]);
  const [draft, setDraft] = useState<Record<string, string[]>>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ["app-users"],
    queryFn: () => fetchUsers({ data: { organizationId: organizationId! } }),
    enabled: isAdmin && !!organizationId,
  });

  const create = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          organizationId: organizationId!,
          email,
          password,
          fullName,
          panels: newPanels,
        },
      }),
    onSuccess: () => {
      toast.success("User created");
      setEmail(""); setPassword(""); setFullName(""); setNewPanels([]);
      qc.invalidateQueries({ queryKey: ["app-users"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not create user"),
  });

  const save = useMutation({
    mutationFn: (v: { userId: string; panels: string[] }) =>
      saveFn({
        data: {
          organizationId: organizationId!,
          ...v,
        },
      }),
    onSuccess: () => { toast.success("Permissions updated"); qc.invalidateQueries({ queryKey: ["app-users"] }); },
    onError: (e: any) => toast.error(e?.message ?? "Could not save permissions"),
  });

  const remove = useMutation({
    mutationFn: (userId: string) =>
      delFn({
        data: {
          organizationId: organizationId!,
          userId,
        },
      }),
    onSuccess: () => { toast.success("User deleted"); qc.invalidateQueries({ queryKey: ["app-users"] }); },
    onError: (e: any) => toast.error(e?.message ?? "Could not delete user"),
  });

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!isAdmin) return <p className="text-sm text-muted-foreground">You don't have access to this section.</p>;

  const panelsFor = (u: { id: string; panels: string[] }) => draft[u.id] ?? u.panels;
  const toggle = (list: string[], key: string) =>
    list.includes(key) ? list.filter((k) => k !== key) : [...list, key];

  return (
    <>
      <PageHeader title="Users" description="Create users and control which panels each one can access." />

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Create new user</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="nu-name">Full name</Label>
              <Input id="nu-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nu-email">Email</Label>
              <Input id="nu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nu-pass">Password</Label>
              <Input id="nu-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Panel access</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {PANELS.map((p) => (
                <label key={p.key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={newPanels.includes(p.key)}
                    onCheckedChange={() => setNewPanels((l) => toggle(l, p.key))}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
          <Button onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending ? "Creating…" : "Create user"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Existing users</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading users…</p>
          ) : (users ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          ) : (
            (users ?? []).map((u: any) => (
              <div key={u.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{u.full_name ?? u.email}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.roles.map((r: string) => (
                      <Badge key={r} variant="outline" className="text-[10px] uppercase">{r.replace("_", " ")}</Badge>
                    ))}
                    <Button
                      size="icon" variant="ghost"
                      onClick={() => { if (confirm(`Delete ${u.email}?`)) remove.mutate(u.id); }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {u.roles.some((r: string) => r === "admin" || r === "super_admin") ? (
                  <p className="mt-3 text-xs text-muted-foreground">Admins have access to all panels.</p>
                ) : (
                  <>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {PANELS.map((p) => (
                        <label key={p.key} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={panelsFor(u).includes(p.key)}
                            onCheckedChange={() =>
                              setDraft((d) => ({ ...d, [u.id]: toggle(panelsFor(u), p.key) }))
                            }
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                    <Button
                      size="sm" className="mt-3"
                      disabled={save.isPending}
                      onClick={() => save.mutate({ userId: u.id, panels: panelsFor(u) })}
                    >
                      Save permissions
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
