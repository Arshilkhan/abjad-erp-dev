import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { NewPODialog } from "./purchases.index";

export const Route = createFileRoute("/_authenticated/purchases/new")({
  head: () => ({
    meta: [
      { title: "New Purchase Order — ABJAD ERP" },
      { name: "description", content: "Create a new vendor purchase order." },
      { property: "og:title", content: "New Purchase Order — ABJAD ERP" },
      { property: "og:description", content: "Create a new vendor purchase order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewPurchaseOrderPage,
});

function NewPurchaseOrderPage() {
  const navigate = useNavigate({ from: "/purchases/new" });
  const queryClient = useQueryClient();

  const returnToPurchases = () => navigate({ to: "/purchases" });
  const handleSaved = async () => {
    await queryClient.invalidateQueries({ queryKey: ["purchase_orders"] });
    await returnToPurchases();
  };

  return (
    <NewPODialog
      open
      onClose={returnToPurchases}
      onSaved={handleSaved}
    />
  );
}