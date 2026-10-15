import type { Metadata } from "next";
import { ConfirmationView } from "@/components/reservation/ConfirmationView";

export const metadata: Metadata = {
  title: "Réservation confirmée | MadaVoyage",
  description: "Votre séjour écotouristique à Madagascar est réservé : récapitulatif, règlement et prochaines étapes.",
  robots: { index: false },
};

export default function Page() {
  return (
    <main className="w-full pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-space-lg min-h-[calc(100vh-20rem)]">
        <ConfirmationView />
      </div>
    </main>
  );
}
