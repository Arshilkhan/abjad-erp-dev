# Split document types into dedicated tables and flows

## Confirmed decisions
- Keep tax invoices in `invoices` and `invoice_items`.
- Create `quotation` / `quotation_items`, `challan` / `challan_items`, and `performa` / `performa_items`.
- Keep the already-working `purchase_orders` / `purchase_order_items` tables rather than creating duplicate `purchase` tables.
- Use separate creation flows for Tax Invoice, Proforma Invoice, Quotation, Delivery Challan, and Purchase Order.
- Do not migrate old invoice-family records because `invoices` and `invoice_items` currently contain no records.

## Database changes
- Add the six new tables with document-appropriate columns, explicit authenticated/service-role grants, row-level access rules, indexes, updated-time triggers, and item-total/header-total triggers.
- Reuse the existing customer, product, company profile, role, and permission data.
- Keep tax-invoice payment, rejection, credit, and history relationships attached only to `invoices` / `invoice_items`.
- Restrict `invoices` to `invoice_type = 'tax_invoice'` and retain the column for compatibility; restrict new tables to their own document purpose by construction.
- Preserve `purchase_orders` / `purchase_order_items` and their existing vendor-based workflow.
- Apply the schema additively to Lovable Cloud and provide one complete, ordered SQL script for the separate live database.

## Application changes
- Replace the shared type-switching creation experience with dedicated create pages and panel actions:
  - Tax Invoice → `invoices` / `invoice_items`
  - Proforma Invoice → `performa` / `performa_items`
  - Quotation → `quotation` / `quotation_items`
  - Delivery Challan → `challan` / `challan_items`
  - Purchase Order → existing `purchase_orders` / `purchase_order_items`
- Keep shared form building blocks where practical, but make each save/load/edit path explicitly select its table pair.
- Make list, folder, detail, edit, duplicate, cancel, search, dashboard, and report reads use the correct table.
- Add a dedicated Proforma panel; keep Quotation, Challan, Invoice, and Purchase panels isolated from one another.
- Make document URLs carry the document kind so identical UUIDs across tables cannot be opened from the wrong source.

## PDFs, email, and backup
- Fetch each document and its items from its own table before generating or emailing a PDF.
- Keep the existing tax/proforma/quotation PDF renderer, the goods-only challan renderer, and the purchase-order renderer.
- Update Google Drive backup and CSV export to include every new table and generate PDFs into separate document folders.
- Keep payments, rejections, customer credits, and invoice history as tax-invoice-only features unless a later request explicitly extends them.

## Validation
- Refresh generated database types after the migration.
- Verify creation, editing, viewing, downloading, emailing, listing, searching, and backup retrieval for every document type.
- Confirm documents appear only in their own panel and tax invoices still support payments, rejections, credits, and history.
- Run the project checks and test the primary flows in desktop and mobile previews.

## Delivery
- Provide the exact ordered SQL needed for the user-owned live database after the project implementation is complete.
- Do not remove the old purchase-order tables or alter unrelated ERP, authentication, email, or backup scheduling behavior.
