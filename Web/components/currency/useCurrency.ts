"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { eur, mga, signedEur, usd } from "@/components/reservation/pricing";
import { CURRENCY_KEY, parseCurrency, type Currency } from "./currency";

/** Devise lue par le serveur dans le cookie, utilisée pendant l'hydratation. */
export const CurrencySeedContext = createContext<Currency>("EUR");

const listeners = new Set<() => void>();

function read(): Currency {
  return parseCurrency(localStorage.getItem(CURRENCY_KEY));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === CURRENCY_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setCurrency(currency: Currency) {
  localStorage.setItem(CURRENCY_KEY, currency);
  document.cookie = `${CURRENCY_KEY}=${currency}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  listeners.forEach((l) => l());
}

export function useCurrency() {
  const seed = useContext(CurrencySeedContext);
  const currency = useSyncExternalStore(subscribe, read, () => seed);
  return [currency, setCurrency] as const;
}

const signed = (format: (n: number) => string) => (amount: number) =>
  amount === 0 ? format(0) : `${amount > 0 ? "+" : "−"}${format(Math.abs(amount))}`;

/**
 * Formateurs de prix selon la devise choisie dans l'en-tête : `eur` affiche la devise principale,
 * `mga` l'équivalent indicatif. En mode MGA, les deux sont inversés ; en mode USD, l'équivalent
 * indicatif est l'euro, devise de facturation.
 */
export function useMoney() {
  const [currency] = useCurrency();
  return moneyFor(currency);
}

export type Money = {
  currency: Currency;
  eur: (amount: number, withCents?: boolean) => string;
  mga: (amount: number) => string;
  signedEur: (amount: number) => string;
};

export function moneyFor(currency: Currency): Money {
  if (currency === "EUR") return { currency, eur, mga, signedEur };
  if (currency === "USD") return { currency, eur: usd, mga: (amount) => eur(amount), signedEur: signed(usd) };
  return { currency, eur: (amount) => mga(amount), mga: (amount) => eur(amount), signedEur: signed(mga) };
}
