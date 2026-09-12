-- Run this manually against the external ABJAD production database before
-- deploying the four-document workflow. This file is intentionally not
-- applied to Lovable Cloud.

BEGIN;

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS document_no bigint,
  ADD COLUMN IF NOT EXISTS shipping_address_snapshot text,
  ADD COLUMN IF NOT EXISTS customer_state_snapshot text,
  ADD COLUMN IF NOT EXISTS customer_state_code_snapshot text,
  ADD COLUMN IF NOT EXISTS customer_reference text,
  ADD COLUMN IF NOT EXISTS valid_until date,
  ADD COLUMN IF NOT EXISTS expected_delivery text,
  ADD COLUMN IF NOT EXISTS due_date date,
  ADD COLUMN IF NOT EXISTS reason_for_movement text,
  ADD COLUMN IF NOT EXISTS transporter_name text,
  ADD COLUMN IF NOT EXISTS vehicle_number text,
  ADD COLUMN IF NOT EXISTS lr_gr_number text,
  ADD COLUMN IF NOT EXISTS eway_bill_number text,
  ADD COLUMN IF NOT EXISTS place_of_dispatch text,
  ADD COLUMN IF NOT EXISTS place_of_delivery text,
  ADD COLUMN IF NOT EXISTS related_invoice_number text,
  ADD COLUMN IF NOT EXISTS related_invoice_date date,
  ADD COLUMN IF NOT EXISTS terms_conditions text,
  ADD COLUMN IF NOT EXISTS email_status text NOT NULL DEFAULT 'not_sent',
  ADD COLUMN IF NOT EXISTS email_recipient text;

ALTER TABLE public.invoice_items
  ADD COLUMN IF NOT EXISTS serial_batch_number text;

ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_invoice_number_key;
CREATE UNIQUE INDEX IF NOT EXISTS invoices_type_number_unique
  ON public.invoices (invoice_type, invoice_number);
CREATE UNIQUE INDEX IF NOT EXISTS invoices_type_document_no_unique
  ON public.invoices (invoice_type, document_no)
  WHERE document_no IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.document_number_counters (
  invoice_type public.invoice_type PRIMARY KEY,
  last_number bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.document_number_counters TO authenticated;
GRANT ALL ON public.document_number_counters TO service_role;
ALTER TABLE public.document_number_counters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "document counters writable by editors" ON public.document_number_counters;
CREATE POLICY "document counters writable by editors"
  ON public.document_number_counters FOR ALL TO authenticated
  USING (public.can_write()) WITH CHECK (public.can_write());

INSERT INTO public.document_number_counters (invoice_type, last_number)
SELECT kind, COALESCE(MAX(parsed_no), 0)
FROM (
  SELECT invoice_type AS kind,
    CASE
      WHEN invoice_type = 'delivery_challan' THEN substring(invoice_number FROM '^dc-([0-9]+)')::bigint
      ELSE substring(invoice_number FROM '^([0-9]+)')::bigint
    END AS parsed_no
  FROM public.invoices
  WHERE invoice_type IN ('quotation', 'proforma', 'tax_invoice', 'delivery_challan')
) existing
GROUP BY kind
ON CONFLICT (invoice_type) DO UPDATE
SET last_number = GREATEST(public.document_number_counters.last_number, EXCLUDED.last_number),
    updated_at = now();

CREATE OR REPLACE FUNCTION public.assign_final_document_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE next_number bigint;
BEGIN
  IF NEW.invoice_type NOT IN ('quotation', 'proforma', 'tax_invoice', 'delivery_challan') THEN
    RETURN NEW;
  END IF;
  IF NEW.status <> 'draft' AND NEW.document_no IS NULL THEN
    INSERT INTO public.document_number_counters (invoice_type, last_number)
    VALUES (NEW.invoice_type, 1)
    ON CONFLICT (invoice_type) DO UPDATE
      SET last_number = public.document_number_counters.last_number + 1,
          updated_at = now()
    RETURNING last_number INTO next_number;
    NEW.document_no := next_number;
    NEW.invoice_number := next_number::text;
  ELSIF NEW.status = 'draft' AND (NEW.invoice_number IS NULL OR NEW.invoice_number = '') THEN
    NEW.invoice_number := 'draft-' || NEW.id::text;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_final_document_number ON public.invoices;
CREATE TRIGGER trg_assign_final_document_number
  BEFORE INSERT OR UPDATE OF status ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.assign_final_document_number();

COMMIT;