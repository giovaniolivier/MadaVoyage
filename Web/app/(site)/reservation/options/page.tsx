import type { Metadata } from "next";
import { BookingFromUrl } from "@/components/reservation/BookingBits";
import { OptionsStep } from "@/components/reservation/OptionsStep";

export const metadata: Metadata = {
  title: "Étape 4 · Offre : options et activités | Réservation MadaVoyage",
  description: "Ajoutez restauration locale, excursions en parcs nationaux et matériel de randonnée à votre séjour.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <BookingFromUrl />
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
        <h1 className="sr-only">Réservation, étape 4 : options et activités</h1>
        <OptionsStep />
      </main>
    </>
  );
}
