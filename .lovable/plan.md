# Move invoice import into the new invoice form

## Changes
- Remove “Import Invoice” from the sidebar and access-panel list.
- Add an “Import Invoice” action at the top of the Invoice Details section when creating a new invoice.
- Reuse the existing PDF picker and extraction logic to fill the same invoice form.
- Mark the saved invoice as imported only when a PDF was successfully selected for import.
- Keep editing, normal invoice creation, and the existing import URL working for compatibility.

## Verification
- Confirm the sidebar no longer shows Import Invoice.
- Confirm the new-invoice form can select a PDF and populate extracted details.
- Confirm normal manually created invoices are not marked as imported.
