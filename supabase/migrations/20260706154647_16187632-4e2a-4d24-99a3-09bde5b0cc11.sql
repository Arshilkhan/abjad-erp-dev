
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'accountant', 'sales_executive', 'viewer');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by signed-in" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + assign first user as super_admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'viewer') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ COMPANY PROFILE (singleton) ============
CREATE TABLE public.company_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'ABJAD Engineering Works',
  logo_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  state_code TEXT,
  pincode TEXT,
  gst_number TEXT,
  pan_number TEXT,
  mobile TEXT,
  alt_mobile TEXT,
  email TEXT,
  website TEXT,
  bank_name TEXT,
  bank_account TEXT,
  bank_ifsc TEXT,
  bank_branch TEXT,
  bank_branch_code TEXT,
  declaration TEXT DEFAULT 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
  invoice_prefix TEXT DEFAULT 'INV',
  quotation_prefix TEXT DEFAULT 'QTN',
  po_prefix TEXT DEFAULT 'PO',
  financial_year TEXT DEFAULT '2025-26',
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.company_profile TO authenticated;
GRANT ALL ON public.company_profile TO service_role;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company readable" ON public.company_profile FOR SELECT TO authenticated USING (true);
CREATE POLICY "company writable by admin" ON public.company_profile FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER company_profile_updated BEFORE UPDATE ON public.company_profile FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.company_profile (name, address, city, state, state_code, gst_number, pan_number, mobile, email)
VALUES ('ABJAD Engineering Works', 'Plot No. 12, MIDC Industrial Area', 'Pune', 'Maharashtra', '27', '27AABCA1234A1Z5', 'AABCA1234A', '+91 98765 43210', 'accounts@abjadengineering.com');

-- ============ INVOICE SETTINGS (singleton, field visibility & mandatory flags) ============
CREATE TABLE public.invoice_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_gst_number BOOLEAN DEFAULT true,
  mandatory_gst_number BOOLEAN DEFAULT true,
  show_pan_number BOOLEAN DEFAULT true,
  mandatory_pan_number BOOLEAN DEFAULT true,
  show_po_number BOOLEAN DEFAULT true,
  mandatory_po_number BOOLEAN DEFAULT false,
  show_challan_number BOOLEAN DEFAULT true,
  mandatory_challan_number BOOLEAN DEFAULT false,
  show_freight BOOLEAN DEFAULT true,
  mandatory_freight BOOLEAN DEFAULT true,
  show_packing_charges BOOLEAN DEFAULT true,
  mandatory_packing_charges BOOLEAN DEFAULT false,
  show_discount BOOLEAN DEFAULT true,
  mandatory_discount BOOLEAN DEFAULT false,
  show_contact_person BOOLEAN DEFAULT true,
  mandatory_contact_person BOOLEAN DEFAULT false,
  show_delivery BOOLEAN DEFAULT true,
  mandatory_delivery BOOLEAN DEFAULT false,
  show_declaration BOOLEAN DEFAULT true,
  show_bank_details BOOLEAN DEFAULT true,
  show_signature BOOLEAN DEFAULT true,
  show_company_seal BOOLEAN DEFAULT true,
  show_work_order BOOLEAN DEFAULT true,
  show_gst_arn BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, INSERT ON public.invoice_settings TO authenticated;
GRANT ALL ON public.invoice_settings TO service_role;
ALTER TABLE public.invoice_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings readable" ON public.invoice_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "settings writable by admin" ON public.invoice_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER invoice_settings_updated BEFORE UPDATE ON public.invoice_settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
INSERT INTO public.invoice_settings DEFAULT VALUES;

-- ============ CUSTOMERS ============
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  company_name TEXT,
  billing_address TEXT,
  shipping_address TEXT,
  contact_person TEXT,
  mobile TEXT,
  email TEXT,
  gst_number TEXT,
  pan_number TEXT,
  state TEXT,
  state_code TEXT,
  place_of_supply TEXT,
  credit_limit NUMERIC(14,2) DEFAULT 0,
  payment_terms TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers all" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_customers_name ON public.customers (customer_name);
CREATE INDEX idx_customers_gst ON public.customers (gst_number);

-- ============ PRODUCTS ============
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories all" ON public.product_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  product_code TEXT UNIQUE,
  hsn_code TEXT,
  description TEXT,
  unit TEXT DEFAULT 'NOS',
  gst_percentage NUMERIC(5,2) DEFAULT 18,
  selling_price NUMERIC(14,2) DEFAULT 0,
  purchase_price NUMERIC(14,2) DEFAULT 0,
  stock_quantity NUMERIC(14,3) DEFAULT 0,
  minimum_stock NUMERIC(14,3) DEFAULT 0,
  maximum_stock NUMERIC(14,3) DEFAULT 0,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  drawing_number TEXT,
  material TEXT,
  weight NUMERIC(10,3),
  dimensions TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products all" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_products_name ON public.products (product_name);
CREATE INDEX idx_products_code ON public.products (product_code);

-- ============ INVOICES ============
CREATE TYPE public.invoice_type AS ENUM ('tax_invoice','proforma','quotation','purchase_order','delivery_challan','credit_note','debit_note');
CREATE TYPE public.invoice_status AS ENUM ('draft','sent','paid','partial','cancelled');

CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_type invoice_type NOT NULL DEFAULT 'tax_invoice',
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
  customer_name_snapshot TEXT,
  customer_gst_snapshot TEXT,
  customer_address_snapshot TEXT,
  po_number TEXT,
  po_date DATE,
  challan_number TEXT,
  challan_date DATE,
  work_order_number TEXT,
  gst_arn TEXT,
  place_of_supply TEXT,
  is_igst BOOLEAN DEFAULT false,
  net_value NUMERIC(14,2) DEFAULT 0,
  discount_amount NUMERIC(14,2) DEFAULT 0,
  freight NUMERIC(14,2) DEFAULT 0,
  packing_charges NUMERIC(14,2) DEFAULT 0,
  other_charges NUMERIC(14,2) DEFAULT 0,
  subtotal NUMERIC(14,2) DEFAULT 0,
  sgst_amount NUMERIC(14,2) DEFAULT 0,
  cgst_amount NUMERIC(14,2) DEFAULT 0,
  igst_amount NUMERIC(14,2) DEFAULT 0,
  round_off NUMERIC(14,2) DEFAULT 0,
  grand_total NUMERIC(14,2) DEFAULT 0,
  amount_paid NUMERIC(14,2) DEFAULT 0,
  amount_in_words TEXT,
  delivery_mode TEXT,
  payment_terms TEXT,
  contact_person TEXT,
  contact_mobile TEXT,
  notes TEXT,
  status invoice_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices all" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_invoices_date ON public.invoices (invoice_date DESC);
CREATE INDEX idx_invoices_customer ON public.invoices (customer_id);
CREATE INDEX idx_invoices_status ON public.invoices (status);

CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  sr_no INT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  hsn_code TEXT,
  description TEXT NOT NULL,
  quantity NUMERIC(14,3) NOT NULL DEFAULT 1,
  uom TEXT DEFAULT 'NOS',
  unit_rate NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount_pct NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(14,2) DEFAULT 0,
  tax_pct NUMERIC(5,2) DEFAULT 18,
  tax_amount NUMERIC(14,2) DEFAULT 0,
  total_amount NUMERIC(14,2) NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoice items all" ON public.invoice_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_invoice_items_invoice ON public.invoice_items (invoice_id);

-- ============ STOCK MOVEMENTS ============
CREATE TYPE public.stock_movement_type AS ENUM ('stock_in','stock_out','consumption','manufacturing','adjustment');
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type stock_movement_type NOT NULL,
  quantity NUMERIC(14,3) NOT NULL,
  reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock all" ON public.stock_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_stock_product ON public.stock_movements (product_id);
