"use client";

import Link from "next/link";
import { DestinationNotice, useQuote } from "./BookingBits";
import {
  durationLabel,
  longRangeLabel,
  travelersCount,
  type ActivityId,
  type DietId,
  type MealId,
  type TransportId,
} from "./booking-store";
import { useMoney } from "@/components/currency/useCurrency";
import { ACTIVITIES, DESTINATIONS, DOSSIER, HOTELS, MEALS, TRANSPORTS, activityCost, mealCost, rateLabel, transportCost } from "./pricing";

const MEAL_CARDS: { id: MealId; text: string; tags?: string[] }[] = [
  {
    id: "breakfast",
    text: "Fruits exotiques cueillis du jour, confitures de litchis de Brickaville, jus de mangue et mofo gasy traditionnels.",
  },
  {
    id: "half",
    text: "Petits-déjeuners complets + dîners bistronomiques 3 plats au lodge : poisson grillé du jour, zébu braisé aux baies roses et vanille de Sambirano.",
    tags: ["Pêche raisonnée", "Vanille Bourbon"],
  },
  {
    id: "full",
    text: "Tous repas inclus (déjeuners panier pique-nique éco-conçu lors des excursions + dîners gastronomiques de fête malgache).",
  },
];

const DIETS: { id: DietId; label: string; hint: string; childOnly?: boolean }[] = [
  { id: "child", label: "Menu Enfant", hint: "Poissons doux, purées, portions adaptées", childOnly: true },
  { id: "veggie", label: "Végétarien / Pescétarien", hint: "Priorité aux légumes tropicaux et légumineuses" },
  { id: "gluten", label: "Sans Gluten / Allergies", hint: "Signalement transmis à la cuisine de l'hôtel" },
];

const ACTIVITY_CARDS: { id: ActivityId; img: string; badge: string; badgeClass: string; text: string; note: string }[] = [
  {
    id: "lokobe",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBphGsy0_Yu4n8OHWm4L0EFfrbaV-4dw1hyZuO3x-AlC4pQB_x6aHNUz-Z-pjuMjs3WATGdOxyf2l6F78FV1ccaTDE106Fqgyr1IcS643wjcwEE736JcXkUd1pFK9ITn1shTzLXSeR72taG1nW2RAVn3hVX5HplPp-g5iZgMYpwonlXgQvJl8Tb06jW47NWsGcqyDWOazpzMyM6eFfCLR7D0vMWkk7sLVkJZriT0k5neqvNYzqV87U",
    badge: "Parc National",
    badgeClass: "text-secondary",
    text: "Traversée douce en pirogue à balancier depuis le village d'Ambatozavavy, puis randonnée guidée au cœur de la forêt primaire : lémuriens Macaco noirs, caméléons panthères nains et pharmacopée traditionnelle avec un écoguide MNP.",
    note: "Guide MNP francophone dédié · Déjeuner créole inclus",
  },
  {
    id: "tanikely",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR5MHTqBgpe69zMaHwmayeiZdeErbkBoClRWBJ8XfmvOHttYSAM2iwVaBrbUh6w9QYy8GbgkFi3HfFIrvDRTUdkzkpMsMK8NH9pD7MWJMZeENxb563RtcE4ht_jVGLfvaSpvBshsRVfSN-dM3LcYLOhYVi_3NvdYzoIO8W7B0UKikZwXp5MR84S1oOn9ReZ7G7M5aXiFDrRM6rqOIUp-Ik6U8waeBzYR23GOMoXqDFFljcL4Hclnw",
    badge: "Réserve Marine MNP",
    badgeClass: "text-primary",
    text: "Journée snorkeling dans l'aquarium naturel protégé de Nosy Tanikely : tortues marines imbriquées, récifs de coraux préservés et observation respectueuse des dauphins à bosse.",
    note: "Palmes, masques et gilets adaptés aux enfants fournis à bord",
  },
  {
    id: "passot",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqid2a0DiUklHeQRpm38X1sZJTvAOaVNw8bJh63rkrXeDhAEsERuHq2aTs1lJQfJHwG_xFGtq8kKMXNQLp1l8brKShThwzzpIHHPsCBWlCSMNRXtjV9D8odR6TRQ9OPukHgxA_cJlkB6b8cJWv0eAwXXNl6BPfKHYvPQcghoRvYWW_pAw1hahT9C39tqZriR4qoNCPyH7Q7FDRhgT9npG947z69ub-dA-8_jV3sGddc7suKl5JMvY",
    badge: "Point Culminant",
    badgeClass: "text-tertiary",
    text: "Balade guidée le long des lacs sacrés de cratère, ascension facile jusqu'au belvédère à 329 m avec vue à 360° sur le canal du Mozambique.",
    note: "Départ en milieu d'après-midi (15h30)",
  },
];

const SLOTS = { morning: "Matin · départ 7h30", afternoon: "Après-midi · départ 13h00" } as const;

export function OptionsStep() {
  const { booking, update, q } = useQuote();
  const { eur, mga } = useMoney();
  const destination = DESTINATIONS[booking.destination];
  const total = travelersCount(booking);
  const over = q.gap > 0;

  const toggle = <T extends string>(list: T[], id: T) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface-container-low/60 py-space-sm">
        <div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-wrap items-center justify-end gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[15px] text-primary">folder_open</span>
              Dossier #{DOSSIER}
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">currency_exchange</span>
              {rateLabel()}
            </span>
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.03)] py-space-lg">
        <div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col gap-space-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-md bg-surface-container-low/40 p-space-md rounded-2xl">
            <div className="flex items-center gap-space-md">
              <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[30px]">nature_people</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Votre séjour sur mesure</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    {booking.children + booking.infants > 0 ? "Famille" : "Groupe"} · {total} personne{total > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant flex flex-wrap items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                  {longRangeLabel(booking)} ({durationLabel(booking).toLowerCase()})<span className="opacity-40">•</span>
                  <span className="material-symbols-outlined text-[16px] text-tertiary">location_on</span>
                  {destination.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-space-xs">
              {[
                { n: booking.adults, label: booking.adults > 1 ? "Adultes" : "Adulte", tone: "bg-primary/10 text-primary" },
                {
                  n: booking.children,
                  label: booking.children > 1 ? "Enfants" : "Enfant",
                  tone: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
                },
                {
                  n: booking.infants,
                  label: booking.infants > 1 ? "Bébés" : "Bébé",
                  tone: "bg-secondary-container text-on-secondary-container",
                },
              ]
                .filter((c) => c.n > 0)
                .map((c) => (
                  <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest rounded-xl shadow-sm" key={c.label}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${c.tone}`}>{c.n}</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{c.label}</span>
                  </div>
                ))}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary-container/40 text-on-secondary-container rounded-xl font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[16px]">park</span>
                Impact CO₂ compensé 100%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[
              { step: "Étape 1 · Validé", label: "Séjour", href: "/reservation/dates" },
              { step: "Étape 2 · Validé", label: `Destination ${destination.short}`, href: "/reservation/destination" },
              { step: "Étape 3 · Validé", label: "Budget", href: "/reservation/budget" },
            ].map((s) => (
              <div
                className="relative flex items-center gap-space-xs p-2 rounded-xl bg-surface-container-low transition-all hover:bg-surface-container"
                key={s.step}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase truncate">{s.step}</span>
                  <Link
                    className="font-label-md text-label-md text-on-surface font-semibold truncate hover:text-primary hover:underline after:absolute after:inset-0"
                    href={s.href}
                  >
                    {s.label}
                  </Link>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-space-xs p-2 rounded-xl bg-primary text-on-primary shadow-md">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase font-bold tracking-wider truncate">En cours</span>
                <span className="font-label-md text-label-md text-on-primary font-bold truncate">Séjour sur mesure</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs p-2 rounded-xl bg-surface-container/60 opacity-60">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-sm flex-shrink-0">
                5
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold truncate">Étape Finale</span>
                <span className="font-label-md text-label-md text-on-surface truncate">Paiement Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="Sections des options"
        className="w-full bg-surface-container-low/90 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)] sticky top-16 z-30 backdrop-blur-md"
      >
        <div className="max-w-[1440px] mx-auto px-margin-desktop flex items-center justify-between gap-space-md overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <Link
              className="shrink-0 whitespace-nowrap px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface text-label-md font-label-md shadow-sm flex items-center gap-2 transition-all"
              href="/reservation/composition"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
              <span>
                Hébergement :{" "}
                <strong>
                  {HOTELS[booking.hotel].name} ({eur(q.hotel.amount)})
                </strong>
              </span>
            </Link>
            {[
              { href: "#section-restauration", icon: "restaurant", label: "Restauration Locale" },
              { href: "#section-activites", icon: "sailing", label: "Activités & Excursions MNP" },
              { href: "#section-materiel", icon: "directions_car", label: "Transports & Matériel" },
            ].map((s) => (
              <a
                className="shrink-0 whitespace-nowrap px-4 py-2 rounded-full bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary text-label-md font-label-md flex items-center gap-2 transition-all"
                href={s.href}
                key={s.href}
              >
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                <span>{s.label}</span>
              </a>
            ))}
          </div>
          <div className="hidden xl:flex items-center gap-2 text-on-surface-variant text-body-sm font-body-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Sauvegarde automatique du devis
          </div>
        </div>
      </nav>

      <div className="w-full py-space-xl">
        <div className="max-w-[1440px] mx-auto px-margin-desktop">
          <DestinationNotice />
        </div>
        <div className="max-w-[1440px] mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          <div className="lg:col-span-8 flex flex-col gap-space-xl">
            <section
              className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm flex flex-col gap-space-lg scroll-mt-40"
              id="section-restauration"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">dinner_dining</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-headline-md text-headline-md text-on-surface">Restauration &amp; Terroir Éco-responsable</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                        100% Frais &amp; Solidaire
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Circuits courts, pêche artisanale et maraîchage bio local.
                    </p>
                  </div>
                </div>
                <span className="text-secondary font-label-md text-label-md font-semibold flex items-center gap-1 self-start md:self-auto bg-surface-container-low px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">eco</span>
                  Zero-Waste &amp; Anti-Gaspillage
                </span>
              </div>

              <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <legend className="sr-only">Formule de repas</legend>
                {MEAL_CARDS.map((m) => {
                  const active = booking.meals === m.id;
                  const price = mealCost(booking, m.id);
                  return (
                    <label
                      className={`rounded-2xl p-space-md flex flex-col justify-between relative cursor-pointer transition-all ${
                        active
                          ? "bg-surface-container-lowest shadow-md ring-2 ring-primary"
                          : "bg-surface-container-low/70 hover:bg-surface-container-low"
                      }`}
                      key={m.id}
                    >
                      {active && (
                        <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm">
                          Sélectionné
                        </span>
                      )}
                      <span className="flex flex-col gap-space-xs">
                        <span className="flex justify-between items-start gap-2">
                          <span className={`font-headline-sm text-headline-sm ${active ? "text-primary font-bold" : "text-on-surface"}`}>
                            {MEALS[m.id].name}
                          </span>
                          <input
                            checked={active}
                            className="w-5 h-5 accent-primary cursor-pointer shrink-0"
                            name="meal_plan"
                            onChange={() => update({ meals: m.id })}
                            type="radio"
                            value={m.id}
                          />
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{m.text}</span>
                        {m.tags && (
                          <span className="flex flex-wrap gap-1 pt-1">
                            {m.tags.map((t) => (
                              <span
                                className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px]"
                                key={t}
                              >
                                {t}
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className="pt-space-md flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{eur(price, true)}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          ~ {mga(price)} · {total} pers. · {q.nights} nuits
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              <fieldset className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm">
                <legend className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5 float-left mb-space-sm">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">check_box</span>
                  Préférences &amp; Régimes Alimentaires enregistrés pour le dossier :
                </legend>
                <div className="clear-left grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  {DIETS.filter((d) => !d.childOnly || booking.children > 0).map((d) => (
                    <label
                      className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-lowest cursor-pointer shadow-sm"
                      key={d.id}
                    >
                      <input
                        checked={booking.diets.includes(d.id)}
                        className="w-4 h-4 accent-primary"
                        onChange={() => update((b) => ({ diets: toggle(b.diets, d.id) }))}
                        type="checkbox"
                      />
                      <span className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface font-bold">{d.label}</span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant">{d.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </section>

            <section
              className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm flex flex-col gap-space-lg scroll-mt-40"
              id="section-activites"
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">kayaking</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-headline-md text-headline-md text-on-surface">Activités &amp; Excursions Nature MNP</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                      Madagascar National Parks
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Guides naturalistes locaux certifiés, droit d&apos;entrée dans les aires protégées et conservation active de la faune.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-space-md">
                {ACTIVITY_CARDS.map((a) => {
                  const included = booking.activities.includes(a.id);
                  const price = activityCost(booking, a.id);
                  return (
                    <article
                      className={`rounded-2xl p-space-md flex flex-col md:flex-row gap-space-md transition-all ${
                        included
                          ? "bg-surface-container-lowest shadow-md ring-2 ring-primary"
                          : "bg-surface-container-low/60 hover:bg-surface-container-low"
                      }`}
                      key={a.id}
                    >
                      <div
                        aria-label={ACTIVITIES[a.id].name}
                        className="w-full md:w-56 h-44 md:h-auto min-h-[11rem] rounded-xl bg-cover bg-center flex-shrink-0 relative overflow-hidden"
                        role="img"
                        style={{ backgroundImage: `url('${a.img}')` }}
                      >
                        <span
                          className={`absolute top-2 left-2 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-label-sm text-label-sm font-bold shadow-sm ${a.badgeClass}`}
                        >
                          {a.badge}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between flex-1 gap-space-sm">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{ACTIVITIES[a.id].name}</h3>
                            {included ? (
                              <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shrink-0">
                                Inclus au devis
                              </span>
                            ) : (
                              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold shrink-0">
                                + {eur(price, true)}
                              </span>
                            )}
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{a.text}</p>
                          <p className="font-body-sm text-[12px] text-secondary font-medium">✓ {a.note}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-surface-container-high/40">
                          <div className="flex flex-col">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{eur(price, true)}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              ~ {mga(price)} · forfait {booking.adults + booking.children} pers.
                              {booking.infants > 0 ? " (bébés offerts)" : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {a.id === "lokobe" && included && (
                              <label className="flex items-center gap-1 px-3 py-2 rounded-full bg-surface-container-highest text-on-surface-variant font-label-md text-label-md font-semibold">
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                <span className="sr-only">Horaire de l&apos;excursion</span>
                                <select
                                  className="bg-transparent focus:outline-none cursor-pointer"
                                  onChange={(e) => update({ lokobeSlot: e.target.value as keyof typeof SLOTS })}
                                  value={booking.lokobeSlot}
                                >
                                  {Object.entries(SLOTS).map(([k, v]) => (
                                    <option key={k} value={k}>
                                      {v}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            )}
                            <button
                              aria-pressed={included}
                              className={`px-5 py-2.5 rounded-full font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                                included
                                  ? "bg-surface-container-high text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                                  : "bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary"
                              }`}
                              onClick={() => update((b) => ({ activities: toggle(b.activities, a.id) }))}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">{included ? "remove_circle" : "add_circle"}</span>
                              {included ? "Retirer du devis" : "Ajouter au devis"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section
              className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm flex flex-col gap-space-lg scroll-mt-40"
              id="section-materiel"
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">commute</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Transports et équipements</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Vols intérieurs Madagascar Airlines et logistique sécurisée avec chauffeur-guide certifié.
                  </p>
                </div>
              </div>

              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <legend className="sr-only">Formule de transport</legend>
                {(Object.keys(TRANSPORTS) as TransportId[]).map((id) => {
                  const active = booking.transport === id;
                  const cost = transportCost(booking, id);
                  return (
                    <label
                      className={`p-space-md rounded-2xl flex flex-col gap-2 cursor-pointer transition-all ${
                        active
                          ? "bg-surface-container-lowest shadow-md ring-2 ring-primary"
                          : "bg-surface-container-low hover:bg-surface-container"
                      }`}
                      key={id}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-headline-sm text-headline-sm text-on-surface">{TRANSPORTS[id].name}</span>
                        <input
                          checked={active}
                          className="w-5 h-5 accent-primary shrink-0"
                          name="transport"
                          onChange={() => update({ transport: id })}
                          type="radio"
                          value={id}
                        />
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {TRANSPORTS[id].detail}. Vols Antananarivo ⇄ {destination.airport}.
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        {eur(cost.amount)}{" "}
                        <span className="font-normal text-on-surface-variant">
                          ({eur(cost.flights)} vols + {eur(cost.ground)} transferts)
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col justify-between gap-space-md">
                  <div className="p-3 rounded-xl bg-surface-container-lowest flex items-start gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">verified_user</span>
                    <span className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">Chauffeur-Guide Assermenté</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        Aucune obligation de permis de conduire local. Carburant et assurances tous risques inclus.
                      </span>
                    </span>
                  </div>
                  {booking.children > 0 && (
                    <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input
                          checked={booking.childSeat}
                          className="w-4 h-4 accent-primary"
                          onChange={(e) => update({ childSeat: e.target.checked })}
                          type="checkbox"
                        />
                        <span className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold">Siège Auto Réhausseur Homologué</span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            {booking.children > 1 ? `${booking.children} sièges préconfigurés` : "Préconfiguré pour votre enfant"}
                          </span>
                        </span>
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary font-bold">Gratuit (0 €)</span>
                    </label>
                  )}
                </div>

                <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-headline-sm text-on-surface">Pack Observation &amp; Bivouac</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                        Inclus (0 €)
                      </span>
                    </div>
                    <ul className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Jumelles étanches HD 10x42 (faune &amp; oiseaux)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>{total} lampes frontales solaires (lumière rouge non agressive)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>{total} gourdes filtrantes inox isothermes 1L sans plastique</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-highest/60 flex items-center justify-between text-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">inventory_2</span>
                      Caution matériel 0 € (prise en charge par MadaVoyage)
                    </span>
                    <span className="font-label-sm text-label-sm font-bold text-primary">Validé</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-36 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-xl flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/60">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Synthèse en direct</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Dossier #{DOSSIER}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">shield</span> Garanti
                </span>
              </div>

              <div className="flex flex-col gap-3 font-body-md text-body-md" aria-live="polite">
                {q.lines.map((l) => (
                  <div
                    className={`flex items-start justify-between gap-2 ${l.id === "hotel" || l.id === "transport" ? "" : "bg-primary-fixed/20 p-2 rounded-xl"}`}
                    key={l.id}
                  >
                    <div className="flex flex-col">
                      <span className="text-on-surface font-medium">{l.label}</span>
                      <span className="text-on-surface-variant font-body-sm text-xs">{l.detail}</span>
                    </div>
                    <span className="text-on-surface font-semibold text-right shrink-0">{eur(l.amount, true)}</span>
                  </div>
                ))}
                <div className="flex items-start justify-between text-on-surface-variant text-body-sm">
                  <span>Pack matériel{booking.children > 0 && booking.childSeat ? " & siège enfant" : ""}</span>
                  <span className="text-secondary font-semibold">0,00 € (Offert)</span>
                </div>
                {q.discount > 0 && (
                  <div className="flex items-start justify-between text-body-sm">
                    <span className="text-on-surface-variant">Code promo {booking.promo}</span>
                    <span className="text-secondary font-semibold">−{eur(q.discount, true)}</span>
                  </div>
                )}
              </div>

              <div className="pt-space-sm border-t border-surface-container-high/60 flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Total Séjour TTC</span>
                  <div className="flex flex-col items-end">
                    <span className="font-display-lg text-[32px] leading-tight text-on-surface font-extrabold">{eur(q.total, true)}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">~ {mga(q.total)}</span>
                  </div>
                </div>
                <Link
                  className={`px-3 py-2 rounded-xl flex items-center justify-between ${over ? "bg-tertiary-fixed/50 text-on-tertiary-fixed-variant" : "bg-secondary-container/60 text-on-secondary-container"}`}
                  href="/reservation/budget"
                >
                  <span className="flex items-center gap-1.5 font-label-md text-label-md font-semibold">
                    <span className="material-symbols-outlined text-[18px]">{over ? "warning" : "verified"}</span>
                    {over ? "Budget dépassé" : "Respect du Budget Fixé"}
                  </span>
                  <span className="font-label-md text-label-md font-bold">
                    {eur(q.total)} / {eur(booking.budget)}
                  </span>
                </Link>
              </div>

              <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col gap-2 font-body-sm text-body-sm">
                <div className="flex justify-between items-center text-on-surface">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <strong>Acompte 30% requis (Étape 5) :</strong>
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-tertiary">{eur(q.deposit, true)}</span>
                    <span className="text-[11px] block text-on-surface-variant">~ {mga(q.deposit)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant pt-1 border-t border-surface-container-high/40">
                  <span>Solde 70% (prélevé à J-15 du départ) :</span>
                  <div className="text-right">
                    <span className="font-semibold text-on-surface">{eur(q.balance, true)}</span>
                    <span className="text-[11px] block text-on-surface-variant">~ {mga(q.balance)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs pt-1">
                <Link
                  className="w-full h-14 rounded-full bg-tertiary text-on-tertiary hover:bg-tertiary-container hover:text-on-tertiary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] text-center"
                  href="/reservation/recapitulatif"
                >
                  <span>Continuer vers l&apos;Étape 5 · Paiement Sécurisé</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
                <span className="text-center font-body-sm text-[12px] text-on-surface-variant">
                  Aucun débit immédiat lors de cette étape de validation.
                </span>
              </div>

              <div className="pt-space-sm border-t border-surface-container-high/60 flex flex-col gap-2 font-body-sm text-[12px] text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">event_available</span>
                  <span>
                    Annulation gratuite 100% sans frais jusqu&apos;à <strong>J-7 avant départ</strong>.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">currency_exchange</span>
                  <span>
                    Facturé en euros, Ariary indicatifs : <strong>{rateLabel()}</strong>.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">support_agent</span>
                  <span>Assistance conciergerie WhatsApp 7j/7 basée à Antananarivo.</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center gap-space-sm shadow-sm">
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">handshake</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface font-bold">Tourisme Solidaire &amp; Équitable</span>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight">
                  Sur ces {eur(q.total)}, <strong>84%</strong> sont directement reversés aux coopératives et écoguides locaux.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
