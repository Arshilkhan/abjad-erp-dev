import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ConfigRow = {
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

export type FieldConfig = {
  visible: boolean;
  mandatory: boolean;
  readOnly: boolean;
  label: string;
};

const FALLBACK: FieldConfig = { visible: true, mandatory: false, readOnly: false, label: "" };

export function useInvoiceConfig() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["invoice-config"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("invoice_configuration") as any)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ConfigRow[];
    },
    staleTime: 30_000,
  });

  const map = new Map(rows.map((r) => [r.feature_key, r]));

  const cfg = (key: string): FieldConfig => {
    const r = map.get(key);
    if (!r) return FALLBACK;
    const enabled = r.enabled;
    return {
      visible: enabled && r.is_visible,
      mandatory: enabled && r.is_mandatory,
      readOnly: enabled ? r.is_read_only || !r.is_editable : true,
      label: r.label,
    };
  };

  return { cfg, rows, isLoading };
}
