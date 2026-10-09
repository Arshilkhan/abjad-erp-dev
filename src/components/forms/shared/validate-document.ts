interface ValidateDocumentArgs {
  customerCompany: string;
  customerGst: string;
  mandatoryGstNumber?: boolean | null;
  isChallan: boolean;
  mandatoryChallanNumber?: boolean | null;
  challanNumber: string;
  showPaymentTerms: boolean;
  isTaxInvoice: boolean;
  itemsCount: number;
  cfg: (key: string) => {
    visible: boolean;
    mandatory: boolean;
    label?: string;
  };
  freight: number;
  packing: number;
  otherCharges: number;
  transportCharges: number;
  deliveryCharges: number;
}

export function validateDocument({
  customerCompany,
  customerGst,
  mandatoryGstNumber,
  isChallan,
  mandatoryChallanNumber,
  challanNumber,
  showPaymentTerms,
  isTaxInvoice,
  itemsCount,
  cfg,
  freight,
  packing,
  otherCharges,
  transportCharges,
  deliveryCharges,
}: ValidateDocumentArgs): void {
  if (!customerCompany.trim()) {
    throw new Error("Please enter a company name");
  }

  if (mandatoryGstNumber && !customerGst.trim()) {
    throw new Error("Customer GST Number is mandatory");
  }

  if (isChallan && mandatoryChallanNumber && !challanNumber) {
    throw new Error("Challan Number is mandatory");
  }

  const requireCharge = (key: string, value: number) => {
    const charge = cfg(key);

    if (charge.visible && charge.mandatory && !Number(value)) {
      throw new Error(`${charge.label || key} is mandatory`);
    }
  };

  if (showPaymentTerms) {
    requireCharge("freight_charges", freight);
    requireCharge("packing_charges", packing);
    requireCharge("other_charges", otherCharges);

    if (isTaxInvoice) {
      requireCharge("transportation_charges", transportCharges);
      requireCharge("delivery_charges", deliveryCharges);
    }
  }

  if (itemsCount === 0) {
    throw new Error("Add at least one item");
  }
}
