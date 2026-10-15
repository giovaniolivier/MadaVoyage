import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Étape 3 · Budget | Réservation MadaVoyage",
  description: "Comparez votre budget cible et les alternatives proposées pour votre séjour.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
