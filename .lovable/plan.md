# Header creation shortcuts

## Changes
- Replace the single “New Invoice” header action with a compact create menu containing New Proforma, New Quotation, New Challan, and New PO.
- Link Proforma, Quotation, and Challan directly to their dedicated creation pages.
- Give Purchase Orders a dedicated `/purchases/new` page that opens the existing PO form, then returns to Purchases after save or cancel.
- Remove the duplicate Proforma, Quotation, Challan, and PO creation buttons from their panel bodies while preserving empty-state creation links.
- Show each shortcut only when the signed-in user can access its corresponding panel.

## Validation
- Check all four header actions navigate to the intended form.
- Confirm the PO form can save or cancel from its dedicated page.
- Verify desktop and mobile header layouts and ensure the app builds cleanly.