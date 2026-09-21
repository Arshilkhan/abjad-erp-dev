import { useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { extractInvoicePdf } from "@/lib/invoice-pdf.functions";
import { sendInvoiceEmail } from "@/lib/invoice-email.functions";import { useNavigate, useRouter } from "@tanstack/react-router";
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
import { Plus, Trash2, ArrowLeft, X, Upload, Loader2 } from "lucide-react";
import { formatINR, amountInWords } from "@/lib/format";
import { logInvoiceEvent } from "@/lib/invoice-history";
import { TypeaheadInput } from "@/components/typeahead-input";
import { useInvoiceConfig } from "@/lib/invoice-config";

interface LineItem {
  sr_no: number;
  product_id: string | null;
  hsn_code: string;
  description: string;
  quantity: number;
  uom: string;
  unit_rate: number;
  discount_mode: "pct" | "flat";
  discount_value: number;
  tax_pct: number;
  serial_batch_number: string;
}

export const MOVEMENT_REASONS = [
  "Delivery / Supply",
  "Job Work",
  "Repair",
  "Returnable Goods",
  "Sample / Demo",
  "Stock Transfer",
  "Other",
];

function emptyItem(sr: number): LineItem {
  return {
    sr_no: sr,
    product_id: null,
    hsn_code: "",
    description: "",
    quantity: 1,
    uom: "NOS",
    unit_rate: 0,
    discount_mode: "pct",
    discount_value: 0,
    tax_pct: 18,
    serial_batch_number: "",
  };
}

function computeItem(it: LineItem) {
  const gross = it.quantity * it.unit_rate;
  const raw = Number(it.discount_value || 0);
  const discount_amount = it.discount_mode === "flat" ? Math.min(Math.max(raw, 0), gross) : (gross * raw) / 100;
  const discount_pct = gross > 0 ? (discount_amount / gross) * 100 : 0;
  const net = gross - discount_amount;
  const tax_amount = (net * it.tax_pct) / 100;
  const total_amount = net + tax_amount;
  return { discount_amount, discount_pct, tax_amount, total_amount, net };
}

export function InvoiceForm({ editId, importMode }: { editId?: string; importMode?: boolean }) {
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
  const [invoiceType, setInvoiceType] = useState<string>("tax_invoice");
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
    queryKey: ["invoice-edit", editId],
    enabled: isEdit,
    queryFn: async () => {
      const [inv, its, cits] = await Promise.all([
        supabase.from("invoices").select("*").eq("id", editId!).single(),
        supabase.from("invoice_items").select("*").eq("invoice_id", editId!).order("sr_no"),
        (supabase.from("challan_items") as any).select("*").eq("challan_id", editId!).order("sr_no"),
      ]);
      if (inv.error) throw inv.error;
      const itemRows = inv.data?.invoice_type === "delivery_challan" ? (cits.data ?? []) : (its.data ?? []);
      return { invoice: inv.data, items: itemRows };
    },
  });

  useEffect(() => {
    if (!existing || hydrated) return;
    const inv = existing.invoice;
    setCustomerId(inv.customer_id ?? "");
    setCustomerText(inv.customer_name_snapshot ?? "");
    setInvoiceType(inv.invoice_type);
    setInvoiceDate(inv.invoice_date);
    setChallanNumber(inv.challan_number ?? "");
    setChallanDates(((inv as any).challan_dates as string[] | null) ?? (inv.challan_date ? [inv.challan_date] : []));

    setWorkOrder(inv.work_order_number ?? "");
    setFreight(Number(inv.freight ?? 0));
    setPacking(Number(inv.packing_charges ?? 0));
    setOtherCharges(Number(inv.other_charges ?? 0));
    setTransportCharges(Number((inv as any).transportation_charges ?? 0));
    setDeliveryCharges(Number((inv as any).delivery_charges ?? 0));
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
            unit_rate: Number(it.unit_rate ?? 0),
            ...(() => {
              const gross = Number(it.quantity ?? 1) * Number(it.unit_rate ?? 0);
              const discountAmount = Number(it.discount_amount ?? 0);
              const discountPct = Number(it.discount_pct ?? 0);
              const expectedAmount = (gross * discountPct) / 100;
              const isFlat = discountAmount > 0 && Math.abs(discountAmount - expectedAmount) > 0.01;
              return {
                discount_mode: isFlat ? "flat" as const : "pct" as const,
                discount_value: isFlat ? discountAmount : discountPct,
              };
            })(),
            tax_pct: Number(it.tax_pct ?? 18),
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
    setProductTexts((prev) => prev.map((t, i) => (i === idx ? p.product_name : t)));
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
      requireCharge("freight_charges", freight);
      requireCharge("packing_charges", packing);
      requireCharge("other_charges", otherCharges);
      requireCharge("transportation_charges", transportCharges);
      requireCharge("delivery_charges", deliveryCharges);
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
        po_number: null,
        po_date: null,
        challan_number: isChallan ? challanNumber || null : null,
        challan_date: isChallan ? challanDates[0] || invoiceDate : null,
        challan_dates: isChallan ? (challanDates.length ? challanDates : [invoiceDate]) : [],
        movement_reason: isChallan ? movementReason || null : null,
        transporter_name: isChallan ? transporterName.trim() || null : null,
        place_of_dispatch: isChallan ? placeOfDispatch.trim() || null : null,
        place_of_delivery: isChallan ? placeOfDelivery.trim() || null : null,

        work_order_number: workOrder || null,
        place_of_supply: cust.state ?? null,
        is_igst: isIGST,
        net_value: totals.net,
        discount_amount: totals.disc,
        freight: Number(freight || 0),
        packing_charges: Number(packing || 0),
        other_charges: Number(otherCharges || 0),
        transportation_charges: Number(transportCharges || 0),
        delivery_charges: Number(deliveryCharges || 0),
        subtotal: totals.subtotal,
        sgst_amount,
        cgst_amount,
        igst_amount,
        round_off: totals.round_off,
        grand_total: totals.grand,
        amount_in_words: amountInWords(totals.grand),
        delivery_mode: deliveryMode || null,
        payment_terms: paymentTerms || null,
        contact_person: nameTyped || null,
        contact_mobile: custMobile || null,
        notes: notes || null,
        status,
      };

      let invId: string;
      let invNumber: string;
      if (isEdit) {
        const { data: inv, error } = await supabase
          .from("invoices")
          .update(payload)
          .eq("id", editId!)
          .select()
          .single();
        if (error) throw error;
        invId = inv.id;
        invNumber = inv.invoice_number;
        const { error: dErr } = isChallan
          ? await (supabase.from("challan_items") as any).delete().eq("challan_id", invId)
          : await supabase.from("invoice_items").delete().eq("invoice_id", invId);
        if (dErr) throw dErr;
      } else {
        // Invoice number format: <sequence>-<company-name-slug>, e.g. 1-fluid-tech
        const slug =
          (custCompany || cust.company_name || cust.customer_name || customerText || "customer")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "customer";

        const { data: existing } = await supabase.from("invoices").select("invoice_number, invoice_type");
        const typePrefix = isChallan
          ? "dc"
          : invoiceType === "quotation"
            ? "qtn"
            : invoiceType === "proforma"
              ? "pro"
              : invoiceType === "purchase_order"
                ? "po"
                : "inv";
        const seqRe = isChallan ? /^dc-(\d+)-/i : new RegExp(`^(?:${typePrefix}-)?(\\d+)-`, "i");
        let seq = 0;
        for (const row of existing ?? []) {
          if (row.invoice_type !== invoiceType) continue;
          const m = seqRe.exec(row.invoice_number ?? "");
          if (m) seq = Math.max(seq, Number(m[1]));
        }

        let inserted: any = null;
        let lastErr: any = null;
        for (let attempt = 0; attempt < 25; attempt++) {
          seq += 1;
          const invoice_number = `${typePrefix}-${seq}-${slug}`;
          const insertPayload: any = { ...payload, invoice_number, created_by: user?.id };
          if (importMode || pdfImported) {
            insertPayload.is_imported = true;
            insertPayload.import_source = "manual";
          }
          const { data: inv, error } = await supabase.from("invoices").insert(insertPayload).select().single();
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

      if (isChallan) {
        // Keep the challan parent in sync so challan_items can use its dedicated foreign key.
        const { error: parentError } = await (supabase.from("challans") as any).upsert({ id: invId }, { onConflict: "id" });
        if (parentError) throw parentError;
        const rows = resolvedItems.map((it) => ({
          challan_id: invId,
          product: it.description || null,
          hsn: it.hsn_code || null,
          description: it.description || null,
          quantity: Number(it.quantity) || 0,
          uom: it.uom || null,
          serial_batch_number: it.serial_batch_number?.trim() || null,
        }));
        const { error: iErr } = await (supabase.from("challan_items") as any).insert(rows);
        if (iErr) throw iErr;
      } else {
        const rows = resolvedItems.map((it) => {
          const c = computeItem(it);
          return {
            invoice_id: invId,
            sr_no: it.sr_no,
            product_id: it.product_id,
            hsn_code: it.hsn_code || null,
            description: it.description,
            quantity: it.quantity,
            uom: it.uom,
            serial_batch_number: it.serial_batch_number?.trim() || null,
            unit_rate: it.unit_rate,
            discount_pct: c.discount_pct,
            discount_amount: c.discount_amount,
            tax_pct: it.tax_pct,
            tax_amount: c.tax_amount,
            total_amount: c.total_amount,
          };
        });
        const { error: iErr } = await supabase.from("invoice_items").insert(rows);
        if (iErr) throw iErr;
      }

      return { id: invId, invoice_number: invNumber };
    },
    onSuccess: async (inv, status) => {
      qc.invalidateQueries({ queryKey: ["customers-list"] });
      qc.invalidateQueries({ queryKey: ["products-list"] });
      if (isEdit) {
        await logInvoiceEvent(inv.id, "edited", "Invoice edited");
       } else if (importMode || pdfImported) {
        await logInvoiceEvent(inv.id, "imported", `Imported invoice ${inv.invoice_number}`);
      } else {
        await logInvoiceEvent(inv.id, "created", `Created invoice ${inv.invoice_number}`);
      }
      toast.success(`Invoice ${inv.invoice_number} ${isEdit ? "updated" : importMode ? "imported" : "created"}`);

      if (status === "sent") {
        try {
          const res: any = await sendEmail({ data: { invoiceId: inv.id } });
          if (res?.sent) {
            toast.success(`Invoice emailed to ${res.email}`);
            await logInvoiceEvent(inv.id, "sent", `Invoice emailed to ${res.email}`);
          } else if (res?.reason === "no_email") {
            toast.info("Saved. No customer email on file, so nothing was sent.");
          } else if (res?.reason === "recipient_suppressed") {
            toast.warning("Saved. The customer has unsubscribed from emails.");
          }
        } catch (err: any) {
          toast.error(`Invoice saved, but the email could not be sent: ${err?.message ?? "unknown error"}`);
        }
      }

      nav({ to: "/invoices/$id", params: { id: inv.id } });
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
      if (d.challan_number) setChallanNumber(d.challan_number);
      if (d.challan_date) setChallanDates([d.challan_date]);

      if (d.work_order_number) setWorkOrder(d.work_order_number);
      if (d.freight) setFreight(d.freight);
      if (d.packing_charges) setPacking(d.packing_charges);
      if (d.other_charges) setOtherCharges(d.other_charges);
      
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
            discount_mode: "pct",
            discount_value: it.discount_pct,
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
            ? `Edit Invoice${existing?.invoice?.invoice_number ? ` — ${existing.invoice.invoice_number}` : ""}`
            : importMode
              ? "Import Invoice"
              : "New Invoice"
        }
        description={
          importMode
            ? "Record an invoice that was created outside the software. It'll be tagged 'Imported' and behaves like a normal invoice."
            : isEdit
              ? "Update customer, line items, taxes, charges, delivery and payment details."
              : "Create a GST tax invoice. Field visibility and mandatory rules follow your Settings."
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

       <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
           <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base">{isChallan ? "Delivery Challan Details" : "Invoice Details"}</CardTitle>
             {!isEdit && (
               <>
                 <input
                   id="invoice-pdf"
                   type="file"
                   accept="application/pdf"
                   className="hidden"
                   disabled={extracting}
                   onChange={(e) => {
                     const f = e.target.files?.[0];
                     e.target.value = "";
                     if (f) void handlePdf(f);
                   }}
                 />
                 <Button type="button" variant="outline" size="sm" disabled={extracting} asChild={!extracting}>
                   {extracting ? (
                     <span className="flex items-center">
                       <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Importing…
                     </span>
                   ) : (
                     <label htmlFor="invoice-pdf" className="cursor-pointer">
                       <Upload className="mr-1 h-4 w-4" /> Import Invoice
                     </label>
                   )}
                 </Button>
               </>
             )}
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
             {!isEdit && pdfName && (
              <div className="col-span-2 space-y-1.5 md:col-span-4">
                <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-3">
                  <span className="text-xs text-muted-foreground">
                     {extracting
                       ? `Reading ${pdfName}…`
                       : pdfImported
                         ? `${pdfName} imported. Review the details below before saving.`
                         : `Could not import ${pdfName}. Choose another PDF to try again.`}
                  </span>
                </div>
              </div>
            )}
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Customer Name</Label>
              <TypeaheadInput
                value={customerText}
                onChange={(v) => {
                  setCustomerText(v);
                  if (customerId) setCustomerId("");
                }}
                options={customers.map((c: any) => ({
                  id: c.id,
                  label: c.customer_name || c.company_name,
                  sublabel: [c.company_name, c.gst_number].filter(Boolean).join(" • "),
                }))}
                onSelect={(opt) => {
                  setCustomerId(opt.id);
                  setCustomerText(opt.label);
                }}
                placeholder="Type a customer name — new names are saved automatically"
              />
              {!customerId && customerText.trim() && (
                <p className="text-xs text-muted-foreground">New customer — will be added to your directory on save.</p>
              )}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Company Name *</Label>
              <Input value={custCompany} onChange={(e) => setCustCompany(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Textarea rows={2} value={custAddress} onChange={(e) => setCustAddress(e.target.value)} placeholder="Customer billing address" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mobile</Label>
              <Input value={custMobile} onChange={(e) => setCustMobile(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">GST Number{settings?.mandatory_gst_number && " *"}</Label>
              <Input className="font-mono" value={custGst} onChange={(e) => setCustGst(e.target.value.toUpperCase())} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax_invoice">Tax Invoice</SelectItem>
                  <SelectItem value="proforma">Proforma</SelectItem>
                  <SelectItem value="quotation">Quotation</SelectItem>
                  <SelectItem value="delivery_challan">Delivery Challan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{isChallan ? "Delivery Challan Date" : "Date"}</Label>
              <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
            </div>
            {isChallan && (
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Reason for Movement</Label>
                <Select value={movementReason} onValueChange={setMovementReason}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOVEMENT_REASONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isChallan && (
              <>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">
                    Challan Numbers (comma separated)
                    {settings?.mandatory_challan_number && " *"}
                  </Label>
                  <Input
                    value={challanNumber}
                    placeholder="DC-001, DC-002, DC-003"
                    onChange={(e) => setChallanNumber(e.target.value)}
                  />
                  {challanNumber.trim() && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {challanNumber
                        .split(",")
                        .map((n) => n.trim())
                        .filter(Boolean)
                        .map((n, i) => (
                          <span key={`${n}-${i}`} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                            {n}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Challan Dates</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={challanDateInput}
                      onChange={(e) => setChallanDateInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addChallanDate();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={addChallanDate}>
                      Add
                    </Button>
                  </div>
                  {challanDates.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {challanDates.map((d) => (
                        <span key={d} className="flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs">
                          {d}
                          <button
                            type="button"
                            aria-label={`Remove ${d}`}
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => setChallanDates((prev) => prev.filter((x) => x !== d))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {(settings?.show_work_order || isEdit) && (
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Work Order Number</Label>
                <Input value={workOrder} onChange={(e) => setWorkOrder(e.target.value)} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {customer ? (
              <>
                <div className="font-medium">{customer.company_name || customer.customer_name}</div>
                <div className="text-xs text-muted-foreground whitespace-pre-line">{customer.billing_address}</div>
                <div className="pt-2 text-xs">
                  <span className="text-muted-foreground">GST:</span>{" "}
                  <span className="font-mono">{customer.gst_number ?? "—"}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">State:</span> {customer.state} ({customer.state_code})
                </div>
                <div className="mt-2 rounded bg-secondary px-2 py-1 text-xs font-medium">
                  {isIGST ? "Inter-state → IGST" : "Intra-state → SGST + CGST"}
                </div>
              </>
            ) : customerText.trim() ? (
              <>
                <div className="font-medium">{custCompany || customerText}</div>
                <div className="text-xs text-muted-foreground">New customer — saved when you save this invoice.</div>
                <div className="pt-2 text-xs">
                  <span className="text-muted-foreground">GST:</span>{" "}
                  <span className="font-mono">{custGst || "—"}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Mobile:</span> {custMobile || "—"}
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Email:</span> {custEmail || "—"}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-xs">Type a customer name to begin.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{isChallan ? "Goods Being Moved" : "Line Items"}</CardTitle>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="mr-1 h-4 w-4" /> Add Row
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-2 text-left w-10">#</th>
                  <th className="p-2 text-left w-48">Product</th>
                  <th className="p-2 text-left w-24">HSN</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-right w-20">Qty</th>
                  <th className="p-2 text-left w-16">UOM</th>
                  {isChallan ? (
                    <th className="p-2 text-left w-40">Serial / Batch No.</th>
                  ) : (
                    <>
                      <th className="p-2 text-right w-24">Rate</th>
                      <th className="p-2 text-right w-28">Discount</th>
                      <th className="p-2 text-right w-16">Tax%</th>
                      <th className="p-2 text-right w-28">Total</th>
                    </>
                  )}
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const c = computeItem(it);
                  return (
                    <tr key={idx} className="border-t">
                      <td className="p-1 text-center text-muted-foreground">{it.sr_no}</td>
                      <td className="p-1">
                        <TypeaheadInput
                          value={productTexts[idx] ?? ""}
                          onChange={(v) => {
                            setProductTexts((prev) => prev.map((t, i) => (i === idx ? v : t)));
                            if (it.product_id) setItem(idx, { product_id: null });
                          }}
                          options={products.map((p: any) => ({
                            id: p.id,
                            label: p.product_name,
                            sublabel: `${p.product_code ?? ""}${p.hsn_code ? ` • HSN ${p.hsn_code}` : ""}`,
                          }))}
                          onSelect={(opt) => applyProduct(idx, opt.id)}
                          placeholder="Type product…"
                          inputClassName="h-8"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          className="h-8 font-mono text-xs"
                          value={it.hsn_code}
                          onChange={(e) => setItem(idx, { hsn_code: e.target.value })}
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          className="h-8"
                          value={it.description}
                          onChange={(e) => setItem(idx, { description: e.target.value })}
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          className="h-8 text-right tabular-nums"
                          type="number"
                          value={it.quantity}
                          onChange={(e) => setItem(idx, { quantity: Number(e.target.value) })}
                        />
                      </td>
                      <td className="p-1">
                        <Input className="h-8" value={it.uom} onChange={(e) => setItem(idx, { uom: e.target.value })} />
                      </td>
                      {isChallan ? (
                        <td className="p-1">
                          <Input
                            className="h-8"
                            value={it.serial_batch_number}
                            onChange={(e) => setItem(idx, { serial_batch_number: e.target.value })}
                            placeholder="Serial / Batch"
                          />
                        </td>
                      ) : (
                        <>
                          <td className="p-1">
                            <Input
                              className="h-8 text-right tabular-nums"
                              type="number"
                              value={it.unit_rate}
                              onChange={(e) => setItem(idx, { unit_rate: Number(e.target.value) })}
                            />
                          </td>
                          <td className="p-1">
                            <div className="flex items-center gap-1">
                              <Select
                                value={it.discount_mode}
                                onValueChange={(value: "pct" | "flat") => setItem(idx, { discount_mode: value })}
                              >
                                <SelectTrigger className="h-8 w-14 px-2 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pct">%</SelectItem>
                                  <SelectItem value="flat">₹</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                className="h-8 min-w-0 text-right tabular-nums"
                                type="number"
                                min="0"
                                value={it.discount_value}
                                onChange={(e) => setItem(idx, { discount_value: Number(e.target.value) })}
                              />
                            </div>
                          </td>
                          <td className="p-1">
                            <Input
                              className="h-8 text-right tabular-nums"
                              type="number"
                              value={it.tax_pct}
                              onChange={(e) => setItem(idx, { tax_pct: Number(e.target.value) })}
                            />
                          </td>
                          <td className="p-2 text-right tabular-nums font-medium">{formatINR(c.total_amount)}</td>
                        </>
                      )}
                      <td className="p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(idx)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
            <ChargeRow
              config={cfg("transportation_charges")}
              fallbackLabel="Transportation Charges"
              value={transportCharges}
              onChange={setTransportCharges}
            />
            <ChargeRow
              config={cfg("delivery_charges")}
              fallbackLabel="Delivery Charges"
              value={deliveryCharges}
              onChange={setDeliveryCharges}
            />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}

function ChargeRow({
  config,
  fallbackLabel,
  value,
  onChange,
}: {
  config: { visible: boolean; mandatory: boolean; readOnly: boolean; label: string };
  fallbackLabel: string;
  value: number;
  onChange: (v: number) => void;
}) {
  if (!config.visible) return null;
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs text-muted-foreground">
        {config.label || fallbackLabel}
        {config.mandatory && " *"}
      </Label>
      <Input
        className="h-8 w-32 text-right"
        type="number"
        value={value}
        readOnly={config.readOnly}
        disabled={config.readOnly}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

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
import { Plus, Trash2, ArrowLeft, X, Upload, Loader2 } from "lucide-react";
import { formatINR, amountInWords } from "@/lib/format";
import { logInvoiceEvent } from "@/lib/invoice-history";
import { TypeaheadInput } from "@/components/typeahead-input";
import { useInvoiceConfig } from "@/lib/invoice-config";

interface LineItem {
  sr_no: number;
  product_id: string | null;
  hsn_code: string;
  description: string;
  quantity: number;
  uom: string;
  unit_rate: number;
  discount_mode: "pct" | "flat";
  discount_value: number;
  tax_pct: number;
  serial_batch_number: string;
}

export const MOVEMENT_REASONS = [
  "Delivery / Supply",
  "Job Work",
  "Repair",
  "Returnable Goods",
  "Sample / Demo",
  "Stock Transfer",
  "Other",
];

function emptyItem(sr: number): LineItem {
  return {
    sr_no: sr,
    product_id: null,
    hsn_code: "",
    description: "",
    quantity: 1,
    uom: "NOS",
    unit_rate: 0,
    discount_mode: "pct",
    discount_value: 0,
    tax_pct: 18,
    serial_batch_number: "",
  };
}

function computeItem(it: LineItem) {
  const gross = it.quantity * it.unit_rate;
  const raw = Number(it.discount_value || 0);
  const discount_amount = it.discount_mode === "flat" ? Math.min(Math.max(raw, 0), gross) : (gross * raw) / 100;
  const discount_pct = gross > 0 ? (discount_amount / gross) * 100 : 0;
  const net = gross - discount_amount;
  const tax_amount = (net * it.tax_pct) / 100;
  const total_amount = net + tax_amount;
  return { discount_amount, discount_pct, tax_amount, total_amount, net };
}

export function InvoiceForm({ editId, importMode }: { editId?: string; importMode?: boolean }) {
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
  const [invoiceType, setInvoiceType] = useState<string>("tax_invoice");
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
    queryKey: ["invoice-edit", editId],
    enabled: isEdit,
    queryFn: async () => {
      const [inv, its, cits] = await Promise.all([
        supabase.from("invoices").select("*").eq("id", editId!).single(),
        supabase.from("invoice_items").select("*").eq("invoice_id", editId!).order("sr_no"),
        (supabase.from("challan_items") as any).select("*").eq("challan_id", editId!).order("sr_no"),
      ]);
      if (inv.error) throw inv.error;
      const itemRows = inv.data?.invoice_type === "delivery_challan" ? (cits.data ?? []) : (its.data ?? []);
      return { invoice: inv.data, items: itemRows };
    },
  });

  useEffect(() => {
    if (!existing || hydrated) return;
    const inv = existing.invoice;
    setCustomerId(inv.customer_id ?? "");
    setCustomerText(inv.customer_name_snapshot ?? "");
    setInvoiceType(inv.invoice_type);
    setInvoiceDate(inv.invoice_date);
    setChallanNumber(inv.challan_number ?? "");
    setChallanDates(((inv as any).challan_dates as string[] | null) ?? (inv.challan_date ? [inv.challan_date] : []));

    setWorkOrder(inv.work_order_number ?? "");
    setFreight(Number(inv.freight ?? 0));
    setPacking(Number(inv.packing_charges ?? 0));
    setOtherCharges(Number(inv.other_charges ?? 0));
    setTransportCharges(Number((inv as any).transportation_charges ?? 0));
    setDeliveryCharges(Number((inv as any).delivery_charges ?? 0));
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
            unit_rate: Number(it.unit_rate ?? 0),
            ...(() => {
              const gross = Number(it.quantity ?? 1) * Number(it.unit_rate ?? 0);
              const discountAmount = Number(it.discount_amount ?? 0);
              const discountPct = Number(it.discount_pct ?? 0);
              const expectedAmount = (gross * discountPct) / 100;
              const isFlat = discountAmount > 0 && Math.abs(discountAmount - expectedAmount) > 0.01;
              return {
                discount_mode: isFlat ? "flat" as const : "pct" as const,
                discount_value: isFlat ? discountAmount : discountPct,
              };
            })(),
            tax_pct: Number(it.tax_pct ?? 18),
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
    setProductTexts((prev) => prev.map((t, i) => (i === idx ? p.product_name : t)));
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
      requireCharge("freight_charges", freight);
      requireCharge("packing_charges", packing);
      requireCharge("other_charges", otherCharges);
      requireCharge("transportation_charges", transportCharges);
      requireCharge("delivery_charges", deliveryCharges);
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
        po_number: null,
        po_date: null,
        challan_number: isChallan ? challanNumber || null : null,
        challan_date: isChallan ? challanDates[0] || invoiceDate : null,
        challan_dates: isChallan ? (challanDates.length ? challanDates : [invoiceDate]) : [],
        movement_reason: isChallan ? movementReason || null : null,
        transporter_name: isChallan ? transporterName.trim() || null : null,
        place_of_dispatch: isChallan ? placeOfDispatch.trim() || null : null,
        place_of_delivery: isChallan ? placeOfDelivery.trim() || null : null,

        work_order_number: workOrder || null,
        place_of_supply: cust.state ?? null,
        is_igst: isIGST,
        net_value: totals.net,
        discount_amount: totals.disc,
        freight: Number(freight || 0),
        packing_charges: Number(packing || 0),
        other_charges: Number(otherCharges || 0),
        transportation_charges: Number(transportCharges || 0),
        delivery_charges: Number(deliveryCharges || 0),
        subtotal: totals.subtotal,
        sgst_amount,
        cgst_amount,
        igst_amount,
        round_off: totals.round_off,
        grand_total: totals.grand,
        amount_in_words: amountInWords(totals.grand),
        delivery_mode: deliveryMode || null,
        payment_terms: paymentTerms || null,
        contact_person: nameTyped || null,
        contact_mobile: custMobile || null,
        notes: notes || null,
        status,
      };

      let invId: string;
      let invNumber: string;
      if (isEdit) {
        const { data: inv, error } = await supabase
          .from("invoices")
          .update(payload)
          .eq("id", editId!)
          .select()
          .single();
        if (error) throw error;
        invId = inv.id;
        invNumber = inv.invoice_number;
        const { error: dErr } = isChallan
          ? await (supabase.from("challan_items") as any).delete().eq("challan_id", invId)
          : await supabase.from("invoice_items").delete().eq("invoice_id", invId);
        if (dErr) throw dErr;
      } else {
        // Invoice number format: <sequence>-<company-name-slug>, e.g. 1-fluid-tech
        const slug =
          (custCompany || cust.company_name || cust.customer_name || customerText || "customer")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "customer";

        const { data: existing } = await supabase.from("invoices").select("invoice_number, invoice_type");
        const typePrefix = isChallan
          ? "dc"
          : invoiceType === "quotation"
            ? "qtn"
            : invoiceType === "proforma"
              ? "pro"
              : invoiceType === "purchase_order"
                ? "po"
                : "inv";
        const seqRe = isChallan ? /^dc-(\d+)-/i : new RegExp(`^(?:${typePrefix}-)?(\\d+)-`, "i");
        let seq = 0;
        for (const row of existing ?? []) {
          if (row.invoice_type !== invoiceType) continue;
          const m = seqRe.exec(row.invoice_number ?? "");
          if (m) seq = Math.max(seq, Number(m[1]));
        }

        let inserted: any = null;
        let lastErr: any = null;
        for (let attempt = 0; attempt < 25; attempt++) {
          seq += 1;
          const invoice_number = `${typePrefix}-${seq}-${slug}`;
          const insertPayload: any = { ...payload, invoice_number, created_by: user?.id };
          if (importMode || pdfImported) {
            insertPayload.is_imported = true;
            insertPayload.import_source = "manual";
          }
          const { data: inv, error } = await supabase.from("invoices").insert(insertPayload).select().single();
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

      if (isChallan) {
        // Keep the challan parent in sync so challan_items can use its dedicated foreign key.
        const { error: parentError } = await (supabase.from("challans") as any).upsert({ id: invId }, { onConflict: "id" });
        if (parentError) throw parentError;
        const rows = resolvedItems.map((it) => ({
          challan_id: invId,
          product: it.description || null,
          hsn: it.hsn_code || null,
          description: it.description || null,
          quantity: Number(it.quantity) || 0,
          uom: it.uom || null,
          serial_batch_number: it.serial_batch_number?.trim() || null,
        }));
        const { error: iErr } = await (supabase.from("challan_items") as any).insert(rows);
        if (iErr) throw iErr;
      } else {
        const rows = resolvedItems.map((it) => {
          const c = computeItem(it);
          return {
            invoice_id: invId,
            sr_no: it.sr_no,
            product_id: it.product_id,
            hsn_code: it.hsn_code || null,
            description: it.description,
            quantity: it.quantity,
            uom: it.uom,
            serial_batch_number: it.serial_batch_number?.trim() || null,
            unit_rate: it.unit_rate,
            discount_pct: c.discount_pct,
            discount_amount: c.discount_amount,
            tax_pct: it.tax_pct,
            tax_amount: c.tax_amount,
            total_amount: c.total_amount,
          };
        });
        const { error: iErr } = await supabase.from("invoice_items").insert(rows);
        if (iErr) throw iErr;
      }

      return { id: invId, invoice_number: invNumber };
    },
    onSuccess: async (inv, status) => {
      qc.invalidateQueries({ queryKey: ["customers-list"] });
      qc.invalidateQueries({ queryKey: ["products-list"] });
      if (isEdit) {
        await logInvoiceEvent(inv.id, "edited", "Invoice edited");
       } else if (importMode || pdfImported) {
        await logInvoiceEvent(inv.id, "imported", `Imported invoice ${inv.invoice_number}`);
      } else {
        await logInvoiceEvent(inv.id, "created", `Created invoice ${inv.invoice_number}`);
      }
      toast.success(`Invoice ${inv.invoice_number} ${isEdit ? "updated" : importMode ? "imported" : "created"}`);

      if (status === "sent") {
        try {
          const res: any = await sendEmail({ data: { invoiceId: inv.id } });
          if (res?.sent) {
            toast.success(`Invoice emailed to ${res.email}`);
            await logInvoiceEvent(inv.id, "sent", `Invoice emailed to ${res.email}`);
          } else if (res?.reason === "no_email") {
            toast.info("Saved. No customer email on file, so nothing was sent.");
          } else if (res?.reason === "recipient_suppressed") {
            toast.warning("Saved. The customer has unsubscribed from emails.");
          }
        } catch (err: any) {
          toast.error(`Invoice saved, but the email could not be sent: ${err?.message ?? "unknown error"}`);
        }
      }

      nav({ to: "/invoices/$id", params: { id: inv.id } });
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
      if (d.challan_number) setChallanNumber(d.challan_number);
      if (d.challan_date) setChallanDates([d.challan_date]);

      if (d.work_order_number) setWorkOrder(d.work_order_number);
      if (d.freight) setFreight(d.freight);
      if (d.packing_charges) setPacking(d.packing_charges);
      if (d.other_charges) setOtherCharges(d.other_charges);
      
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
            discount_mode: "pct",
            discount_value: it.discount_pct,
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
            ? `Edit Invoice${existing?.invoice?.invoice_number ? ` — ${existing.invoice.invoice_number}` : ""}`
            : importMode
              ? "Import Invoice"
              : "New Invoice"
        }
        description={
          importMode
            ? "Record an invoice that was created outside the software. It'll be tagged 'Imported' and behaves like a normal invoice."
            : isEdit
              ? "Update customer, line items, taxes, charges, delivery and payment details."
              : "Create a GST tax invoice. Field visibility and mandatory rules follow your Settings."
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

       <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
           <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base">{isChallan ? "Delivery Challan Details" : "Invoice Details"}</CardTitle>
             {!isEdit && (
               <>
                 <input
                   id="invoice-pdf"
                   type="file"
                   accept="application/pdf"
                   className="hidden"
                   disabled={extracting}
                   onChange={(e) => {
                     const f = e.target.files?.[0];
                     e.target.value = "";
                     if (f) void handlePdf(f);
                   }}
                 />
                 <Button type="button" variant="outline" size="sm" disabled={extracting} asChild={!extracting}>
                   {extracting ? (
                     <span className="flex items-center">
                       <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Importing…
                     </span>
                   ) : (
                     <label htmlFor="invoice-pdf" className="cursor-pointer">
                       <Upload className="mr-1 h-4 w-4" /> Import Invoice
                     </label>
                   )}
                 </Button>
               </>
             )}
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
             {!isEdit && pdfName && (
              <div className="col-span-2 space-y-1.5 md:col-span-4">
                <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-3">
                  <span className="text-xs text-muted-foreground">
                     {extracting
                       ? `Reading ${pdfName}…`
                       : pdfImported
                         ? `${pdfName} imported. Review the details below before saving.`
                         : `Could not import ${pdfName}. Choose another PDF to try again.`}
                  </span>
                </div>
              </div>
            )}
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Customer Name</Label>
              <TypeaheadInput
                value={customerText}
                onChange={(v) => {
                  setCustomerText(v);
                  if (customerId) setCustomerId("");
                }}
                options={customers.map((c: any) => ({
                  id: c.id,
                  label: c.customer_name || c.company_name,
                  sublabel: [c.company_name, c.gst_number].filter(Boolean).join(" • "),
                }))}
                onSelect={(opt) => {
                  setCustomerId(opt.id);
                  setCustomerText(opt.label);
                }}
                placeholder="Type a customer name — new names are saved automatically"
              />
              {!customerId && customerText.trim() && (
                <p className="text-xs text-muted-foreground">New customer — will be added to your directory on save.</p>
              )}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Company Name *</Label>
              <Input value={custCompany} onChange={(e) => setCustCompany(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Textarea rows={2} value={custAddress} onChange={(e) => setCustAddress(e.target.value)} placeholder="Customer billing address" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mobile</Label>
              <Input value={custMobile} onChange={(e) => setCustMobile(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">GST Number{settings?.mandatory_gst_number && " *"}</Label>
              <Input className="font-mono" value={custGst} onChange={(e) => setCustGst(e.target.value.toUpperCase())} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax_invoice">Tax Invoice</SelectItem>
                  <SelectItem value="proforma">Proforma</SelectItem>
                  <SelectItem value="quotation">Quotation</SelectItem>
                  <SelectItem value="delivery_challan">Delivery Challan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{isChallan ? "Delivery Challan Date" : "Date"}</Label>
              <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
            </div>
            {isChallan && (
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Reason for Movement</Label>
                <Select value={movementReason} onValueChange={setMovementReason}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOVEMENT_REASONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isChallan && (
              <>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">
                    Challan Numbers (comma separated)
                    {settings?.mandatory_challan_number && " *"}
                  </Label>
                  <Input
                    value={challanNumber}
                    placeholder="DC-001, DC-002, DC-003"
                    onChange={(e) => setChallanNumber(e.target.value)}
                  />
                  {challanNumber.trim() && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {challanNumber
                        .split(",")
                        .map((n) => n.trim())
                        .filter(Boolean)
                        .map((n, i) => (
                          <span key={`${n}-${i}`} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                            {n}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Challan Dates</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={challanDateInput}
                      onChange={(e) => setChallanDateInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addChallanDate();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={addChallanDate}>
                      Add
                    </Button>
                  </div>
                  {challanDates.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {challanDates.map((d) => (
                        <span key={d} className="flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs">
                          {d}
                          <button
                            type="button"
                            aria-label={`Remove ${d}`}
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => setChallanDates((prev) => prev.filter((x) => x !== d))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {(settings?.show_work_order || isEdit) && (
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Work Order Number</Label>
                <Input value={workOrder} onChange={(e) => setWorkOrder(e.target.value)} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {customer ? (
              <>
                <div className="font-medium">{customer.company_name || customer.customer_name}</div>
                <div className="text-xs text-muted-foreground whitespace-pre-line">{customer.billing_address}</div>
                <div className="pt-2 text-xs">
                  <span className="text-muted-foreground">GST:</span>{" "}
                  <span className="font-mono">{customer.gst_number ?? "—"}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">State:</span> {customer.state} ({customer.state_code})
                </div>
                <div className="mt-2 rounded bg-secondary px-2 py-1 text-xs font-medium">
                  {isIGST ? "Inter-state → IGST" : "Intra-state → SGST + CGST"}
                </div>
              </>
            ) : customerText.trim() ? (
              <>
                <div className="font-medium">{custCompany || customerText}</div>
                <div className="text-xs text-muted-foreground">New customer — saved when you save this invoice.</div>
                <div className="pt-2 text-xs">
                  <span className="text-muted-foreground">GST:</span>{" "}
                  <span className="font-mono">{custGst || "—"}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Mobile:</span> {custMobile || "—"}
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Email:</span> {custEmail || "—"}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-xs">Type a customer name to begin.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{isChallan ? "Goods Being Moved" : "Line Items"}</CardTitle>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="mr-1 h-4 w-4" /> Add Row
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-2 text-left w-10">#</th>
                  <th className="p-2 text-left w-48">Product</th>
                  <th className="p-2 text-left w-24">HSN</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-right w-20">Qty</th>
                  <th className="p-2 text-left w-16">UOM</th>
                  {isChallan ? (
                    <th className="p-2 text-left w-40">Serial / Batch No.</th>
                  ) : (
                    <>
                      <th className="p-2 text-right w-24">Rate</th>
                      <th className="p-2 text-right w-28">Discount</th>
                      <th className="p-2 text-right w-16">Tax%</th>
                      <th className="p-2 text-right w-28">Total</th>
                    </>
                  )}
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const c = computeItem(it);
                  return (
                    <tr key={idx} className="border-t">
                      <td className="p-1 text-center text-muted-foreground">{it.sr_no}</td>
                      <td className="p-1">
                        <TypeaheadInput
                          value={productTexts[idx] ?? ""}
                          onChange={(v) => {
                            setProductTexts((prev) => prev.map((t, i) => (i === idx ? v : t)));
                            if (it.product_id) setItem(idx, { product_id: null });
                          }}
                          options={products.map((p: any) => ({
                            id: p.id,
                            label: p.product_name,
                            sublabel: `${p.product_code ?? ""}${p.hsn_code ? ` • HSN ${p.hsn_code}` : ""}`,
                          }))}
                          onSelect={(opt) => applyProduct(idx, opt.id)}
                          placeholder="Type product…"
                          inputClassName="h-8"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          className="h-8 font-mono text-xs"
                          value={it.hsn_code}
                          onChange={(e) => setItem(idx, { hsn_code: e.target.value })}
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          className="h-8"
                          value={it.description}
                          onChange={(e) => setItem(idx, { description: e.target.value })}
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          className="h-8 text-right tabular-nums"
                          type="number"
                          value={it.quantity}
                          onChange={(e) => setItem(idx, { quantity: Number(e.target.value) })}
                        />
                      </td>
                      <td className="p-1">
                        <Input className="h-8" value={it.uom} onChange={(e) => setItem(idx, { uom: e.target.value })} />
                      </td>
                      {isChallan ? (
                        <td className="p-1">
                          <Input
                            className="h-8"
                            value={it.serial_batch_number}
                            onChange={(e) => setItem(idx, { serial_batch_number: e.target.value })}
                            placeholder="Serial / Batch"
                          />
                        </td>
                      ) : (
                        <>
                          <td className="p-1">
                            <Input
                              className="h-8 text-right tabular-nums"
                              type="number"
                              value={it.unit_rate}
                              onChange={(e) => setItem(idx, { unit_rate: Number(e.target.value) })}
                            />
                          </td>
                          <td className="p-1">
                            <div className="flex items-center gap-1">
                              <Select
                                value={it.discount_mode}
                                onValueChange={(value: "pct" | "flat") => setItem(idx, { discount_mode: value })}
                              >
                                <SelectTrigger className="h-8 w-14 px-2 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pct">%</SelectItem>
                                  <SelectItem value="flat">₹</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                className="h-8 min-w-0 text-right tabular-nums"
                                type="number"
                                min="0"
                                value={it.discount_value}
                                onChange={(e) => setItem(idx, { discount_value: Number(e.target.value) })}
                              />
                            </div>
                          </td>
                          <td className="p-1">
                            <Input
                              className="h-8 text-right tabular-nums"
                              type="number"
                              value={it.tax_pct}
                              onChange={(e) => setItem(idx, { tax_pct: Number(e.target.value) })}
                            />
                          </td>
                          <td className="p-2 text-right tabular-nums font-medium">{formatINR(c.total_amount)}</td>
                        </>
                      )}
                      <td className="p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(idx)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
            <ChargeRow
              config={cfg("transportation_charges")}
              fallbackLabel="Transportation Charges"
              value={transportCharges}
              onChange={setTransportCharges}
            />
            <ChargeRow
              config={cfg("delivery_charges")}
              fallbackLabel="Delivery Charges"
              value={deliveryCharges}
              onChange={setDeliveryCharges}
            />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}

function ChargeRow({
  config,
  fallbackLabel,
  value,
  onChange,
}: {
  config: { visible: boolean; mandatory: boolean; readOnly: boolean; label: string };
  fallbackLabel: string;
  value: number;
  onChange: (v: number) => void;
}) {
  if (!config.visible) return null;
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs text-muted-foreground">
        {config.label || fallbackLabel}
        {config.mandatory && " *"}
      </Label>
      <Input
        className="h-8 w-32 text-right"
        type="number"
        value={value}
        readOnly={config.readOnly}
        disabled={config.readOnly}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
