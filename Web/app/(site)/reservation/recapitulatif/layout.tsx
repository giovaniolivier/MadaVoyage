import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Étape 5 · Récapitulatif & paiement | Réservation MadaVoyage",
  description: "Vérifiez votre séjour et choisissez votre moyen de paiement sécurisé.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
