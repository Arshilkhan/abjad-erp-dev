import { Link } from "@tanstack/react-router";
import { isSalesDocumentKind, type SalesDocumentKind } from "@/lib/sales-documents";

const docKind = (r: any): SalesDocumentKind => {
  const t = String(r?.invoice_type ?? "");
  return isSalesDocumentKind(t) ? t : "tax_invoice";
};
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR, formatDate, billNo } from "@/lib/format";
import { Pencil, Ban } from "lucide-react";
import { CancelInvoiceDialog } from "@/components/cancel-invoice-dialog";

export const statusStyles: Record<string, string> = {
    paid: "bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)] border-transparent",
    sent: "bg-secondary text-secondary-foreground",
    partial: "bg-[color:oklch(0.94_0.09_75)] text-[color:oklch(0.40_0.15_75)] border-transparent",
    draft: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive border-transparent",
};

export const typeStyles: Record<string, { label: string; className: string }> = {
    tax_invoice: { label: "Tax Invoice", className: "bg-[color:oklch(0.93_0.05_255)] text-[color:oklch(0.40_0.14_255)] border-transparent" },
    proforma: { label: "Proforma", className: "bg-[color:oklch(0.94_0.06_300)] text-[color:oklch(0.40_0.14_300)] border-transparent" },
    quotation: { label: "Quotation", className: "bg-[color:oklch(0.94_0.07_75)] text-[color:oklch(0.40_0.15_75)] border-transparent" },
    purchase_order: { label: "Purchase Order", className: "bg-[color:oklch(0.93_0.05_210)] text-[color:oklch(0.38_0.13_210)] border-transparent" },
    delivery_challan: { label: "Delivery Challan", className: "bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)] border-transparent" },
    credit_note: { label: "Credit Note", className: "bg-[color:oklch(0.93_0.06_25)] text-[color:oklch(0.42_0.15_25)] border-transparent" },
    debit_note: { label: "Debit Note", className: "bg-[color:oklch(0.93_0.05_35)] text-[color:oklch(0.42_0.14_35)] border-transparent" },
};

export function InvoiceTypeBadge({ type }: { type: string }) {
    const t = typeStyles[type];
    return (
        <Badge variant="outline" className={`text-[10px] font-semibold uppercase tracking-wide ${t?.className ?? ""}`}>
            {t?.label ?? String(type).replace(/_/g, " ")}
        </Badge>
    );
}


export function InvoiceTable({ rows, isLoading }: { rows: any[]; isLoading?: boolean }) {
    const qc = useQueryClient();
    const [sortField, setSortField] = useState<"invoice" | "customer" | "date" | "total" | null>(() => {
        const saved = localStorage.getItem("abjad-erp-invoice-sort-field");
        return saved === "invoice" ||
            saved === "customer" ||
            saved === "date" ||
            saved === "total"
            ? saved
            : null;
    });

const [sortDirection, setSortDirection] = useState<"asc" | "desc">(() => {
  const saved = localStorage.getItem("abjad-erp-invoice-sort-direction");
  return saved === "desc" ? "desc" : "asc";
});

const handleSort = (field: "invoice" | "customer" | "date" | "total") => {
    if (sortField === field) {
        const nextDirection = sortDirection === "asc" ? "desc" : "asc";
        setSortDirection(nextDirection);
        localStorage.setItem("abjad-erp-invoice-sort-direction", nextDirection);
    } else {
        setSortField(field);
        setSortDirection("asc");
        localStorage.setItem("abjad-erp-invoice-sort-field", field);
        localStorage.setItem("abjad-erp-invoice-sort-direction", "asc");
    }
};

    const sortedRows = useMemo(() => {
        if (!sortField) return rows;

        return [...rows].sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "invoice":
                    comparison = String(a.invoice_number ?? "").localeCompare(
                        String(b.invoice_number ?? ""),
                        undefined,
                        { numeric: true, sensitivity: "base" },
                    );
                    break;

                case "customer":
                    comparison = String(a.customer_name_snapshot ?? "").localeCompare(
                        String(b.customer_name_snapshot ?? ""),
                        undefined,
                        { sensitivity: "base" },
                    );
                    break;

                case "date":
                    comparison =
                        new Date(a.invoice_date).getTime() -
                        new Date(b.invoice_date).getTime();
                    break;

                case "total":
                    comparison = Number(a.grand_total ?? 0) - Number(b.grand_total ?? 0);
                    break;
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [rows, sortField, sortDirection]);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("invoice")}
                    >
                        Invoice #
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("customer")}
                    >
                        Customer
                    </TableHead>
                    <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("date")}
                    >
                        Date
                    </TableHead>
                    <TableHead
                        className="cursor-pointer select-none text-right"
                        onClick={() => handleSort("total")}
                    >
                        Total
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
                {!isLoading && rows.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                        No documents here yet. <Link to="/invoices/new" className="text-primary hover:underline">Create one</Link>.
                    </TableCell></TableRow>
                )}
                {sortedRows.map((r: any) => (
                    <TableRow key={r.id} className={`hover:bg-muted/40 ${r.status === "cancelled" ? "opacity-60" : ""}`}>
                        <TableCell className="font-mono text-sm font-medium">
                            <Link to="/invoices/$id" params={{ id: r.id }} search={{ kind: docKind(r) }} className="text-primary hover:underline">
                                {billNo(r.invoice_number) || (r.challan_number ? `CH ${r.challan_number}` : "—")}
                            </Link>
                            {r.is_imported && <Badge variant="outline" className="ml-2 text-[9px] uppercase">Imported</Badge>}
                        </TableCell>
                        <TableCell><InvoiceTypeBadge type={String(r.invoice_type)} /></TableCell>
                        <TableCell>{r.customer_name_snapshot ?? "—"}</TableCell>
                        <TableCell>{formatDate(r.invoice_date)}</TableCell>
                        <TableCell className="text-right tabular-nums font-semibold">{formatINR(r.grand_total)}</TableCell>
                        <TableCell><Badge variant="outline" className={`text-[10px] font-medium uppercase ${statusStyles[r.status] ?? ""}`}>{r.status}</Badge></TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                                {r.status !== "cancelled" && (
                                    <>
                                        <Button size="icon" variant="ghost" asChild title="Edit">
                                            <Link to="/invoices/$id/edit" params={{ id: r.id }} search={{ kind: docKind(r) }}><Pencil className="h-3.5 w-3.5" /></Link>
                                        </Button>
                                        <CancelInvoiceDialog
                                            invoiceId={r.id}
                                            invoiceNumber={r.invoice_number}
                                            onCancelled={() => qc.invalidateQueries({ queryKey: ["invoices"] })}
                                            trigger={<Button size="icon" variant="ghost" title="Cancel invoice"><Ban className="h-3.5 w-3.5 text-destructive" /></Button>}
                                        />
                                    </>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
