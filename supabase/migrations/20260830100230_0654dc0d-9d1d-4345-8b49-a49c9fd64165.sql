-- Helper functions -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin'));
$$;

CREATE OR REPLACE FUNCTION public.can_write(_user_id uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin','admin','accountant','sales_executive')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_panel(_panel text, _user_id uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin(_user_id)
     OR EXISTS (SELECT 1 FROM public.user_panel_permissions WHERE user_id = _user_id AND panel = _panel);
$$;

CREATE OR REPLACE FUNCTION public.can_edit_panel(_panel text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_panel(_panel) AND public.can_write();
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- Invoices --------------------------------------------------------------
DROP POLICY IF EXISTS "invoices all" ON public.invoices;
CREATE POLICY "invoices read" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "invoices write" ON public.invoices FOR INSERT TO authenticated WITH CHECK (public.can_edit_panel('invoices'));
CREATE POLICY "invoices update" ON public.invoices FOR UPDATE TO authenticated USING (public.can_edit_panel('invoices')) WITH CHECK (public.can_edit_panel('invoices'));
CREATE POLICY "invoices delete" ON public.invoices FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "invoice items all" ON public.invoice_items;
CREATE POLICY "invoice items read" ON public.invoice_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "invoice items insert" ON public.invoice_items FOR INSERT TO authenticated WITH CHECK (public.can_edit_panel('invoices'));
CREATE POLICY "invoice items update" ON public.invoice_items FOR UPDATE TO authenticated USING (public.can_edit_panel('invoices')) WITH CHECK (public.can_edit_panel('invoices'));
CREATE POLICY "invoice items delete" ON public.invoice_items FOR DELETE TO authenticated USING (public.can_edit_panel('invoices'));

DROP POLICY IF EXISTS "rejections all authed" ON public.invoice_rejections;
CREATE POLICY "rejections read" ON public.invoice_rejections FOR SELECT TO authenticated USING (true);
CREATE POLICY "rejections insert" ON public.invoice_rejections FOR INSERT TO authenticated WITH CHECK (public.can_edit_panel('invoices') AND (actor_id IS NULL OR actor_id = auth.uid()));
CREATE POLICY "rejections update" ON public.invoice_rejections FOR UPDATE TO authenticated USING (public.can_edit_panel('invoices')) WITH CHECK (public.can_edit_panel('invoices'));
CREATE POLICY "rejections delete" ON public.invoice_rejections FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "rej inv all authed" ON public.rejected_inventory;
CREATE POLICY "rejected inventory read" ON public.rejected_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "rejected inventory write" ON public.rejected_inventory FOR ALL TO authenticated USING (public.can_edit_panel('rejected-items') OR public.can_edit_panel('invoices')) WITH CHECK (public.can_edit_panel('rejected-items') OR public.can_edit_panel('invoices'));

-- Invoice history (audit) -----------------------------------------------
DROP POLICY IF EXISTS "history insert authed" ON public.invoice_history;
CREATE POLICY "history insert own actor" ON public.invoice_history FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- Payments / credits -----------------------------------------------------
DROP POLICY IF EXISTS "auth all payments" ON public.payments;
CREATE POLICY "payments read" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "payments insert" ON public.payments FOR INSERT TO authenticated WITH CHECK (public.can_edit_panel('payments'));
CREATE POLICY "payments update" ON public.payments FOR UPDATE TO authenticated USING (public.can_edit_panel('payments')) WITH CHECK (public.can_edit_panel('payments'));
CREATE POLICY "payments delete" ON public.payments FOR DELETE TO authenticated USING (public.can_edit_panel('payments'));

DROP POLICY IF EXISTS "credits all authed" ON public.customer_credits;
CREATE POLICY "credits read" ON public.customer_credits FOR SELECT TO authenticated USING (public.has_panel('customer-credits') OR public.has_panel('invoices'));
CREATE POLICY "credits write" ON public.customer_credits FOR ALL TO authenticated
  USING (public.can_edit_panel('customer-credits') OR public.can_edit_panel('invoices'))
  WITH CHECK (public.can_edit_panel('customer-credits') OR public.can_edit_panel('invoices'));

-- Customers / vendors ----------------------------------------------------
DROP POLICY IF EXISTS "customers all" ON public.customers;
CREATE POLICY "customers read" ON public.customers FOR SELECT TO authenticated USING (public.has_panel('customers') OR public.has_panel('invoices') OR public.has_panel('payments') OR public.has_panel('quotations'));
CREATE POLICY "customers write" ON public.customers FOR ALL TO authenticated
  USING (public.can_edit_panel('customers') OR public.can_edit_panel('invoices'))
  WITH CHECK (public.can_edit_panel('customers') OR public.can_edit_panel('invoices'));

DROP POLICY IF EXISTS "auth all vendors" ON public.vendors;
CREATE POLICY "vendors read" ON public.vendors FOR SELECT TO authenticated USING (public.has_panel('purchases'));
CREATE POLICY "vendors write" ON public.vendors FOR ALL TO authenticated
  USING (public.can_edit_panel('purchases')) WITH CHECK (public.can_edit_panel('purchases'));

-- Purchase orders --------------------------------------------------------
DROP POLICY IF EXISTS "auth all po" ON public.purchase_orders;
CREATE POLICY "po read" ON public.purchase_orders FOR SELECT TO authenticated USING (public.has_panel('purchases'));
CREATE POLICY "po write" ON public.purchase_orders FOR ALL TO authenticated
  USING (public.can_edit_panel('purchases')) WITH CHECK (public.can_edit_panel('purchases'));

DROP POLICY IF EXISTS "auth all po items" ON public.purchase_order_items;
CREATE POLICY "po items read" ON public.purchase_order_items FOR SELECT TO authenticated USING (public.has_panel('purchases'));
CREATE POLICY "po items write" ON public.purchase_order_items FOR ALL TO authenticated
  USING (public.can_edit_panel('purchases')) WITH CHECK (public.can_edit_panel('purchases'));

-- Products / inventory ---------------------------------------------------
DROP POLICY IF EXISTS "products all" ON public.products;
CREATE POLICY "products read" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "products write" ON public.products FOR ALL TO authenticated
  USING (public.can_edit_panel('products') OR public.can_edit_panel('invoices') OR public.can_edit_panel('inventory'))
  WITH CHECK (public.can_edit_panel('products') OR public.can_edit_panel('invoices') OR public.can_edit_panel('inventory'));

DROP POLICY IF EXISTS "categories all" ON public.product_categories;
CREATE POLICY "categories read" ON public.product_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "categories write" ON public.product_categories FOR ALL TO authenticated
  USING (public.can_edit_panel('products')) WITH CHECK (public.can_edit_panel('products'));

DROP POLICY IF EXISTS "stock all" ON public.stock_movements;
CREATE POLICY "stock read" ON public.stock_movements FOR SELECT TO authenticated USING (public.has_panel('inventory') OR public.has_panel('products'));
CREATE POLICY "stock write" ON public.stock_movements FOR ALL TO authenticated
  USING (public.can_edit_panel('inventory') OR public.can_edit_panel('products'))
  WITH CHECK (public.can_edit_panel('inventory') OR public.can_edit_panel('products'));

-- Configuration ----------------------------------------------------------
DROP POLICY IF EXISTS "invcfg all authed" ON public.invoice_configuration;
CREATE POLICY "invcfg read" ON public.invoice_configuration FOR SELECT TO authenticated USING (true);
CREATE POLICY "invcfg admin write" ON public.invoice_configuration FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Profiles ---------------------------------------------------------------
DROP POLICY IF EXISTS "profiles readable by signed-in" ON public.profiles;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());

-- Rate limiting ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  identifier text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.rate_limits TO service_role;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS rate_limits_lookup ON public.rate_limits (bucket, identifier, created_at DESC);
