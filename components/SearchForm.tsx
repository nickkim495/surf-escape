"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { AirportCombobox } from "@/components/AirportCombobox";
import { cn, normalizeIata } from "@/lib/utils";

export type SearchFormValues = {
  origin: string;
  departureDate: string;
  returnDate: string;
};

export type FieldKey = "origin" | "departureDate" | "returnDate";

type SearchFormProps = {
  values: SearchFormValues;
  onChange: (next: SearchFormValues) => void;
  /** Called only when all required fields pass validation. */
  onSubmit: (payload: SearchFormValues) => void;
  disabled?: boolean;
  /** API / network error (shown below the submit row). */
  error?: string | null;
  className?: string;
};

export function SearchForm({
  values,
  onChange,
  onSubmit,
  disabled,
  error,
  className,
}: SearchFormProps) {
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldKey, string>>
  >({});

  function clearFieldError(key: FieldKey) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const originEl = document.getElementById("origin") as HTMLInputElement | null;
    const rawOrigin = originEl?.value?.trim() ?? "";
    const originCode = normalizeIata(rawOrigin);

    const nextErrors: Partial<Record<FieldKey, string>> = {};

    if (!rawOrigin) {
      nextErrors.origin = "Select or enter your departure airport.";
    } else if (!originCode) {
      nextErrors.origin = "Enter a valid 3-letter airport code.";
    }

    if (!values.departureDate) {
      nextErrors.departureDate = "Select a departure date.";
    }
    if (!values.returnDate) {
      nextErrors.returnDate = "Select a return date.";
    }

    if (
      values.departureDate &&
      values.returnDate &&
      values.departureDate >= values.returnDate
    ) {
      nextErrors.returnDate = "Return date must be after departure.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: SearchFormValues = {
      ...values,
      origin: originCode,
    };
    if (payload.origin !== values.origin) {
      onChange(payload);
    }
    onSubmit(payload);
  }

  const inputErrorRing =
    "border-red-500 ring-red-500/35 focus:ring-red-500";
  const inputDefaultRing =
    "border-black/10 ring-blue-600/40 focus:ring-blue-600";

  return (
    <form
      id="search"
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-black/8 bg-white p-5 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] sm:p-6",
        className,
      )}
      noValidate
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--brand-ink)]">
            Plan a surf weekend
          </h2>
          <p className="text-sm text-[var(--muted)]">
            We&apos;ll check our curated list and rank what looks surfable.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="origin" className="text-sm font-medium text-[var(--brand-ink)]">
            From (airport)
          </label>
          <AirportCombobox
            id="origin"
            value={values.origin}
            onDraftChange={() => clearFieldError("origin")}
            onChange={(iata) => {
              clearFieldError("origin");
              onChange({ ...values, origin: iata });
            }}
            disabled={disabled}
            invalid={Boolean(fieldErrors.origin)}
            describedBy={fieldErrors.origin ? "origin-error" : undefined}
          />
          {fieldErrors.origin ? (
            <p
              id="origin-error"
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {fieldErrors.origin}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="departure"
            className="text-sm font-medium text-[var(--brand-ink)]"
          >
            Depart
          </label>
          <input
            id="departure"
            name="departure"
            type="date"
            aria-invalid={Boolean(fieldErrors.departureDate)}
            aria-describedby={
              fieldErrors.departureDate ? "departure-error" : undefined
            }
            className={cn(
              "h-11 rounded-xl border bg-white px-3 text-sm text-[var(--brand-ink)] outline-none transition focus:ring-2",
              fieldErrors.departureDate ? inputErrorRing : inputDefaultRing,
            )}
            value={values.departureDate}
            onChange={(e) => {
              clearFieldError("departureDate");
              onChange({ ...values, departureDate: e.target.value });
            }}
          />
          {fieldErrors.departureDate ? (
            <p
              id="departure-error"
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {fieldErrors.departureDate}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="return" className="text-sm font-medium text-[var(--brand-ink)]">
            Return
          </label>
          <input
            id="return"
            name="return"
            type="date"
            aria-invalid={Boolean(fieldErrors.returnDate)}
            aria-describedby={
              fieldErrors.returnDate ? "return-error" : undefined
            }
            className={cn(
              "h-11 rounded-xl border bg-white px-3 text-sm text-[var(--brand-ink)] outline-none transition focus:ring-2",
              fieldErrors.returnDate ? inputErrorRing : inputDefaultRing,
            )}
            value={values.returnDate}
            onChange={(e) => {
              clearFieldError("returnDate");
              onChange({ ...values, returnDate: e.target.value });
            }}
          />
          {fieldErrors.returnDate ? (
            <p
              id="return-error"
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {fieldErrors.returnDate}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--muted)]">
          No accounts, no saved trips — results stay in this browser session.
        </p>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Searching…" : "Search"}
        </button>
      </div>

      {error ? (
        <p
          id="search-error"
          role="alert"
          className="mt-3 text-sm font-medium text-red-600"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
