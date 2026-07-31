import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

export interface TypeaheadOption {
  id: string;
  label: string;
  sublabel?: string;
}

/**
 * Text input with suggestions. Free-form typing allowed.
 * Calls onSelect when a suggestion is picked, onChange for raw text.
 * If user leaves the field with text that doesn't match any option,
 * onMissing(text) is invoked (used to prompt "add new").
 */
export function TypeaheadInput({
  value,
  onChange,
  onSelect,
  onMissing,
  options,
  placeholder,
  className,
  inputClassName,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (opt: TypeaheadOption) => void;
  onMissing?: (text: string) => void;
  options: TypeaheadOption[];
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options.slice(0, 8);
    return options
      .filter((o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sublabel ?? "").toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [value, options]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (opt: TypeaheadOption) => {
    onSelect(opt);
    onChange(opt.label);
    setOpen(false);
  };

  const handleBlur = () => {
    // small delay so click on suggestion registers first
    setTimeout(() => {
      const t = value.trim();
      if (!t) return;
      const match = options.find((o) => o.label.toLowerCase() === t.toLowerCase());
      if (!match && onMissing) onMissing(t);
    }, 150);
  };

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <Input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClassName}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlight(0); }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, filtered.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
          else if (e.key === "Enter" && filtered[highlight]) { e.preventDefault(); pick(filtered[highlight]); }
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {filtered.map((o, i) => (
            <li
              key={o.id}
              onMouseDown={(e) => { e.preventDefault(); pick(o); }}
              onMouseEnter={() => setHighlight(i)}
              className={`cursor-pointer px-3 py-1.5 text-sm ${i === highlight ? "bg-accent text-accent-foreground" : ""}`}
            >
              <div className="font-medium">{o.label}</div>
              {o.sublabel && <div className="text-xs text-muted-foreground">{o.sublabel}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}