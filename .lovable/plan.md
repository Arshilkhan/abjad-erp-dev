# Send invoice emails through Resend

## What changes

Emails currently go through Lovable's managed email API, which needs a Lovable key that cannot be copied into Vercel. Switching the send path to Resend with your own `RESEND_API_KEY` removes that blocker.

Bonus: Resend supports real file attachments, so the invoice PDF can be attached to the email directly instead of uploading it to storage and sending a signed link. That also removes the service-role-key dependency that was breaking the live deployment.

## Steps

1. **New sender module** `src/lib/email-templates/send-email-resend.ts`
   - Reads `RESEND_API_KEY` from `process.env` inside the handler (server-only).
   - Renders the existing React Email template (`invoice-sent`) from the current registry — no template rewrite.
   - POSTs to `https://api.resend.com/emails` with `from`, `to`, `subject`, `html`, `text`, and optional `attachments`.
   - Surfaces the provider status + error body on failure instead of a generic 500.

2. **`src/lib/invoice-email.functions.ts`**
   - Build the PDF as today, then pass the bytes as a base64 attachment named `<invoice-number>.pdf`.
   - Drop the storage upload and signed-URL steps, and the `client.server` (service-role) import.
   - Keep rate limits, customer lookup, and the `{ sent, reason }` return shape.

3. **Template** `src/lib/email-templates/invoice-sent.tsx`
   - Remove the `pdfUrl` download button/prop since the PDF is attached. Everything else stays.

4. **Verify**: typecheck + build, then send a test invoice from the preview.

## Sender address

You wrote `abjadengineerworks`, which is not a full email address. I will use `invoices@abjadengineeringworks.in` unless you say otherwise. Whatever address is used, its domain must be verified inside your Resend dashboard or Resend rejects the send.

## Environment variables

- `RESEND_API_KEY` — set it in **both** Vercel projects (live and dev). Already done for one, per your message.
- In the Lovable preview it also needs to exist for testing; I can request it as a project secret when you approve.
- `LOVABLE_API_KEY` is no longer needed for invoice email.
- `SUPABASE_SERVICE_ROLE_KEY` is no longer needed by this flow.

## Note

Lovable's built-in auth emails (sign-in, password reset) keep using Lovable's own infrastructure — this change only affects invoice emails.
