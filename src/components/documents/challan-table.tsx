import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatDate } from "@/lib/format";

export function ChallanTable({
    rows,
    isLoading,
}: {
    rows: any[];
    isLoading?: boolean;
}) {
    const [sortField, setSortField] = useState<
        "challan" | "customer" | "date" | null
    >(null);

    const [sortDirection, setSortDirection] =
        useState<"asc" | "desc">("asc");

    const handleSort = (
        field: "challan" | "customer" | "date",
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
                case "challan":
                    comparison = String(
                        a.challan_number ??
                            a.invoice_number ??
                            "",
                    ).localeCompare(
                        String(
                            b.challan_number ??
                                b.invoice_number ??
                                "",
                        ),
                        undefined,
                        { numeric: true },
                    );
                    break;

                case "customer":
                    comparison = String(
                        a.customer_name_snapshot ?? "",
                    ).localeCompare(
                        String(b.customer_name_snapshot ?? ""),
                    );
                    break;

                case "date":
                    comparison =
                        new Date(a.invoice_date).getTime() -
                        new Date(b.invoice_date).getTime();
                    break;
            }

            return sortDirection === "asc"
                ? comparison
                : -comparison;
        });
    }, [rows, sortField, sortDirection]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("challan")}
                    >
                        Challan #
                    </TableHead>

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

                    <TableHead>Status</TableHead>

                    <TableHead className="w-24 text-right">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell
                            colSpan={5}
                            className="py-8 text-center text-muted-foreground"
                        >
                            Loading…
                        </TableCell>
                    </TableRow>
                )}

                {!isLoading && rows.length === 0 && (
                    <TableRow>
                        <TableCell
                            colSpan={5}
                            className="py-10 text-center text-muted-foreground"
                        >
                            No delivery challans here yet.{" "}
                            <Link
                                to="/invoices/new"
                                search={{ kind: "delivery_challan" }}
                                className="text-primary hover:underline"
                            >
                                Create one
                            </Link>.
                        </TableCell>
                    </TableRow>
                )}

                {sortedRows.map((r: any) => (
                    <TableRow
                        key={r.id}
                        className={`hover:bg-muted/40 ${
                            r.status === "cancelled"
                                ? "opacity-60"
                                : ""
                        }`}
                    >
                        <TableCell className="font-mono text-sm font-medium">
                            <Link
                                to="/invoices/$id"
                                params={{ id: r.id }}
                                search={{
                                    kind: "delivery_challan",
                                }}
                                className="text-primary hover:underline"
                            >
                                {r.challan_number ||
                                    r.invoice_number}
                            </Link>
                        </TableCell>

                        <TableCell>
                            {r.customer_name_snapshot ?? "—"}
                        </TableCell>

                        <TableCell>
                            {formatDate(r.invoice_date)}
                        </TableCell>

                        <TableCell>
                            <Badge
                                variant="outline"
                                className="text-[10px] font-medium uppercase"
                            >
                                {r.status}
                            </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                            <Button
                                size="icon"
                                variant="ghost"
                                asChild
                                title="Edit"
                            >
                                <Link
                                    to="/invoices/$id/edit"
                                    params={{ id: r.id }}
                                    search={{
                                        kind: "delivery_challan",
                                    }}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
