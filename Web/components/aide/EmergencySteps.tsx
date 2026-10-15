import Link from "next/link";
import { EMERGENCY, LOCAL_EMERGENCY } from "@/lib/site";

const numberLink = "font-label-lg text-label-lg font-bold text-primary underline underline-offset-2 whitespace-nowrap";

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-space-sm">
      <span
        aria-hidden="true"
        className="w-6 h-6 rounded-full bg-error text-on-error font-label-md text-label-md font-bold flex items-center justify-center shrink-0"
      >
        {n}
      </span>
      <span className="flex flex-col gap-0.5">{children}</span>
    </li>
  );
}

export default function EmergencySteps() {
  return (
    <section
      aria-labelledby="urgence-etapes-titre"
      id="urgence"
      className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col gap-space-md border-l-4 border-error scroll-mt-28"
    >
      <div className="flex items-center gap-space-xs">
        <span aria-hidden="true" className="material-symbols-outlined text-[22px] text-error">
          emergency
        </span>
        <h2 id="urgence-etapes-titre" className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Que faire en cas d&apos;urgence ?
        </h2>
      </div>
      <ol className="flex flex-col gap-space-md font-body-md text-body-md text-on-surface">
        <Step n={1}>
          <span>Danger immédiat (accident, agression, incendie) : appelez les secours malgaches.</span>
          <span className="flex flex-wrap gap-x-space-md gap-y-0.5">
            {LOCAL_EMERGENCY.numbers.map((n) => (
              <span key={n.number}>
                {n.label}{" "}
                <a className={numberLink} href={`tel:${n.number}`}>
                  {n.number}
                </a>
                {"note" in n && <span className="text-on-surface-variant"> ({n.note})</span>}
              </span>
            ))}
          </span>
        </Step>
        <Step n={2}>
          <span>Prévenez notre ligne d&apos;urgence, 24 h/24 une fois sur place :</span>
          <span className="flex flex-wrap gap-x-space-sm">
            <a className={numberLink} href={EMERGENCY.call}>
              {EMERGENCY.display}
            </a>
            <a
              className="font-label-md text-label-md font-bold text-primary underline underline-offset-2"
              href={EMERGENCY.whatsapp}
              rel="noopener noreferrer"
              target="_blank"
            >
              ou sur WhatsApp
            </a>
          </span>
        </Step>
        <Step n={3}>
          <span>
            Problème de santé : appelez aussi l&apos;assistance de votre assurance. Son numéro figure sur votre attestation et dans votre{" "}
            <Link className="font-bold text-primary underline underline-offset-2" href="/carnet">
              carnet de voyage
            </Link>
            .
          </span>
        </Step>
        <Step n={4}>
          <span>
            Voyageurs français (agression, perte du passeport, hospitalisation) : permanence d&apos;urgence du consulat de France.
          </span>
          <a className={numberLink} href={LOCAL_EMERGENCY.consulate.href}>
            {LOCAL_EMERGENCY.consulate.display}
          </a>
        </Step>
      </ol>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Numéros publics vérifiés le {LOCAL_EMERGENCY.checked} auprès de l&apos;
        <a className="underline underline-offset-2" href={LOCAL_EMERGENCY.source.href} rel="noopener noreferrer" target="_blank">
          {LOCAL_EMERGENCY.source.label}
        </a>
        .
      </p>
    </section>
  );
}
