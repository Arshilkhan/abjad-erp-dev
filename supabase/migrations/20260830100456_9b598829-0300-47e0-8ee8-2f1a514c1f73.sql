-- Amount in words (Indian numbering), mirrors the app formatter -----------
CREATE OR REPLACE FUNCTION public.num_words_below_hundred(n int)
RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE
  ones text[] := ARRAY['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  tens text[] := ARRAY['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
BEGIN
  IF n < 20 THEN RETURN ones[n + 1]; END IF;
  RETURN tens[(n / 10) + 1] || CASE WHEN n % 10 > 0 THEN ' ' || ones[(n % 10) + 1] ELSE '' END;
END; $$;

CREATE OR REPLACE FUNCTION public.amount_in_words(amount numeric)
RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE
  ones text[] := ARRAY['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
  rupees bigint := floor(amount);
  paise int := round((amount - floor(amount)) * 100);
  n bigint; crore bigint; lakh bigint; thousand bigint; hundred int; h int; r int;
  parts text[] := ARRAY[]::text[];
  out_text text;
BEGIN
  IF rupees = 0 AND paise = 0 THEN RETURN 'Zero Rupees Only'; END IF;
  n := rupees;
  crore := n / 10000000; n := n % 10000000;
  lakh := n / 100000; n := n % 100000;
  thousand := n / 1000; n := n % 1000;
  hundred := n;
  IF crore > 0 THEN parts := parts || (public.num_words_below_hundred(crore::int) || ' Crore'); END IF;
  IF lakh > 0 THEN parts := parts || (public.num_words_below_hundred(lakh::int) || ' Lakh'); END IF;
  IF thousand > 0 THEN parts := parts || (public.num_words_below_hundred(thousand::int) || ' Thousand'); END IF;
  IF hundred > 0 THEN
    h := hundred / 100; r := hundred % 100;
    parts := parts || (
      CASE WHEN h > 0 THEN ones[h + 1] || ' Hundred' || CASE WHEN r > 0 THEN ' ' ELSE '' END ELSE '' END
      || CASE WHEN r > 0 THEN public.num_words_below_hundred(r) ELSE '' END
    );
  END IF;
  out_text := array_to_string(parts, ' ') || ' Rupees';
  IF paise > 0 THEN out_text := out_text || ' and ' || public.num_words_below_hundred(paise) || ' Paise'; END IF;
  RETURN out_text || ' Only';
END; $$;

REVOKE EXECUTE ON FUNCTION public.amount_in_words(numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.num_words_below_hundred(int) FROM PUBLIC, anon;

-- Line item values are always derived, never trusted from the client -------
CREATE OR REPLACE FUNCTION public.tg_invoice_item_amounts()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  qty numeric; gross numeric; disc numeric; net numeric; tax numeric;
BEGIN
  qty := GREATEST(COALESCE(NEW.quantity,0) - COALESCE(NEW.rejected_quantity,0), 0);
  NEW.accepted_quantity := qty;
  gross := qty * COALESCE(NEW.unit_rate,0);
  disc := gross * COALESCE(NEW.discount_pct,0) / 100;
  net := gross - disc;
  tax := net * COALESCE(NEW.tax_pct,0) / 100;
  NEW.discount_amount := disc;
  NEW.tax_amount := tax;
  NEW.total_amount := net + tax;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS tg_invoice_item_amounts ON public.invoice_items;
CREATE TRIGGER tg_invoice_item_amounts BEFORE INSERT OR UPDATE ON public.invoice_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_invoice_item_amounts();

-- Invoice header totals derived from its line items ------------------------
CREATE OR REPLACE FUNCTION public.recalc_invoice_totals(_invoice_id uuid)
RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  inv public.invoices%ROWTYPE;
  item_net numeric := 0; item_tax numeric := 0; item_disc numeric := 0;
  extra numeric := 0; charges numeric := 0; sub numeric; pre numeric; grand numeric;
BEGIN
  SELECT * INTO inv FROM public.invoices WHERE id = _invoice_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT COALESCE(SUM((GREATEST(quantity - COALESCE(rejected_quantity,0),0) * unit_rate)
                      * (1 - COALESCE(discount_pct,0)/100)), 0),
         COALESCE(SUM(COALESCE(tax_amount,0)), 0),
         COALESCE(SUM(COALESCE(discount_amount,0)), 0)
    INTO item_net, item_tax, item_disc
    FROM public.invoice_items WHERE invoice_id = _invoice_id;

  IF NOT EXISTS (SELECT 1 FROM public.invoice_items WHERE invoice_id = _invoice_id) THEN
    RETURN; -- nothing to derive from yet
  END IF;

  extra := GREATEST(COALESCE(inv.discount_amount,0) - item_disc, 0);
  charges := COALESCE(inv.freight,0) + COALESCE(inv.packing_charges,0) + COALESCE(inv.other_charges,0)
           + COALESCE(inv.transportation_charges,0) + COALESCE(inv.delivery_charges,0);
  sub := item_net + charges - extra;
  pre := sub + item_tax;
  grand := round(pre);

  UPDATE public.invoices SET
    net_value = item_net,
    discount_amount = item_disc + extra,
    subtotal = sub,
    sgst_amount = CASE WHEN COALESCE(is_igst,false) THEN 0 ELSE item_tax / 2 END,
    cgst_amount = CASE WHEN COALESCE(is_igst,false) THEN 0 ELSE item_tax / 2 END,
    igst_amount = CASE WHEN COALESCE(is_igst,false) THEN item_tax ELSE 0 END,
    round_off = grand - pre,
    grand_total = grand,
    amount_in_words = public.amount_in_words(grand)
  WHERE id = _invoice_id;
END; $$;

CREATE OR REPLACE FUNCTION public.tg_recalc_from_items()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  PERFORM public.recalc_invoice_totals(COALESCE(NEW.invoice_id, OLD.invoice_id));
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS tg_items_recalc_invoice ON public.invoice_items;
CREATE TRIGGER tg_items_recalc_invoice AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_recalc_from_items();

CREATE OR REPLACE FUNCTION public.tg_recalc_on_invoice_change()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.freight IS DISTINCT FROM OLD.freight
     OR NEW.packing_charges IS DISTINCT FROM OLD.packing_charges
     OR NEW.other_charges IS DISTINCT FROM OLD.other_charges
     OR NEW.transportation_charges IS DISTINCT FROM OLD.transportation_charges
     OR NEW.delivery_charges IS DISTINCT FROM OLD.delivery_charges
     OR NEW.is_igst IS DISTINCT FROM OLD.is_igst
     OR NEW.discount_amount IS DISTINCT FROM OLD.discount_amount THEN
    PERFORM public.recalc_invoice_totals(NEW.id);
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS tg_invoice_charges_recalc ON public.invoices;
CREATE TRIGGER tg_invoice_charges_recalc AFTER UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.tg_recalc_on_invoice_change();
