import { isSalesDocumentKind, type SalesDocumentKind } from "@/lib/sales-documents";
import { billNo } from "@/lib/format";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, FileText, User, Package, Folder } from "lucide-react";
import { folderSlug } from "@/lib/invoice-folders";

type Hit =
  | { kind: "invoice"; id: string; primary: string; secondary: string }
  | { kind: "folder"; id: string; primary: string; secondary: string }
  | { kind: "customer"; id: string; primary: string; secondary: string }
  | { kind: "product"; id: string; primary: string; secondary: string };


export function GlobalSearch() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { data: invoices = [] } = useQuery({
    queryKey: ["gs-invoices"],
    queryFn: async () => {
      const cols = "id, invoice_number, customer_name_snapshot, invoice_type, po_number, challan_number, status";
      const res = await Promise.all(
        (["invoices", "performa", "quotation", "challan"] as const).map((t) =>
          (supabase.from(t as "invoices") as any).select(cols).order("created_at", { ascending: false }).limit(100),
        ),
      );
      return res.flatMap((r: any) => r.data ?? []);
    },
  });
  const { data: customers = [] } = useQuery({
    queryKey: ["gs-customers"],
    queryFn: async () => (await supabase.from("customers").select("id, customer_name, company_name, gst_number").limit(200)).data ?? [],
  });
  const { data: products = [] } = useQuery({
    queryKey: ["gs-products"],
    queryFn: async () => (await supabase.from("products").select("id, product_name, product_code, hsn_code").limit(200)).data ?? [],
  });

  const hits = useMemo<Hit[]>(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const inv: Hit[] = invoices
      .filter((r: any) =>
        [r.invoice_number, r.customer_name_snapshot, r.po_number, r.challan_number, r.invoice_type]
          .filter(Boolean)
          .some((v: string) => String(v).toLowerCase().includes(s)),
      )
      .slice(0, 6)
      .map((r: any) => ({
        kind: "invoice",
        id: r.id,
        doc: isSalesDocumentKind(String(r.invoice_type)) ? r.invoice_type : "tax_invoice",
        primary: billNo(r.invoice_number),
        secondary: [r.customer_name_snapshot, String(r.invoice_type ?? "").replace(/_/g, " ")].filter(Boolean).join(" • "),
      }));

    const folderNames = new Map<string, string>();
    for (const r of invoices as any[]) {
      const name = (r.customer_name_snapshot ?? "").trim();
      if (name) folderNames.set(folderSlug(name), name);
    }
    for (const c of customers as any[]) {
      const name = (c.company_name || c.customer_name || "").trim();
      if (name) folderNames.set(folderSlug(name), name);
    }
    const fld: Hit[] = [...folderNames.entries()]
      .filter(([, name]) => name.toLowerCase().includes(s))
      .slice(0, 4)
      .map(([slug, name]) => ({ kind: "folder", id: slug, primary: name, secondary: "Company folder" }));

    const cus: Hit[] = customers
      .filter((r: any) => (r.company_name ?? "").toLowerCase().includes(s) || (r.customer_name ?? "").toLowerCase().includes(s) || (r.gst_number ?? "").toLowerCase().includes(s))
      .slice(0, 6)
      .map((r: any) => ({ kind: "customer", id: r.id, primary: r.company_name || r.customer_name, secondary: r.gst_number ?? "" }));
    const prd: Hit[] = products
      .filter((r: any) => (r.product_name ?? "").toLowerCase().includes(s) || (r.product_code ?? "").toLowerCase().includes(s) || (r.hsn_code ?? "").toLowerCase().includes(s))
      .slice(0, 6)
      .map((r: any) => ({ kind: "product", id: r.id, primary: r.product_name, secondary: r.product_code ?? "" }));
    return [...fld, ...inv, ...cus, ...prd];
  }, [q, invoices, customers, products]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const go = (hit: Hit) => {
    setOpen(false);
    setQ("");
    if (hit.kind === "invoice") nav({ to: "/invoices/$id", params: { id: hit.id }, search: { kind: hit.doc ?? "tax_invoice" } });
    else if (hit.kind === "folder") nav({ to: "/invoices/folder/$company", params: { company: hit.id } });
    else if (hit.kind === "customer") nav({ to: "/customers" });
    else if (hit.kind === "product") nav({ to: "/products" });
  };

  const Icon = ({ k }: { k: Hit["kind"] }) =>
    k === "invoice" ? <FileText className="h-3.5 w-3.5" />
      : k === "folder" ? <Folder className="h-3.5 w-3.5" />
      : k === "customer" ? <User className="h-3.5 w-3.5" />
      : <Package className="h-3.5 w-3.5" />;


  return (
    <div ref={wrapRef} className="relative flex-1 max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setHighlight(0); }}
        onFocus={() => setOpen(true)}
        placeholder="Search invoices, customers, products…"
        className="h-9 pl-9"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, hits.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
          else if (e.key === "Enter" && hits[highlight]) { e.preventDefault(); go(hits[highlight]); }
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && q.trim() && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
          {hits.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">No matches for "{q}"</p>
          ) : (
            <ul className="max-h-80 overflow-auto py-1">
              {hits.map((h, i) => (
                <li
                  key={`${h.kind}-${h.id}`}
                  onMouseDown={(e) => { e.preventDefault(); go(h); }}
                  onMouseEnter={() => setHighlight(i)}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm ${i === highlight ? "bg-accent text-accent-foreground" : ""}`}
                >
                  <span className="text-muted-foreground"><Icon k={h.kind} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{h.primary}</div>
                    {h.secondary && <div className="truncate text-xs text-muted-foreground">{h.secondary}</div>}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{h.kind}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}