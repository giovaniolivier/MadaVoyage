"use client";

import Link from "next/link";
import { DestinationNotice, useQuote } from "./BookingBits";
import { durationLabel, longRangeLabel, travelersLongLabel, type HotelId, type RoomId } from "./booking-store";
import { useMoney } from "@/components/currency/useCurrency";
import { ACTIVITIES, DESTINATIONS, HOTELS, MEALS, ROOMS, TRANSPORTS, hotelCost } from "./pricing";
import { CANCELLATION, SOLIDARITY_RATE, SOLIDARITY_USES } from "@/lib/site";
import { HOTEL_CARDS } from "./hotel-cards";

export function CompositionStep() {
  const { booking, update, q } = useQuote();
  const { eur, mga, signedEur } = useMoney();
  const destination = DESTINATIONS[booking.destination];
  const people = booking.adults + booking.children;
  const activitiesTotal = booking.activities.reduce((s, id) => s + (q.lines.find((l) => l.id === id)?.amount ?? 0), 0);
  const share = q.budgetShare;
  const over = q.gap > 0;
  const hasLokobe = booking.activities.includes("lokobe");

  const subSteps = [
    {
      n: "4.2",
      icon: "flight_takeoff",
      label: "2. Transports",
      sub: `${booking.transport === "private" ? "Madagascar Airlines + 4x4" : "Navette partagée"} (${eur(q.transport.amount)})`,
      href: "/reservation/options#section-materiel",
    },
    {
      n: "4.3",
      icon: "restaurant",
      label: "3. Restauration",
      sub: `${MEALS[booking.meals].name.split(" ")[0]} (${eur(q.meals)})`,
      href: "/reservation/options#section-restauration",
    },
    {
      n: "4.4",
      icon: "hiking",
      label: "4. Activités",
      sub: booking.activities.length
        ? `${booking.activities.length} sortie${booking.activities.length > 1 ? "s" : ""} (${eur(activitiesTotal)})`
        : "Aucune sortie",
      href: "/reservation/options#section-activites",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 w-full pt-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-[14px] uppercase tracking-wider mb-2">
            <span>Réservation</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary font-bold">{destination.name}</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Composez votre séjour</h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1.5">
            Personnalisez chaque étape selon vos envies : hébergements d&apos;exception, transferts et excursions exclusives.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-full shadow-sm self-start md:self-auto">
          <span className="material-symbols-outlined text-secondary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <div className="flex flex-col">
            <span className="font-label-md text-[14px] text-on-surface font-bold leading-tight">Garantie Fihavanana ONTM</span>
            <span className="font-body-sm text-[14px] text-on-surface-variant leading-tight">
              Tarifs directs prestataires locaux certifiés
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 mb-10 shadow-sm border border-surface-container">
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-surface-container-high z-0"></div>
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-1 bg-primary-container z-0"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {[
              { step: "Étape 1 · Validé", title: durationLabel(booking), sub: longRangeLabel(booking), href: "/reservation/dates" },
              { step: "Étape 2 · Validé", title: destination.short, sub: travelersLongLabel(booking), href: "/reservation/destination" },
              {
                step: "Étape 3 · Validé",
                title: `Budget Cible ${eur(booking.budget)}`,
                sub: over ? `Dépassement ${signedEur(q.gap)}` : `Éco-marge +${eur(-q.gap)} préservés`,
                href: "/reservation/budget",
                tone: over ? "text-tertiary" : "text-secondary",
              },
            ].map((s) => (
              <div className="relative flex items-center gap-3 bg-surface-container-lowest pr-2" key={s.step}>
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] text-secondary font-bold uppercase tracking-wider">{s.step}</span>
                  <Link
                    className="font-headline-sm text-[16px] text-on-surface truncate font-bold hover:text-primary hover:underline after:absolute after:inset-0"
                    href={s.href}
                  >
                    {s.title}
                  </Link>
                  <span className={`text-[14px] truncate ${s.tone ? `${s.tone} font-bold` : "text-on-surface-variant"}`}>{s.sub}</span>
                </div>
              </div>
            ))}
            <div className="relative flex items-center gap-3 bg-surface-container-lowest pr-2">
              <div className="w-9 h-9 rounded-full bg-surface-container-lowest border-4 border-primary text-primary flex items-center justify-center font-bold shrink-0 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] text-primary font-bold uppercase tracking-wider">Étape 4 · En Cours</span>
                <span className="font-headline-sm text-[16px] text-primary font-bold truncate">Séjour sur mesure</span>
                <span className="text-[14px] text-on-surface-variant truncate">
                  {eur(q.total)} · {mga(q.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DestinationNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <nav
            aria-label="Sous-étapes de la composition"
            className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[12px] uppercase tracking-wider">
                  Navigation Modulaire
                </span>
                <span className="text-[14px] text-on-surface-variant">Sélectionnez une sous-étape à configurer :</span>
              </div>
              <span className="text-[12px] font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">task_alt</span> 4/4 Modules configurés
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <a
                aria-current="step"
                className="flex flex-col p-3 rounded-xl bg-primary text-on-primary text-left shadow-sm transition-all"
                href="#module-hebergement"
              >
                <span className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Sous-Étape 4.1</span>
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                </span>
                <span className="font-headline-sm text-[14px] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">hotel</span> 1. Hébergement
                </span>
                <span className="text-[12px] opacity-90 mt-1 truncate">
                  {HOTELS[booking.hotel].name} ({eur(q.hotel.amount)})
                </span>
              </a>
              {subSteps.map((s) => (
                <Link
                  className="flex flex-col p-3 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container text-left transition-all"
                  href={s.href}
                  key={s.n}
                >
                  <span className="flex items-center justify-between w-full mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Sous-Étape {s.n} · Prêt</span>
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  </span>
                  <span className="font-headline-sm text-[14px] font-bold flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-primary">{s.icon}</span> {s.label}
                  </span>
                  <span className="text-[12px] text-on-surface-variant mt-1 truncate">{s.sub}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex flex-col gap-5">
            <section
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container scroll-mt-28"
              id="module-hebergement"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[12px] font-bold">Module 4.1</span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Choix de l&apos;Hébergement</h2>
                  </div>
                  <p className="font-body-md text-[14px] text-on-surface-variant">
                    Sélection de {q.nights} nuits ({longRangeLabel(booking)}) pour {travelersLongLabel(booking)}, petits-déjeuners inclus.
                  </p>
                </div>
                <span className="text-[13px] font-bold bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-full shrink-0">
                  3 options certifiées ONTM
                </span>
              </div>

              <div className="flex flex-col gap-5 mt-6">
                {HOTEL_CARDS.map((h) => {
                  const active = booking.hotel === h.id;
                  const cost = hotelCost(booking, h.id);
                  const diff = cost.amount - q.hotel.amount;
                  return (
                    <article
                      className={`bg-surface-container-lowest rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all ${
                        active ? "border-2 border-primary-container" : "border border-surface-container hover:shadow-md"
                      }`}
                      key={h.id}
                    >
                      {active && (
                        <div className="absolute top-0 right-0 bg-primary-container text-on-primary px-4 py-1.5 text-[13px] font-bold rounded-bl-xl flex items-center gap-1.5 shadow-sm z-10">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Sélection actuelle
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className={`md:col-span-5 relative rounded-xl overflow-hidden group ${active ? "h-52" : "h-48"}`}>
                          <img
                            alt={h.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={h.img}
                          />
                          <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full text-[13px] text-on-surface font-bold flex items-center gap-1 shadow-sm">
                            <span
                              className="material-symbols-outlined text-amber-500 text-[18px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            {h.rating} <span className="text-on-surface-variant font-normal">({h.reviews} avis)</span>
                          </div>
                          {h.badge && (
                            <div className="absolute bottom-3 left-3 bg-secondary/90 backdrop-blur-sm text-on-secondary px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">eco</span> {h.badge}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-7 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center gap-1.5 text-on-surface-variant text-[13px] mb-1.5">
                              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                              <span>{h.location}</span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{h.title}</h3>
                            <p className="text-[14px] text-on-surface-variant mt-2 line-clamp-2">{h.text}</p>
                            {h.id === "manga-soa" && (
                              <Link
                                className="inline-flex items-center gap-1 mt-1.5 text-[13px] font-bold text-primary hover:underline"
                                href="/hebergements/manga-soa-lodge"
                              >
                                Voir la fiche du lodge
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                              </Link>
                            )}
                            <div className="flex flex-wrap gap-2 my-3">
                              <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface text-[12px] font-bold flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-primary text-[16px]">family_restroom</span>
                                {cost.rooms > 1 ? `${cost.rooms} chambres` : "1 chambre"} pour {people} pers.
                              </span>
                              {h.tags.map((t) => (
                                <span
                                  className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface text-[12px] font-bold flex items-center gap-1.5"
                                  key={t.label}
                                >
                                  {t.icon && <span className="material-symbols-outlined text-primary text-[16px]">{t.icon}</span>} {t.label}
                                </span>
                              ))}
                            </div>
                            {h.id === "manga-soa" && active && (
                              <fieldset className="mb-3">
                                <legend className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                                  Catégorie de chambre
                                </legend>
                                <div className="flex flex-wrap gap-2">
                                  {(Object.keys(ROOMS) as RoomId[]).map((r) => (
                                    <button
                                      aria-pressed={booking.room === r}
                                      className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors ${
                                        booking.room === r
                                          ? "bg-primary text-on-primary"
                                          : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                                      }`}
                                      key={r}
                                      onClick={() => update({ room: r })}
                                      type="button"
                                    >
                                      {ROOMS[r].name} · {ROOMS[r].perNight} €/nuit
                                    </button>
                                  ))}
                                </div>
                              </fieldset>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-surface-container">
                            <div className="flex flex-col">
                              <span className="text-[12px] text-on-surface-variant">Tarif {q.nights} nuits</span>
                              <div className="flex items-baseline gap-1.5">
                                <span
                                  className={`font-headline-md text-headline-md font-bold ${active ? "text-primary" : "text-on-surface"}`}
                                >
                                  {eur(cost.amount)}
                                </span>
                                {active ? (
                                  <span className="text-[13px] text-on-surface-variant">/ {mga(cost.amount)}</span>
                                ) : (
                                  <span className={`text-[13px] font-bold ${diff > 0 ? "text-tertiary" : "text-secondary"}`}>
                                    ({signedEur(diff)})
                                  </span>
                                )}
                              </div>
                            </div>
                            {active ? (
                              <span className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container text-[13px] font-bold flex items-center gap-1.5 shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">done</span>
                                Sélectionné
                              </span>
                            ) : (
                              <button
                                className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed text-[13px] font-bold transition-colors"
                                onClick={() => update({ hotel: h.id })}
                                type="button"
                              >
                                Basculer vers cet hôtel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className={`flex items-center gap-2 text-[13px] font-bold ${over ? "text-tertiary" : "text-secondary"}`}>
                  <span className="material-symbols-outlined text-[18px]">{over ? "warning" : "verified"}</span>
                  {over ? "Total au-dessus de votre budget cible" : "Hébergement validé dans votre quota budgétaire"} ({eur(q.hotel.amount)}{" "}
                  / {mga(q.hotel.amount)})
                </div>
                <Link
                  className="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary text-[14px] font-bold flex items-center gap-2 shadow-sm transition-all"
                  href="/reservation/options"
                >
                  <span>Étape suivante : Repas, Activités &amp; Transports</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </section>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Sous-modules de votre devis</h3>
                </div>
                <span className="text-[13px] text-on-surface-variant font-bold">Cliquez sur « Configurer » pour modifier</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between border border-surface-container">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase text-primary tracking-wider">Étape 4.2 · Transports</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                        Validé
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-on-surface">{TRANSPORTS[booking.transport].name}</h4>
                    <p className="text-[12px] text-on-surface-variant mt-1">
                      Antananarivo ⇄ {destination.airport} ({travelersLongLabel(booking)}) · {TRANSPORTS[booking.transport].detail}.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container flex items-baseline justify-between">
                    <span className="text-[12px] text-on-surface-variant">
                      {eur(q.transport.amount)} ({eur(q.transport.flights)} + {eur(q.transport.ground)})
                    </span>
                    <Link className="text-[12px] font-bold text-primary hover:underline" href="/reservation/options#section-materiel">
                      Configurer
                    </Link>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between border border-surface-container">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase text-primary tracking-wider">Étape 4.3 · Repas</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                        Validé
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-on-surface">{MEALS[booking.meals].name}</h4>
                    <p className="text-[12px] text-on-surface-variant mt-1">{MEALS[booking.meals].detail}.</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container flex items-baseline justify-between">
                    <span className="text-[12px] text-on-surface-variant">{eur(q.meals)} inclus</span>
                    <Link className="text-[12px] font-bold text-primary hover:underline" href="/reservation/options#section-restauration">
                      Configurer
                    </Link>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between border border-surface-container">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase text-primary tracking-wider">Étape 4.4 · Excursion</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${hasLokobe ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container-high text-on-surface-variant"}`}
                      >
                        {hasLokobe ? "Inclus" : "Non inclus"}
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-on-surface">Réserve de Lokobe MNP</h4>
                    <p className="text-[12px] text-on-surface-variant mt-1">Pirogue d&apos;Ampasipohy, pistage lémuriens et guide éco.</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container flex items-baseline justify-between">
                    <span className="text-[12px] text-on-surface-variant">
                      {eur(ACTIVITIES.lokobe.price.adult * booking.adults + ACTIVITIES.lokobe.price.child * booking.children)}
                      {hasLokobe ? " inclus" : ""}
                    </span>
                    <button
                      className="text-[12px] font-bold text-primary hover:underline"
                      onClick={() =>
                        update((b) => ({
                          activities: hasLokobe ? b.activities.filter((a) => a !== "lokobe") : [...b.activities, "lokobe"],
                        }))
                      }
                      type="button"
                    >
                      {hasLokobe ? "Retirer" : "Ajouter"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-surface-container-high">
            <div className="flex items-center justify-between pb-4 border-b border-surface-container">
              <div className="flex flex-col">
                <span className="text-[14px] uppercase tracking-wider text-secondary font-bold">Synthèse Financière</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Votre séjour</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
            </div>

            <div className="py-4 space-y-3.5 text-[14px] text-on-surface" aria-live="polite">
              {[
                { icon: "hotel", label: `Hébergement (${HOTELS[booking.hotel].name}, ${q.nights} n.)`, amount: q.hotel.amount },
                { icon: "flight", label: "Vols Madagascar Airlines A/R", amount: q.transport.flights },
                {
                  icon: "directions_car",
                  label: booking.transport === "private" ? "Navette 4x4 privée" : "Navette éco-partagée",
                  amount: q.transport.ground,
                },
                { icon: "restaurant", label: MEALS[booking.meals].name, amount: q.meals },
                ...booking.activities.map((id) => ({
                  icon: "forest",
                  label: ACTIVITIES[id].short,
                  amount: q.lines.find((l) => l.id === id)?.amount ?? 0,
                })),
                ...(q.discount > 0 ? [{ icon: "redeem", label: `Code promo ${booking.promo}`, amount: -q.discount }] : []),
              ].map((l) => (
                <div className="flex items-center justify-between gap-2" key={l.label}>
                  <span className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary">{l.icon}</span>
                    {l.label}
                  </span>
                  <span className="font-headline-sm text-[16px] font-bold shrink-0">{eur(l.amount)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-dashed border-surface-container-high bg-surface-container-low -mx-6 px-6 pb-4 rounded-b-xl">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-headline-sm text-[16px] text-on-surface font-bold">Total du séjour</span>
                <span className="font-display-lg text-display-lg text-primary leading-none">{eur(q.total)}</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant text-[14px]">
                <span>Dual Currency officiel</span>
                <span className="font-bold text-on-surface">~ {mga(q.total)}</span>
              </div>

              <div className={`mt-4 p-3.5 rounded-xl ${over ? "bg-tertiary/10" : "bg-secondary/10"}`}>
                <div
                  className={`flex items-center justify-between text-[14px] mb-2 font-bold ${over ? "text-tertiary" : "text-secondary"}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">savings</span> Budget cible : {eur(booking.budget)}
                  </span>
                  <span>{share.toFixed(1).replace(".", ",")}% utilisé</span>
                </div>
                <div
                  aria-label="Part du budget utilisée"
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={Math.min(100, Math.round(share))}
                  className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden"
                  role="progressbar"
                >
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-tertiary" : "bg-secondary"}`}
                    style={{ width: `${Math.min(100, share)}%` }}
                  ></div>
                </div>
                <p className={`text-[14px] font-bold mt-2.5 flex items-center gap-1.5 ${over ? "text-tertiary" : "text-secondary"}`}>
                  <span className="material-symbols-outlined text-[18px]">{over ? "arrow_upward" : "arrow_downward"}</span>
                  {over ? (
                    <>
                      {signedEur(q.gap)} au-dessus du budget ·{" "}
                      <Link className="underline" href="/reservation/budget">
                        voir les alternatives
                      </Link>
                    </>
                  ) : (
                    <>+{eur(-q.gap)} préservés pour vos activités sur place !</>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                className="w-full h-14 bg-tertiary hover:opacity-95 active:scale-[0.98] text-on-tertiary rounded-full text-[16px] font-bold flex items-center justify-center gap-3 shadow-lg shadow-tertiary-container/30 transition-all"
                href="/reservation/recapitulatif"
              >
                <span>Passer au Récapitulatif &amp; Paiement</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <p className="text-center text-[14px] text-on-surface-variant">{CANCELLATION.short} (7 jours avant le départ)</p>
            </div>

            <div className="mt-6 pt-5 border-t border-surface-container">
              <span className="text-[14px] text-on-surface-variant uppercase tracking-wider block mb-2.5 font-bold">
                Options de Règlement Sécurisé :
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[14px] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">credit_card</span>
                  CB 3x sans frais
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[14px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  MVola Ariary
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[14px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Orange Money
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-surface-container flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[14px] text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                <span>Sous convention Office National du Tourisme (ONTM)</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">headset_mic</span>
                <span>Assistance locale 24/7 à Antananarivo &amp; Hell-Ville</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-5 shadow-sm border border-surface-container">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">nature_people</span>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-on-surface">Fonds Fihavanana</h4>
                <p className="text-[14px] text-on-surface-variant mt-1 leading-relaxed">
                  {SOLIDARITY_RATE} de ce devis ({eur(q.impact, true)}) finance le fonds Fihavanana : {SOLIDARITY_USES}.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
