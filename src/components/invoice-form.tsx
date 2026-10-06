import { salesDocumentConfig, type SalesDocumentKind } from "@/lib/sales-documents";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { extractInvoicePdf } from "@/lib/invoice-pdf.functions";
import { sendInvoiceEmail } from "@/lib/invoice-email.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, X, Upload, Loader2 } from "lucide-react";
import { formatINR, amountInWords } from "@/lib/format";
import { logInvoiceEvent } from "@/lib/invoice-history";
import { TypeaheadInput } from "@/components/typeahead-input";
import { useInvoiceConfig } from "@/lib/invoice-config";
import { computeItem, emptyItem, MOVEMENT_REASONS, type LineItem, } from "@/components/forms/shared/types";
import { Row, ChargeRow, } from "@/components/forms/shared/totals-section";
import { ProductLineItems } from "@/components/forms/shared/product-line-items";
import { DocumentDetails } from "@/components/forms/shared/document-details";

export function InvoiceForm({
  editId,
  importMode,
  documentType = "tax_invoice",
}: {
  editId?: string;
  importMode?: boolean;
  documentType?: SalesDocumentKind;
}) {
  const docCfg = salesDocumentConfig(documentType);
  const docTable = docCfg.table as "invoices";
  const docItemsTable = docCfg.itemsTable as "invoice_items";
  const isTaxInvoice = documentType === "tax_invoice";
  const nav = useNavigate();
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!editId;
  const qc = useQueryClient();

  const [items, setItems] = useState<LineItem[]>([emptyItem(1)]);
  const [customerId, setCustomerId] = useState<string>("");
  const [customerText, setCustomerText] = useState<string>("");
  const [custCompany, setCustCompany] = useState("");
  // Contact person mirrors the customer name — no separate input.
  const [custAddress, setCustAddress] = useState("");
  const [custMobile, setCustMobile] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custGst, setCustGst] = useState("");
  const [productTexts, setProductTexts] = useState<string[]>([""]);
  const [invoiceType, setInvoiceType] = useState<string>(documentType);
  const [challanNumber, setChallanNumber] = useState("");
  const [challanDates, setChallanDates] = useState<string[]>([]);
  const [challanDateInput, setChallanDateInput] = useState("");

  const [workOrder, setWorkOrder] = useState("");
  const [freight, setFreight] = useState(0);
  const [packing, setPacking] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [transportCharges, setTransportCharges] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState("By Road");
  const [paymentTerms, setPaymentTerms] = useState("30 Days");
  const [notes, setNotes] = useState("");
  const [movementReason, setMovementReason] = useState("Delivery / Supply");
  const [transporterName, setTransporterName] = useState("");
  const [placeOfDispatch, setPlaceOfDispatch] = useState("");
  const [placeOfDelivery, setPlaceOfDelivery] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [hydrated, setHydrated] = useState(false);
  const isChallan = invoiceType === "delivery_challan";

  const addChallanDate = () => {
    const d = challanDateInput;
    if (!d) return;
    setChallanDates((prev) => (prev.includes(d) ? prev : [...prev, d].sort()));
    setChallanDateInput("");
  };

  const { data: customers = [] } = useQuery({
    queryKey: ["customers-list"],
    queryFn: async () =>
      (
        await supabase
          .from("customers")
          .select(
            "id, customer_name, company_name, gst_number, billing_address, state, state_code, contact_person, mobile, email",
          )
      ).data ?? [],
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products-list"],
    queryFn: async () =>
      (
        await supabase
          .from("products")
          .select("id, product_name, product_code, hsn_code, unit, gst_percentage, selling_price")
      ).data ?? [],
  });
  const { data: settings } = useQuery({
    queryKey: ["invoice-settings"],
    queryFn: async () => (await supabase.from("invoice_settings").select("*").limit(1).maybeSingle()).data,
  });
  const { cfg } = useInvoiceConfig();
  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: async () => (await supabase.from("company_profile").select("state_code").limit(1).maybeSingle()).data,
  });

  // Load existing invoice for edit
  const { data: existing } = useQuery({
    queryKey: ["invoice-edit", documentType, editId],
    enabled: isEdit,
    queryFn: async () => {
      const [inv, its] = await Promise.all([
        supabase.from(docTable).select("*").eq("id", editId!).single(),
        supabase.from(docItemsTable).select("*").eq("invoice_id", editId!).order("sr_no"),
      ]);
      if (inv.error) throw inv.error;
      return { invoice: inv.data, items: its.data ?? [] };
    },
  });

  useEffect(() => {
    if (!existing || hydrated) return;
    const inv = existing.invoice;
    setCustomerId(inv.customer_id ?? "");
    setCustomerText(inv.customer_name_snapshot ?? "");
    setInvoiceType(documentType);
    setInvoiceDate(inv.invoice_date);
    if (isChallan) {
      setChallanNumber((inv as any).challan_number ?? "");
      setChallanDates(
        ((inv as any).challan_dates as string[] | null) ??
        ((inv as any).challan_date ? [(inv as any).challan_date] : []),
      );
    }

    setWorkOrder(inv.work_order_number ?? "");
    if (!isChallan) {
      setFreight(Number((inv as any).freight ?? 0));
      setPacking(Number((inv as any).packing_charges ?? 0));
      setOtherCharges(Number((inv as any).other_charges ?? 0));
      if (isTaxInvoice) {
        setTransportCharges(Number((inv as any).transportation_charges ?? 0));
        setDeliveryCharges(Number((inv as any).delivery_charges ?? 0));
      }
    }
    setDeliveryMode(inv.delivery_mode ?? "");
    setPaymentTerms(inv.payment_terms ?? "");
    setNotes(inv.notes ?? "");
    setMovementReason((inv as any).movement_reason ?? "Delivery / Supply");
    setTransporterName((inv as any).transporter_name ?? "");
    setPlaceOfDispatch((inv as any).place_of_dispatch ?? "");
    setPlaceOfDelivery((inv as any).place_of_delivery ?? "");
    setItems(
      existing.items.length
        ? existing.items.map((it: any, i: number) => ({
          sr_no: it.sr_no ?? i + 1,
          product_id: it.product_id,
          hsn_code: it.hsn_code ?? "",
          description: it.description ?? "",
          quantity: Number(it.quantity ?? 1),
          uom: it.uom ?? "NOS",
          unit_rate: isChallan ? 0 : Number(it.unit_rate ?? 0),
          discount_mode: "pct" as const,
          discount_value: isChallan ? 0 : Number(it.discount_pct ?? 0),
          tax_pct: isChallan ? 0 : Number(it.tax_pct ?? 18),
          serial_batch_number: (it as any).serial_batch_number ?? "",
        }))
        : [emptyItem(1)],
    );
    setProductTexts(existing.items.length ? existing.items.map((it: any) => it.description ?? "") : [""]);
    setHydrated(true);
  }, [existing, hydrated]);

  const customer = customers.find((c: any) => c.id === customerId);
  const isIGST = !!(customer?.state_code && company?.state_code && customer.state_code !== company.state_code);

  // Fill the customer detail fields whenever an existing customer is selected
  // (also covers edit-mode hydration once the customer list arrives).
  useEffect(() => {
    if (!customer) return;
    setCustomerText(customer.customer_name || customer.company_name || "");
    setCustCompany(customer.company_name ?? "");
    setCustAddress((customer as any).billing_address ?? "");

    setCustMobile((customer as any).mobile ?? "");
    setCustEmail((customer as any).email ?? "");
    setCustGst(customer.gst_number ?? "");
  }, [customerId, customer]);

  const totals = useMemo(() => {
    let net = 0,
      tax = 0,
      disc = 0;
    for (const it of items) {
      const c = computeItem(it);
      net += c.net;
      tax += c.tax_amount;
      disc += c.discount_amount;
    }
    const subtotal =
      net +
      Number(freight || 0) +
      Number(packing || 0) +
      Number(otherCharges || 0) +
      Number(transportCharges || 0) +
      Number(deliveryCharges || 0);
    const preRound = subtotal + tax;
    const grand = Math.round(preRound);
    const round_off = grand - preRound;
    return { net, tax, disc, subtotal, grand, round_off };
  }, [items, freight, packing, otherCharges, transportCharges, deliveryCharges]);

  const setItem = (idx: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const addItem = () => {
    setItems((p) => [...p, emptyItem(p.length + 1)]);
    setProductTexts((p) => [...p, ""]);
  };
  const removeItem = (idx: number) => {
    setItems((p) => p.filter((_, i) => i !== idx).map((it, i) => ({ ...it, sr_no: i + 1 })));
    setProductTexts((p) => p.filter((_, i) => i !== idx));
  };

  const applyProduct = (idx: number, pid: string) => {
    const p = products.find((x: any) => x.id === pid);

    if (!p) return;

    setItem(idx, {
      product_id: p.id,
      hsn_code: p.hsn_code ?? "",
      description: p.product_name,
      unit_rate: Number(p.selling_price ?? 0),
      uom: p.unit ?? "NOS",
      tax_pct: Number(p.gst_percentage ?? 18),
    });
  };

  const setProductText = (idx: number, value: string) => {
    setProductTexts((prev) =>
      prev.map((text, i) => (i === idx ? value : text)),
    );
  };

  const sendEmail = useServerFn(sendInvoiceEmail);

  const save = useMutation({
    mutationFn: async (status: "draft" | "sent") => {
      const nameTyped = customerText.trim();
      if (!custCompany.trim()) throw new Error("Please enter a company name");
      if (settings?.mandatory_gst_number && !custGst.trim()) throw new Error("Customer GST Number is mandatory");
      if (isChallan && settings?.mandatory_challan_number && !challanNumber)
        throw new Error("Challan Number is mandatory");

      const requireCharge = (key: string, val: number) => {
        const c = cfg(key);
        if (c.visible && c.mandatory && !Number(val)) throw new Error(`${c.label || key} is mandatory`);
      };
      if (!isChallan) {
        requireCharge("freight_charges", freight);
        requireCharge("packing_charges", packing);
        requireCharge("other_charges", otherCharges);
        if (isTaxInvoice) {
          requireCharge("transportation_charges", transportCharges);
          requireCharge("delivery_charges", deliveryCharges);
        }
      }
      if (items.length === 0) throw new Error("Add at least one item");

      // Resolve the customer: use the selected one, match an existing record by
      // name, or create a brand-new customer from the typed details.
      let cust: any =
        customer ??
        customers.find(
          (c: any) =>
            (c.customer_name ?? "").toLowerCase() === nameTyped.toLowerCase() ||
            (c.company_name ?? "").toLowerCase() === nameTyped.toLowerCase(),
        );
      if (cust) {
        const patch: any = {};
        if (custCompany.trim() && custCompany !== (cust.company_name ?? "")) patch.company_name = custCompany.trim();
        if (nameTyped && nameTyped !== (cust.contact_person ?? "")) patch.contact_person = nameTyped;
        if (custAddress.trim() && custAddress !== (cust.billing_address ?? "")) patch.billing_address = custAddress.trim();
        if (custMobile.trim() && custMobile !== (cust.mobile ?? "")) patch.mobile = custMobile.trim();
        if (custEmail.trim() && custEmail !== (cust.email ?? "")) patch.email = custEmail.trim();
        if (custGst.trim() && custGst !== (cust.gst_number ?? "")) patch.gst_number = custGst.trim();
        if (Object.keys(patch).length) {
          const { data, error } = await supabase.from("customers").update(patch).eq("id", cust.id).select().single();
          if (error) throw error;
          cust = data;
        }
      } else {
        const { data, error } = await supabase
          .from("customers")
          .insert({
            customer_name: nameTyped,
            company_name: custCompany.trim() || null,
            contact_person: nameTyped || null,
            billing_address: custAddress.trim() || null,
            mobile: custMobile.trim() || null,
            email: custEmail.trim() || null,
            gst_number: custGst.trim() || null,
            created_by: user?.id ?? null,
          })
          .select()
          .single();
        if (error) throw error;
        cust = data;
        setCustomerId(cust.id);
      }

      // Create any products that were typed in but don't exist yet.
      const resolvedItems: LineItem[] = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i]!;
        const typed = (productTexts[i] ?? "").trim();
        if (it.product_id || !typed) {
          resolvedItems.push({ ...it, description: it.description || typed });
          continue;
        }
        const match = products.find((p: any) => (p.product_name ?? "").toLowerCase() === typed.toLowerCase());
        if (match) {
          resolvedItems.push({ ...it, product_id: match.id, description: it.description || typed });
          continue;
        }
        const { data: newProd, error: pErr } = await supabase
          .from("products")
          .insert({
            product_name: typed,
            hsn_code: it.hsn_code || null,
            description: it.description || null,
            unit: it.uom || null,
            selling_price: Number(it.unit_rate) || 0,
            gst_percentage: Number(it.tax_pct) || 0,
            stock_quantity: Number(it.quantity) || 0,
          })
          .select()
          .single();
        if (pErr) throw pErr;
        resolvedItems.push({ ...it, product_id: newProd.id, description: it.description || typed });
      }

      const sgst_amount = isIGST ? 0 : totals.tax / 2;
      const cgst_amount = isIGST ? 0 : totals.tax / 2;
      const igst_amount = isIGST ? totals.tax : 0;

      const payload: any = {
        invoice_type: invoiceType as any,
        invoice_date: invoiceDate,
        customer_id: cust.id,
        customer_name_snapshot: cust.company_name || cust.customer_name,
        customer_gst_snapshot: cust.gst_number,
        customer_address_snapshot: custAddress.trim() || cust.billing_address,
        work_order_number: workOrder || null,
        delivery_mode: deliveryMode || null,
        contact_person: nameTyped || null,
        contact_mobile: custMobile || null,
        notes: notes || null,
        status,
      };
      if (isChallan) {
        Object.assign(payload, {
          challan_number: challanNumber || null,
          challan_date: challanDates[0] || invoiceDate,
          challan_dates: challanDates.length ? challanDates : [invoiceDate],
          movement_reason: movementReason || null,
          transporter_name: transporterName.trim() || null,
          place_of_dispatch: placeOfDispatch.trim() || null,
          place_of_delivery: placeOfDelivery.trim() || null,
        });
      } else {
        Object.assign(payload, {
          is_igst: isIGST,
          net_value: totals.net,
          discount_amount: totals.disc,
          freight: Number(freight || 0),
          packing_charges: Number(packing || 0),
          other_charges: Number(otherCharges || 0),

          subtotal: totals.subtotal,
          sgst_amount,
          cgst_amount,
          igst_amount,
          round_off: totals.round_off,
          grand_total: totals.grand,
          amount_in_words: amountInWords(totals.grand),
          payment_terms: paymentTerms || null,
        });
        if (isTaxInvoice) {
          payload.transportation_charges = Number(transportCharges || 0);
          payload.delivery_charges = Number(deliveryCharges || 0);
        }
      }

      let invId: string;
      let invNumber: string;
      if (isEdit) {
        const { data: inv, error } = await supabase
          .from(docTable)
          .update(payload)
          .eq("id", editId!)
          .select()
          .single();
        if (error) throw error;
        invId = inv.id;
        invNumber = inv.invoice_number;
        const { error: dErr } = await supabase.from(docItemsTable).delete().eq("invoice_id", invId);
        if (dErr) throw dErr;
      } else {
        // Invoice number format: <sequence>-<company-name-slug>, e.g. 1-fluid-tech
        const slug =
          (custCompany || cust.company_name || cust.customer_name || customerText || "customer")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "customer";

        const { data: existing } = await supabase.from(docTable).select("invoice_number");
        // Delivery challans never consume a bill number; they get their own "dc-" reference.
        const seqRe = docCfg.prefix ? new RegExp(`^${docCfg.prefix}(\\d+)-`, "i") : /^(\d+)-/;
        let seq = 0;
        for (const row of existing ?? []) {
          const m = seqRe.exec(row.invoice_number ?? "");
          if (m) seq = Math.max(seq, Number(m[1]));
        }

        let inserted: any = null;
        let lastErr: any = null;
        for (let attempt = 0; attempt < 25; attempt++) {
          seq += 1;
          const invoice_number = `${docCfg.prefix}${seq}-${slug}`;
          const insertPayload: any = { ...payload, invoice_number, created_by: user?.id };
          if (isTaxInvoice && (importMode || pdfImported)) {
            insertPayload.is_imported = true;
            insertPayload.import_source = "manual";
          }
          const { data: inv, error } = await supabase.from(docTable).insert(insertPayload).select().single();
          if (!error) {
            inserted = inv;
            lastErr = null;
            break;
          }
          lastErr = error;
          if (error.code !== "23505") break;
        }
        if (!inserted) throw lastErr ?? new Error("Could not generate a unique invoice number");
        invId = inserted.id;
        invNumber = inserted.invoice_number;
      }

      const rows = resolvedItems.map((it) => {
        const c = computeItem(it);
        const base = {
          invoice_id: invId,
          sr_no: it.sr_no,
          product_id: it.product_id,
          hsn_code: it.hsn_code || null,
          description: it.description,
          quantity: it.quantity,
          uom: it.uom,
          serial_batch_number: it.serial_batch_number?.trim() || null,
        };
        return isChallan
          ? base
          : {
            ...base,
            unit_rate: it.unit_rate,
            discount_pct: c.discount_pct,
            discount_amount: c.discount_amount,
            tax_pct: it.tax_pct,
            tax_amount: c.tax_amount,
            total_amount: c.total_amount,
          };
      });
      const { error: iErr } = await supabase.from(docItemsTable).insert(rows);
      if (iErr) throw iErr;

      return { id: invId, invoice_number: invNumber };
    },
    onSuccess: async (inv, status) => {
      qc.invalidateQueries({ queryKey: ["customers-list"] });
      qc.invalidateQueries({ queryKey: ["products-list"] });
      if (!isTaxInvoice) {
        // History is a tax-invoice-only feature.
      } else if (isEdit) {
        await logInvoiceEvent(inv.id, "edited", "Invoice edited");
      } else if (importMode || pdfImported) {
        await logInvoiceEvent(inv.id, "imported", `Imported invoice ${inv.invoice_number}`);
      } else {
        await logInvoiceEvent(inv.id, "created", `Created invoice ${inv.invoice_number}`);
      }
      toast.success(`${docCfg.label} ${inv.invoice_number} ${isEdit ? "updated" : importMode ? "imported" : "created"}`);

      if (status === "sent") {
        try {
          const res: any = await sendEmail({ data: { invoiceId: inv.id, kind: documentType } });
          if (res?.sent) {
            toast.success(`Invoice emailed to ${res.email}`);
            if (isTaxInvoice) await logInvoiceEvent(inv.id, "sent", `Invoice emailed to ${res.email}`);
          } else if (res?.reason === "no_email") {
            toast.info("Saved. No customer email on file, so nothing was sent.");
          } else if (res?.reason === "recipient_suppressed") {
            toast.warning("Saved. The customer has unsubscribed from emails.");
          }
        } catch (err: any) {
          toast.error(`Invoice saved, but the email could not be sent: ${err?.message ?? "unknown error"}`);
        }
      }

      nav({ to: "/invoices/$id", params: { id: inv.id }, search: { kind: documentType } });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const runExtract = useServerFn(extractInvoicePdf);
  const [extracting, setExtracting] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pdfImported, setPdfImported] = useState(false);

  const handlePdf = async (file: File) => {
    if (file.type !== "application/pdf") return toast.error("Please choose a PDF file.");
    if (file.size > 15 * 1024 * 1024) return toast.error("PDF is too large (max 15 MB).");
    setPdfName(file.name);
    setPdfImported(false);
    setExtracting(true);
    try {
      const fileData = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("Could not read that file."));
        r.readAsDataURL(file);
      });
      const d = await runExtract({ data: { fileData } });
      if (d.customer_name) {
        const match = customers.find(
          (c: any) =>
            (c.customer_name ?? "").toLowerCase() === d.customer_name.toLowerCase() ||
            (c.company_name ?? "").toLowerCase() === d.customer_name.toLowerCase(),
        );
        setCustomerId(match?.id ?? "");
        setCustomerText(d.customer_name);
      }
      // The imported invoice only names the buyer, so company name mirrors it.
      if (d.customer_name || d.company_name) setCustCompany(d.customer_name || d.company_name);
      if (d.mobile) setCustMobile(d.mobile);
      const footerMobiles = (d.footer_contact_mobiles ?? []).length > 0 ? d.footer_contact_mobiles!.join(" / ") : "";
      if (footerMobiles && !d.mobile) setCustMobile(footerMobiles);

      if (d.email) setCustEmail(d.email);
      if (d.gst_number) setCustGst(d.gst_number);
      if (d.invoice_date) setInvoiceDate(d.invoice_date);
      if (d.work_order_number) setWorkOrder(d.work_order_number);
      if (isTaxInvoice && d.freight) setFreight(d.freight);
      if (isTaxInvoice && d.packing_charges) setPacking(d.packing_charges);
      if (isTaxInvoice && d.other_charges) setOtherCharges(d.other_charges);

      if (d.delivery_mode) setDeliveryMode(d.delivery_mode);
      if (d.payment_terms) setPaymentTerms(d.payment_terms);
      if (d.notes) setNotes(d.notes);
      if (d.items.length) {
        setItems(
          d.items.map((it, i) => ({
            sr_no: i + 1,
            product_id:
              products.find((p: any) => (p.product_name ?? "").toLowerCase() === it.description.toLowerCase())?.id ??
              null,
            hsn_code: it.hsn_code,
            description: it.description,
            quantity: it.quantity,
            uom: it.uom,
            unit_rate: it.unit_rate,
            discount_mode: "pct" as const,
            discount_value: Number(it.discount_pct ?? 0),
            tax_pct: it.tax_pct || 18,
            serial_batch_number: "",
          })),
        );
        setProductTexts(d.items.map((it) => it.description));
      }
      setPdfImported(true);
      toast.success(`Imported ${d.items.length} line item${d.items.length === 1 ? "" : "s"} from the PDF.`);
    } catch (e: any) {
      toast.error(e?.message || "Could not read that PDF.");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <>
      <PageHeader
        title={
          isEdit
            ? `Edit ${docCfg.label}${existing?.invoice?.invoice_number ? ` — ${existing.invoice.invoice_number}` : ""}`
            : importMode
              ? "Import Invoice"
              : `New ${docCfg.label}`
        }
        description={
          importMode
            ? "Record an invoice that was created outside the software. It'll be tagged 'Imported' and behaves like a normal invoice."
            : isEdit
              ? `Update ${docCfg.label.toLowerCase()} details.`
              : isTaxInvoice
                ? "Create a GST tax invoice. Field visibility and mandatory rules follow your Settings."
                : `Create a ${docCfg.label.toLowerCase()}.`
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.history.back()}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button variant="outline" onClick={() => save.mutate("draft")} disabled={save.isPending}>
              Save Draft
            </Button>
            <Button onClick={() => save.mutate("sent")} disabled={save.isPending}>
              {save.isPending ? "Saving…" : isEdit ? "Save Changes" : "Save & Send"}
            </Button>
          </div>
        }
      />

      <DocumentDetails
        isChallan={isChallan}
        isEdit={isEdit}
        isTaxInvoice={isTaxInvoice}
        docLabel={docCfg.label}
        customers={customers}
        settings={settings}
        customerId={customerId}
        customerText={customerText}
        custCompany={custCompany}
        custAddress={custAddress}
        custMobile={custMobile}
        custEmail={custEmail}
        custGst={custGst}
        invoiceDate={invoiceDate}
        movementReason={movementReason}
        challanNumber={challanNumber}
        challanDates={challanDates}
        challanDateInput={challanDateInput}
        workOrder={workOrder}
        extracting={extracting}
        pdfName={pdfName}
        pdfImported={pdfImported}
        setCustomerId={setCustomerId}
        setCustomerText={setCustomerText}
        setCustCompany={setCustCompany}
        setCustAddress={setCustAddress}
        setCustMobile={setCustMobile}
        setCustEmail={setCustEmail}
        setCustGst={setCustGst}
        setInvoiceDate={setInvoiceDate}
        setMovementReason={setMovementReason}
        setChallanNumber={setChallanNumber}
        setChallanDateInput={setChallanDateInput}
        setWorkOrder={setWorkOrder}
        setChallanDates={setChallanDates}
        addChallanDate={addChallanDate}
        handlePdf={handlePdf}
      />

      <ProductLineItems
        items={items}
        productTexts={productTexts}
        products={products}
        isChallan={isChallan}
        setItem={setItem}
        setProductText={setProductText}
        applyProduct={applyProduct}
        removeItem={removeItem}
        addItem={addItem}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {(settings?.show_delivery || isEdit) && (
              <div className="space-y-1.5">
                <Label className="text-xs">Delivery Mode</Label>
                <Input value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value)} />
              </div>
            )}
            {!isChallan && (
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Terms</Label>
                <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
              </div>
            )}
            {isChallan && (
              <>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Transporter Name</Label>
                  <Input value={transporterName} onChange={(e) => setTransporterName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Place of Dispatch</Label>
                  <Input value={placeOfDispatch} onChange={(e) => setPlaceOfDispatch(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Place of Delivery</Label>
                  <Input value={placeOfDelivery} onChange={(e) => setPlaceOfDelivery(e.target.value)} />
                </div>
              </>
            )}
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className={isChallan ? "hidden" : undefined}>
          <CardHeader>
            <CardTitle className="text-base">Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Net Value" value={formatINR(totals.net)} />
            <ChargeRow config={cfg("freight_charges")} fallbackLabel="Freight" value={freight} onChange={setFreight} />
            {isTaxInvoice && <ChargeRow
              config={cfg("transportation_charges")}
              fallbackLabel="Transportation Charges"
              value={transportCharges}
              onChange={setTransportCharges}
            />}
            {isTaxInvoice && <ChargeRow
              config={cfg("delivery_charges")}
              fallbackLabel="Delivery Charges"
              value={deliveryCharges}
              onChange={setDeliveryCharges}
            />}
            <ChargeRow
              config={cfg("packing_charges")}
              fallbackLabel="Packing & Forwarding"
              value={packing}
              onChange={setPacking}
            />
            <ChargeRow
              config={cfg("other_charges")}
              fallbackLabel="Other Charges"
              value={otherCharges}
              onChange={setOtherCharges}
            />
            <div className="border-t pt-2">
              <Row label="Subtotal" value={formatINR(totals.subtotal)} />
              {isIGST ? (
                <Row label="IGST" value={formatINR(totals.tax)} />
              ) : (
                <>
                  <Row label="CGST" value={formatINR(totals.tax / 2)} />
                  <Row label="SGST" value={formatINR(totals.tax / 2)} />
                </>
              )}
              <Row label="Round Off" value={formatINR(totals.round_off)} />
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-base font-bold">
              <span>Grand Total</span>
              <span className="tabular-nums">{formatINR(totals.grand)}</span>
            </div>
            <p className="pt-1 text-xs italic text-muted-foreground">{amountInWords(totals.grand)}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
