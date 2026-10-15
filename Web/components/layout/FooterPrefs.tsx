"use client";

import { CURRENCIES, type Currency } from "@/components/currency/currency";
import { useCurrency } from "@/components/currency/useCurrency";
import { LANGS, setLang, useLang, type Lang } from "@/components/i18n/lang";

const select =
  "h-11 pl-3 pr-9 rounded-full bg-surface-container-lowest border border-outline-variant font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary";

/** Même réglage que le menu « Langue et devise » de l'en-tête : les deux restent synchronisés. */
export default function FooterPrefs() {
  const lang = useLang();
  const [currency, setCurrency] = useCurrency();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-primary">language</span>
        <span className="sr-only">Langue</span>
        <select className={select} onChange={(e) => setLang(e.target.value as Lang)} value={lang}>
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-primary">payments</span>
        <span className="sr-only">Devise</span>
        <select className={select} onChange={(e) => setCurrency(e.target.value as Currency)} value={currency}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label} ({c.symbol})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
