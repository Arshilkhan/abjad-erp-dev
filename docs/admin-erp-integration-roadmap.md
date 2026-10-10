# ABJAD ERP Admin Integration Roadmap

Last audited: 2026-10-10  
Repository: `Arshilkhan/abjad-erp-dev`  
Branch: `main`  
Environment audited: DEV only

## Objective and architecture

Prepare this ERP repository to integrate with the platform Admin UI, which is deployed from a separate GitHub repository. The Admin repository owns the Admin pages and user experience; this repository owns ERP data access, organization-scoped behavior, and any server-side integration operations exposed to that UI. Do not add a second platform Admin UI here. Preserve the existing ERP, organization data, and tenant boundaries. Platform-level administration must remain distinct from organization-level administration.

The ERP repository uses React 19, TypeScript, TanStack Router/Start, Vite, and Supabase. The browser Supabase client uses the publishable key and authenticated session. Authenticated TanStack server functions receive the session bearer token through global function middleware and create a user-scoped Supabase client. Privileged functions can dynamically import the server-only service-role client; those calls bypass RLS and require explicit authorization checks. The Admin app currently has no real authentication or API calls, so the identity provider, Admin-to-ERP contract, and cross-origin deployment configuration still need to be agreed.

## Evidence and scope

- Source review covered `package.json`, route and component inventories, authentication middleware/context, Admin-related server functions, navigation/panel definitions, generated Supabase types, migrations, and the provided DEV schema snapshot.
- The public Admin DEV repository `Arshilkhan/abjad-admin-dev` was shallow-cloned read-only to `/tmp/abjad-admin-dev` and inspected at commit `e37064f` on 2026-10-10. No files in that checkout were changed.
- The linked DEV database was inspected with read-only Supabase CLI commands on 2026-10-10. Migration history, schema, organization record, organization-member role counts, feature values, table RLS flags, and effective policies were queried. No data was changed.
- The file `supabase/migrations/20261010100000_dev_schema_snapshot.sql.snapshot` is a user-provided reference artifact. The CLI skipped it because it does not match the executable migration filename pattern. It was not executed, renamed, or edited.
- No general test framework or `*.test.*`/`*.spec.*` files were found under `src/`. Focused coverage is available through `npm run test:platform-admin-api` and the rollback-only SQL regression at `supabase/tests/organization_access_regression.sql`; the SQL regression has passed against linked DEV. The API smoke check still awaits endpoint and test-account credentials.
- Conclusions below distinguish repository/migration evidence from live DEV database evidence. No LIVE repository or database was accessed.

## Current implementation inventory

### DONE — verified

- **Stack and baseline:** React/TypeScript, TanStack Router/Start, Supabase, and Vite confirmed from source and package metadata.
- **Authentication plumbing:** `AuthProvider` loads the signed-in user’s `organization_members` rows and panel permissions. `src/start.ts` registers `attachSupabaseAuth`; `requireSupabaseAuth` verifies bearer-token claims before server functions receive a user-scoped client.
- **Authorization path traced:** `/auth` establishes the Supabase session; `AuthProvider` selects the first organization membership; `/_authenticated` redirects unauthenticated users and applies panel checks in the browser. Server functions must enforce authorization independently: `listAppUsers` verifies the token with `requireSupabaseAuth` and then calls `is_org_admin` before reading organization user data. `createAppUser` follows the same org-admin check before service-role Auth/profile/membership/panel writes; some write results are not checked. RLS remains the database boundary. Browser route/panel checks alone do not authorize requests. The new platform organization API instead checks global `user_roles.super_admin` before service-role reads.
- **DEV organization:** Read-only DEV query verified organization `a5d88bfa-0213-4504-a5e7-270c7a820db6`, “ABJAD Engineering Works”, status `active`. The DEV database currently has one organization membership with role `super_admin`; `user_roles` has one `super_admin` entry. Only aggregate counts were queried, not user identities.
- **DEV table/RLS inventory:** The live DEV catalog contains 33 public base tables; all 33 have RLS enabled. Twenty-nine have an `organization_id` column. The four without one are `organizations`, `profiles`, `rate_limits`, and legacy `user_roles`.
- **DEV policy inventory:** Current public policies use organization membership, organization roles, or panel checks for tenant business data; the live policy catalog returned no `USING (true)` policy. The organization-scoped policy state is visible in the DEV schema dump at `/tmp/abjad-dev-public-schema.sql` for this audit session.
- **Migration ledger:** `supabase migration list --linked` verified that all 11 tracked executable migration versions from `20260706154647` through `20260916053557` match the linked DEV migration ledger.
- **Baseline checks:** `npx tsc --noEmit` passed. `npm run build` passed. The build emitted existing `createServerFn().inputValidator()` deprecation warnings and bundler warnings. No automated test command or source test files are configured.

### PARTIAL — exists but incomplete or inconsistent

- **Organization context:** `src/lib/auth-context.tsx` picks `memberships?.[0]` with no ordering or user selection. The DEV organization currently has one member row, so no switching scenario exists in current DEV data. There is no organization switcher or selected-organization persistence.
- **Role model:** The legacy global `user_roles` table and organization-scoped `organization_members.role` both use the `app_role` values, but they are separate grants. The app context derives `isAdmin` from organization membership (`admin` or `super_admin`); SQL functions such as `is_admin` and `has_role` derive privileges from global `user_roles`. The DB helper `is_org_admin` treats both `admin` and `super_admin` as organization admins, so the UI label `super_admin` does not itself identify a distinct platform-only capability. The new platform organization API specifically requires a global `user_roles.super_admin`; no equivalence between the two role sources is assumed.
- **Admin UI:** There is no dedicated platform Admin dashboard or organization-management route. Existing `/users` is an organization-admin user/panel management screen; `/backups` is organization-scoped operational tooling. Admin links are visible through `AppSidebar` role checks, and the authenticated layout also checks panel visibility.
- **External Admin authentication and data:** In `Arshilkhan/abjad-admin-dev`, `src/auth/auth-context.tsx` accepts any non-empty email/password, stores only `abjad_admin_authenticated=true` in localStorage, and protects routes in the browser. There is no identity verification or authorization token. The repo has no Supabase client dependency and its source contains no API fetch/client calls. Do not connect privileged ERP operations to this login state.
- **External Admin prototype scope:** The organization list reads an in-memory copy of six mock records; suspend mutates only that in-memory list, create only shows an alert, and delete explicitly says it is a preview and does nothing. Dashboard metrics/charts, subscriptions, audit logs, support tickets, and platform settings are hardcoded. Access control, feature flags, and usage limits are local UI state with preview-only save buttons. Organization details and profile routes show “coming soon”. The deployment config is a Vercel SPA rewrite; no server/API routes were found.
- **External Admin data shape:** The mock organization uses slug IDs and display values such as `Active`, `Trial`, `Suspended`, and `Cancelled`, plus plan, user count, last-active, and usage fields. ERP organizations use UUIDs and the inspected DEV status is `active`; ERP data currently has no implemented subscription, billing, usage-limit, support-ticket, or platform-audit API. Treat mock fields as design examples, not an agreed schema or contract.
- **User/membership management:** `src/lib/admin-users.functions.ts` checks `is_org_admin` before privileged service-role operations. It supports user creation, panel permission replacement, and organization membership removal. Service-role write results are checked; partial user creation attempts to remove the newly created Auth user and profile on later setup failure. Panel values are checked against `PANELS`, and panel updates/removals verify target membership first. Permission replacement remains two requests (delete then insert), not an atomic transaction. It does not provide invitations, membership assignment/role editing for existing users, global user activation, or organization CRUD. The UI calls membership removal “delete user”, although the Auth account remains. Admin server functions still use deprecated `.inputValidator()`.
- **Feature/module model:** `organization_features` exists and DEV currently has 12 enabled feature rows. The `has_org_panel` function checks organization membership, admin role, or `user_panel_permissions`; it does not consult `organization_features`. No Admin feature-management route is present. Feature keys and UI panel keys also differ (for example, `delivery_challans` vs `challans`, `purchase_orders` vs `purchases`).
- **Support operations:** Organization-aware backup functions and backup routes exist. The scheduled cron reads one arbitrary `backup_settings` row, applies its frequency to the run, then runs backups for every organization. Per-organization schedules are therefore not honored by that path. Both `src/lib/backup.functions.ts` and `src/lib/backup.functions.tsx` exist with overlapping exports and different query scoping; callers and module resolution should be reconciled. These paths have not been integration-tested across organizations.
- **Organization activation:** DEV organizations use `active`/`suspended` status. The enforced suspension policy blocks members from organization business data and org-admin operations through RLS helpers and the authenticated ERP layout. The client refreshes status on window focus and every 30 seconds; backend RLS enforcement is immediate. Members retain sign-in and read access to their own membership and organization status so the UI can explain the suspension. Platform-level organization reads remain available to global platform super-admins. Scheduled service-role backups continue for data preservation. The Admin API does not yet expose a suspend/reactivate write operation.
- **Migration reproducibility:** The linked DEV schema contains organization tables, organization helper functions, scoped `organization_id` columns, and organization-aware RLS policies. The original multi-organization schema still is not represented by the tracked migration history; the new migrations cover the narrow role-grant and suspension changes only. The snapshot is not an executable migration. A clean database cannot be assumed to reproduce the current DEV schema from tracked migrations.

### First ERP API slice — implemented, not yet deployed or cross-repo verified

- `GET /api/admin/organizations` returns `{ organizations: [...] }` with `id`, `name`, `slug`, `status`, `created_at`, and `updated_at`.
- `GET /api/admin/organizations/{id}` returns `{ organization: {...} }`; invalid UUIDs return `400`, and unknown IDs return `404`.
- Both endpoints require `Authorization: Bearer <ERP Supabase access token>`. The ERP verifies the token and requires the authenticated user to have the global `user_roles` entry `super_admin`, checked through `has_role`. Organization-level admin membership is not accepted as platform authorization.
- Browser requests with an `Origin` are accepted only when the exact origin is included in the ERP deployment's comma-separated `ADMIN_ALLOWED_ORIGINS` environment variable. Requests without an `Origin` are suitable for server-to-server callers. Responses are marked `Cache-Control: no-store`.
- Only list/detail reads are implemented. No create, edit, suspend, user, feature, subscription, or usage operations are exposed yet.

### MISSING — cross-repository integration capabilities not implemented or verified

- A real Admin authentication flow and documented Admin-to-ERP contract, including identity/token validation, authoritative platform role, allowed operations, request/response shapes, and error behavior. The current Admin localStorage flag is not authentication.
- A dedicated platform-authorized server boundary for the operations the external Admin UI needs. No platform-wide organization listing/search, detail, provisioning, membership administration, activation, or suspension APIs were found in the ERP source.
- Cross-repository integration verification against the deployed Admin UI.
- A documented and enforced distinction between platform `super_admin` privileges and organization `admin` privileges.
- A user-facing organization switcher and explicit selected-organization state.
- Enforced feature enablement at both UI and database/server boundaries.
- Plans, subscriptions, billing rules, and plan enforcement.
- Platform-level audit events for sensitive Admin actions. Existing invoice history is business-document history, not a platform Admin audit log.
- A general test framework. Focused API smoke tests need dedicated DEV tokens and a reachable API; the two-organization RLS regression exists and passed in DEV using temporary transaction fixtures that were rolled back.

### BLOCKED — decision or prerequisite required

- **Admin identity and API contract:** The inspected Admin app has only static frontend login; no authenticated principal or token exists for ERP to validate. Decide the shared identity provider and authoritative platform-admin role before implementing cross-organization writes. The existing ERP `requireSupabaseAuth` validates Supabase bearer tokens for server functions, but authentication alone does not establish platform-admin authority.

- **Schema migration work:** Reconcile how the multi-organization schema entered DEV with the tracked migration history before adding/replaying organization DDL or treating the snapshot as a baseline. Do not rename or execute the snapshot, reset the database, or blindly replay schema definitions.
- **Platform-role authority:** Decide which source grants platform-wide authority and whether the existing global `user_roles` `super_admin` is intended to be platform-only. Do not migrate or merge role systems until this is decided.
- **Commercial plans:** Plan limits, subscription lifecycle, grace periods, and billing are undefined. Do not invent or enforce them.

## Security risks and migration considerations

1. **Anonymous role probing in DEV:** The provided current DEV schema snapshot grants `anon` execute on `public.has_org_role(uuid, app_role, uuid)`. The function is `SECURITY DEFINER` and accepts a caller-supplied user ID, organization ID, and role, returning whether that membership exists. This exposes a role-membership oracle to unauthenticated callers. Migration `20261010123000_revoke_anon_has_org_role.sql` revokes `PUBLIC` and `anon`, then explicitly retains authenticated/service-role execution.
2. **Legacy/global and organization roles overlap:** Global `is_admin`/`has_role` checks coexist with `is_org_admin`/`has_org_role`. Do not interpret an organization admin as a platform admin. Trace every server function and RLS policy before any role migration.
3. **Service-role operations:** The service-role Supabase client bypasses RLS. Every such handler must authorize the actor and constrain the target organization/resource. Check all write errors and validate target membership before relying on these functions for administration.
4. **Feature flags are not effective authorization:** `organization_features` currently stores flags, but `has_org_panel` does not read them. A disabled feature would not be enforced by the current helper. Do not expose feature toggles as effective security controls until backend/database checks use the authoritative flag.
5. **Suspended organizations:** DEV suspension enforcement is in place. All organization role, membership, panel, and access helpers require `organizations.status = 'active'`; organization business-data RLS is denied while members can still read their own membership and organization status. The scheduled backup cron remains a trusted system operation and continues to preserve data.
6. **Migration source mismatch:** DEV’s current schema is broader than tracked executable migrations. Make only narrowly scoped forward migrations after verifying both the current live object definitions and migration history. Never reset or replay the schema snapshot.
7. **Testing limitation:** Current DEV still contains one persistent organization and one organization member. The regression script temporarily created a second organization and cross-tenant customer fixture inside a transaction, verified denied reads/writes and suspension behavior, then rolled all fixture changes back.
8. **Scheduled backup scope:** `src/routes/api/public/backup-cron.ts` selects a single settings row and then loops through all organizations. This can run a backup for an organization whose own schedule is off and does not implement independent schedules. Resolve before relying on per-organization schedules.

## Phased roadmap

### Phase 0 — Audit and baseline: DONE for source and current DEV inventory

- [x] Check Git status and preserve existing changes.
- [x] Inventory routes, current Admin UI, and `admin-users.functions.ts`.
- [x] Trace authentication, role helpers, organization context, feature helpers, and server-only Supabase client use.
- [x] Inspect all tracked migration files and the provided snapshot without executing it.
- [x] Query linked DEV migration ledger and read-only schema/catalog evidence.
- [x] Verify the known organization, membership-role aggregate, feature rows, table RLS flags, and current policies.
- [x] Run TypeScript and production build checks; record lack of an automated test script.
- [x] Record current security and migration blockers.

### Phase 1 — Authorization model: IN PROGRESS

- [x] Apply the narrow forward migration `20261010123000_revoke_anon_has_org_role.sql` to linked DEV and verify anonymous execution is denied while authenticated and service-role execution remains. Its in-migration privilege assertions passed, and the post-apply linked ledger records version `20261010123000` on 2026-10-10.
- [x] Document the current global `user_roles` and organization-scoped `organization_members` sources. New platform Admin API routes require global `user_roles.super_admin`; organization membership alone is insufficient. Broader `admin`/`super_admin` role semantics remain an explicit decision before adding writes.
- [x] Trace login → organization selection → route guard → server function → RLS for organization user-list reads and service-role user creation; record the result and write caveat above.
- [x] Add an environment-driven platform API smoke-check script covering unauthenticated and malformed calls, non-platform-admin and organization-admin denials, platform-admin list/detail reads, invalid/unknown IDs, and CORS preflight. Run it against DEV when dedicated test tokens and an endpoint are available.
- [x] Add broader authorization and two-organization cross-tenant regression coverage in `supabase/tests/organization_access_regression.sql`; it passed against DEV using rollback-only fixtures and covers member/admin role distinction, cross-organization read/write denial, suspension access denial, and retained suspension-status visibility.
- [x] Define suspension behavior and enforce it consistently: suspended organizations deny member access to organization business data and org-admin operations through RLS/server authorization; users retain sign-in plus self-membership/status visibility; global platform-admin access and scheduled system backups continue.

### Phase 2 — Admin identity, integration contract, and ERP server boundary: IN PROGRESS

- [x] Inspect `Arshilkhan/abjad-admin-dev` and list current screens and their data needs; confirmed the current app is a static prototype with mock data and no authentication/API integration.
- [x] Add read-only organization list/detail API routes gated by a verified ERP Supabase access token and the global `super_admin` role.
- [ ] Confirm the Admin app will authenticate through the same ERP Supabase project and that global `user_roles.super_admin` is the intended platform-admin grant before using the endpoints in production.
- [ ] Replace the Admin's static localStorage login with authenticated identity before connecting sensitive data or mutations.
- [ ] Set `ADMIN_ALLOWED_ORIGINS` to the exact Admin deployment origin(s), then verify cross-origin preflight and bearer-token requests in DEV.
- [ ] Add write operations only after the Admin authentication, role, and write semantics are agreed; never put service-role credentials or unrestricted cross-organization queries in the browser.
- [ ] Add authorization and cross-organization tests for each operation. Keep organization `/users` behavior separate from platform-wide operations.

### Phase 3 — Organization management capabilities: MISSING

- [ ] Provide organization search/list and detail operations through the agreed server boundary for authorized platform administrators.
- [ ] Define duplicate handling and preserve the existing DEV organization/data.
- [ ] Implement provisioning/edit/member management only after the schema and role prerequisites are resolved.
- [x] Define and enforce suspension semantics; the RLS regression covers active, suspended, and cross-tenant access.
- [ ] Add platform audit events for suspension/reactivation. The external Admin repo owns the corresponding UI.

### Phase 4 — User and membership management: PARTIAL

- [x] Check service-role operation results, validate panel keys, and verify target membership before panel updates or membership removal. User-creation setup checks each write and attempts Auth-user cleanup after setup failure.
- [ ] Make panel permission replacement atomic so a failed insert cannot leave the member with cleared permissions.
- [ ] Decide whether the current “delete user” action means remove membership or disable/delete the Auth account; align UI copy.
- [ ] Add invitations and safe assignment/removal/role change workflows.
- [ ] Validate panel keys and prevent accidental role escalation.
- [ ] Replace deprecated validators only as part of a tested change, not as a standalone rewrite.

### Phase 5 — Feature and module access: PARTIAL

- [ ] Reconcile feature keys with `PANELS` and current routes.
- [ ] Define how `organization_features.enabled` changes effective access.
- [ ] Enforce feature state in both navigation and database/server authorization.
- [ ] Verify direct calls cannot access disabled modules.

### Phase 6 — Plans and subscriptions: MISSING / BLOCKED

- [ ] Define the business plan model and subscription lifecycle.
- [ ] Inspect current database again before proposing a narrowly scoped migration.
- [ ] Implement only after requirements are approved; do not add payment processing by assumption.

### Phase 7 — Audit logs and platform operations: PARTIAL

- [ ] Define sensitive platform actions and required audit fields.
- [ ] Add restricted platform audit records without secrets.
- [ ] Review existing backup/support functions for tenant and service-role boundaries.
- [ ] Fix scheduled backup selection so frequency and `last_run_at` are evaluated per organization; reconcile duplicate `backup.functions` modules.

### Phase 8 — Cross-repository integration and release readiness: NOT STARTED

- [ ] Connect the ERP server boundary to the external Admin UI using the agreed contract; verify deployed environment configuration without exposing service-role credentials.
- [ ] Test platform admin, organization admin, accountant, sales executive, and viewer access.
- [ ] Test two organizations, direct route access, server functions, disabled modules, and revoked membership.
- [ ] Re-run TypeScript, build, and automated security/business-flow tests.
- [ ] Document DEV rollout and verification; prepare a separate LIVE release plan only after DEV approval.

## Current verification results

| Check | Result | Evidence / notes |
|---|---|---|
| `npx tsc --noEmit` | PASS | No TypeScript errors. |
| `npm run build` | PASS | Production client/SSR/Nitro builds completed. Existing TanStack `inputValidator()` deprecation and bundler warnings remain. |
| Automated tests | PARTIAL | `npm run test:platform-admin-api` is available; static checks passed, but end-to-end execution awaits a reachable DEV endpoint and dedicated test tokens. No general test framework or source test suite is configured. |
| `supabase migration list --linked` | PASS | All 13 executable local migration versions match the linked DEV ledger. The CLI skips the `.snapshot` reference file. |
| Phase 1 grant migration | PASS, APPLIED TO DEV | `20261010123000_revoke_anon_has_org_role.sql` applied successfully; its assertions verified `anon` is denied and `authenticated`/`service_role` retain execution. Post-apply ledger confirms the version. |
| Suspension enforcement migration | PASS, APPLIED TO DEV | `20261010133000_enforce_suspended_organization_access.sql` updates organization authorization helpers and the organization feature-read policy. |
| Two-organization authorization regression | PASS, DEV, ROLLED BACK | `supabase/tests/organization_access_regression.sql` passed active-member, viewer/admin distinction, second-organization read/write denial, suspended data read/write denial, and retained status/membership visibility assertions. Follow-up catalog counts confirm fixture organization/customer rows were rolled back. |
| Linked DEV schema/catalog | PASS, read-only | 33 public base tables, all RLS enabled; 29 have `organization_id`; policies and helper grants inspected. |
| DEV organization data | PASS, read-only | Known organization is active; one org membership role `super_admin`; one global role `super_admin`; 12 feature rows all enabled. |
| Cross-organization behavior | PASS, REGRESSION SCRIPT | DEV returned to its original single persistent organization/member after the rollback-only second-organization test. |

## Exact next task

Configure `ERP_ADMIN_API_BASE_URL`, dedicated DEV platform-super-admin/organization-admin/viewer tokens, `ADMIN_TEST_ORGANIZATION_ID`, and `ADMIN_TEST_ALLOWED_ORIGIN`, then run `npm run test:platform-admin-api`. These environment values are currently unset in this Codespace. The two requested Phase 1 items are complete and verified in DEV. Do not apply either migration to LIVE.

## Change log

- **2026-10-10:** Replaced the prior end-of-session reminder with the evidence-based Admin integration roadmap. Audited repository source and linked DEV migration/schema/catalog. Recorded role-model overlap, feature and suspension enforcement gaps, the anonymous `has_org_role` grant, and the mismatch between current DEV schema and tracked executable migrations. Ran TypeScript and production build checks. No application source or database objects were changed.
- **2026-10-10:** Clarified the repository boundary: the separate Admin repository owns the Admin UI, while this ERP repo must provide the agreed secure integration boundary and backend capabilities. Updated phases and next task to require inspection of the external contract before implementation. No application source or database objects were changed.
- **2026-10-10:** Inspected public Admin DEV repo `Arshilkhan/abjad-admin-dev` at `e37064f`. Verified its login is static/localStorage-only, organization data is an in-memory mock, other views are hardcoded or preview-only, and it has no Supabase/API integration. Updated integration blockers and data-contract findings. No application source or database objects were changed.
- **2026-10-10:** Added ERP API routes for platform-super-admin organization list/detail reads, using ERP Supabase bearer-token validation, global `super_admin` authorization, and exact-origin CORS allowlisting via `ADMIN_ALLOWED_ORIGINS`. TypeScript and production build passed. No schema or live data was changed; endpoints have not yet been deployed or exercised from the Admin app.
- **2026-10-10:** Started Phase 1. Added forward-only migration `20261010123000_revoke_anon_has_org_role.sql`, including in-migration checks that `anon` is denied while `authenticated` and `service_role` retain execution. Traced and documented representative auth-to-RLS flows and the current role sources. Rechecked the supplied current DEV snapshot: it confirms the exact three-argument `SECURITY DEFINER` function and explicit grants to `anon`, `authenticated`, and `service_role`. The linked Supabase CLI has no access token in this Codespace, so the migration has not been applied to the database. Phase 1 remains in progress.
- **2026-10-10:** Continued Phase 1. Added `scripts/check-platform-admin-api.mjs` and the `test:platform-admin-api` npm command for environment-configured auth, role, response, ID-validation, and CORS smoke checks. Updated this roadmap with the separate global/org role authorities and traced representative user-list read and service-role user-creation paths. Script syntax, package JSON, and diff whitespace checks passed. After the user completed `supabase login` in the Codespace terminal, applied the single pending migration `20261010123000_revoke_anon_has_org_role.sql` to linked DEV; embedded role grants passed assertions and the post-apply migration ledger matches all 12 executable local versions. Re-ran `npx tsc --noEmit` and `npm run build`; both passed with existing deprecation/bundler warnings. API endpoint execution remains pending because its base URL and dedicated test tokens are not configured.
- **2026-10-10:** Hardened organization user-management server functions: service-role writes now check errors, creation validates/deduplicates panel keys and attempts to clean up a new Auth user/profile if subsequent setup fails, and panel updates/removal verify target membership before writing. Permission replacement still uses separate delete/insert calls and can be left partially applied on a write failure. Final `npx tsc --noEmit`, `npm run build`, and `git diff --check` passed. Platform API smoke execution remains pending its unset DEV URL and test tokens.
- **2026-10-10:** Completed the two requested Phase 1 items. Added and applied `20261010133000_enforce_suspended_organization_access.sql` to DEV: organization role/member/panel/access helpers and feature reads now reject suspended organizations. The authenticated layout shows a suspension notice while preserving sign-in and status visibility; status refreshes on focus and every 30 seconds. Platform-level reads and scheduled service-role backups remain available. Added and ran `supabase/tests/organization_access_regression.sql` against DEV; active-member access, viewer/admin separation, cross-organization read/write denial, suspended read/write denial, and retained status/membership visibility all passed. The transaction rolled back its temporary second organization and customer fixtures; follow-up counts show DEV still has one organization, one membership, and zero fixture rows. `npx tsc --noEmit`, `npm run build`, JSON parsing, and `git diff --check` passed. Both requested checklist items are complete; platform API smoke tests still await the endpoint and dedicated test tokens.

## Session closeout

At the end of each Codex session, update this roadmap with verified status and evidence, list changed files/migrations, report checks and results, state blockers, and name the single next task. Do not commit or push unless explicitly requested. Never modify LIVE.
