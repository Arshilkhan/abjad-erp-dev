CREATE TABLE public.quotation (LIKE public.invoices INCLUDING DEFAULTS INCLUDING STORAGE INCLUDING COMMENTS);
ALTER TABLE public.quotation ADD PRIMARY KEY (id);
ALTER TABLE public.quotation ADD UNIQUE (invoice_number);
ALTER TABLE public.quotation ADD CONSTRAINT quotation_type_check CHECK (invoice_type = 'quotation');
ALTER TABLE public.quotation ADD CONSTRAINT quotation_customer_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotation TO authenticated;
GRANT ALL ON public.quotation TO service_role;
ALTER TABLE public.quotation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotation read" ON public.quotation FOR SELECT TO authenticated USING (true);
CREATE POLICY "quotation insert" ON public.quotation FOR INSERT TO authenticated WITH CHECK (public.can_edit_panel('quotations'));
CREATE POLICY "quotation update" ON public.quotation FOR UPDATE TO authenticated USING (public.can_edit_panel('quotations')) WITH CHECK (public.can_edit_panel('quotations'));
CREATE POLICY "quotation delete" ON public.quotation FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX idx_quotation_date ON public.quotation(invoice_date DESC);
CREATE INDEX idx_quotation_customer ON public.quotation(customer_id);
CREATE INDEX idx_quotation_status ON public.quotation(status);
CREATE TRIGGER quotation_updated BEFORE UPDATE ON public.quotation FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.quotation_items (LIKE public.invoice_items INCLUDING DEFAULTS INCLUDING STORAGE INCLUDING COMMENTS);
ALTER TABLE public.quotation_items ADD PRIMARY KEY (id);
ALTER TABLE public.quotation_items ADD CONSTRAINT quotation_items_parent_fkey FOREIGN KEY (invoice_id) REFERENCES public.quotation(id) ON DELETE CASCADE;
ALTER TABLE public.quotation_items ADD CONSTRAINT quotation_items_product_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotation_items TO authenticated;
GRANT ALL ON public.quotation_items TO service_role;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotation items read" ON public.quotation_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "quotation items write" ON public.quotation_items FOR ALL TO authenticated USING (public.can_edit_panel('quotations')) WITH CHECK (public.can_edit_panel('quotations'));
CREATE INDEX idx_quotation_items_parent ON public.quotation_items(invoice_id);
CREATE TRIGGER quotation_item_amounts BEFORE INSERT OR UPDATE ON public.quotation_items FOR EACH ROW EXECUTE FUNCTION public.tg_invoice_item_amounts();

CREATE TABLE public.performa (LIKE public.invoices INCLUDING DEFAULTS INCLUDING STORAGE INCLUDING COMMENTS);
ALTER TABLE public.performa ALTER COLUMN invoice_type SET DEFAULT 'proforma';
ALTER TABLE public.performa ADD PRIMARY KEY (id);
ALTER TABLE public.performa ADD UNIQUE (invoice_number);
ALTER TABLE public.performa ADD CONSTRAINT performa_type_check CHECK (invoice_type = 'proforma');
ALTER TABLE public.performa ADD CONSTRAINT performa_customer_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.performa TO authenticated;
GRANT ALL ON public.performa TO service_role;
ALTER TABLE public.performa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "performa read" ON public.performa FOR SELECT TO authenticated USING (true);
CREATE POLICY "performa insert" ON public.performa FOR INSERT TO authenticated WITH CHECK (public.can_edit_panel('invoices'));
CREATE POLICY "performa update" ON public.performa FOR UPDATE TO authenticated USING (public.can_edit_panel('invoices')) WITH CHECK (public.can_edit_panel('invoices'));
CREATE POLICY "performa delete" ON public.performa FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX idx_performa_date ON public.performa(invoice_date DESC);
CREATE INDEX idx_performa_customer ON public.performa(customer_id);
CREATE INDEX idx_performa_status ON public.performa(status);
CREATE TRIGGER performa_updated BEFORE UPDATE ON public.performa FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.performa_items (LIKE public.invoice_items INCLUDING DEFAULTS INCLUDING STORAGE INCLUDING COMMENTS);
ALTER TABLE public.performa_items ADD PRIMARY KEY (id);
ALTER TABLE public.performa_items ADD CONSTRAINT performa_items_parent_fkey FOREIGN KEY (invoice_id) REFERENCES public.performa(id) ON DELETE CASCADE;
ALTER TABLE public.performa_items ADD CONSTRAINT performa_items_product_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.performa_items TO authenticated;
GRANT ALL ON public.performa_items TO service_role;
ALTER TABLE public.performa_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "performa items read" ON public.performa_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "performa items write" ON public.performa_items FOR ALL TO authenticated USING (public.can_edit_panel('invoices')) WITH CHECK (public.can_edit_panel('invoices'));
CREATE INDEX idx_performa_items_parent ON public.performa_items(invoice_id);
CREATE TRIGGER performa_item_amounts BEFORE INSERT OR UPDATE ON public.performa_items FOR EACH ROW EXECUTE FUNCTION public.tg_invoice_item_amounts();

CREATE TABLE public.challan (LIKE public.invoices INCLUDING DEFAULTS INCLUDING STORAGE INCLUDING COMMENTS);
ALTER TABLE public.challan ALTER COLUMN invoice_type SET DEFAULT 'delivery_challan';
ALTER TABLE public.challan ADD PRIMARY KEY (id);
ALTER TABLE public.challan ADD UNIQUE (invoice_number);
ALTER TABLE public.challan ADD CONSTRAINT challan_type_check CHECK (invoice_type = 'delivery_challan');
ALTER TABLE public.challan ADD CONSTRAINT challan_customer_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challan TO authenticated;
GRANT ALL ON public.challan TO service_role;
ALTER TABLE public.challan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "challan read" ON public.challan FOR SELECT TO authenticated USING (true);
CREATE POLICY "challan insert" ON public.challan FOR INSERT TO authenticated WITH CHECK (public.can_edit_panel('challans'));
CREATE POLICY "challan update" ON public.challan FOR UPDATE TO authenticated USING (public.can_edit_panel('challans')) WITH CHECK (public.can_edit_panel('challans'));
CREATE POLICY "challan delete" ON public.challan FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX idx_challan_date ON public.challan(invoice_date DESC);
CREATE INDEX idx_challan_customer ON public.challan(customer_id);
CREATE INDEX idx_challan_status ON public.challan(status);
CREATE TRIGGER challan_updated BEFORE UPDATE ON public.challan FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.challan_items (LIKE public.invoice_items INCLUDING DEFAULTS INCLUDING STORAGE INCLUDING COMMENTS);
ALTER TABLE public.challan_items ADD PRIMARY KEY (id);
ALTER TABLE public.challan_items ADD CONSTRAINT challan_items_parent_fkey FOREIGN KEY (invoice_id) REFERENCES public.challan(id) ON DELETE CASCADE;
ALTER TABLE public.challan_items ADD CONSTRAINT challan_items_product_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challan_items TO authenticated;
GRANT ALL ON public.challan_items TO service_role;
ALTER TABLE public.challan_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "challan items read" ON public.challan_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "challan items write" ON public.challan_items FOR ALL TO authenticated USING (public.can_edit_panel('challans')) WITH CHECK (public.can_edit_panel('challans'));
CREATE INDEX idx_challan_items_parent ON public.challan_items(invoice_id);
CREATE TRIGGER challan_item_amounts BEFORE INSERT OR UPDATE ON public.challan_items FOR EACH ROW EXECUTE FUNCTION public.tg_invoice_item_amounts();

CREATE OR REPLACE FUNCTION public.recalc_sales_document_totals()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  parent_id uuid;
  parent_table text := TG_ARGV[0];
  item_net numeric := 0;
  item_tax numeric := 0;
  item_disc numeric := 0;
  parent_row record;
  charges numeric := 0;
  sub numeric;
  pre numeric;
  grand numeric;
BEGIN
  parent_id := COALESCE(NEW.invoice_id, OLD.invoice_id);
  EXECUTE format('SELECT * FROM public.%I WHERE id = $1', parent_table) INTO parent_row USING parent_id;
  IF parent_row IS NULL THEN RETURN NULL; END IF;
  EXECUTE format('SELECT COALESCE(SUM((GREATEST(quantity - COALESCE(rejected_quantity,0),0) * unit_rate) * (1 - COALESCE(discount_pct,0)/100)),0), COALESCE(SUM(discount_amount),0), COALESCE(SUM(tax_amount),0) FROM public.%I WHERE invoice_id = $1', TG_TABLE_NAME)
    INTO item_net, item_disc, item_tax USING parent_id;
  charges := COALESCE(parent_row.freight,0) + COALESCE(parent_row.packing_charges,0) + COALESCE(parent_row.other_charges,0) + COALESCE(parent_row.transportation_charges,0) + COALESCE(parent_row.delivery_charges,0);
  sub := item_net + charges;
  pre := sub + item_tax;
  grand := round(pre);
  EXECUTE format('UPDATE public.%I SET net_value=$1, discount_amount=$2, subtotal=$3, sgst_amount=$4, cgst_amount=$5, igst_amount=$6, round_off=$7, grand_total=$8, amount_in_words=public.amount_in_words($8) WHERE id=$9', parent_table)
    USING item_net, item_disc, sub,
      CASE WHEN COALESCE(parent_row.is_igst,false) THEN 0 ELSE item_tax/2 END,
      CASE WHEN COALESCE(parent_row.is_igst,false) THEN 0 ELSE item_tax/2 END,
      CASE WHEN COALESCE(parent_row.is_igst,false) THEN item_tax ELSE 0 END,
      grand-pre, grand, parent_id;
  RETURN NULL;
END; $$;
REVOKE EXECUTE ON FUNCTION public.recalc_sales_document_totals() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.recalc_sales_document_totals() TO authenticated, service_role;
CREATE TRIGGER quotation_recalc AFTER INSERT OR UPDATE OR DELETE ON public.quotation_items FOR EACH ROW EXECUTE FUNCTION public.recalc_sales_document_totals('quotation');
CREATE TRIGGER performa_recalc AFTER INSERT OR UPDATE OR DELETE ON public.performa_items FOR EACH ROW EXECUTE FUNCTION public.recalc_sales_document_totals('performa');
CREATE TRIGGER challan_recalc AFTER INSERT OR UPDATE OR DELETE ON public.challan_items FOR EACH ROW EXECUTE FUNCTION public.recalc_sales_document_totals('challan');

COMMENT ON COLUMN public.invoices.invoice_type IS 'Tax invoices only in the current application; legacy enum retained for compatibility.';