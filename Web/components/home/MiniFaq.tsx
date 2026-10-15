import Link from "next/link";
import { CANCELLATION } from "@/lib/site";

const QUESTIONS = [
  {
    icon: "event_busy",
    question: "Et si je dois annuler ?",
    answer: (
      <>
        {CANCELLATION.free} {CANCELLATION.late}
      </>
    ),
    link: { href: "/modification", label: "Simuler une modification ou une annulation" },
  },
  {
    icon: "vaccines",
    question: "Faut-il un traitement contre le paludisme ?",
    answer: (
      <>
        Oui, un traitement préventif est recommandé dès que vous quittez les Hautes Terres (côtes, Ouest, Sud). Demandez conseil à votre
        médecin ou à un centre de vaccinations internationales. Nos 4x4 embarquent de l'eau filtrée.
      </>
    ),
    link: { href: "/aide", label: "Santé, vaccins et eau potable" },
  },
  {
    icon: "badge",
    question: "Comment obtenir le visa ?",
    answer: (
      <>
        Directement à l'arrivée à Antananarivo ou Nosy Be : 10 € jusqu'à 15 jours, 35 € jusqu'à 30 jours, 40 € jusqu'à 60 jours. Passeport
        valable 6 mois après le retour, avec 2 pages vierges.
      </>
    ),
    link: { href: "/aide", label: "Toutes les formalités" },
  },
];

export default function MiniFaq() {
  return (
    <div className="flex flex-col gap-3">
      {QUESTIONS.map((q, i) => (
        <details key={q.question} className="group bg-surface-container-lowest rounded-2xl shadow-sm open:shadow-md" open={i === 0}>
          <summary className="flex items-center gap-3 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">{q.icon}</span>
            </span>
            <span className="flex-1 font-headline-sm text-headline-sm text-on-surface">{q.question}</span>
            <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <div className="px-5 pb-5 pl-[4.75rem] flex flex-col gap-3">
            <p className="font-body-md text-body-md text-on-surface-variant">{q.answer}</p>
            <Link className="self-start font-label-md text-label-md text-primary hover:underline underline-offset-4" href={q.link.href}>
              {q.link.label} →
            </Link>
          </div>
        </details>
      ))}
    </div>
  );
}
