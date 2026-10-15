export type Currency = "EUR" | "MGA" | "USD";

export const CURRENCY_KEY = "mv_currency";

export const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "MGA", label: "Ariary malgache", symbol: "Ar" },
  { code: "USD", label: "Dollar américain", symbol: "$" },
];

export function parseCurrency(raw: string | null | undefined): Currency {
  return raw === "MGA" || raw === "USD" ? raw : "EUR";
}
