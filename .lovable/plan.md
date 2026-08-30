# Production Security Hardening + Dev/Live Separation

## What I checked already

- Backend security scan: 6 critical, 12 warnings.
- Database linter: 1 warning.
- Dependency scan: no high/critical vulnerabilities.
- Access-control code: `_authenticated` layout and panel permissions are enforced in the browser only; admin user-management server functions do correctly re-check the admin role on the server.

## 1. Critical / high issues found

1. **Invoice PDF storage has no access rules.** The bucket is private, but there are no policies on stored objects, so any signed-in client could read or overwrite any invoice PDF.
2. **Every business table allows any signed-in user full read/write.** Customers, vendors, invoices, invoice items, payments, customer credits, purchase orders, products, stock, rejections, invoice configuration, product categories all use "authenticated can do anything". A "viewer" account can edit invoice amounts, change prices, delete payments, or read vendor bank details.
3. **Audit log is forgeable.** `invoice_history` can be inserted by anyone with any `actor_id`/`actor_email` value, and it is written from the browser — so the audit trail cannot be trusted.
4. **Panel permissions are cosmetic.** Hiding a sidebar item does not stop that user from calling the database directly with their own token.
5. **Money is computed in the browser.** Totals, GST, discounts and payment amounts are sent from the client and stored as-is; a tampered request can save an invoice with any total.
6. **No rate limiting** on sign-in, invoice email sending, or PDF import (the AI extraction endpoint can be called repeatedly by any signed-in user).
7. **Security definer function callable by signed-in users** (linter warning) — needs review of `EXECUTE` grants.

Not currently a problem: dependencies are clean, service keys are server-only, no secrets are hard-coded in the repo, Lovable serves HTTPS by default.

## 2. Fixes to make (non-destructive, no data deleted)

**Database (migrations, additive only)**
- Add a `public.can_write()` / role helper and replace every blanket "authenticated true" policy with:
  - read: any signed-in user with the matching panel permission,
  - write (insert/update/delete): admin, accountant, or sales roles depending on table; viewers read-only.
- Vendors/customers bank + GST columns: keep readable to admin/accountant roles only.
- `invoice_history`: SELECT for admins/owners, INSERT forced to `actor_id = auth.uid()`, no UPDATE/DELETE (already denied).
- `invoice_configuration`, `product_categories`, `company_profile`, `invoice_settings`: writes restricted to admins.
- `user_roles` / `user_panel_permissions`: writes admin-only; users may read their own.
- Storage: add object policies on the `invoice-pdfs` bucket so only server (service role) writes, and reads happen through short-lived signed URLs only.
- Review and revoke unnecessary `EXECUTE` on the flagged security-definer function.

**Server-side enforcement**
- Move invoice create/update, payment recording, invoice cancel, and rejection handling into authenticated server functions that recalculate line totals, tax, round-off and grand total from the item rows — client-sent totals are ignored.
- Server-side role/panel check helper reused by every sensitive server function (invoice write, payment write, cancel, user admin, email send).
- Write `invoice_history` entries server-side with the verified user id, replacing the browser-side logger.
- Zod validation on every server function input.

**Abuse / hardening**
- Rate limits: sign-in attempts (per email + IP), invoice email sends (per invoice + per user per hour), PDF extraction (per user per hour), stored in a small `rate_limits` table.
- Security headers via the server entry: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/frame-ancestors, and a conservative CSP.
- PDF upload path: validate file type/size before AI extraction; keep storage paths derived from invoice id (no client-supplied paths).
- Production error responses stay generic; full detail only in server logs.

Not needed for this app: CSRF tokens (no cookie-based session; bearer token auth), SSRF/command-injection controls (no outbound URL fetching or shell use), SQL injection controls (all access goes through the parameterised client).

## 3. Dev / Live separation

Lovable branches share one backend, so branches alone will **not** isolate data. Two clean options:

- **Option A (recommended, simplest):** duplicate this project into a second Lovable project used as the dev/test ERP. It gets its own database, storage, secrets and URL. Attach `dev-erp.abjadengineeringworks.in` to it and `live-erp.abjadengineeringworks.in` to this one. Changes are promoted by pushing code from `test` to `main`. Zero risk of test data touching live data.
- **Option B:** keep one project and point the `test` branch at a second, self-managed backend by overriding the backend environment variables per deployment. More moving parts, and the risk of a misconfigured variable pointing test at live data.

Either way: separate email sender/secrets for dev, and never copy live customer data into dev unmasked.

## 4. Manual actions for you

- Decide Option A or B above; create the second project/domain.
- Enable leaked-password protection and set a sensible session/JWT expiry in the auth settings.
- Confirm database backup schedule and do one restore drill before go-live.
- Protect the GitHub `main` branch: require PR review, no force-push, enable secret scanning + Dependabot.
- Rotate the personal access token used earlier if it is still broadly scoped.

## 5. Production checklist (verified after the fixes)

- Sign-in, sign-out, password reset, protected routes behave correctly.
- A "viewer" account cannot write to any table directly (tested with its own token).
- Invoice total tampering attempt is rejected/recalculated.
- Another user's invoice PDF is not reachable without a signed URL.
- Security headers present on the deployed response.
- Rate limits trigger on repeated sign-in/email attempts.
- Rescan shows no critical findings.

## Technical notes

Policy rewrites go through migrations (drop-and-recreate policies only, no table or data changes). Server functions live in `src/lib/*.functions.ts` using `requireSupabaseAuth`; the recalculation logic lives in a `.server.ts` helper shared by create/update. Headers are added in `src/server.ts`. Rate limiting uses a Postgres table with a security-definer `check_rate_limit()` function callable only from server functions.
