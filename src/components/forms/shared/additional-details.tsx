import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalDetailsProps {
  isChallan: boolean;
  isEdit: boolean;
  showDelivery?: boolean | null;
  deliveryMode: string;
  paymentTerms: string;
  transporterName: string;
  placeOfDispatch: string;
  placeOfDelivery: string;
  notes: string;
  setDeliveryMode: (value: string) => void;
  setPaymentTerms: (value: string) => void;
  setTransporterName: (value: string) => void;
  setPlaceOfDispatch: (value: string) => void;
  setPlaceOfDelivery: (value: string) => void;
  setNotes: (value: string) => void;
}

export function AdditionalDetails({
  isChallan,
  isEdit,
  showDelivery,
  deliveryMode,
  paymentTerms,
  transporterName,
  placeOfDispatch,
  placeOfDelivery,
  notes,
  setDeliveryMode,
  setPaymentTerms,
  setTransporterName,
  setPlaceOfDispatch,
  setPlaceOfDelivery,
  setNotes,
}: AdditionalDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Additional Details</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3">
        {(showDelivery || isEdit) && (
          <div className="space-y-1">
            <Label>Delivery Mode</Label>
            <Input
              value={deliveryMode}
              onChange={(e) => setDeliveryMode(e.target.value)}
              placeholder="e.g. Road"
            />
          </div>
        )}

        {!isChallan && (
          <div className="space-y-1">
            <Label>Payment Terms</Label>
            <Input
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g. 30 Days"
            />
          </div>
        )}

        {isChallan && (
          <>
            <div className="space-y-1">
              <Label>Transporter Name</Label>
              <Input
                value={transporterName}
                onChange={(e) => setTransporterName(e.target.value)}
                placeholder="Transporter name"
              />
            </div>

            <div className="space-y-1">
              <Label>Place of Dispatch</Label>
              <Input
                value={placeOfDispatch}
                onChange={(e) => setPlaceOfDispatch(e.target.value)}
                placeholder="Place of dispatch"
              />
            </div>

            <div className="space-y-1">
              <Label>Place of Delivery</Label>
              <Input
                value={placeOfDelivery}
                onChange={(e) => setPlaceOfDelivery(e.target.value)}
                placeholder="Place of delivery"
              />
            </div>
          </>
        )}

        <div className="col-span-2 space-y-1">
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}