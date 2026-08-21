export const PANELS = [
  { key: "dashboard", label: "Dashboard", url: "/dashboard" },
  { key: "invoices", label: "Invoices", url: "/invoices" },
  { key: "cancelled-invoices", label: "Cancelled Invoices", url: "/cancelled-invoices" },
  { key: "invoice-import", label: "Import Invoice", url: "/invoices/import" },
  { key: "quotations", label: "Quotations", url: "/quotations" },
  { key: "customers", label: "Customers", url: "/customers" },
  { key: "products", label: "Products", url: "/products" },
  { key: "inventory", label: "Inventory", url: "/inventory" },
  { key: "rejected-items", label: "Rejected Items", url: "/rejected-items" },
  { key: "customer-credits", label: "Customer Credits", url: "/customer-credits" },
  { key: "purchases", label: "Purchases", url: "/purchases" },
  { key: "payments", label: "Payments", url: "/payments" },
  { key: "reports", label: "Reports", url: "/reports" },
  { key: "settings", label: "Settings", url: "/settings" },
] as const;

export type PanelKey = (typeof PANELS)[number]["key"];

export const ADMIN_ROLES = ["super_admin", "admin"];
