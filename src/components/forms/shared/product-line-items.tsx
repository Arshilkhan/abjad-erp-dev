import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypeaheadInput } from "@/components/typeahead-input";
import { formatINR } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";

import { computeItem, type LineItem } from "./types";

interface ProductOption {
  id: string;
  product_name: string;
  product_code?: string | null;
  hsn_code?: string | null;
}

interface ProductLineItemsProps {
  items: LineItem[];
  productTexts: string[];
  products: ProductOption[];
  isChallan: boolean;
  setItem: (idx: number, patch: Partial<LineItem>) => void;
  setProductText: (idx: number, value: string) => void;
  applyProduct: (idx: number, productId: string) => void;
  removeItem: (idx: number) => void;
  addItem: () => void;
}

export function ProductLineItems({
  items,
  productTexts,
  products,
  isChallan,
  setItem,
  setProductText,
  applyProduct,
  removeItem,
  addItem,
}: ProductLineItemsProps) {
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          {isChallan ? "Goods Being Moved" : "Line Items"}
        </CardTitle>

        <Button type="button" size="sm" variant="outline" onClick={addItem}>
          <Plus className="mr-1 h-4 w-4" />
          Add Row
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-10 p-2 text-left">#</th>
                <th className="w-48 p-2 text-left">Product</th>
                <th className="w-24 p-2 text-left">HSN</th>
                <th className="p-2 text-left">Description</th>
                <th className="w-20 p-2 text-right">Qty</th>
                <th className="w-16 p-2 text-left">UOM</th>

                {isChallan ? (
                  <th className="w-40 p-2 text-left">
                    Serial / Batch No.
                  </th>
                ) : (
                  <>
                    <th className="w-24 p-2 text-right">Rate</th>
                    <th className="w-40 p-2 text-right">Discount</th>
                    <th className="w-16 p-2 text-right">Tax%</th>
                    <th className="w-28 p-2 text-right">Total</th>
                  </>
                )}

                <th className="w-8"></th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, idx) => {
                const c = computeItem(it);

                return (
                  <tr key={idx} className="border-t">
                    <td className="p-1 text-center text-muted-foreground">
                      {it.sr_no}
                    </td>

                    <td className="p-1">
                      <TypeaheadInput
                        value={productTexts[idx] ?? ""}
                        onChange={(value) => {
                          setProductText(idx, value);

                          if (it.product_id) {
                            setItem(idx, { product_id: null });
                          }
                        }}
                        options={products.map((p) => ({
                          id: p.id,
                          label: p.product_name,
                          sublabel: `${p.product_code ?? ""}${
                            p.hsn_code ? ` • HSN ${p.hsn_code}` : ""
                          }`,
                        }))}
                        onSelect={(option) => applyProduct(idx, option.id)}
                        placeholder="Type product…"
                        inputClassName="h-8"
                      />
                    </td>

                    <td className="p-1">
                      <Input
                        className="h-8 font-mono text-xs"
                        value={it.hsn_code}
                        onChange={(e) =>
                          setItem(idx, {
                            hsn_code: e.target.value,
                          })
                        }
                      />
                    </td>

                    <td className="p-1">
                      <Input
                        className="h-8"
                        value={it.description}
                        onChange={(e) =>
                          setItem(idx, {
                            description: e.target.value,
                          })
                        }
                      />
                    </td>

                    <td className="p-1">
                      <Input
                        className="h-8 text-right tabular-nums"
                        type="number"
                        value={it.quantity}
                        onChange={(e) =>
                          setItem(idx, {
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </td>

                    <td className="p-1">
                      <Input
                        className="h-8"
                        value={it.uom}
                        onChange={(e) =>
                          setItem(idx, {
                            uom: e.target.value,
                          })
                        }
                      />
                    </td>

                    {isChallan ? (
                      <td className="p-1">
                        <Input
                          className="h-8"
                          value={it.serial_batch_number}
                          onChange={(e) =>
                            setItem(idx, {
                              serial_batch_number: e.target.value,
                            })
                          }
                          placeholder="Serial / Batch"
                        />
                      </td>
                    ) : (
                      <>
                        <td className="p-1">
                          <Input
                            className="h-8 text-right tabular-nums"
                            type="number"
                            value={it.unit_rate}
                            onChange={(e) =>
                              setItem(idx, {
                                unit_rate: Number(e.target.value),
                              })
                            }
                          />
                        </td>

                        <td className="p-1">
                          <div className="flex min-w-36 gap-1">
                            <Input
                              className="h-8 min-w-0 text-right tabular-nums"
                              type="number"
                              min={0}
                              max={
                                it.discount_mode === "pct"
                                  ? 100
                                  : undefined
                              }
                              step="0.01"
                              value={it.discount_value}
                              aria-label={`Discount value for item ${it.sr_no}`}
                              onChange={(e) =>
                                setItem(idx, {
                                  discount_value: Number(e.target.value),
                                })
                              }
                            />

                            <Select
                              value={it.discount_mode}
                              onValueChange={(value) =>
                                setItem(idx, {
                                  discount_mode:
                                    value === "flat" ? "flat" : "pct",
                                })
                              }
                            >
                              <SelectTrigger
                                className="h-8 w-20 px-2"
                                aria-label={`Discount type for item ${it.sr_no}`}
                              >
                                <SelectValue />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="pct">%</SelectItem>
                                <SelectItem value="flat">Flat</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>

                        <td className="p-1">
                          <Input
                            className="h-8 text-right tabular-nums"
                            type="number"
                            value={it.tax_pct}
                            onChange={(e) =>
                              setItem(idx, {
                                tax_pct: Number(e.target.value),
                              })
                            }
                          />
                        </td>

                        <td className="p-2 text-right tabular-nums font-medium">
                          {formatINR(c.total_amount)}
                        </td>
                      </>
                    )}

                    <td className="p-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(idx)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="space-y-3 p-3 md:hidden">
          {items.map((it, idx) => {
            const c = computeItem(it);

            return (
              <div
                key={idx}
                className="rounded-lg border bg-background p-3 shadow-sm"
              >
                {/* Card header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {it.sr_no}
                    </span>
                    <span className="text-sm font-medium">
                      {isChallan ? "Item" : "Line Item"} {it.sr_no}
                    </span>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(idx)}
                    disabled={items.length === 1}
                    aria-label={`Remove item ${it.sr_no}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Product */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Product
                    </label>

                    <TypeaheadInput
                      value={productTexts[idx] ?? ""}
                      onChange={(value) => {
                        setProductText(idx, value);

                        if (it.product_id) {
                          setItem(idx, { product_id: null });
                        }
                      }}
                      options={products.map((p) => ({
                        id: p.id,
                        label: p.product_name,
                        sublabel: `${p.product_code ?? ""}${
                          p.hsn_code ? ` • HSN ${p.hsn_code}` : ""
                        }`,
                      }))}
                      onSelect={(option) => applyProduct(idx, option.id)}
                      placeholder="Type product…"
                      inputClassName="h-9"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Description
                    </label>

                    <Input
                      className="h-9"
                      value={it.description}
                      onChange={(e) =>
                        setItem(idx, {
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* HSN / UOM */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        HSN
                      </label>

                      <Input
                        className="h-9 font-mono text-xs"
                        value={it.hsn_code}
                        onChange={(e) =>
                          setItem(idx, {
                            hsn_code: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        UOM
                      </label>

                      <Input
                        className="h-9"
                        value={it.uom}
                        onChange={(e) =>
                          setItem(idx, {
                            uom: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Quantity
                    </label>

                    <Input
                      className="h-9 tabular-nums"
                      type="number"
                      value={it.quantity}
                      onChange={(e) =>
                        setItem(idx, {
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  {isChallan ? (
                    /* Serial / Batch */
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Serial / Batch No.
                      </label>

                      <Input
                        className="h-9"
                        value={it.serial_batch_number}
                        onChange={(e) =>
                          setItem(idx, {
                            serial_batch_number: e.target.value,
                          })
                        }
                        placeholder="Serial / Batch"
                      />
                    </div>
                  ) : (
                    <>
                      {/* Rate */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Rate
                        </label>

                        <Input
                          className="h-9 tabular-nums"
                          type="number"
                          value={it.unit_rate}
                          onChange={(e) =>
                            setItem(idx, {
                              unit_rate: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      {/* Discount */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Discount
                        </label>

                        <div className="flex gap-2">
                          <Input
                            className="h-9 min-w-0 flex-1 tabular-nums"
                            type="number"
                            min={0}
                            max={
                              it.discount_mode === "pct" ? 100 : undefined
                            }
                            step="0.01"
                            value={it.discount_value}
                            aria-label={`Discount value for item ${it.sr_no}`}
                            onChange={(e) =>
                              setItem(idx, {
                                discount_value: Number(e.target.value),
                              })
                            }
                          />

                          <Select
                            value={it.discount_mode}
                            onValueChange={(value) =>
                              setItem(idx, {
                                discount_mode:
                                  value === "flat" ? "flat" : "pct",
                              })
                            }
                          >
                            <SelectTrigger
                              className="h-9 w-24 shrink-0"
                              aria-label={`Discount type for item ${it.sr_no}`}
                            >
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="pct">%</SelectItem>
                              <SelectItem value="flat">Flat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Tax */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Tax %
                        </label>

                        <Input
                          className="h-9 tabular-nums"
                          type="number"
                          value={it.tax_pct}
                          onChange={(e) =>
                            setItem(idx, {
                              tax_pct: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">
                          Total
                        </span>
                        <span className="text-sm font-semibold tabular-nums">
                          {formatINR(c.total_amount)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}