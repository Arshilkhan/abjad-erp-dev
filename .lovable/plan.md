# Four distinct business-document workflows

## Goal
Turn the existing shared document engine into four clearly distinct workflows—Quotation, Proforma Invoice, Tax Invoice, and Delivery Challan—while preserving authentication, customer/product lookup, calculations, imports, and current database connectivity.

## What will change

### 1. Type-aware creation and editing
- Keep one maintainable form, but drive its labels, required fields, visible sections, totals, and save wording from the selected document type.
- Show the common customer details and keep existing-customer autofill/new-customer creation.
- Add Bill To and optional Ship To/Delivery Address behavior where applicable.
- Add only the relevant fields for each type:
  - **Quotation:** quotation date, validity, customer/enquiry reference, salesperson, expected delivery, delivery mode, payment terms, terms.
  - **Proforma Invoice:** proforma date, reference, optional work order, expected delivery, payment terms, validity, terms, and a clear “Not a Tax Invoice” status.
  - **Tax Invoice:** invoice date, place of supply, optional shipping address, PO/date, work order, challan references, payment terms, due date, and delivery mode.
  - **Delivery Challan:** challan date, consignee/delivery address, PO/reference, optional invoice reference, reason for movement, and transport details; remove payment-focused fields.
- Keep all line items editable. Use stacked item editors on mobile and the existing table-style workflow on desktop.

### 2. Separate panels and navigation
- Keep Quotations and Delivery Challans in their existing panels.
- Add a dedicated Proforma Invoices panel.
- Restrict the Invoices panel to Tax Invoices only.
- Add type-aware create actions and headings while retaining shared detail/edit routes and browser-history Back behavior.

### 3. Type-specific preview and PDF
- Refactor the printable screen and downloadable/email PDF to use the same document-type configuration.
- Use the correct document-number label, date label, customer terminology, sections, totals, and empty-field suppression for each type.
- Quotation becomes an offer with validity and quotation terms.
- Proforma clearly states “PROFORMA INVOICE – NOT A TAX INVOICE” and excludes tax-invoice declarations.
- Tax Invoice uses “Invoice Number,” GST-specific Bill To/Ship To and place-of-supply details, and only the applicable CGST/SGST or IGST rows.
- Delivery Challan emphasizes goods movement, transport details, and receiver acknowledgement; it omits bank/payment-request presentation.
- Preserve DD-MM-YYYY formatting, company branding, configured website, PDF attachments, and existing tax calculations.

### 4. Document-specific Save & Send
- Before sending, show the saved customer email in an editable confirmation step.
- Block sending with a clear message when no recipient is entered.
- Generate and attach the correct PDF, with document-specific subject and message text.
- Keep existing send history/status behavior and rate limiting; do not require manual PDF download.

### 5. Simple independent numbering
- Display whole numbers only for finalized/sent documents, with an independent sequence for each type.
- Drafts receive an internal temporary identifier and do not consume a final number.
- Final numbers remain fixed; cancelled numbers are never reused.
- Existing records remain accessible and are not renumbered automatically.

## Database change required
The current external schema has one globally unique `invoice_number`, so it cannot safely store Quotation 25 and Tax Invoice 25 simultaneously. It also lacks several requested document-specific fields.

I will add a separate, idempotent SQL file for you to run manually against the external database. It will:
- add the minimal document fields to `invoices` and serial/batch information to `invoice_items`;
- replace global number uniqueness with uniqueness per document type;
- add a small locked counter table and trigger/function for concurrency-safe final numbering;
- include explicit grants and RLS;
- preserve existing data and avoid automatically executing any SQL.

The app changes will handle the transition safely, but independent final numbering becomes active only after you run that SQL.

## Technical approach
- Introduce a typed document-definition module for labels, visible fields, table columns, totals, PDF sections, panel destination, and email terminology.
- Split large form/PDF regions into focused shared components instead of duplicating four complete implementations.
- Reuse the current `invoices`, `invoice_items`, `customers`, and email infrastructure.
- Do not change the current tax formulas, customer/product creation rules, authentication, or external database connection.

## Verification
- Validate create, draft, finalize/send, edit, open, download, email, cancel, and panel visibility for all four types.
- Verify customer autofill/new-customer behavior and intrastate versus interstate taxes.
- Verify mobile stacked line items and desktop layout at representative viewport sizes.
- Verify PDF titles, terminology, sections, dates, numbering, recipient confirmation, and attached files.
- Run type checking, formatting checks, and browser checks without applying the external-database SQL automatically.
