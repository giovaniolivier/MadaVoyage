"use client";

import Link from "next/link";
import { balanceDateLabel, useQuote } from "./BookingBits";
import { durationLabel, longRangeLabel, travelersLongLabel } from "./booking-store";
import { useMoney } from "@/components/currency/useCurrency";
import { DESTINATIONS, DOSSIER, HOTELS, MEALS, hotelUnit } from "./pricing";

export function ConfirmationView() {
  const { booking, q } = useQuote();
  const { eur, mga } = useMoney();
  const destination = DESTINATIONS[booking.destination];
  const deposit = booking.payNow === "deposit";
  const paid = deposit ? q.deposit : q.total;

  const steps = [
    {
      icon: "mark_email_read",
      title: "Confirmation et vouchers par email",
      text: "Votre quittance, vos billets Madagascar Airlines et les vouchers hôteliers arrivent dans votre boîte mail d'ici 10 minutes.",
    },
    {
      icon: "badge",
      title: "Passeports et visa",
      text: "Visa touristique à demander en ligne avant le départ ou à l'arrivée ; passeport valable 6 mois après le retour. Consultez nos conseils santé.",
      href: "/aide",
      cta: "FAQ santé & visas",
    },
    ...(deposit
      ? [
          {
            icon: "event_repeat",
            title: `Solde de ${eur(q.balance, true)} le ${balanceDateLabel(booking)}`,
            text: "Prélèvement automatique 15 jours avant l'arrivée, avec le même moyen de paiement. Rappel envoyé 3 jours avant.",
          },
        ]
      : []),
    {
      icon: "menu_book",
      title: "Préparez votre carnet de voyage",
      text: "Itinéraire jour par jour, liste d'affaires éco-responsable et contacts de vos guides, consultables hors connexion.",
      href: "/carnet",
      cta: "Ouvrir mon carnet",
    },
    {
      icon: "flight_land",
      title: `Accueil à l'aéroport de ${destination.airport}`,
      text: "Votre chauffeur-guide vous attend à la sortie des arrivées avec une pancarte MadaVoyage.",
    },
  ];

  return (
    <div className="flex flex-col gap-space-xl">
      <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center gap-space-lg">
        <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-md">
          <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <div className="flex-1">
          <p className="font-label-md text-label-md text-secondary font-bold">Dossier #{DOSSIER}</p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Réservation confirmée !</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Votre séjour <strong className="text-on-surface">{destination.name}</strong> du {longRangeLabel(booking)} est réservé. Misaotra
            betsaka, à très bientôt à Madagascar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            className="px-space-md py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm hover:bg-primary/90"
            onClick={() => window.print()}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Imprimer / PDF
          </button>
          <Link
            className="px-space-md py-2.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container-highest"
            href="/compte"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Mon espace voyageur
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-md">Prochaines étapes</h2>
            <ol className="flex flex-col gap-space-md">
              {steps.map((step, i) => (
                <li className="flex items-start gap-space-sm" key={step.title}>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                      <span className="sr-only">Étape {i + 1} : </span>
                      {step.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{step.text}</p>
                    {step.href && (
                      <Link
                        className="mt-1 inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline"
                        href={step.href}
                      >
                        {step.cta}
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="bg-surface-container-low rounded-lg p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md print:hidden">
            <div className="flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-tertiary text-[22px]">edit_calendar</span>
              <div>
                <h2 className="font-label-lg text-label-lg text-on-surface font-bold">Un imprévu ?</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Modification ou annulation sans frais jusqu&apos;à 7 jours avant le départ.
                </p>
              </div>
            </div>
            <Link
              className="px-space-md py-2 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm shrink-0 text-center"
              href="/modification"
            >
              Modifier ma réservation
            </Link>
          </section>
        </div>

        <aside className="lg:col-span-5 flex flex-col gap-space-lg">
          <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Règlement</h2>
            <div className="p-space-md rounded bg-secondary/10 flex items-center justify-between gap-space-sm">
              <div>
                <p className="font-label-md text-label-md text-secondary font-bold">
                  {deposit ? "Acompte réglé (30 %)" : "Séjour entièrement réglé"}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">≈ {mga(paid)}</p>
              </div>
              <span className="font-headline-md text-headline-md text-secondary font-bold">{eur(paid, true)}</span>
            </div>
            {deposit && (
              <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span>Solde restant, prélevé le {balanceDateLabel(booking)}</span>
                <span className="font-bold text-on-surface">{eur(q.balance, true)}</span>
              </div>
            )}
          </section>

          <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Votre séjour</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {durationLabel(booking)} · {travelersLongLabel(booking)}
              </p>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface">
              <strong>
                {HOTELS[booking.hotel].name} {HOTELS[booking.hotel].stars.split(" ")[0]}
              </strong>{" "}
              · {hotelUnit(booking).roomName} · {MEALS[booking.meals].name}
            </p>
            <ul className="flex flex-col gap-2">
              {q.lines.map((line) => (
                <li className="flex items-start justify-between gap-space-sm font-body-sm text-body-sm" key={line.id}>
                  <span className="flex items-start gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary">{line.icon}</span>
                    {line.label}
                  </span>
                  <span className="font-bold text-on-surface shrink-0">{eur(line.amount)}</span>
                </li>
              ))}
              {q.discount > 0 && (
                <li className="flex items-center justify-between font-body-sm text-body-sm text-secondary font-bold">
                  <span>Remise code {booking.promo}</span>
                  <span>−{eur(q.discount)}</span>
                </li>
              )}
            </ul>
            <div className="pt-space-sm border-t border-outline-variant/30 flex items-baseline justify-between">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">Total du séjour</span>
              <span className="font-headline-md text-headline-md text-primary font-bold">{eur(q.total)}</span>
            </div>
          </section>

          <p className="p-space-md bg-secondary/10 rounded flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
            <span className="material-symbols-outlined text-secondary text-[20px]">nature_people</span>
            {eur(q.impact, true)} de votre séjour financent le reboisement et la protection des lémuriens à Nosy Be.
          </p>
        </aside>
      </div>
    </div>
  );
}
