import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const eventLabels: Record<string, { label: string; color: string }> = {
  created: { label: "Created", color: "bg-blue-100 text-blue-800" },
  edited: { label: "Edited", color: "bg-amber-100 text-amber-800" },
  sent: { label: "Sent", color: "bg-slate-100 text-slate-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  rejected_items: { label: "Items Rejected", color: "bg-orange-100 text-orange-800" },
  payment_received: { label: "Payment", color: "bg-green-100 text-green-800" },
  credit_generated: { label: "Credit Note", color: "bg-purple-100 text-purple-800" },
  adjustment: { label: "Adjustment", color: "bg-indigo-100 text-indigo-800" },
  imported: { label: "Imported", color: "bg-teal-100 text-teal-800" },
  duplicated: { label: "Duplicated", color: "bg-slate-100 text-slate-800" },
};

export function InvoiceHistoryTab({ invoiceId }: { invoiceId: string }) {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["invoice-history", invoiceId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("invoice_history") as any)
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && rows.length === 0 && (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">No activity recorded yet.</div>
        )}
        <ol className="relative space-y-4 border-l pl-6">
          {rows.map((r: any) => {
            const meta = eventLabels[r.event_type] ?? { label: r.event_type, color: "bg-muted text-muted-foreground" };
            return (
              <li key={r.id} className="relative">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`text-[10px] uppercase ${meta.color}`} variant="outline">{meta.label}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</span>
                  {r.actor_email && <span className="text-xs text-muted-foreground">• {r.actor_email}</span>}
                </div>
                {r.description && <p className="mt-1 text-sm">{r.description}</p>}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}