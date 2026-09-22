import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type Row = {
  id: string;
  feature_key: string;
  label: string;
  enabled: boolean;
  is_mandatory: boolean;
  is_visible: boolean;
  is_editable: boolean;
  is_read_only: boolean;
  sort_order: number;
};

const HIDDEN_KEYS = new Set([
  "rejected_items",
  "customer_credit",
  "credit_note",
  "inventory_adjustment",
  "history_tracking",
  "audit_log",
]);

export function InvoiceConfigurationTab() {
  const qc = useQueryClient();
  const { data: allRows = [], isLoading } = useQuery({
    queryKey: ["invoice-config"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("invoice_configuration") as any)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const rows = allRows.filter((r) => !HIDDEN_KEYS.has(r.feature_key));

  const toggle = async (row: Row, patch: Partial<Row>) => {
    // Enforce: Editable and Read Only are mutually exclusive
    if (patch.is_editable === true) patch.is_read_only = false;
    if (patch.is_read_only === true) patch.is_editable = false;
    // Mandatory implies Visible
    if (patch.is_mandatory === true) patch.is_visible = true;

    const { error } = await (supabase.from("invoice_configuration") as any)
      .update(patch)
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["invoice-config"] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Invoice Configuration</CardTitle>
        <CardDescription>
          Enable or disable features, and control the permission level applied on invoice forms.
          <span className="mt-1 block text-xs text-muted-foreground">
            <b>Mandatory</b> = required to save. <b>Visible</b> = shown on the form. <b>Editable</b> = user can modify. <b>Read Only</b> = shown but locked.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-2 text-left">Feature</th>
                <th className="p-2 text-center">Enabled</th>
                <th className="p-2 text-center">Mandatory</th>
                <th className="p-2 text-center">Visible</th>
                <th className="p-2 text-center">Editable</th>
                <th className="p-2 text-center">Read Only</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/20">
                  <td className="p-2 font-medium">{r.label}</td>
                  <Cell checked={r.enabled} onChange={(v) => toggle(r, { enabled: v })} />
                  <Cell checked={r.is_mandatory} onChange={(v) => toggle(r, { is_mandatory: v })} disabled={!r.enabled} />
                  <Cell checked={r.is_visible} onChange={(v) => toggle(r, { is_visible: v })} disabled={!r.enabled || r.is_mandatory} />
                  <Cell checked={r.is_editable} onChange={(v) => toggle(r, { is_editable: v })} disabled={!r.enabled} />
                  <Cell checked={r.is_read_only} onChange={(v) => toggle(r, { is_read_only: v })} disabled={!r.enabled} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function Cell({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <td className="p-2 text-center">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} disabled={disabled} />
    </td>
  );
}