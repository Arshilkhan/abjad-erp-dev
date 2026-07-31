
-- 1. Extend invoices for cancellation and import tagging
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS is_imported BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS import_source TEXT;

-- 2. Extend invoice_items for rejection tracking
ALTER TABLE public.invoice_items
  ADD COLUMN IF NOT EXISTS rejected_quantity NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS accepted_quantity NUMERIC;

-- 3. Invoice history / audit trail
CREATE TABLE IF NOT EXISTS public.invoice_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invoice_history_invoice ON public.invoice_history(invoice_id, created_at DESC);
GRANT SELECT, INSERT ON public.invoice_history TO authenticated;
GRANT ALL ON public.invoice_history TO service_role;
ALTER TABLE public.invoice_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history read authed" ON public.invoice_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "history insert authed" ON public.invoice_history FOR INSERT TO authenticated WITH CHECK (true);

-- 4. Rejected items adjustments (per invoice line)
CREATE TABLE IF NOT EXISTS public.invoice_rejections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  invoice_item_id UUID NOT NULL REFERENCES public.invoice_items(id) ON DELETE CASCADE,
  rejected_quantity NUMERIC NOT NULL CHECK (rejected_quantity > 0),
  rejection_reason TEXT NOT NULL,
  reason_notes TEXT,
  unit_rate NUMERIC NOT NULL DEFAULT 0,
  tax_pct NUMERIC NOT NULL DEFAULT 0,
  rejected_value NUMERIC NOT NULL DEFAULT 0,
  gst_deduction NUMERIC NOT NULL DEFAULT 0,
  total_deduction NUMERIC NOT NULL DEFAULT 0,
  disposition TEXT NOT NULL DEFAULT 'restock',
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rejections_invoice ON public.invoice_rejections(invoice_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_rejections TO authenticated;
GRANT ALL ON public.invoice_rejections TO service_role;
ALTER TABLE public.invoice_rejections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rejections all authed" ON public.invoice_rejections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Customer credits (auto-generated from rejections; usable as refund or next-invoice adjustment)
CREATE TABLE IF NOT EXISTS public.customer_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  source_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  source_rejection_id UUID REFERENCES public.invoice_rejections(id) ON DELETE SET NULL,
  credit_amount NUMERIC NOT NULL DEFAULT 0,
  used_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_credits_customer ON public.customer_credits(customer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_credits TO authenticated;
GRANT ALL ON public.customer_credits TO service_role;
ALTER TABLE public.customer_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "credits all authed" ON public.customer_credits FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_credits_updated BEFORE UPDATE ON public.customer_credits FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 6. Rejected inventory (defect/return holding stock)
CREATE TABLE IF NOT EXISTS public.rejected_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  rejection_id UUID REFERENCES public.invoice_rejections(id) ON DELETE SET NULL,
  description TEXT,
  quantity NUMERIC NOT NULL DEFAULT 0,
  uom TEXT,
  reason TEXT,
  disposition TEXT NOT NULL DEFAULT 'hold',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rejected_inventory TO authenticated;
GRANT ALL ON public.rejected_inventory TO service_role;
ALTER TABLE public.rejected_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rej inv all authed" ON public.rejected_inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Invoice Configuration — feature toggles + 4-level permission matrix
CREATE TABLE IF NOT EXISTS public.invoice_configuration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_editable BOOLEAN NOT NULL DEFAULT true,
  is_read_only BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_configuration TO authenticated;
GRANT ALL ON public.invoice_configuration TO service_role;
ALTER TABLE public.invoice_configuration ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invcfg all authed" ON public.invoice_configuration FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_invcfg_updated BEFORE UPDATE ON public.invoice_configuration FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed feature list
INSERT INTO public.invoice_configuration (feature_key, label, sort_order) VALUES
  ('freight_charges', 'Freight Charges', 10),
  ('delivery_charges', 'Delivery Charges', 20),
  ('transportation_charges', 'Transportation Charges', 30),
  ('packing_charges', 'Packing Charges', 40),
  ('other_charges', 'Other Charges', 50),
  ('import_invoice', 'Import Invoice', 60),
  ('cancel_invoice', 'Cancel Invoice', 70),
  ('rejected_items', 'Rejected Items', 80),
  ('customer_credit', 'Customer Credit', 90),
  ('credit_note', 'Credit Note', 100),
  ('inventory_adjustment', 'Inventory Adjustment', 110),
  ('history_tracking', 'History Tracking', 120),
  ('audit_log', 'Audit Log', 130)
ON CONFLICT (feature_key) DO NOTHING;

-- 8. Extend invoices for additional charges (transportation, delivery, other)
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS transportation_charges NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_charges NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS other_charges NUMERIC NOT NULL DEFAULT 0;
