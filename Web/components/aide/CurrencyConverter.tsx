"use client";

import { useId, useRef, useState } from "react";
import { exchangeRate } from "@/components/reservation/pricing";
import { rateDateLabel } from "@/lib/exchange-rate";

type Code = "EUR" | "MGA" | "USD";

const CURRENCIES: { code: Code; label: string; symbol: string; decimals: number }[] = [
  { code: "EUR", label: "Euro", symbol: "€", decimals: 2 },
  { code: "MGA", label: "Ariary", symbol: "Ar", decimals: 0 },
  { code: "USD", label: "Dollar US", symbol: "$", decimals: 2 },
];

const byCode = (code: Code) => CURRENCIES.find((c) => c.code === code)!;

const format = (value: number, code: Code) => {
  const { decimals, symbol } = byCode(code);
  const text = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return `${text.replace(/[\u202f\u00a0]/g, "\u00a0")}\u00a0${symbol}`;
};

const parseAmount = (text: string) => {
  const value = Number(text.replace(/[\s\u00a0\u202f]/g, "").replace(",", "."));
  return Number.isFinite(value) && value >= 0 ? value : null;
};

const selectClass =
  "h-11 pl-space-sm pr-8 bg-surface-container-low rounded font-label-md text-label-md font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary";

export default function CurrencyConverter() {
  const id = useId();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<Code>("EUR");
  const [to, setTo] = useState<Code>("MGA");

  const rate = exchangeRate();
  const perEur: Record<Code, number> = { EUR: 1, MGA: rate.mgaPerEur, USD: rate.usdPerEur };
  const value = parseAmount(amount);
  const result = value === null ? null : (value / perEur[from]) * perEur[to];

  const lastSwap = useRef<{ shown: string; original: string } | null>(null);

  function swap() {
    setFrom(to);
    setTo(from);
    if (lastSwap.current?.shown === amount) {
      setAmount(lastSwap.current.original);
      lastSwap.current = null;
    } else if (result !== null) {
      const factor = 10 ** byCode(to).decimals;
      const shown = String(Math.round(result * factor) / factor).replace(".", ",");
      lastSwap.current = { shown, original: amount };
      setAmount(shown);
    }
  }

  return (
    <div className="flex flex-col gap-space-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-amount`} className="font-label-md text-label-md text-on-surface font-semibold">
          Montant
        </label>
        <div className="flex gap-space-xs">
          <input
            id={`${id}-amount`}
            className="flex-1 min-w-0 h-11 px-space-md bg-surface-container-low rounded font-label-lg text-label-lg text-on-surface outline-none focus:ring-2 focus:ring-primary"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={value === null}
          />
          <select aria-label="Devise de départ" className={selectClass} value={from} onChange={(e) => setFrom(e.target.value as Code)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-space-xs">
        <span className="h-px flex-1 bg-outline-variant/60" />
        <button
          className="h-9 px-space-md rounded-full border border-outline-variant font-label-md text-label-md font-bold text-primary hover:bg-surface-container-high flex items-center gap-1"
          onClick={swap}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            swap_vert
          </span>
          Inverser
        </button>
        <span className="h-px flex-1 bg-outline-variant/60" />
      </div>

      <div className="p-space-md bg-surface-container-low rounded flex flex-col gap-1">
        <div className="flex items-center justify-between gap-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant">Soit environ</span>
          <select
            aria-label="Devise d'arrivée"
            className={`${selectClass} bg-surface-container-lowest`}
            value={to}
            onChange={(e) => setTo(e.target.value as Code)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
        <output
          htmlFor={`${id}-amount`}
          aria-live="polite"
          className="font-headline-md text-headline-md text-primary font-extrabold tracking-tight"
        >
          {result === null ? "Montant invalide" : format(result, to)}
        </output>
      </div>

      <p className="font-body-md text-body-md text-on-surface-variant">
        1&nbsp;€ = {format(rate.mgaPerEur, "MGA")} = {format(rate.usdPerEur, "USD")} · taux du {rateDateLabel(rate)}, source{" "}
        <a className="underline underline-offset-2" href="https://www.exchangerate-api.com" rel="noopener noreferrer" target="_blank">
          {rate.source}
        </a>
        .
      </p>
    </div>
  );
}
