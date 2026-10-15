import { EMAIL, PHONE, WHATSAPP } from "@/lib/site";
import { SupportNow } from "./SupportStatus";
import TicketRequest from "./TicketRequest";

/** Même couleur d'action pour les trois canaux : seule l'icône les distingue. */
export const CONTACT_ACTION =
  "w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-xs shadow-sm hover:bg-on-primary-fixed-variant transition-colors";

function Card({
  icon,
  title,
  status,
  audience,
  detail,
  children,
  note,
}: {
  icon: string;
  title: string;
  status: React.ReactNode;
  audience: string;
  detail: React.ReactNode;
  children: React.ReactNode;
  note: React.ReactNode;
}) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded shadow-lg flex flex-col justify-between gap-space-md">
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between gap-space-sm mb-space-xs">
          <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-[26px]">
              {icon}
            </span>
          </div>
          {status}
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{title}</h3>
        <p className="font-label-md text-label-md text-on-surface font-semibold">{audience}</p>
        <p className="font-body-md text-body-md text-on-surface-variant">{detail}</p>
      </div>
      <div className="flex flex-col gap-2">
        {children}
        <span className="block text-center font-body-md text-body-md text-on-surface-variant">{note}</span>
      </div>
    </div>
  );
}

export default function ContactCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
      <Card
        icon="chat"
        title="WhatsApp"
        status={<SupportNow className="text-right" />}
        audience="Pour les voyageurs sur place ou qui partent dans les 48 h"
        detail={
          <>
            Transferts, chauffeurs, météo marine. Une fois sur place, urgences 24 h/24 au même numéro :{" "}
            <span className="whitespace-nowrap font-semibold text-on-surface">{WHATSAPP.display}</span>.
          </>
        }
        note="Tous les jours, 8 h – 20 h (heure de Madagascar)"
      >
        <a className={CONTACT_ACTION} href={WHATSAPP.href} rel="noopener noreferrer" target="_blank">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            chat
          </span>
          Écrire sur WhatsApp
        </a>
      </Card>

      <Card
        icon="call"
        title="Téléphone"
        status={<SupportNow className="text-right" />}
        audience="Pour toute question, avant ou après réservation"
        detail={
          <>
            Bureau d&apos;Antananarivo, en français, anglais ou malgache :{" "}
            <span className="whitespace-nowrap font-semibold text-on-surface">{PHONE.display}</span>.
          </>
        }
        note="Tarif d'un appel vers Madagascar, selon votre opérateur"
      >
        <a className={CONTACT_ACTION} href={PHONE.href}>
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            call
          </span>
          Appeler le bureau
        </a>
      </Card>

      <Card
        icon="mail"
        title="Par écrit"
        status={<span className="font-body-md text-body-md font-bold text-on-surface-variant">Dépôt à toute heure</span>}
        audience="Vous avez réservé : demande liée à votre dossier"
        detail={
          <>
            Changement de dates, facture, attestation de voyage. Pas encore réservé ? Écrivez à{" "}
            <a className="font-semibold text-primary underline underline-offset-2" href={EMAIL.href}>
              {EMAIL.display}
            </a>
            .
          </>
        }
        note="Traitée par ordre d'arrivée, de 8 h à 20 h (heure de Madagascar)"
      >
        <TicketRequest className={CONTACT_ACTION} />
      </Card>
    </div>
  );
}
