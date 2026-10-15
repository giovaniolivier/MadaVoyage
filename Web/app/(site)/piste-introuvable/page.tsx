import type { Metadata } from "next";
import LostTrail from "@/components/errors/LostTrail";

export const metadata: Metadata = {
  title: "Piste introuvable | MadaVoyage",
  description:
    "Cette page n'existe pas ou a été déplacée. Retrouvez nos circuits, le simulateur de budget ou contactez notre conciergerie.",
  robots: { index: false },
};

export default function Page() {
  return <LostTrail />;
}
