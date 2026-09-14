# Document creation overhaul

- [x] Make the shared creation form context-aware for quotation, proforma invoice, tax invoice, and delivery challan.
- [ ] Improve fully editable mobile line items without changing desktop behavior.
- [x] Add separate proforma panel and keep each document type visible only in its own panel.
- [x] Implement type-specific previews, PDFs, terminology, totals, footers, and receiver acknowledgement.
- [x] Make Save & Send messaging and attachments document-specific with recipient validation.
- [ ] Implement independent simple numbering after the user applies the separate external-database SQL (`external-database-document-upgrade.sql`).
- [ ] Verify all four document flows, calculations, customer autofill, mobile/desktop, auth, and existing routes.
