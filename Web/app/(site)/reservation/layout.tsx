import { cookies } from "next/headers";
import { CURRENCY_KEY, parseCurrency } from "@/components/currency/currency";
import { BookingSeed } from "@/components/reservation/BookingSeed";
import { BOOKING_KEY, parseBooking } from "@/components/reservation/booking-data";

export default async function ReservationLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  return (
    <BookingSeed currency={parseCurrency(store.get(CURRENCY_KEY)?.value)} value={parseBooking(store.get(BOOKING_KEY)?.value)}>
      {children}
    </BookingSeed>
  );
}
