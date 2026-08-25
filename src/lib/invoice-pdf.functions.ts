import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const extractInvoicePdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { fileData: string }) => {
    if (!input?.fileData?.startsWith("data:")) throw new Error("Please upload a valid PDF file.");
    return input;
  })
  .handler(async ({ data }) => {
    const { extractInvoiceFromPdf } = await import("./invoice-pdf-extract.server");
    return await extractInvoiceFromPdf(data.fileData);
  });
