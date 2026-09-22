# Finish invoice view persistence and discount wiring

## Changes
- Preserve the manually completed Settings cleanup and flat/% discount control.
- Complete any remaining load, import, calculation, and save mappings for both discount modes.
- Remember the Invoices panel view choice locally so returning to the panel restores it.

## Verification
- Confirm flat and percentage discounts calculate and save correctly.
- Confirm the selected invoice view survives navigation away and back.
- Confirm the removed Settings options remain absent.
