# Make invoice email work on Vercel (no service-role key)

## Why it fails today

The send flow (`src/lib/invoice-email.functions.ts`) builds the invoice PDF, then uploads it to the private `invoice-pdfs` bucket and creates a signed link using the **admin client** (`src/integrations/supabase/client.server.ts`). That client needs `SUPABASE_SERVICE_ROLE_KEY`, which Lovable Cloud does not let you read, so a Vercel deployment cannot be given the value — hence the "Missing Supabase environment variable(s)" error.

Confirmed by checking the database: the `invoice-pdfs` bucket currently has **no storage access rules at all**, which is exactly why only the service role can write to it.

## Recommendation

Drop the service-role dependency for this flow. The upload happens inside an authenticated server function that already verifies the signed-in user, so the user's own credentials are enough — provided the bucket gets proper rules. This is also the safer option: no all-powerful key ever has to live in Vercel.

## Changes

1. **Storage access rules for `invoice-pdfs`** (additive migration, no data touched):
   - Signed-in users with write permission may upload/replace objects in this bucket.
   - Signed-in users may read objects (needed to mint the signed download link).
   - Anonymous users get nothing; the bucket stays private and downloads stay signed-URL-only.

2. **`src/lib/invoice-email.functions.ts`**: replace the two `supabaseAdmin` storage calls (upload + `createSignedUrl`) with the request-scoped `context.supabase` client from the auth middleware. Remove the in-handler `client.server` import. Everything else — rate limits, PDF build, template send — stays as is.

3. **Verify**: typecheck, build, and send a test invoice email from the preview to confirm the PDF uploads and the signed link resolves.

## Environment variables you still need in Vercel

After this change, each Vercel project needs only:

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- `LOVABLE_API_KEY` (for email delivery)

No `SUPABASE_SERVICE_ROLE_KEY`.

## Note

Other places in the app may still use the admin client. This plan only removes it from the invoice email path, which is the one you are hitting. If a build check shows another Vercel-facing feature depends on it, I will list it rather than silently changing it.
