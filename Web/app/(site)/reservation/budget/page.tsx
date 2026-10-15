"use client";

import Link from "next/link";
import { useState } from "react";
import ApplyAlternativeButton from "@/components/reservation/ApplyAlternativeButton";
import { BookingFromUrl, DestinationNotice, useQuote } from "@/components/reservation/BookingBits";
import { addDays, durationLabel, nightsOf, rangeLabel, travelersCount, type Booking } from "@/components/reservation/booking-store";
import { useMoney } from "@/components/currency/useCurrency";
import { DESTINATIONS, HOTELS, quote, rateLabel, shorterStay } from "@/components/reservation/pricing";

type Alternative = {
  id: "hotel" | "transport" | "duration";
  variant: "primary" | "secondary";
  img: string;
  alt: string;
  tag: { icon: string; label: string; className: string };
  kicker: string;
  rating: React.ReactNode;
  title: string;
  description: React.ReactNode;
  bullets: { icon: string; text: React.ReactNode; className?: string }[];
  patch: Partial<Booking> | null;
  undo: Partial<Booking>;
  applied: boolean;
};

const BUDGET_MIN = 300;
const BUDGET_MAX = 20000;

export default function Page() {
  const { booking, update, q } = useQuote();
  const { eur, mga, signedEur } = useMoney();
  const [editingBudget, setEditingBudget] = useState(false);
  const [draftBudget, setDraftBudget] = useState("");
  const [shortened, setShortened] = useState<Partial<Booking> | null>(null);
  const nights = nightsOf(booking);
  const destination = DESTINATIONS[booking.destination];
  const overBudget = q.gap > 0;
  const gapPercent = booking.budget > 0 ? Math.abs((q.gap / booking.budget) * 100) : 0;

  const shortPatch = shorterStay(booking);
  const alternatives: Alternative[] = [
    {
      id: "hotel",
      variant: "primary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtuXev3iCPfZwGHTEfg7wXhzZjdwqlNWhd4bzUnhcRAIFvJ5JZXx-I1sdXjfnLRfNGSl7ct_s6oydegohpLTMwiR3f0Q8Klafd6-VCDS5WaN5PeAnzSkcYDPsyjtZCIUhHRpygQ5RwE_U5PxpN7vnS7bDGQx35Doy1WlEgha0E0Q6hUJAIrr-WLVcADP_mfvqJdFRB6njDR52NnRJH-a_b4D0Ae7er4dxQWfKGKpmoqIhaYNIV51Y",
      alt: "Bungalow écolodge en palissandre et toit de raphia sur la baie de Madirokely, Nosy Be",
      tag: { icon: "recommend", label: "Recommandé par nos experts", className: "bg-primary text-on-primary" },
      kicker: "Hébergement Éco-Charme",
      rating: <>3★ Charme</>,
      title: "Alternative Hébergement de Charme",
      description: (
        <>
          Remplacement du {HOTELS[booking.hotel === "heure-bleue" ? "manga-soa" : booking.hotel].name} par{" "}
          <strong>L&apos;Heure Bleue 3★ Charme</strong> (écolabel 100% énergie solaire, niché dans la baie préservée de Madirokely).
        </>
      ),
      bullets: [
        { icon: "check_circle", text: <>Mêmes dates conservées ({rangeLabel(booking)})</> },
        { icon: "check_circle", text: "Mêmes vols réguliers Madagascar Airlines inclus" },
        { icon: "check_circle", text: "Excursions et formule repas préservées" },
        { icon: "solar_power", text: "Écolabel certifié neutralité carbone", className: "text-on-surface-variant" },
      ],
      patch: { hotel: "heure-bleue" },
      undo: { hotel: "manga-soa" },
      applied: booking.hotel === "heure-bleue",
    },
    {
      id: "transport",
      variant: "primary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgfD6WJMNmOt-4JyWmmLVvSQx43y-BoFuQ6X9lGYAGG2Y0mKTCninwU80L8n9roJ8uLq_MNJy0wemoeJHusJBxZUhg3zcAxH9kXNnyok9rcvrrC0O6Tv7uYnvyVLIlaWA4CcKFF27EqOUlYsCd-k76cLk5Cc5WYiwlxq7IAQ8gSvtPvJQfvbxdyXsVRCHk3uEZb960MBG4Z2f4pCXA8LCHWSUlWitzc829v6cmR_fGavvurtQBlfw",
      alt: "Navette électrique sur une piste de latérite bordée de plantations d'ylang-ylang à Nosy Be",
      tag: { icon: "airport_shuttle", label: "Mobilité Partagée", className: "bg-secondary text-on-secondary" },
      kicker: "Logistique Raisonnée",
      rating: <>{HOTELS[booking.hotel].stars.split(" ")[0]} conservé</>,
      title: "Alternative Transport & Transferts",
      description: (
        <>
          Remplacement du 4x4 individuel par la <strong>navette éco-partagée</strong> combinée à un vol aller en horaire matinal
          promotionnel Madagascar Airlines.
        </>
      ),
      bullets: [
        {
          icon: "check_circle",
          text: (
            <>
              <strong>{HOTELS[booking.hotel].name}</strong> intégralement maintenu
            </>
          ),
        },
        { icon: "check_circle", text: <>Mêmes dates de vacances ({nights} nuits complètes)</> },
        { icon: "check_circle", text: "Réduction d'empreinte carbone transport de 38%" },
        { icon: "schedule", text: "Décollage d'Antananarivo à 06h45 au lieu de 11h15", className: "text-on-surface-variant" },
      ],
      patch: { transport: "shared" },
      undo: { transport: "private" },
      applied: booking.transport === "shared",
    },
    {
      id: "duration",
      variant: "secondary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVMEB7coQ8sECzBN05B49pzsxKkmaczQ2_yrwk_iB2KTv--pfTGz4EXCDi15kjKTbUvRtwggzZGSocInAWDl13SfTUw9uVQi9X67wlVoQpe1hs987W6NWJ99uHhiQ0djFFwtQXg4j9v6-FzyOEcYxNCt7C7JP_hml0uV1A5L0jbl2Udkp2UZh6FyiTiBWCFQ2bz7_vemNO1NxxIS1hcTh9-F76eMQWsgdFzuj8Qu9Vw63A-ZY-nYY",
      alt: "Plage de sable blanc et banc de sable reliant les deux îlots de Nosy Iranja au coucher du soleil",
      tag: { icon: "price_check", label: "Formule Concentrée", className: "bg-secondary text-on-secondary" },
      kicker: "Ajustement de durée",
      rating: <>−2 nuits</>,
      title: "Alternative Ajustement de Durée",
      description: shortened ? (
        <>
          Séjour condensé appliqué : <strong>{durationLabel(booking)}</strong>, en préservant votre hébergement et toutes vos sorties
          guidées.
        </>
      ) : shortPatch ? (
        <>
          Séjour condensé sur <strong>{durationLabel({ ...booking, ...shortPatch })}</strong> (au lieu de {nights} nuits) en préservant
          votre hébergement et toutes vos sorties guidées.
        </>
      ) : (
        <>Votre séjour est déjà trop court pour être condensé davantage (3 nuits minimum).</>
      ),
      bullets: [
        {
          icon: "check_circle",
          text: (
            <>
              <strong>{HOTELS[booking.hotel].name}</strong> conservé
            </>
          ),
        },
        { icon: "check_circle", text: "Transferts & vols Madagascar Airlines inclus" },
        { icon: "check_circle", text: "100% des excursions programmées maintenues" },
        { icon: "event", text: "Même date d'arrivée, départ de Madagascar avancé de 2 jours", className: "text-on-surface-variant" },
      ],
      patch: shortPatch,
      undo: shortened ?? {},
      applied: shortened !== null,
    },
  ];

  const saveBudget = () => {
    const value = Number.parseInt(draftBudget, 10);
    if (Number.isFinite(value)) update({ budget: Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, value)) });
    setEditingBudget(false);
  };

  return (
    <>
      <main className="w-full pt-20 bg-background">
        <div className="max-w-[1280px] mx-auto px-gutter-desktop min-h-[calc(100vh-80px)]">
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-[1200px] mx-auto pt-space-md pb-space-xl">
              <div className="bg-surface-container-lowest rounded p-space-lg shadow-sm mb-space-xl">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-surface-container-highest -z-0"></div>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-primary-container -z-0" style={{ width: "50%" }}></div>

                  {[
                    { label: "1. Séjour", sub: rangeLabel(booking), href: "/reservation/dates" },
                    { label: "2. Destination", sub: destination.short, href: "/reservation/destination" },
                  ].map((s) => (
                    <div className="relative flex flex-col items-center z-10" key={s.label}>
                      <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </div>
                      <Link
                        className="font-label-sm text-label-sm text-secondary font-bold mt-space-xs hover:underline after:absolute after:inset-0"
                        href={s.href}
                      >
                        {s.label}
                      </Link>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{s.sub}</span>
                    </div>
                  ))}

                  <div className="relative flex flex-col items-center z-10">
                    <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-tertiary-container flex items-center justify-center shadow-md ring-4 ring-tertiary-container/20">
                      <span className="material-symbols-outlined text-[22px]">balance</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-tertiary font-bold mt-space-xs flex items-center gap-1">
                      <span>3. Budget</span>
                      {overBudget && <span className="w-2 h-2 rounded-full bg-tertiary-container inline-block animate-pulse"></span>}
                    </span>
                    <span className="font-label-sm text-label-sm text-tertiary-container font-semibold text-[11px]">
                      {overBudget ? "Arbitrage requis" : "Budget respecté"}
                    </span>
                  </div>

                  <div className="relative flex flex-col items-center z-10 opacity-45">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                      <span className="font-label-md text-label-md">4</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-space-xs">4. Offre</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Personnalisation</span>
                  </div>

                  <div className="relative flex flex-col items-center z-10 opacity-45">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                      <span className="font-label-md text-label-md">5</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-space-xs">5. Paiement</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Validation finale</span>
                  </div>
                </div>
              </div>

              <BookingFromUrl />
              <DestinationNotice />

              <div className="bg-surface-container-lowest rounded p-space-lg shadow-sm mb-space-xl overflow-hidden relative">
                <div className="bg-surface-container rounded p-space-lg mb-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                  <div className="flex items-start gap-space-md">
                    <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[28px]">balance</span>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-lowest text-tertiary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-1">
                        <span className="material-symbols-outlined text-[14px]">tune</span>
                        Optimisation personnalisée
                      </div>
                      <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                        {overBudget ? "Ajustement budgétaire recommandé pour votre séjour" : "Votre séjour respecte votre budget"} ·{" "}
                        {destination.short}
                      </h1>
                    </div>
                  </div>
                  <div className="inline-flex items-center self-start md:self-center gap-2 px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-secondary text-[18px]">currency_exchange</span>
                    <span>{rateLabel()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
                  <div className="p-space-md rounded bg-surface-container-low flex flex-col justify-between">
                    <div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
                      <span className="font-label-md text-label-md font-medium">Budget total du groupe</span>
                      <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
                    </div>
                    {editingBudget ? (
                      <form
                        className="flex items-center gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          saveBudget();
                        }}
                      >
                        <label className="sr-only" htmlFor="budget-input">
                          Nouveau budget total du groupe, en euros
                        </label>
                        <input
                          autoFocus
                          className="w-32 h-11 px-3 rounded bg-surface-container-lowest font-headline-sm text-headline-sm text-primary font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                          id="budget-input"
                          inputMode="numeric"
                          max={BUDGET_MAX}
                          min={BUDGET_MIN}
                          onChange={(e) => setDraftBudget(e.target.value)}
                          step={50}
                          type="number"
                          value={draftBudget}
                        />
                        <span className="font-headline-sm text-headline-sm text-primary">€</span>
                        <button className="h-11 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md" type="submit">
                          OK
                        </button>
                      </form>
                    ) : (
                      <div>
                        <div className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">{eur(booking.budget)}</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">
                          ~ {mga(booking.budget)} · soit {eur(booking.budget / travelersCount(booking))} / pers.
                        </div>
                      </div>
                    )}
                    <div className="mt-space-sm pt-space-xs flex items-center justify-between gap-1 font-body-sm text-body-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        <span>Objectif voyageur enregistré</span>
                      </span>
                      {!editingBudget && (
                        <button
                          className="text-primary font-semibold hover:underline"
                          onClick={() => {
                            setDraftBudget(String(booking.budget));
                            setEditingBudget(true);
                          }}
                          type="button"
                        >
                          Modifier
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-space-md rounded bg-surface-container-high flex flex-col justify-between">
                    <div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
                      <span className="font-label-md text-label-md font-medium">Coût estimé actuel</span>
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">shopping_cart_checkout</span>
                    </div>
                    <div>
                      <div className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{eur(q.total)}</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">~ {mga(q.total)}</div>
                    </div>
                    <div className="mt-space-sm pt-space-xs flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-primary">hotel</span>
                      <span>
                        {durationLabel(booking)} · {booking.adults + booking.children + booking.infants} voyageurs
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-space-md rounded flex flex-col justify-between ${overBudget ? "bg-tertiary-fixed/30" : "bg-secondary-container/40"}`}
                  >
                    <div className={`flex items-center justify-between mb-space-xs ${overBudget ? "text-tertiary" : "text-secondary"}`}>
                      <span className="font-label-md text-label-md font-bold">{overBudget ? "Écart à arbitrer" : "Marge préservée"}</span>
                      <span className="material-symbols-outlined text-[20px]">{overBudget ? "trending_up" : "savings"}</span>
                    </div>
                    <div aria-live="polite">
                      <div
                        className={`font-headline-lg text-headline-lg font-bold tracking-tight ${overBudget ? "text-tertiary" : "text-secondary"}`}
                      >
                        {overBudget ? signedEur(q.gap) : eur(-q.gap)}
                      </div>
                      <div className={`font-label-sm text-label-sm ${overBudget ? "text-tertiary" : "text-secondary"}`}>
                        {overBudget ? "+ " : ""}
                        {mga(Math.abs(q.gap))} ({overBudget ? "+" : "−"}
                        {gapPercent.toFixed(1).replace(".", ",")}%)
                      </div>
                    </div>
                    <div
                      className={`mt-space-sm pt-space-xs flex items-center gap-1 font-body-sm text-body-sm font-medium ${overBudget ? "text-tertiary" : "text-secondary"}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>{overBudget ? "3 solutions douces ci-dessous" : "Les alternatives restent disponibles"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-space-md rounded bg-surface-container-low flex items-start gap-space-md">
                  <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">sentiment_satisfied</span>
                  <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    <p className="mb-1 text-on-surface font-semibold">Une démarche transparente et sans compromis sur l&apos;essentiel :</p>
                    <p>
                      {overBudget ? (
                        <>
                          Votre sélection actuelle ({HOTELS[booking.hotel].name}, vols Madagascar Airlines et guides assermentés de Madagascar National
                          Parks) dépasse votre enveloppe de {eur(booking.budget)}. Découvrez ci-dessous nos{" "}
                          <strong>3 alternatives éco-responsables</strong> pour combler cet écart en toute sérénité.
                        </>
                      ) : (
                        <>
                          Votre sélection tient dans votre enveloppe de {eur(booking.budget)}. Vous pouvez la conserver telle quelle ou
                          appliquer une alternative pour augmenter votre marge.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <div className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider mb-1">
                    Solutions d&apos;arbitrage immédiates
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Choisissez l&apos;ajustement qui correspond le mieux à vos priorités
                  </h2>
                </div>
                <span className="hidden md:flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                  Impact écologique neutre ou renforcé
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-space-xl">
                {alternatives.map((a) => {
                  const after = a.applied || !a.patch ? q : quote({ ...booking, ...a.patch });
                  const before = a.applied ? quote({ ...booking, ...a.undo }) : q;
                  const gain = before.total - after.total;
                  const fits = after.total <= booking.budget;
                  return (
                    <div
                      className={`bg-surface-container-lowest rounded overflow-hidden transition-all flex flex-col justify-between group relative ${
                        fits && a.patch ? "shadow-md ring-2 ring-secondary/30 hover:shadow-lg" : "shadow-sm hover:shadow-md"
                      }`}
                      key={a.id}
                    >
                      {fits && (a.patch || a.applied) && (
                        <div className="absolute top-0 right-0 bg-secondary text-on-secondary px-space-md py-1 rounded-bl font-label-sm text-label-sm font-bold z-20 flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">task_alt</span>
                          DANS LE BUDGET
                        </div>
                      )}
                      <div>
                        <div className="relative h-48 w-full overflow-hidden">
                          <div
                            aria-label={a.alt}
                            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                            role="img"
                            style={{ backgroundImage: `url('${a.img}')` }}
                          ></div>
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                            <span
                              className={`inline-flex items-center gap-1 px-space-sm py-1 rounded-full font-label-sm text-label-sm font-bold shadow-sm ${a.tag.className}`}
                            >
                              <span className="material-symbols-outlined text-[14px]">{a.tag.icon}</span>
                              {a.tag.label}
                            </span>
                          </div>
                          {gain > 0 && (
                            <div className="absolute bottom-3 right-3 px-space-sm py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm font-bold shadow-xs">
                              Gain : −{eur(gain)}
                            </div>
                          )}
                        </div>

                        <div className="p-space-lg">
                          <div className="flex items-center justify-between mb-space-xs">
                            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                              {a.kicker}
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
                              {a.rating}
                            </span>
                          </div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-sm leading-snug">
                            {a.title}
                          </h3>
                          <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{a.description}</p>
                          <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface mb-space-lg">
                            {a.bullets.map((b, i) => (
                              <li className={`flex items-center gap-2 ${b.className ?? ""}`} key={i}>
                                <span
                                  className={`material-symbols-outlined text-[18px] ${b.icon === "check_circle" ? "text-secondary" : "text-primary"}`}
                                >
                                  {b.icon}
                                </span>
                                <span>{b.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-space-lg pt-0">
                        <div
                          className={`p-space-sm rounded mb-space-md flex items-center justify-between ${fits ? "bg-secondary-container/30" : "bg-surface-container-low"}`}
                        >
                          <span className="font-label-md text-label-md text-on-surface-variant">
                            {a.applied ? "Total actuel :" : "Nouveau total :"}
                          </span>
                          <div className="text-right">
                            <span className={`font-headline-sm text-headline-sm font-bold ${fits ? "text-secondary" : "text-on-surface"}`}>
                              {eur(after.total)}
                            </span>
                            <span className="block font-label-sm text-label-sm text-on-surface-variant">
                              ~ {mga(after.total)} ({fits ? "sous votre budget" : `écart : ${signedEur(after.total - booking.budget)}`})
                            </span>
                          </div>
                        </div>
                        {a.patch || a.applied ? (
                          <ApplyAlternativeButton
                            applied={a.applied}
                            onApply={() => {
                              if (!a.patch) return;
                              if (a.id === "duration")
                                setShortened(booking.travelMonth ? { monthNights: nights } : { departure: booking.departure });
                              update(a.patch);
                            }}
                            variant={a.variant}
                          />
                        ) : (
                          <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
                            Alternative indisponible pour ce séjour.
                          </p>
                        )}
                        {a.applied && (
                          <button
                            className="mt-space-xs w-full text-center font-label-md text-label-md text-primary hover:underline"
                            onClick={() => {
                              update(a.undo);
                              if (a.id === "duration") setShortened(null);
                            }}
                            type="button"
                          >
                            Annuler cette alternative
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-surface-container-lowest rounded p-space-lg shadow-sm mb-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                    <span className="material-symbols-outlined text-[20px]">edit_note</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Vous préférez ne rien changer ou modifier votre budget ?
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Vous pouvez valider l&apos;estimation actuelle à {eur(q.total)} ou recalculer librement votre enveloppe.
                    </p>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-space-sm w-full md:w-auto shrink-0">
                  <Link
                    className="h-[48px] px-space-md rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                    href="/simulateur"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span>Ajuster manuellement</span>
                  </Link>
                  <Link
                    className="h-[48px] px-space-lg rounded-full bg-surface-container-highest hover:bg-surface-container text-on-surface font-label-md text-label-md font-bold transition-colors flex items-center gap-2 cursor-pointer"
                    href="/reservation/composition"
                  >
                    <span>Continuer avec l&apos;offre actuelle ({eur(q.total)})</span>
                    <span className="material-symbols-outlined text-[18px]">east</span>
                  </Link>
                </div>
              </div>

              <div className="bg-surface-container rounded p-space-lg shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-space-lg items-center">
                  <div className="md:col-span-1 flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">verified</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider block">
                        Engagement Éthique
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Garantie Fihavanana</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">lock_reset</span>
                    <div>
                      <h5 className="font-label-md text-label-md text-on-surface font-bold">Zéro frais cachés</h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Le montant validé est ferme. Taxes de séjour, droits des parcs et transferts toujours inclus.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">currency_exchange</span>
                    <div>
                      <h5 className="font-label-md text-label-md text-on-surface font-bold">Facturé en euros</h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Le change ne modifie pas le prix du voyage. Les montants en Ariary sont indicatifs ({rateLabel()}).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">volunteer_activism</span>
                    <div>
                      <h5 className="font-label-md text-label-md text-on-surface font-bold">Impact communautaire</h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        10% de la marge reversés aux coopératives de pêcheurs et reboisement de mangroves.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
