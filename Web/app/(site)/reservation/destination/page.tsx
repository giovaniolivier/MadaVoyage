import type { Metadata } from "next";
import { BookingFromUrl } from "@/components/reservation/BookingBits";
import { DestinationExplorer, DestinationMain } from "@/components/reservation/DestinationStep";

export const metadata: Metadata = {
  title: "Étape 2 · Destination | Réservation MadaVoyage",
  description: "Choisissez votre destination et vos sanctuaires naturels à Madagascar.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <BookingFromUrl />
      <DestinationMain>
        <DestinationExplorer />
      </DestinationMain>
    </>
  );
}
