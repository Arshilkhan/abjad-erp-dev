import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ~12 MB of base64 payload; keeps oversized uploads away from the AI gateway.
const MAX_DATA_URL_CHARS = 16_000_000;

export const extractInvoicePdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { fileData: string }) => {
    if (typeof input?.fileData !== "string" || !input.fileData.startsWith("data:application/pdf")) {
      throw new Error("Please upload a valid PDF file.");
    }
    if (input.fileData.length > MAX_DATA_URL_CHARS) {
      throw new Error("That PDF is too large. Please upload a file under 10 MB.");
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    const { enforceRateLimit } = await import("./rate-limit.server");
    await enforceRateLimit("pdf-extract", context.userId, 20, 3600);

    const { extractInvoiceFromPdf } = await import("./invoice-pdf-extract.server");
    return await extractInvoiceFromPdf(data.fileData);
  });
