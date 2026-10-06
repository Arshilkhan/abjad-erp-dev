import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}

export function ChargeRow({
  config,
  fallbackLabel,
  value,
  onChange,
}: {
  config: {
    visible: boolean;
    mandatory: boolean;
    readOnly: boolean;
    label: string;
  };
  fallbackLabel: string;
  value: number;
  onChange: (v: number) => void;
}) {
  if (!config.visible) return null;

  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs text-muted-foreground">
        {config.label || fallbackLabel}
        {config.mandatory && " *"}
      </Label>

      <Input
        className="h-8 w-32 text-right"
        type="number"
        value={value}
        readOnly={config.readOnly}
        disabled={config.readOnly}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
