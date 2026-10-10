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
import { logDocumentSaveHistory } from "./shared/document-save-history";
import { validateDocument } from "./shared/validate-document";
import { TypeaheadInput } from "@/components/typeahead-input";
import { useInvoiceConfig } from "@/lib/invoice-config";
import { emptyItem, MOVEMENT_REASONS, type LineItem, } from "@/components/forms/shared/types";
import { Row, ChargeRow, } from "@/components/forms/shared/totals-section";
import { ProductLineItems } from "@/components/forms/shared/product-line-items";
import { DocumentDetails } from "@/components/forms/shared/document-details";
import { AdditionalDetails } from "@/components/forms/shared/additional-details";
import { DocumentFormCore } from "@/components/forms/shared/document-form-core";
import { getDocumentFormConfig } from "./shared/document-config";
import { buildDocumentPayload } from "./shared/document-payload";
import { saveDocument } from "./shared/save-document";
import { resolveCustomer, resolveProducts, } from "./shared/resolve-document-data";
import { importInvoicePdf } from "./shared/pdf-import";
import { hydrateDocument } from "./shared/hydrate-document";
import { calculateDocumentTotals } from "./shared/calculate-document-totals";

export interface DocumentFormProps {
  editId?: string;
  importMode?: boolean;
  documentType?: SalesDocumentKind;
}
export function DocumentForm({
  editId,
  importMode,
  documentType = "tax_invoice",
}: DocumentFormProps) {
  const formConfig = getDocumentFormConfig(documentType);
  const docCfg = salesDocumentConfig(documentType);
  const docTable = docCfg.table as "invoices";
  const docItemsTable = docCfg.itemsTable as "invoice_items";
  const isTaxInvoice = formConfig.isTaxInvoice;
  const nav = useNavigate();
  const router = useRouter();
  const { user, organizationId } = useAuth();
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
  const isChallan = formConfig.isChallan;

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
    hydrateDocument({
      existing,
      documentType,
      isChallan,
      isTaxInvoice,
      showPaymentTerms: formConfig.showPaymentTerms,
      setCustomerId,
      setCustomerText,
      setInvoiceType,
      setInvoiceDate,
      setChallanNumber,
      setChallanDates,
      setWorkOrder,
      setFreight,
      setPacking,
      setOtherCharges,
      setTransportCharges,
      setDeliveryCharges,
      setDeliveryMode,
      setPaymentTerms,
      setNotes,
      setMovementReason,
      setTransporterName,
      setPlaceOfDispatch,
      setPlaceOfDelivery,
      setItems,
      setProductTexts,
    });
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

  const totals = useMemo(
    () =>
      calculateDocumentTotals({
        items,
        freight,
        packing,
        otherCharges,
        transportCharges,
        deliveryCharges,
      }),
    [items, freight, packing, otherCharges, transportCharges, deliveryCharges],
  );

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

      validateDocument({
        customerCompany: custCompany,
        customerGst: custGst,
        mandatoryGstNumber: settings?.mandatory_gst_number,
        isChallan,
        mandatoryChallanNumber: settings?.mandatory_challan_number,
        challanNumber,
        showPaymentTerms: formConfig.showPaymentTerms,
        isTaxInvoice,
        itemsCount: items.length,
        cfg,
        freight,
        packing,
        otherCharges,
        transportCharges,
        deliveryCharges,
      });

      const cust = await resolveCustomer({
        supabase,
        customer,
        customers,
        customerText,
        custCompany,
        custAddress,
        custMobile,
        custEmail,
        custGst,
        createdBy: user?.id,
        organizationId: organizationId!,
      });

      // Create any products that were typed in but don't exist yet.
      const resolvedItems = await resolveProducts({
        supabase,
        items,
        productTexts,
        products,
        organizationId: organizationId!,
      });

      const payload = buildDocumentPayload({
        organizationId: organizationId!,
        invoiceType,
        invoiceDate,
        customerId: cust.id,
        customerName: cust.company_name || cust.customer_name,
        customerGst: cust.gst_number,
        customerAddress: custAddress.trim() || cust.billing_address,
        workOrder,
        deliveryMode,
        contactPerson: nameTyped,
        contactMobile: custMobile,
        notes,
        status,

        isChallan,
        isTaxInvoice,
        isIGST,

        challanNumber,
        challanDates,
        movementReason,
        transporterName,
        placeOfDispatch,
        placeOfDelivery,

        totals,

        freight,
        packing,
        otherCharges,
        transportCharges,
        deliveryCharges,
        paymentTerms,
      });

      const result = await saveDocument({
        supabase,
        docTable,
        docItemsTable,
        payload,
        items: resolvedItems,
        organizationId: organizationId!,
        isChallan,
        isEdit,
        editId,
        docPrefix: docCfg.prefix,
        customerName:
          custCompany ||
          cust.company_name ||
          cust.customer_name ||
          customerText ||
          "customer",
        createdBy: user?.id,
        isTaxInvoice,
        importMode,
        pdfImported,
      });

      return result;
    },
    onSuccess: async (inv, status) => {
      qc.invalidateQueries({ queryKey: ["customers-list"] });
      qc.invalidateQueries({ queryKey: ["products-list"] });
      await logDocumentSaveHistory({
        invoiceId: inv.id,
        invoiceNumber: inv.invoice_number,
        isTaxInvoice,
        isEdit,
        importMode,
        pdfImported,
      });
      toast.success(`${docCfg.label} ${inv.invoice_number} ${isEdit ? "updated" : importMode ? "imported" : "created"}`);

      if (status === "sent") {
        try {
          const res: any = await sendEmail({ data: { invoiceId: inv.id, kind: documentType } });
          if (res?.sent) {
            toast.success(`${docCfg.label} emailed to ${res.email}`);

            if (isTaxInvoice) {
              await logInvoiceEvent(
                inv.id,
                "sent",
                `${docCfg.label} emailed to ${res.email}`,
              );
            }
          } else if (res?.reason === "no_email") {
            toast.info(
              `Saved. No customer email on file, so the ${docCfg.label.toLowerCase()} was not sent.`,
            );
          } else if (res?.reason === "recipient_suppressed") {
            toast.warning(
              `Saved. The customer has unsubscribed from emails.`,
            );
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
    await importInvoicePdf({
      file,
      runExtract,
      customers,
      products,
      isTaxInvoice,
      setPdfName,
      setPdfImported,
      setExtracting,
      setCustomerId,
      setCustomerText,
      setCustCompany,
      setCustMobile,
      setCustEmail,
      setCustGst,
      setInvoiceDate,
      setWorkOrder,
      setFreight,
      setPacking,
      setOtherCharges,
      setDeliveryMode,
      setPaymentTerms,
      setNotes,
      setItems,
      setProductTexts,
      toast,
    });
  };

  return (
    <DocumentFormCore
      header={
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
                {save.isPending ? "Saving…" : "Save & Send"}
              </Button>
            </div>
          }
        />
      }
      details={
        <DocumentDetails
          isChallan={isChallan}
          isEdit={isEdit}
          isTaxInvoice={isTaxInvoice}
          isIGST={isIGST}
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
      }
      items={
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
      }
      additionalDetails={
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <AdditionalDetails
            showPaymentTerms={formConfig.showPaymentTerms}
            showTransportDetails={formConfig.showTransportDetails}
            isEdit={isEdit}
            showDelivery={settings?.show_delivery}
            deliveryMode={deliveryMode}
            paymentTerms={paymentTerms}
            transporterName={transporterName}
            placeOfDispatch={placeOfDispatch}
            placeOfDelivery={placeOfDelivery}
            notes={notes}
            setDeliveryMode={setDeliveryMode}
            setPaymentTerms={setPaymentTerms}
            setTransporterName={setTransporterName}
            setPlaceOfDispatch={setPlaceOfDispatch}
            setPlaceOfDelivery={setPlaceOfDelivery}
            setNotes={setNotes}
          />

          <Card className={!formConfig.showPricing ? "hidden" : undefined}>
            <CardHeader>
              <CardTitle className="text-base">Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Net Value" value={formatINR(totals.net)} />

              <ChargeRow
                config={cfg("freight_charges")}
                fallbackLabel="Freight"
                value={freight}
                onChange={setFreight}
              />

              {isTaxInvoice && (
                <ChargeRow
                  config={cfg("transportation_charges")}
                  fallbackLabel="Transportation Charges"
                  value={transportCharges}
                  onChange={setTransportCharges}
                />
              )}

              {isTaxInvoice && (
                <ChargeRow
                  config={cfg("delivery_charges")}
                  fallbackLabel="Delivery Charges"
                  value={deliveryCharges}
                  onChange={setDeliveryCharges}
                />
              )}

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

                {formConfig.showTaxes && (
                  <>
                    {isIGST ? (
                      <Row label="IGST" value={formatINR(totals.tax)} />
                    ) : (
                      <>
                        <Row label="CGST" value={formatINR(totals.tax / 2)} />
                        <Row label="SGST" value={formatINR(totals.tax / 2)} />
                      </>
                    )}
                  </>
                )}

                <Row label="Round Off" value={formatINR(totals.round_off)} />
              </div>

              <div className="flex items-center justify-between border-t pt-2 text-base font-bold">
                <span>Grand Total</span>
                <span className="tabular-nums">{formatINR(totals.grand)}</span>
              </div>

              <p className="pt-1 text-xs italic text-muted-foreground">
                {amountInWords(totals.grand)}
              </p>
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}
