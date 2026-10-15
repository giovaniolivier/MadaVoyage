"use client";

import { useEffect } from "react";
import type { Currency } from "@/components/currency/currency";
import { CurrencySeedContext } from "@/components/currency/useCurrency";
import { BookingSeedContext, syncBookingCookie, type Booking } from "./booking-store";

export function BookingSeed({ value, currency, children }: { value: Booking; currency: Currency; children: React.ReactNode }) {
  useEffect(syncBookingCookie, []);
  return (
    <CurrencySeedContext.Provider value={currency}>
      <BookingSeedContext.Provider value={value}>{children}</BookingSeedContext.Provider>
    </CurrencySeedContext.Provider>
  );
}
