import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationDetail } from "@/components/reservation/DestinationDetail";
import { ZONE_CARDS } from "@/components/reservation/destination-cards";
import { DESTINATIONS } from "@/components/reservation/pricing";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ZONE_CARDS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = ZONE_CARDS.find((c) => c.id === id);
  if (!card) return {};
  return {
    title: `${DESTINATIONS[card.id].name} : météo, avis et photos | MadaVoyage`,
    description: card.text,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const card = ZONE_CARDS.find((c) => c.id === id);
  if (!card) notFound();
  return (
    <main className="flex-1 w-full pt-20 bg-surface">
      <DestinationDetail id={card.id} />
    </main>
  );
}
