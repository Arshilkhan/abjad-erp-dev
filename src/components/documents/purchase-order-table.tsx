import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatINR, formatDate } from "@/lib/format";

export function PurchaseOrderTable({
    rows,
    isLoading,
    onRowClick,
}: {
    rows: any[];
    isLoading?: boolean;
    onRowClick?: (row: any) => void;
}) {
    const [sortField, setSortField] = useState<
        "po" | "vendor" | "date" | "total" | "expected" | null
    >(null);

    const [sortDirection, setSortDirection] =
        useState<"asc" | "desc">("asc");

    const handleSort = (
        field: "po" | "vendor" | "date" | "total" | "expected",
    ) => {
        if (sortField === field) {
            setSortDirection((prev) =>
                prev === "asc" ? "desc" : "asc",
            );
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedRows = useMemo(() => {
        if (!sortField) return rows;

        return [...rows].sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "po":
                    comparison = String(a.po_number ?? "").localeCompare(
                        String(b.po_number ?? ""),
                        undefined,
                        { numeric: true },
                    );
                    break;

                case "vendor":
                    comparison = String(
                        a.vendor_name_snapshot ?? "",
                    ).localeCompare(
                        String(b.vendor_name_snapshot ?? ""),
                    );
                    break;

                case "date":
                    comparison =
                        new Date(a.po_date).getTime() -
                        new Date(b.po_date).getTime();
                    break;

                case "total":
                    comparison =
                        Number(a.grand_total ?? 0) -
                        Number(b.grand_total ?? 0);
                    break;

                case "expected":
                    comparison =
                        new Date(a.expected_date ?? 0).getTime() -
                        new Date(b.expected_date ?? 0).getTime();
                    break;
            }

            return sortDirection === "asc"
                ? comparison
                : -comparison;
        });
    }, [rows, sortField, sortDirection]);

    const statusColor: Record<string, string> = {
        draft: "bg-muted text-muted-foreground",
        sent: "bg-secondary text-secondary-foreground",
        received:
            "bg-[color:oklch(0.92_0.06_155)] text-[color:oklch(0.35_0.14_155)]",
        cancelled: "bg-destructive/10 text-destructive",
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("po")}
                    >
                        PO #
                    </TableHead>

                    <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("date")}
                    >
                        Date
                    </TableHead>

                    <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("vendor")}
                    >
                        Vendor
                    </TableHead>

                    <TableHead
                        className="cursor-pointer select-none text-right"
                        onClick={() => handleSort("total")}
                    >
                        Total
                    </TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("expected")}
                    >
                        Expected
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell
                            colSpan={6}
                            className="py-8 text-center text-muted-foreground"
                        >
                            Loading…
                        </TableCell>
                    </TableRow>
                )}

                {!isLoading && rows.length === 0 && (
                    <TableRow>
                        <TableCell
                            colSpan={6}
                            className="py-10 text-center text-muted-foreground"
                        >
                            No purchase orders yet.
                        </TableCell>
                    </TableRow>
                )}

                {sortedRows.map((r: any) => (
                    <TableRow
                        key={r.id}
                        className={
                            onRowClick
                                ? "cursor-pointer hover:bg-muted/40"
                                : "hover:bg-muted/40"
                        }
                        onClick={() => onRowClick?.(r)}
                    >
                        <TableCell className="font-mono text-sm font-medium">
                            {r.po_number ?? "—"}
                        </TableCell>

                        <TableCell>
                            {formatDate(r.po_date)}
                        </TableCell>

                        <TableCell>
                            {r.vendor_name_snapshot ?? "—"}
                        </TableCell>

                        <TableCell className="text-right tabular-nums font-semibold">
                            {formatINR(r.grand_total)}
                        </TableCell>

                        <TableCell>
                            <Badge
                                variant="outline"
                                className={`text-[10px] uppercase ${statusColor[r.status] ?? ""}`}
                            >
                                {r.status ?? "—"}
                            </Badge>
                        </TableCell>

                        <TableCell>
                            {r.expected_date
                                ? formatDate(r.expected_date)
                                : "—"}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
