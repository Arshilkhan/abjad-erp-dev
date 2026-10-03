# Remove unused document fields

## Scope
- Remove the listed columns from each document table and its generated database types.
- Stop reading, writing, calculating, displaying, importing, emailing, or exporting those fields for the affected document type.
- Keep fields that still belong to other document types; shared screens and PDF code will branch by document type.

## Document changes
- **Delivery challan:** remove PO/date, tax and all monetary summary fields from `challan`; remove pricing, discount, tax, totals, rejection, and acceptance fields from `challan_items`. Keep goods identity, quantity, UOM, serial/batch, movement, consignee, and transport details.
- **Tax invoice:** remove PO/date, challan references/dates, GST ARN, place of supply, and challan transport/movement fields from `invoices`. Preserve invoice pricing, tax, payment, and import data.
- **Proforma and quotation:** remove PO/date, challan references/dates, GST ARN, place of supply, import markers, and challan transport/movement fields from their tables. Preserve their financial fields and line-item pricing.
- **Purchase order:** remove document-level discount, freight, and packing-charge columns and references. Preserve current line-item pricing and tax calculations.

## Application updates
- Make the shared create/edit form build type-specific save payloads so it never sends removed columns.
- Remove obsolete hydration/import mappings and type-specific fields from saved-document views and PDFs.
- Keep the dedicated delivery challan PDF goods-only; calculate quantity directly from `quantity` after removing rejection/acceptance fields.
- Update duplication, backup generation, reports, and other shared readers so no removed column is referenced.

## Database migration
- Apply one schema migration that drops only the explicitly listed columns and repairs dependent functions/triggers first where required.
- Regenerate database types automatically after migration.
- Provide the exact SQL used so the same change can be applied to the separately managed live database.

## Validation
- Run focused type checks/tests and inspect the latest build status.
- Verify creation and PDF generation for tax invoice, proforma, quotation, challan, and purchase order, including a mobile-safe form check.
