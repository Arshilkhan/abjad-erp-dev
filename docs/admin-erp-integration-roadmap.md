# ABJAD ERP Admin Integration Roadmap

Last audited: 2026-10-10  
Repository: `Arshilkhan/abjad-erp-dev`  
Branch: `main`  
Environment audited: DEV only

## Objective and architecture

Prepare this ERP repository to integrate with the platform Admin UI, which is deployed from a separate GitHub repository. The Admin repository owns the Admin pages and user experience; this repository owns ERP data access, organization-scoped behavior, and any server-side integration operations exposed to that UI. Do not add a second platform Admin UI here. Preserve the existing ERP, organization data, and tenant boundaries. Platform-level administration must remain distinct from organization-level administration.

The repository uses React 19, TypeScript, TanStack Router/Start, Vite, and Supabase. The browser Supabase client uses the publishable key and authenticated session. Authenticated TanStack server functions receive the session bearer token through global function middleware and create a user-scoped Supabase client. Privileged functions can dynamically import the server-only service-role client; those calls bypass RLS and require explicit authorization checks. The Admin-to-ERP authentication, API shape, and deployment origins have not yet been provided or verified, so integration endpoints must not be designed around assumptions about the external UI.

## Evidence and scope

- Source review covered `package.json`, route and component inventories, authentication middleware/context, Admin-related server functions, navigation/panel definitions, generated Supabase types, migrations, and the provided DEV schema snapshot.
- The linked DEV database was inspected with read-only Supabase CLI commands on 2026-10-10. Migration history, schema, organization record, organization-member role counts, feature values, table RLS flags, and effective policies were queried. No data was changed.
- The file `supabase/migrations/20261010100000_dev_schema_snapshot.sql.snapshot` is a user-provided reference artifact. The CLI skipped it because it does not match the executable migration filename pattern. It was not executed, renamed, or edited.
- `npm run` lists no test script, and no `*.test.*` or `*.spec.*` files were found under `src/`.
- Conclusions below distinguish repository/migration evidence from live DEV database evidence. No LIVE repository or database was accessed.

## Current implementation inventory

### DONE — verified

- **Stack and baseline:** React/TypeScript, TanStack Router/Start, Supabase, and Vite confirmed from source and package metadata.
- **Authentication plumbing:** `AuthProvider` loads the signed-in user’s `organization_members` rows and panel permissions. `src/start.ts` registers `attachSupabaseAuth`; `requireSupabaseAuth` verifies bearer-token claims before server functions receive a user-scoped client.
- **DEV organization:** Read-only DEV query verified organization `a5d88bfa-0213-4504-a5e7-270c7a820db6`, “ABJAD Engineering Works”, status `active`. The DEV database currently has one organization membership with role `super_admin`; `user_roles` has one `super_admin` entry. Only aggregate counts were queried, not user identities.
- **DEV table/RLS inventory:** The live DEV catalog contains 33 public base tables; all 33 have RLS enabled. Twenty-nine have an `organization_id` column. The four without one are `organizations`, `profiles`, `rate_limits`, and legacy `user_roles`.
- **DEV policy inventory:** Current public policies use organization membership, organization roles, or panel checks for tenant business data; the live policy catalog returned no `USING (true)` policy. The organization-scoped policy state is visible in the DEV schema dump at `/tmp/abjad-dev-public-schema.sql` for this audit session.
- **Migration ledger:** `supabase migration list --linked` verified that all 11 tracked executable migration versions from `20260706154647` through `20260916053557` match the linked DEV migration ledger.
- **Baseline checks:** `npx tsc --noEmit` passed. `npm run build` passed. The build emitted existing `createServerFn().inputValidator()` deprecation warnings and bundler warnings. No automated test command or source test files are configured.

### PARTIAL — exists but incomplete or inconsistent

- **Organization context:** `src/lib/auth-context.tsx` picks `memberships?.[0]` with no ordering or user selection. The DEV organization currently has one member row, so no switching scenario exists in current DEV data. There is no organization switcher or selected-organization persistence.
- **Role model:** The legacy global `user_roles` table and organization-scoped `organization_members.role` both use the `app_role` values. The app context derives `isAdmin` from organization membership (`admin` or `super_admin`); SQL functions such as `is_admin` and `has_role` derive privileges from global `user_roles`. The relationship and intended authority of these models are undocumented. The DB helper `is_org_admin` treats both `admin` and `super_admin` as organization admins, so the UI label `super_admin` does not itself identify a distinct platform-only capability.
- **Admin UI:** There is no dedicated platform Admin dashboard or organization-management route. Existing `/users` is an organization-admin user/panel management screen; `/backups` is organization-scoped operational tooling. Admin links are visible through `AppSidebar` role checks, and the authenticated layout also checks panel visibility.
- **External Admin integration:** The platform Admin UI lives in another GitHub repository. This ERP repository has no documented Admin-to-ERP API contract or dedicated platform-administration server-function boundary. Existing org-admin functions and direct Supabase client usage are not a substitute for a platform-authorized integration contract. The external repository and its auth/API implementation were not available in this audit.
- **User/membership management:** `src/lib/admin-users.functions.ts` checks `is_org_admin` before privileged service-role operations. It supports user creation, panel permission replacement, and organization membership removal. It does not provide invitations, membership assignment/role editing for existing users, global user activation, or organization CRUD. Some service-role write results are not checked; `setUserPanels` and `deleteAppUser` do not first verify the target user is a member of the supplied organization. The UI calls membership removal “delete user”, although the Auth account remains. Admin server functions still use deprecated `.inputValidator()`.
- **Feature/module model:** `organization_features` exists and DEV currently has 12 enabled feature rows. The `has_org_panel` function checks organization membership, admin role, or `user_panel_permissions`; it does not consult `organization_features`. No Admin feature-management route is present. Feature keys and UI panel keys also differ (for example, `delivery_challans` vs `challans`, `purchase_orders` vs `purchases`).
- **Support operations:** Organization-aware backup functions and backup routes exist. The scheduled cron reads one arbitrary `backup_settings` row, applies its frequency to the run, then runs backups for every organization. Per-organization schedules are therefore not honored by that path. Both `src/lib/backup.functions.ts` and `src/lib/backup.functions.tsx` exist with overlapping exports and different query scoping; callers and module resolution should be reconciled. These paths have not been integration-tested across organizations.
- **Organization activation:** DEV organizations have `active`/`suspended` status, but the current `can_access_org` helper only checks membership and does not reject suspended organizations. No activation/suspension UI or final business rules exist.
- **Migration reproducibility:** The linked DEV schema contains organization tables, organization helper functions, scoped `organization_id` columns, and organization-aware RLS policies. None of the 11 tracked migrations defines that multi-organization schema; the last migration only adds movement/challan columns. Thus the repo migration ledger matches DEV, while the schema is ahead of the tracked migration source. The snapshot is not an executable migration. A clean database cannot be assumed to reproduce the current DEV schema from tracked migrations.

### MISSING — ERP integration capabilities not implemented or verified

- A documented, authenticated Admin-to-ERP integration contract, including identity/token validation, allowed operations, request/response shapes, and error behavior.
- A dedicated platform-authorized server boundary for the operations the external Admin UI needs. No platform-wide organization listing/search, detail, provisioning, membership administration, activation, or suspension APIs were found in the ERP source.
- Cross-repository integration verification against the deployed Admin UI. The external repository and its contract were not inspected.
- A documented and enforced distinction between platform `super_admin` privileges and organization `admin` privileges.
- A user-facing organization switcher and explicit selected-organization state.
- Enforced feature enablement at both UI and database/server boundaries.
- Plans, subscriptions, billing rules, and plan enforcement.
- Platform-level audit events for sensitive Admin actions. Existing invoice history is business-document history, not a platform Admin audit log.
- Automated authorization and cross-organization regression tests; no test harness/script was found.

### BLOCKED — decision or prerequisite required

- **External integration contract:** The Admin UI is maintained elsewhere, but its repository URL, authentication flow, deployment origins, and required ERP operations have not been supplied. Obtain and inspect the contract before adding endpoints or allowing direct Admin-to-Supabase access. This is the immediate prerequisite for implementing the ERP side without inventing an incompatible interface.

- **Schema migration work:** Reconcile how the multi-organization schema entered DEV with the tracked migration history before adding/replaying organization DDL or treating the snapshot as a baseline. Do not rename or execute the snapshot, reset the database, or blindly replay schema definitions.
- **Platform-role authority:** Decide which source grants platform-wide authority and whether the existing global `user_roles` `super_admin` is intended to be platform-only. Do not migrate or merge role systems until this is decided.
- **Organization suspension semantics:** Decide which routes, server functions, and database operations should stop when an organization is suspended before enforcing the status field.
- **Commercial plans:** Plan limits, subscription lifecycle, grace periods, and billing are undefined. Do not invent or enforce them.

## Security risks and migration considerations

1. **Anonymous role probing in DEV:** The live schema dump grants `anon` execute on `public.has_org_role(uuid, app_role, uuid)`. The function is `SECURITY DEFINER` and accepts a caller-supplied user ID, organization ID, and role, returning whether that membership exists. This exposes a role-membership oracle to unauthenticated callers. Review and revoke anonymous execution with a narrow forward-only migration; retain only intended authenticated/service-role access.
2. **Legacy/global and organization roles overlap:** Global `is_admin`/`has_role` checks coexist with `is_org_admin`/`has_org_role`. Do not interpret an organization admin as a platform admin. Trace every server function and RLS policy before any role migration.
3. **Service-role operations:** The service-role Supabase client bypasses RLS. Every such handler must authorize the actor and constrain the target organization/resource. Check all write errors and validate target membership before relying on these functions for administration.
4. **Feature flags are not effective authorization:** `organization_features` currently stores flags, but `has_org_panel` does not read them. A disabled feature would not be enforced by the current helper. Do not expose feature toggles as effective security controls until backend/database checks use the authoritative flag.
5. **Suspended status is not enforced by access helpers:** `can_access_org` checks membership only. A status change alone would not revoke the organization’s member access.
6. **Migration source mismatch:** DEV’s current schema is broader than tracked executable migrations. Make only narrowly scoped forward migrations after verifying both the current live object definitions and migration history. Never reset or replay the schema snapshot.
7. **Testing limitation:** Current DEV contains one organization and one organization member, so tenant-isolation behavior between two organizations has not been exercised.
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

### Phase 1 — Authorization model: PARTIAL; next after the urgent grant fix

- [ ] Revoke `anon` execution on `has_org_role` through a narrow forward migration and verify intended roles retain access.
- [ ] Document global and organization role sources, their intended authority, and the `super_admin` distinction.
- [ ] Trace login → org selection → route guard → server function → RLS for representative read/write flows.
- [ ] Add tests for unauthenticated calls, non-admin calls, organization admin calls, and cross-organization IDs.
- [ ] Define suspension behavior and enforce it consistently after business rules are agreed.

### Phase 2 — ERP integration contract and server boundary: BLOCKED on external contract

- [ ] Inspect the deployed Admin repository or its API/auth specification and list the exact ERP operations it needs.
- [ ] Agree on token validation, allowed platform roles, origins, payloads, errors, and versioning across both repositories.
- [ ] Implement only the required platform-authorized server functions/API routes in this ERP repository; do not put service-role credentials or unrestricted cross-organization queries in the browser.
- [ ] Add authorization and cross-organization tests for each operation. Keep organization `/users` behavior separate from platform-wide operations.

### Phase 3 — Organization management capabilities: MISSING

- [ ] Provide organization search/list and detail operations through the agreed server boundary for authorized platform administrators.
- [ ] Define duplicate handling and preserve the existing DEV organization/data.
- [ ] Implement provisioning/edit/member management only after the schema and role prerequisites are resolved.
- [ ] Define activation/suspension semantics, then add audit events and cross-tenant tests. The external Admin repo owns the corresponding UI.

### Phase 4 — User and membership management: PARTIAL

- [ ] Check service-role operation results and validate target membership in each server function.
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
| Automated tests | NOT CONFIGURED | No `test` script in `package.json`; no test/spec files found under `src/`. |
| `supabase migration list --linked` | PASS | All 11 local executable migration versions match linked DEV history. CLI skipped the `.snapshot` artifact. |
| Linked DEV schema/catalog | PASS, read-only | 33 public base tables, all RLS enabled; 29 have `organization_id`; policies and helper grants inspected. |
| DEV organization data | PASS, read-only | Known organization is active; one org membership role `super_admin`; one global role `super_admin`; 12 feature rows all enabled. |
| Cross-organization behavior | NOT VERIFIED | DEV currently has one organization and one member; no two-tenant test harness. |

## Exact next task

Obtain and inspect the external Admin repository URL or its integration specification. Record the actual authentication flow, deployed origins, and required ERP operations, then define the smallest server-side contract for those operations. Do not add speculative endpoints or expose service-role access to the Admin browser. Track the anonymous `has_org_role` execution grant as a separate urgent security fix and address it with a narrow forward-only migration after verifying the exact signature and intended grants.

## Change log

- **2026-10-10:** Replaced the prior end-of-session reminder with the evidence-based Admin integration roadmap. Audited repository source and linked DEV migration/schema/catalog. Recorded role-model overlap, feature and suspension enforcement gaps, the anonymous `has_org_role` grant, and the mismatch between current DEV schema and tracked executable migrations. Ran TypeScript and production build checks. No application source or database objects were changed.
- **2026-10-10:** Clarified the repository boundary: the separate Admin repository owns the Admin UI, while this ERP repo must provide the agreed secure integration boundary and backend capabilities. Updated phases and next task to require inspection of the external contract before implementation. No application source or database objects were changed.

## Session closeout

At the end of each Codex session, update this roadmap with verified status and evidence, list changed files/migrations, report checks and results, state blockers, and name the single next task. Do not commit or push unless explicitly requested. Never modify LIVE.
