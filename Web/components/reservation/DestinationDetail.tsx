"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FavoriteButton } from "@/components/explore/Explore";
import { useMoney } from "@/components/currency/useCurrency";
import { ZONE_SEASONS, zoneFit, type ZoneClosure, type ZoneFit } from "@/lib/season-rules";
import { nightsOf } from "./booking-data";
import { stayMonths, stayStart, useBooking, type DestinationId } from "./booking-store";
import { useDatesText } from "./dates-i18n";
import { zoneCard } from "./destination-cards";
import { ratingText, useDestinationText } from "./destination-i18n";
import { DESTINATIONS, FLIGHT_SOURCE, zoneEstimate } from "./pricing";
import { OfflineNotice, useOnline, ZonePhoto } from "./zone-states";

const LEVEL_CLASS: Record<ZoneFit["level"], string> = {
  ideal: "bg-secondary text-on-secondary",
  possible: "bg-secondary/15 text-on-surface",
  rain: "bg-surface-container-high text-on-surface",
  closed: "bg-error-container text-on-error-container",
};

const linkClass = "font-semibold text-primary underline underline-offset-2 hover:decoration-2";

/**
 * Lien vers l'étape 3 qui enregistre d'abord la zone choisie. Hors ligne, le choix est enregistré mais la navigation
 * attend le retour du réseau.
 */
export function ChooseAndContinue({ id, className, children }: { id: DestinationId; className: string; children: ReactNode }) {
  const [, update] = useBooking();
  const online = useOnline();
  const tx = useDestinationText();
  return (
    <Link
      aria-disabled={online ? undefined : true}
      className={`${className} ${online ? "" : "opacity-60 cursor-not-allowed"}`}
      href="/reservation/budget"
      onClick={(e) => {
        update({ destination: id, destinationChosen: true });
        if (!online) e.preventDefault();
      }}
    >
      {children}
      {!online && <span className="sr-only"> {tx.offlineSuffix}</span>}
    </Link>
  );
}

/** Remplace « Continuer » quand la zone est fermée à une partie du séjour. */
export function ClosedNotice({ id, closed, className }: { id: DestinationId; closed: ZoneClosure; className?: string }) {
  const tx = useDestinationText();
  const text = tx.closures[id] ?? closed;
  return (
    <div className={`p-3 rounded bg-error-container text-on-error-container flex flex-col gap-2 ${className ?? ""}`}>
      <p className="font-body-md text-body-md">
        <strong className="font-bold">{tx.closedTitle(text.period)}</strong> {text.reason} {tx.closedHint}
      </p>
      <Link
        className="self-start px-space-md py-2 rounded-full bg-on-error-container text-error-container font-label-md text-label-md font-bold flex items-center gap-1.5"
        href="/reservation/dates"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
          edit_calendar
        </span>
        {tx.editDates}
      </Link>
    </div>
  );
}

export function DestinationDetail({ id }: { id: DestinationId }) {
  const [booking] = useBooking();
  const { eur, mga } = useMoney();
  const tx = useDestinationText();
  const dt = useDatesText();
  const card = zoneCard(id);
  const zone = tx.zones[id];
  const info = DESTINATIONS[id];
  const est = zoneEstimate(id, booking);
  const start = stayStart(booking);
  const tripMonth = start ? Number(start.slice(5, 7)) - 1 : null;
  const stayNights = nightsOf(booking);
  const months = stayMonths(booking);
  const closedAtStay = tripMonth === null ? undefined : zoneFit(id, tripMonth, months).closed;
  const closure = ZONE_SEASONS[id].closed ? (tx.closures[id] ?? ZONE_SEASONS[id].closed) : undefined;
  const online = useOnline();
  const photos = [{ img: card.img, alt: zone.alt }, ...card.gallery.map((p, i) => ({ img: p.img, alt: zone.galleryAlts[i] ?? p.alt }))];

  return (
    <div className="max-w-[1280px] mx-auto px-space-md md:px-gutter-desktop py-space-lg flex flex-col gap-space-lg" lang={dt.html}>
      <Link className={`self-start flex items-center gap-1 ${linkClass}`} href="/reservation/destination">
        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        {tx.backToChoice}
      </Link>

      <header className="relative h-72 md:h-96 rounded-lg overflow-hidden">
        <ZonePhoto alt={zone.alt} className="w-full h-full object-cover" src={card.img} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
        <FavoriteButton id={card.favoriteId} name={zone.name} />
        <div className="absolute bottom-space-md left-space-md right-space-md text-white">
          <span className="inline-block px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm uppercase tracking-wider mb-2">
            {zone.badge}
          </span>
          <h1 className="font-headline-lg text-headline-lg font-bold">{zone.name}</h1>
          <p className="font-body-lg text-body-lg font-medium">{zone.places}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <section aria-labelledby="dest-intro" className="flex flex-col gap-space-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface" id="dest-intro">
              {tx.inBrief}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface">{zone.text}</p>
            <ul className="grid sm:grid-cols-2 gap-2 font-body-md text-body-md text-on-surface">
              {card.highlights.map((h, i) => (
                <li className="flex items-center gap-2" key={h.label}>
                  <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px]">
                    {h.icon}
                  </span>
                  {zone.highlights[i]}
                </li>
              ))}
            </ul>
            <dl className="grid sm:grid-cols-3 gap-space-sm font-body-md text-body-md">
              <div className="p-3 rounded bg-surface-container-low">
                <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">{tx.detailLength}</dt>
                <dd className="font-bold text-on-surface">{tx.nightsRange(card.nights)}</dd>
              </div>
              <div className="p-3 rounded bg-surface-container-low">
                <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">{tx.detailFlight}</dt>
                <dd className="font-bold text-on-surface">
                  {zone.flightNote ? zone.flight : tx.flightLine(zone.flight)}
                  {zone.flightNote && <span className="block font-normal text-on-surface-variant">{zone.flightNote}</span>}
                </dd>
              </div>
              <div className="p-3 rounded bg-surface-container-low">
                <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">{tx.detailLodge}</dt>
                <dd className="font-bold text-on-surface">{zone.lodge}</dd>
              </div>
            </dl>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {tx.flightSourcePrefix}{" "}
              <a className={linkClass} href={FLIGHT_SOURCE.href} rel="noopener noreferrer" target="_blank">
                {tx.flightSource}
                <span className="sr-only"> {dt.newTab}</span>
              </a>
              {tx.flightSourceAfter}.
            </p>
          </section>

          <section aria-labelledby="dest-weather" className="flex flex-col gap-space-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface" id="dest-weather">
              {tx.weatherTitle}
            </h2>
            <ol className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
              {tx.months.map((label, m) => {
                const fit = zoneFit(id, m);
                const current = tripMonth !== null && months.includes(m);
                return (
                  <li
                    className={`rounded p-1.5 text-center font-body-sm text-body-sm ${LEVEL_CLASS[fit.level]} ${current ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    key={label}
                  >
                    <span className="block font-bold first-letter:uppercase">{label}</span>
                    <span className="block">{tx.levels[fit.level]}</span>
                    {current && <span className="sr-only">{tx.stayMonthSr}</span>}
                  </li>
                );
              })}
            </ol>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {tx.weatherLegend}
              {closure && tx.closedLegend}
              {tripMonth !== null && tx.stayCircled(months.length > 1)}
            </p>
            {closure && (
              <p className="font-body-md text-body-md text-on-surface">
                <strong>{tx.annualClosure}</strong> {closure.period}. {closure.reason}
              </p>
            )}
            {ZONE_SEASONS[id].activities.map((a) => (
              <p className="font-body-md text-body-md text-on-surface" key={a.label}>
                <strong>
                  {tx.activities[a.label]?.label ?? a.label}
                  {tx.colon}
                </strong>
                {tx.activitySeen(tx.activities[a.label]?.period ?? a.period)}
              </p>
            ))}
          </section>

          <section aria-labelledby="dest-reviews" className="flex flex-col gap-space-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface" id="dest-reviews">
              {tx.reviewsTitle}
            </h2>
            <p className="flex items-center gap-2 font-body-lg text-body-lg text-on-surface">
              <span aria-hidden="true" className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <strong>{tx.ratingOf(ratingText(card.rating, dt.html))}</strong> · {tx.reviewsCount(card.reviews)}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant first-letter:uppercase">{tx.reviewsSource}.</p>
            <Link className={`self-start ${linkClass}`} href="/avis">
              {tx.readReviews}
            </Link>
          </section>

          <section aria-labelledby="dest-photos" className="flex flex-col gap-space-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface" id="dest-photos">
              {tx.photosTitle}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              {photos.map((p) => (
                <li key={p.img}>
                  <figure className="flex flex-col gap-1">
                    <ZonePhoto alt="" className="w-full h-56 object-cover rounded" lazy src={p.img} />
                    <figcaption className="font-body-sm text-body-sm text-on-surface-variant">{p.alt}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-surface-container-lowest rounded-lg shadow-md p-space-md flex flex-col gap-space-sm">
          <p className="font-body-md text-body-md text-on-surface">
            {tx.priceFrom} <strong className="font-label-lg text-label-lg">{eur(est.total)}</strong>{" "}
            <span className="text-on-surface-variant">({mga(est.total)})</span>
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">{tx.detailPriceNote(est.nights, dt.travelers(booking))}</p>
          {stayNights > 0 && (stayNights < card.nights[0] || stayNights > card.nights[1]) && (
            <p className="font-body-md text-body-md text-on-surface">{tx.nightsWarning(stayNights, tx.nightsRange(card.nights))}</p>
          )}
          {!online && <OfflineNotice />}
          {closedAtStay ? (
            <ClosedNotice closed={closedAtStay} id={id} />
          ) : (
            <ChooseAndContinue
              className="w-full px-space-lg py-3 rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-lg text-label-lg flex items-center justify-center gap-2"
              id={id}
            >
              {tx.choose}
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </ChooseAndContinue>
          )}
          <Link className={`self-center ${linkClass}`} href="/reservation/destination">
            {tx.compare}
          </Link>
        </aside>
      </div>
    </div>
  );
}
