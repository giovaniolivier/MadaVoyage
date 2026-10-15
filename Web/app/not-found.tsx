import type { Metadata } from "next";
import LostTrail from "@/components/errors/LostTrail";
import SiteLayout from "./(site)/layout";

export const metadata: Metadata = {
  title: "Piste introuvable | MadaVoyage",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteLayout>
      <LostTrail />
    </SiteLayout>
  );
}
