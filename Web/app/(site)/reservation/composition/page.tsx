import type { Metadata } from "next";
import { BookingFromUrl } from "@/components/reservation/BookingBits";
import { CompositionStep } from "@/components/reservation/CompositionStep";

export const metadata: Metadata = {
  title: "Étape 4 · Offre : hébergement | Réservation MadaVoyage",
  description: "Composez votre séjour sur mesure : hébergement, transports, repas et activités.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <BookingFromUrl />
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
        <CompositionStep />
      </main>
    </>
  );
}
