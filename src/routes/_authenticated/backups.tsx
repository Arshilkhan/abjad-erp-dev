import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import { CloudUpload, HardDriveDownload, Link2, RefreshCw, Unplug } from "lucide-react";
import {
  getBackupStatus, runBackupNow, saveBackupSettings, disconnectGoogleDrive, getGoogleDriveAuthUrl,
} from "@/lib/backup.functions";

export const Route = createFileRoute("/_authenticated/backups")({
  head: () => ({
    meta: [
      { title: "Backups — ABJAD ERP" },
      { name: "description", content: "Back up ABJAD ERP invoices and records to Google Drive, on demand or on a schedule." },
      { property: "og:title", content: "Backups — ABJAD ERP" },
      { property: "og:description", content: "Back up ABJAD ERP invoices and records to Google Drive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BackupsPage,
});

const fmtSize = (n: number | null | undefined) => {
  const b = Number(n ?? 0);
  if (!b) return "-";
  if (b > 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024).toFixed(0)} KB`;
};

const fmtWhen = (s: string | null | undefined) =>
  s ? `${formatDate(s)} ${new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "-";

function BackupsPage() {
  const qc = useQueryClient();
  const { organizationId } = useAuth();
  const status = useServerFn(getBackupStatus);
  const runNow = useServerFn(runBackupNow);
  const saveSettings = useServerFn(saveBackupSettings);
  const disconnect = useServerFn(disconnectGoogleDrive);
  const authUrl = useServerFn(getGoogleDriveAuthUrl);

  const { data, isLoading, error } = useQuery({
    queryKey: ["backup-status"],
    queryFn: () => status({ data: { organizationId: organizationId! } }),
  });

  const [frequency, setFrequency] = useState("off");
  const [hour, setHour] = useState("20");
  useEffect(() => {
    if (data?.settings) {
      setFrequency((data.settings as any).frequency ?? "off");
      setHour(String((data.settings as any).hour_utc ?? 20));
    }
  }, [data]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("drive");
    if (!p) return;
    if (p === "connected") toast.success("Google Drive connected");
    else toast.error(`Google Drive connection failed (${p})`);
    window.history.replaceState({}, "", "/backups");
    void qc.invalidateQueries({ queryKey: ["backup-status"] });
  }, [qc]);

  const connect = useMutation({
    mutationFn: async () => await authUrl({ data: { organizationId: organizationId! } }),
    onSuccess: (r: any) => { window.location.href = r.url; },
    onError: (e: any) => toast.error(e.message),
  });

  const backup = useMutation({
    mutationFn: async () => await runNow({ data: { organizationId: organizationId! } }),
    onSuccess: (r: any) => {
      toast.success(`Backup uploaded: ${r.fileName} (${r.invoiceCount} invoices)`);
      qc.invalidateQueries({ queryKey: ["backup-status"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const save = useMutation({
    mutationFn: async () => await saveSettings({ data: { organizationId: organizationId!, frequency, hour_utc: Number(hour) } }),
    onSuccess: () => { toast.success("Backup schedule saved"); qc.invalidateQueries({ queryKey: ["backup-status"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const unlink = useMutation({
    mutationFn: async () => await disconnect({ data: { organizationId: organizationId! } }),
    onSuccess: () => { toast.success("Google Drive disconnected"); qc.invalidateQueries({ queryKey: ["backup-status"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (error) {
    return (
      <>
        <PageHeader title="Backups" description="Save your invoices and records to Google Drive." />
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          {(error as any).message}
        </div>
      </>
    );
  }

  const connected = !!data?.connected;

  return (
    <>
      <PageHeader title="Backups" description="Save your invoices and records to Google Drive." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Google Drive</CardTitle>
            <CardDescription>
              A ZIP with every invoice PDF plus spreadsheet exports is stored in an “ABJAD ERP Backups” folder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : connected ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">Connected</Badge>
                  <span className="text-muted-foreground">{data?.accountEmail ?? "Google account"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => backup.mutate()} disabled={backup.isPending}>
                    <CloudUpload className="mr-1 h-4 w-4" />
                    {backup.isPending ? "Backing up…" : "Back up now"}
                  </Button>
                  <Button variant="outline" onClick={() => connect.mutate()} disabled={connect.isPending}>
                    <RefreshCw className="mr-1 h-4 w-4" /> Reconnect
                  </Button>
                  <Button variant="outline" onClick={() => unlink.mutate()} disabled={unlink.isPending}>
                    <Unplug className="mr-1 h-4 w-4" /> Disconnect
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">Not connected yet.</div>
                <Button onClick={() => connect.mutate()} disabled={connect.isPending}>
                  <Link2 className="mr-1 h-4 w-4" /> Connect Google Drive
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Automatic backup</CardTitle>
            <CardDescription>Runs by itself at the chosen hour (UTC).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="daily">Every 2 days</SelectItem>
                    <SelectItem value="weekly">Every week</SelectItem>
                    <SelectItem value="monthly">Every month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Time</Label>
                <p className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                  Automatic backups run once a day, at a time chosen by the host.
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Last automatic run: {fmtWhen((data?.settings as any)?.last_run_at)}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                {save.isPending ? "Saving…" : "Save schedule"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
          <CardDescription>The last 20 backup runs.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase">
                <tr>
                  <th className="p-2 text-left">Started</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-right">Invoices</th>
                  <th className="p-2 text-right">Size</th>
                  <th className="p-2 text-left">File</th>
                </tr>
              </thead>
              <tbody>
                {(data?.history ?? []).length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No backups yet.</td></tr>
                )}
                {(data?.history ?? []).map((h: any) => (
                  <tr key={h.id} className="border-t">
                    <td className="p-2">{fmtWhen(h.started_at)}</td>
                    <td className="p-2 capitalize">{h.trigger_source}</td>
                    <td className="p-2">
                      {h.status === "success" ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">Success</Badge>
                      ) : h.status === "failed" ? (
                        <Badge variant="destructive" title={h.error ?? ""}>Failed</Badge>
                      ) : (
                        <Badge variant="secondary">Running</Badge>
                      )}
                    </td>
                    <td className="p-2 text-right">{h.invoice_count ?? "-"}</td>
                    <td className="p-2 text-right">{fmtSize(h.file_size)}</td>
                    <td className="p-2">
                      {h.drive_link ? (
                        <a className="text-primary underline" href={h.drive_link} target="_blank" rel="noreferrer">
                          <HardDriveDownload className="mr-1 inline h-3.5 w-3.5" />
                          {h.file_name ?? "Open"}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{h.error ? String(h.error).slice(0, 80) : "-"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
