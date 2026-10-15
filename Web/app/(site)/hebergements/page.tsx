import type { Metadata } from "next";
import Link from "next/link";
import { HOTEL_CARDS } from "@/components/reservation/hotel-cards";
import { HOTELS, eur } from "@/components/reservation/pricing";
import { REVIEWS_VERIFIED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tous nos hébergements partenaires à Nosy Be | MadaVoyage",
  description:
    "Écolodges et hôtels de charme sélectionnés par MadaVoyage à Nosy Be : Manga Soa Lodge, Vanila Hotel & Spa, L'Heure Bleue. Prix par nuit et réservation dans votre séjour.",
};

const DETAIL_PAGES: Partial<Record<keyof typeof HOTELS, string>> = { "manga-soa": "/hebergements/manga-soa-lodge" };

export default function Page() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
      <div className="max-w-[1440px] mx-auto px-margin lg:px-margin-desktop py-space-lg flex flex-col gap-space-lg">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
          <Link className="hover:text-primary transition-colors" href="/">
            Accueil
          </Link>
          <span aria-hidden="true" className="opacity-40">
            /
          </span>
          <span aria-current="page" className="text-on-surface font-semibold">
            Hébergements
          </span>
        </nav>

        <header className="flex flex-col gap-space-xs max-w-3xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Tous nos hébergements</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Des adresses que nos équipes connaissent personnellement, choisies pour leur accueil et leur démarche environnementale. Elles
            s&apos;ajoutent à votre séjour à Nosy Be lors de la réservation.
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter-desktop">
          {HOTEL_CARDS.map((h) => {
            const detail = DETAIL_PAGES[h.id];
            const href = detail ?? "/reservation/destination?destination=nosy-be";
            return (
              <li key={h.id} className="flex flex-col rounded-lg overflow-hidden bg-surface-container-lowest shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={h.alt} className="w-full aspect-[4/3] object-cover" loading="lazy" src={h.img} />
                <div className="flex flex-col gap-space-sm p-space-md flex-1">
                  <p className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary">
                      location_on
                    </span>
                    {h.location}
                  </p>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">{h.title}</h2>
                  {REVIEWS_VERIFIED && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{`★ ${h.rating} / 5 · ${h.reviews} avis`}</p>
                  )}
                  <p className="font-body-md text-body-md text-on-surface-variant">{h.text}</p>
                  <ul aria-label="Points forts" className="flex flex-wrap gap-space-xs">
                    {h.tags.map((t) => (
                      <li
                        key={t.label}
                        className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm"
                      >
                        {t.label}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-space-sm flex items-center justify-between gap-space-sm border-t border-outline-variant/40">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      À partir de{" "}
                      <strong className="font-headline-sm text-headline-sm text-on-surface">{eur(HOTELS[h.id].perNight)}</strong> / nuit
                    </p>
                    <Link
                      aria-label={detail ? `Découvrir ${h.title}` : `Réserver un séjour à Nosy Be avec ${h.title}`}
                      className="inline-flex items-center gap-1 min-h-11 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary/90 transition-colors"
                      href={href}
                    >
                      {detail ? "Découvrir" : "Réserver"}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
