import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Étape 5 · Paiement | Réservation MadaVoyage",
  description: "Réglez votre séjour par MVola, Orange Money ou Airtel Money.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
