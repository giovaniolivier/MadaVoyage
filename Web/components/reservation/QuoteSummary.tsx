"use client";

import { useState } from "react";
import { useQuote } from "./BookingBits";
import { durationLabel, longRangeLabel, stayEnd, travelersLongLabel } from "./booking-store";
import { FieldError } from "./FormCheck";
import { useMoney } from "@/components/currency/useCurrency";
import { DESTINATIONS, DOSSIER } from "./pricing";
import { fetchServerQuote } from "./quote-api";

const KNOWN_TRAVELERS = {
  adult: [
    { name: "Alexandre Fontaine", passport: "22AF98104", expiry: "18/06/2030" },
    { name: "Clara Fontaine", passport: "24CF12890", expiry: "12/09/2029" },
  ],
  child: [{ name: "Enzo Fontaine", passport: "25EF77412", expiry: "04/03/2028" }],
  infant: [] as { name: string; passport: string; expiry: string }[],
};

const ROLE = {
  adult: { icon: "person", tag: "Adulte", label: (i: number) => (i === 0 ? "Adulte principal" : "Adulte accompagnateur") },
  child: { icon: "child_care", tag: "Enfant", label: (_: number, age?: number | null) => (age ? `Enfant, ${age} ans` : "Enfant") },
  infant: { icon: "child_friendly", tag: "Bébé", label: () => "Bébé" },
};

const fieldClass =
  "h-10 px-3 bg-surface-container-lowest rounded font-body-sm text-[13px] text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40";

/** Une fiche passeport par voyageur déclaré à l'étape 1. */
export function PassengerFields() {
  const { booking } = useQuote();
  const travelers = (["adult", "child", "infant"] as const).flatMap((role) => {
    const count = role === "adult" ? booking.adults : role === "child" ? booking.children : booking.infants;
    return Array.from({ length: count }, (_, i) => ({ role, i, known: KNOWN_TRAVELERS[role][i] }));
  });
  const returnIso = stayEnd(booking) ?? undefined;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">contact_page</span>
          <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
            Informations Passeports &amp; Voyageurs (vols Madagascar Airlines &amp; réserves MNP)
          </h3>
        </div>
        <span className="text-body-sm text-secondary font-medium">
          {travelers.length} voyageur{travelers.length > 1 ? "s" : ""} à identifier
        </span>
      </div>
      <div className="space-y-3">
        {travelers.map(({ role, i, known }, n) => (
          <fieldset
            className={`p-space-sm bg-surface-container-low rounded border ${n === 0 ? "border-secondary/20" : "border-outline-variant/30"}`}
            key={`${role}-${i}`}
          >
            <legend className="sr-only">
              Voyageur {n + 1} ({ROLE[role].label(i, role === "child" ? booking.childAges[i] : null)})
            </legend>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-[13px] font-bold text-on-surface flex items-center gap-1">
                <span className={`material-symbols-outlined text-[16px] ${n === 0 ? "text-primary" : "text-on-surface-variant"}`}>
                  {ROLE[role].icon}
                </span>
                Voyageur {n + 1} ({ROLE[role].label(i, role === "child" ? booking.childAges[i] : null)}){known ? ` : ${known.name}` : ""}
              </span>
              <span
                className={`font-label-sm text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  n === 0 ? "bg-secondary/15 text-secondary" : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {n === 0 ? "Vérifié" : ROLE[role].tag}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {!known && (
                <div className="sm:col-span-3">
                  <input
                    aria-describedby={`traveler-${n}-name-error`}
                    aria-label={`Nom complet du voyageur ${n + 1}`}
                    className={`${fieldClass} w-full`}
                    data-rule="name"
                    name={`traveler-${n}-name`}
                    placeholder="Nom et prénom"
                    type="text"
                  />
                  <FieldError name={`traveler-${n}-name`} />
                </div>
              )}
              <div>
                <input
                  aria-describedby={`traveler-${n}-passport-error`}
                  aria-label={`Numéro de passeport du voyageur ${n + 1}`}
                  className={`${fieldClass} w-full uppercase`}
                  data-rule="passport"
                  defaultValue={known?.passport}
                  name={`traveler-${n}-passport`}
                  placeholder="N° Passeport"
                  type="text"
                />
                <FieldError name={`traveler-${n}-passport`} />
              </div>
              <div>
                <input
                  aria-describedby={`traveler-${n}-expiry-error`}
                  aria-label={`Date d'expiration du passeport du voyageur ${n + 1}`}
                  className={`${fieldClass} w-full`}
                  data-min-date={returnIso}
                  data-rule="passportExpiry"
                  defaultValue={known?.expiry}
                  inputMode="numeric"
                  name={`traveler-${n}-expiry`}
                  placeholder="Date d'exp. (JJ/MM/AAAA)"
                  type="text"
                />
                <FieldError name={`traveler-${n}-expiry`} />
              </div>
              <div>
                <input
                  aria-describedby={`traveler-${n}-nationality-error`}
                  aria-label={`Nationalité du voyageur ${n + 1}`}
                  className={`${fieldClass} w-full`}
                  data-rule="text"
                  defaultValue={known ? "Française" : undefined}
                  name={`traveler-${n}-nationality`}
                  placeholder="Nationalité"
                  type="text"
                />
                <FieldError name={`traveler-${n}-nationality`} />
              </div>
            </div>
          </fieldset>
        ))}
      </div>
    </>
  );
}

const LINE_TONE: Record<string, string> = {
  hotel: "bg-primary/10 text-primary",
  transport: "bg-primary/10 text-primary",
  meals: "bg-primary/10 text-primary",
};

/** Carte « détail des prestations » des étapes récapitulatif et paiement. */
export function QuoteSummaryCard({ withPromo = false }: { withPromo?: boolean }) {
  const { booking, update, q } = useQuote();
  const { eur, mga } = useMoney();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const destination = DESTINATIONS[booking.destination];
  const under = q.gap <= 0;

  const applyCode = async () => {
    if (!code.trim()) return setError("Saisissez un code.");
    setChecking(true);
    try {
      const { promo } = await fetchServerQuote(booking, code);
      if (!promo?.valid) return setError(promo?.message ?? "Ce code n'est pas valide ou a expiré.");
      setError(null);
      setCode("");
      update({ promo: promo.code, promoDiscount: promo.discount });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vérification impossible pour le moment.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-md">
      <div className="relative h-48 w-full">
        <img
          alt="Vue aérienne d'une baie de Nosy Be : forêt, lagon turquoise, pirogues et écolodge parmi les palmiers"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvXb5xuXZUVOg2kjHMvnsZwRAeVEplVLGuTiBEdaapRdakigbiViAweFKv15v4jol2a6HgUY8XmguG94pC1wgDME_Pm39383oE3kF_DhG-7nY7YV_q_cacHFZDZ_fmDCZfAcmju2CQlVcbfJsx65ZHDAoatBbnrydXdkoEMmmrh9-F7tSYfKf5n_p0S7Pk1YiLu3YQ_5CvspUkN8QYFH8qot6HjRx4ftcI5GXDS7OglWsOH0h6Kgc"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent"></div>
        <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="font-label-sm text-label-sm text-on-surface">Dossier #{DOSSIER}</span>
        </div>
        <div className="absolute top-3 right-3 bg-tertiary text-on-tertiary font-label-sm text-label-sm px-3 py-1 rounded-full shadow-sm">
          {durationLabel(booking)}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-headline-md text-headline-md leading-tight text-white drop-shadow-sm">{destination.name}</h3>
          <p className="font-body-sm text-body-sm text-white/90 flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            {longRangeLabel(booking)} · {travelersLongLabel(booking)}
          </p>
        </div>
      </div>

      <div className="p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-sm">
          <span className="font-label-md text-label-md text-on-surface font-bold">Détail des prestations incluses</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Tarif négocié</span>
        </div>
        <ul className="space-y-space-md" aria-live="polite">
          {q.lines.map((l) => (
            <li className="flex items-start justify-between gap-space-sm bg-surface-container-low/50 p-space-sm rounded" key={l.id}>
              <div className="flex items-start gap-space-sm">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${LINE_TONE[l.id] ?? "bg-secondary/15 text-secondary"}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{l.icon}</span>
                </div>
                <div>
                  <h5 className="font-label-sm text-label-sm text-on-surface font-bold">{l.label}</h5>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">{l.detail}</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface font-bold shrink-0">{eur(l.amount)}</span>
            </li>
          ))}
        </ul>

        {withPromo && (
          <div className="p-space-sm bg-surface-container-low rounded border border-secondary/20 flex flex-col gap-2">
            <label className="font-label-md text-[13px] text-on-surface font-bold flex items-center justify-between" htmlFor="promo-code">
              <span>Code Promo / Bon Éco-Fihavanana</span>
              <span className="text-[11px] text-secondary font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">redeem</span> Réduction directe
              </span>
            </label>
            {booking.promo ? (
              <div className="flex items-center justify-between gap-2 text-[12px] text-secondary font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>
                    Code <strong>{booking.promo}</strong> appliqué : remise écovoyageur (−{eur(q.discount)})
                  </span>
                </span>
                <button
                  className="text-primary font-bold hover:underline"
                  onClick={() => update({ promo: null, promoDiscount: 0 })}
                  type="button"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyCode();
                  }}
                >
                  <input
                    aria-describedby={error ? "promo-error" : undefined}
                    aria-invalid={error ? true : undefined}
                    className="flex-1 h-10 px-3 bg-surface-container-lowest rounded font-mono text-[13px] text-on-surface border border-outline-variant/30 uppercase focus:outline-none focus:ring-2 focus:ring-primary/40"
                    id="promo-code"
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Votre code (ex. : MADA-XXXX)"
                    type="text"
                    value={code}
                  />
                  <button
                    className="px-4 h-10 rounded bg-secondary hover:bg-secondary/90 text-on-secondary font-label-md text-[13px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-secondary/40 active:scale-95"
                    disabled={checking}
                    type="submit"
                  >
                    {checking ? "Vérification…" : "Appliquer"}
                  </button>
                </form>
                {error && (
                  <p className="text-[12px] text-error font-medium" id="promo-error" role="alert">
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="p-space-md rounded bg-surface-container-low space-y-2 mt-2">
          <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>Budget cible :</span>
            <span>{eur(booking.budget, true)}</span>
          </div>
          {q.discount > 0 && (
            <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
              <span>Remise code promo :</span>
              <span className="text-secondary font-bold">−{eur(q.discount, true)}</span>
            </div>
          )}
          <div
            className={`flex items-center justify-between font-body-sm text-body-sm font-bold ${under ? "text-secondary" : "text-tertiary"}`}
          >
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">{under ? "savings" : "trending_up"}</span>
              {under ? "Marge sur votre budget :" : "Dépassement du budget :"}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${under ? "bg-secondary/15" : "bg-tertiary/15"}`}>
              {under ? `+${eur(-q.gap)} préservés` : `+${eur(q.gap)}`}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Total à régler :</span>
              <div className="font-label-sm text-label-sm text-on-surface-variant">Taxes de séjour &amp; vignettes incluses</div>
            </div>
            <div className="text-right">
              <div className="font-headline-lg text-headline-lg text-primary font-bold">{eur(q.total)}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">≈ {mga(q.total)}</div>
            </div>
          </div>
        </div>

        <div className="p-space-md bg-secondary/10 rounded flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[22px]">support_agent</span>
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-label-sm text-label-sm text-on-surface font-bold truncate">Assistance locale 24/7</h5>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
              Conciergerie MadaVoyage à Antananarivo et Hell-Ville joignable sur WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
