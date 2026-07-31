
-- =========== PAYMENTS ===========
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  mode TEXT NOT NULL DEFAULT 'cash',
  reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth all payments" ON public.payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER tg_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_payments_invoice ON public.payments(invoice_id);

-- Recalc parent invoice on payment change
CREATE OR REPLACE FUNCTION public.recalc_invoice_paid()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_invoice_id UUID;
  v_paid NUMERIC;
  v_total NUMERIC;
BEGIN
  v_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);
  SELECT COALESCE(SUM(amount),0) INTO v_paid FROM public.payments WHERE invoice_id = v_invoice_id;
  SELECT grand_total INTO v_total FROM public.invoices WHERE id = v_invoice_id;
  UPDATE public.invoices SET
    amount_paid = v_paid,
    status = CASE
      WHEN v_paid >= COALESCE(v_total,0) AND COALESCE(v_total,0) > 0 THEN 'paid'
      WHEN v_paid > 0 THEN 'partial'
      ELSE COALESCE((SELECT status FROM public.invoices WHERE id = v_invoice_id), 'sent')
    END
  WHERE id = v_invoice_id;
  RETURN NULL;
END; $$;

CREATE TRIGGER tg_payments_recalc AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.recalc_invoice_paid();

-- =========== VENDORS ===========
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  company_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  state_code TEXT,
  pincode TEXT,
  gst_number TEXT,
  pan_number TEXT,
  mobile TEXT,
  email TEXT,
  contact_person TEXT,
  bank_name TEXT,
  bank_account TEXT,
  bank_ifsc TEXT,
  payment_terms TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors TO authenticated;
GRANT ALL ON public.vendors TO service_role;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth all vendors" ON public.vendors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER tg_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========== PURCHASE ORDERS ===========
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT NOT NULL UNIQUE,
  po_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  vendor_name_snapshot TEXT,
  vendor_gst_snapshot TEXT,
  vendor_address_snapshot TEXT,
  is_igst BOOLEAN NOT NULL DEFAULT false,
  net_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  freight NUMERIC(14,2) NOT NULL DEFAULT 0,
  packing_charges NUMERIC(14,2) NOT NULL DEFAULT 0,
  sub_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  sgst_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  cgst_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  igst_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  round_off NUMERIC(14,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, received, cancelled
  expected_date DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_orders TO authenticated;
GRANT ALL ON public.purchase_orders TO service_role;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth all po" ON public.purchase_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER tg_po_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  sr_no INT NOT NULL DEFAULT 1,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  hsn_code TEXT,
  description TEXT NOT NULL,
  quantity NUMERIC(14,3) NOT NULL DEFAULT 0,
  uom TEXT DEFAULT 'NOS',
  unit_rate NUMERIC(14,4) NOT NULL DEFAULT 0,
  tax_pct NUMERIC(6,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_order_items TO authenticated;
GRANT ALL ON public.purchase_order_items TO service_role;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth all po items" ON public.purchase_order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_po_items_po ON public.purchase_order_items(purchase_order_id);
