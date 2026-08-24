// Server-only helper: sends an invoice PDF to the Lovable AI Gateway and
// returns structured invoice fields for the Import Invoice form.

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const PROMPT = `You extract invoice data from a scanned/typed Indian GST invoice PDF.
Return ONLY a JSON object (no markdown fences) with exactly this shape:
{
  "customer_name": string,
  "company_name": string,
  "contact_person": string,
  "mobile": string,
  "email": string,
  "gst_number": string,
  "invoice_date": "YYYY-MM-DD",
  "po_number": string,
  "po_date": "YYYY-MM-DD",
  "challan_number": string,
  "challan_date": "YYYY-MM-DD",
  "work_order_number": string,
  "freight": number,
  "packing_charges": number,
  "other_charges": number,
  "discount_amount": number,
  "delivery_mode": string,
  "payment_terms": string,
  "notes": string,
  "items": [
    { "hsn_code": string, "description": string, "quantity": number,
      "uom": string, "unit_rate": number, "discount_pct": number, "tax_pct": number }
  ]
}
Rules:
- The customer is the party being BILLED (buyer / "Customer Name" block), never the issuing seller company.
- contact_person / mobile / email must belong to the buyer; leave empty when only the seller's contact is printed.
- tax_pct per item = SGST% + CGST%, or the IGST% when IGST is charged (e.g. 9+9 -> 18).
- Include EVERY line item row, in printed order.
- Use "" for unknown text and 0 for unknown numbers. Never invent data.
- notes: only genuine remarks printed on the invoice, otherwise "".`;

export type ExtractedItem = {
  hsn_code: string;
  description: string;
  quantity: number;
  uom: string;
  unit_rate: number;
  discount_pct: number;
  tax_pct: number;
};

export type ExtractedInvoice = {
  customer_name: string;
  company_name: string;
  contact_person: string;
  mobile: string;
  email: string;
  gst_number: string;
  invoice_date: string;
  po_number: string;
  po_date: string;
  challan_number: string;
  challan_date: string;
  work_order_number: string;
  freight: number;
  packing_charges: number;
  other_charges: number;
  discount_amount: number;
  delivery_mode: string;
  payment_terms: string;
  notes: string;
  items: ExtractedItem[];
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => {
  const n = Number(typeof v === "string" ? v.replace(/[^0-9.\-]/g, "") : v);
  return Number.isFinite(n) ? n : 0;
};
const date = (v: unknown) => (/^\d{4}-\d{2}-\d{2}$/.test(str(v)) ? str(v) : "");

function normalize(raw: any): ExtractedInvoice {
  const items = Array.isArray(raw?.items) ? raw.items : [];
  return {
    customer_name: str(raw?.customer_name),
    company_name: str(raw?.company_name),
    contact_person: str(raw?.contact_person),
    mobile: str(raw?.mobile),
    email: str(raw?.email),
    gst_number: str(raw?.gst_number).toUpperCase(),
    invoice_date: date(raw?.invoice_date),
    po_number: str(raw?.po_number),
    po_date: date(raw?.po_date),
    challan_number: str(raw?.challan_number),
    challan_date: date(raw?.challan_date),
    work_order_number: str(raw?.work_order_number),
    freight: num(raw?.freight),
    packing_charges: num(raw?.packing_charges),
    other_charges: num(raw?.other_charges),
    discount_amount: num(raw?.discount_amount),
    delivery_mode: str(raw?.delivery_mode),
    payment_terms: str(raw?.payment_terms),
    notes: str(raw?.notes),
    items: items
      .map((it: any) => ({
        hsn_code: str(it?.hsn_code),
        description: str(it?.description),
        quantity: num(it?.quantity) || 1,
        uom: str(it?.uom) || "NOS",
        unit_rate: num(it?.unit_rate),
        discount_pct: num(it?.discount_pct),
        tax_pct: num(it?.tax_pct),
      }))
      .filter((it: ExtractedItem) => it.description),
  };
}

export async function extractInvoiceFromPdf(fileData: string): Promise<ExtractedInvoice> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this project.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model: "google/gemini-3-flash",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "file", file: { filename: "invoice.pdf", file_data: fileData } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    let message = body;
    try {
      message = JSON.parse(body)?.error?.message ?? JSON.parse(body)?.message ?? body;
    } catch { /* keep raw body */ }
    if (res.status === 429) throw new Error("AI is rate limited right now — please retry in a moment.");
    if (res.status === 402 || res.status === 403) throw new Error(message || "AI usage is currently blocked for this workspace.");
    throw new Error(`Could not read the PDF: ${message?.slice(0, 300) || res.status}`);
  }

  const json: any = await res.json();
  const content: string = json?.choices?.[0]?.message?.content ?? "";
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("The AI could not find invoice data in that PDF.");
  return normalize(JSON.parse(match[0]));
}
