ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS movement_reason text,
  ADD COLUMN IF NOT EXISTS transporter_name text,
  ADD COLUMN IF NOT EXISTS place_of_dispatch text,
  ADD COLUMN IF NOT EXISTS place_of_delivery text;

ALTER TABLE public.invoice_items
  ADD COLUMN IF NOT EXISTS serial_batch_number text;