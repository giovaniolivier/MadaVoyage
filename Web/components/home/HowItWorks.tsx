import Link from "next/link";
import { BOOKING_STEPS, CANCELLATION, DEPOSIT_RATE } from "@/lib/site";

const DETAILS: Record<(typeof BOOKING_STEPS)[number]["label"], { icon: string; text: string }> = {
  Séjour: { icon: "calendar_month", text: "Vos dates, la durée et le nombre de voyageurs, adultes et enfants." },
  Destination: { icon: "map", text: "Nosy Be, Sainte-Marie ou le Grand Nord, avec la météo de la saison choisie." },
  Budget: {
    icon: "savings",
    text: "Votre enveloppe totale pour le groupe. Si elle est dépassée, des alternatives chiffrées vous sont proposées.",
  },
  Offre: { icon: "tune", text: "Hébergement, transports, repas et excursions : le prix se met à jour à chaque choix." },
  Paiement: {
    icon: "credit_card",
    text: `Acompte de ${DEPOSIT_RATE} par carte ou Mobile Money, sans frais. Billets et carnet de voyage arrivent dès la confirmation. ${CANCELLATION.short}.`,
  },
};

export default function HowItWorks() {
  return (
    <ol className="flex flex-col gap-6 lg:h-full">
      {BOOKING_STEPS.map((s, i) => (
        <li key={s.label} className="flex gap-4 lg:flex-1 lg:last:flex-none">
          <div className="relative flex flex-col items-center">
            <span className="w-11 h-11 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            {i < BOOKING_STEPS.length - 1 && <span aria-hidden="true" className="w-0.5 flex-1 bg-outline-variant mt-2 -mb-4"></span>}
          </div>
          <div className="pb-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">{DETAILS[s.label].icon}</span>
              <Link className="hover:text-primary hover:underline underline-offset-4" href={s.href}>
                {s.label}
              </Link>
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">{DETAILS[s.label].text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
