"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { filterAirports, type AirportOption } from "@/lib/airports";
import { cn, normalizeIata } from "@/lib/utils";

type AirportComboboxProps = {
  id: string;
  value: string;
  onChange: (iata: string) => void;
  /** Fires on every keystroke (before blur commit). */
  onDraftChange?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
};

export function AirportCombobox({
  id,
  value,
  onChange,
  onDraftChange,
  disabled,
  invalid,
  describedBy,
}: AirportComboboxProps) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  /** Input text: IATA and/or city filter while typing. */
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = useMemo(() => filterAirports(query), [query]);

  const close = useCallback(() => {
    setOpen(false);
    setHighlight(0);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, close]);

  useEffect(() => {
    setHighlight(0);
  }, [query, open]);

  const commitBlur = useCallback(() => {
    const code = normalizeIata(query);
    if (code) {
      onChange(code);
      setQuery(code);
    } else {
      setQuery(value);
    }
    close();
  }, [query, value, onChange, close]);

  function selectOption(opt: AirportOption) {
    onChange(opt.iata);
    setQuery(opt.iata);
    close();
    inputRef.current?.blur();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(0, filtered.length - 1)));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    }
    if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      selectOption(filtered[highlight]!);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        name="origin"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          open && filtered[highlight]
            ? `${listId}-opt-${filtered[highlight]!.iata}`
            : undefined
        }
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        placeholder="Click to choose or type to filter"
        className={cn(
          "h-11 w-full rounded-xl border bg-white px-3 text-sm text-[var(--brand-ink)] outline-none transition focus:ring-2",
          invalid
            ? "border-red-500 ring-red-500/35 focus:ring-red-500"
            : "border-black/10 ring-blue-600/40 focus:ring-blue-600",
        )}
        value={query}
        onChange={(e) => {
          onDraftChange?.();
          setQuery(e.target.value.toUpperCase());
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          window.setTimeout(() => {
            if (!wrapRef.current?.contains(document.activeElement)) {
              commitBlur();
            }
          }, 0);
        }}
      />

      {open && !disabled ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Airports"
          className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-black/10 bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[var(--muted)]">No matches</p>
          ) : (
            filtered.map((opt, i) => (
              <button
                key={opt.iata}
                type="button"
                id={`${listId}-opt-${opt.iata}`}
                role="option"
                aria-selected={i === highlight}
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm transition",
                  i === highlight ? "bg-blue-50" : "hover:bg-slate-50",
                )}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(opt)}
              >
                <span className="font-semibold tabular-nums tracking-wide text-[var(--brand-ink)]">
                  {opt.iata}
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {opt.city} · {opt.name}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
