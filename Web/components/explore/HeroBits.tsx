import { TrendButton } from "@/components/explore/Explore";
import Pending from "@/components/ui/Pending";
import { GUIDES, RATING, REVIEWS_COUNT, REVIEWS_VERIFIED, SEASON_LABEL, SOLIDARITY_RATE, TRAVELERS_COUNT } from "@/lib/site";

export function SeasonBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-on-surface/50 backdrop-blur-md text-surface font-label-lg text-label-lg font-semibold">
      <span className="material-symbols-outlined text-[20px] text-secondary-fixed">event_available</span>
      {SEASON_LABEL}
    </div>
  );
}

export function TrendChips() {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <span className="font-label-lg text-label-lg text-surface font-semibold [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">Populaires :</span>
      <TrendButton destination="nosy-be" icon="water_lux">
        Nosy Be &amp; Mitsio
      </TrendButton>
      <TrendButton destination="menabe" icon="forest">
        Allée des Baobabs
      </TrendButton>
      <TrendButton destination="isalo" icon="landscape">
        Massif de l’Isalo
      </TrendButton>
    </div>
  );
}

const TRUST = [
  {
    icon: "badge",
    tone: "bg-secondary/40 text-secondary-fixed",
    title: GUIDES.claim,
    text: GUIDES.detail,
  },
  {
    icon: "star",
    tone: "bg-tertiary/50 text-tertiary-fixed",
    title: REVIEWS_VERIFIED ? `${RATING}/5 · ${REVIEWS_COUNT} avis` : "Avis voyageurs",
    text: REVIEWS_VERIFIED ? `${TRAVELERS_COUNT} voyageurs accompagnés` : null,
  },
  {
    icon: "potted_plant",
    tone: "bg-primary/50 text-primary-fixed",
    title: `${SOLIDARITY_RATE} reversé`,
    text: "Au fonds solidaire Fihavanana",
  },
];

export function TrustBar() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 py-5 px-6 rounded-2xl bg-on-surface/70 backdrop-blur-md">
      {TRUST.map((item) => (
        <li className="flex items-center gap-4" key={item.icon}>
          <span className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${item.tone}`}>
            <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
          </span>
          <span className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-surface font-bold">{item.title}</span>
            {item.text ? (
              <span className="font-body-md text-body-md text-surface">{item.text}</span>
            ) : (
              <span className="mt-1">
                <Pending onDark>En attente des premiers avis publiés</Pending>
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
