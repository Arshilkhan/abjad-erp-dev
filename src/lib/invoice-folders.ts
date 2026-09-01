import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const UNFILED = "Unfiled";

export function folderSlug(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "unfiled"
  );
}

export type InvoiceFolder = {
  name: string;
  slug: string;
  rows: any[];
  total: number;
  lastDate: string | null;
};

export function useInvoiceFolders(opts?: { only?: string[]; exclude?: string[] }) {
  const invoicesQ = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });


  const customersQ = useQuery({
    queryKey: ["customers-folder-map"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("id, customer_name, company_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const map = new Map<string, string>();
  for (const c of customersQ.data ?? []) map.set(c.id, (c.company_name || c.customer_name || "").trim());

  const folders = new Map<string, InvoiceFolder>();
  for (const r of invoicesQ.data ?? []) {
    const t = String(r.invoice_type);
    if (opts?.only && !opts.only.includes(t)) continue;
    if (opts?.exclude && opts.exclude.includes(t)) continue;
    const name = (r.customer_id ? map.get(r.customer_id) : "") || (r.customer_name_snapshot ?? "").trim() || UNFILED;

    const slug = folderSlug(name);
    let f = folders.get(slug);
    if (!f) {
      f = { name, slug, rows: [], total: 0, lastDate: null };
      folders.set(slug, f);
    }
    f.rows.push(r);
    if (r.status !== "cancelled") f.total += Number(r.grand_total ?? 0);
    if (!f.lastDate || (r.invoice_date && r.invoice_date > f.lastDate)) f.lastDate = r.invoice_date ?? f.lastDate;
  }

  return {
    isLoading: invoicesQ.isLoading || customersQ.isLoading,
    folders: [...folders.values()].sort((a, b) => a.name.localeCompare(b.name)),
  };
}
