"use client";

import { useEffect, useId, useRef, useState } from "react";

const fieldClass =
  "w-full h-12 px-space-md bg-surface-container-low rounded font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary";
const labelClass = "block font-label-sm text-label-sm text-on-surface font-semibold mb-1";

const MOTIFS = [
  "Modification de dates / vols",
  "Régime alimentaire & allergies",
  "Transfert 4x4 spécifique",
  "Facture ou attestation voyage",
  "Autre question logistique",
];

export default function TicketRequest({ className }: { className: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        className={className}
        onClick={() => {
          setSent(false);
          setOpen(true);
        }}
        type="button"
        aria-haspopup="dialog"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
          mail
        </span>
        <span>Écrire au sujet de mon dossier</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-on-background/50 backdrop-blur-sm flex items-center justify-center p-space-md"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="bg-surface-container-lowest max-w-xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto rounded p-space-xl shadow-2xl relative"
          >
            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors"
              onClick={close}
              type="button"
              aria-label="Fermer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="material-symbols-outlined text-primary text-[22px]">confirmation_number</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Demande liée à votre dossier
              </span>
            </div>
            <h3 id={titleId} className="font-headline-md text-headline-md font-bold text-on-surface mb-space-xs">
              {sent ? "Demande transmise" : "Déposer une demande d'assistance"}
            </h3>

            {sent ? (
              <div className="flex flex-col gap-space-md" role="status">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Votre demande d&apos;assistance a été transmise avec succès à notre équipe conciergerie. Un accusé de réception vous est
                  envoyé sur WhatsApp.
                </p>
                <button
                  className="h-12 w-full rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:opacity-95 transition-all"
                  type="button"
                  onClick={close}
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">
                  Notre équipe de régulation vous répondra par e-mail et WhatsApp avec la priorité requise.
                </p>
                <form
                  className="flex flex-col gap-space-md"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div>
                      <label htmlFor="ticket-name" className={labelClass}>
                        Votre Nom & Prénom *
                      </label>
                      <input
                        ref={firstFieldRef}
                        id="ticket-name"
                        name="name"
                        className={fieldClass}
                        placeholder="ex: Jean Dupont"
                        required
                        type="text"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticket-ref" className={labelClass}>
                        N° de Dossier / Devis
                      </label>
                      <input
                        id="ticket-ref"
                        name="reference"
                        className={fieldClass}
                        placeholder="ex. MDV-2026-8902 (facultatif)"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div>
                      <label htmlFor="ticket-phone" className={labelClass}>
                        Numéro WhatsApp *
                      </label>
                      <input
                        id="ticket-phone"
                        name="whatsapp"
                        className={fieldClass}
                        placeholder="+33 6 12 34 56 78"
                        required
                        type="tel"
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticket-motif" className={labelClass}>
                        Motif principal
                      </label>
                      <select id="ticket-motif" name="motif" className={fieldClass}>
                        {MOTIFS.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ticket-details" className={labelClass}>
                      Détails de votre demande *
                    </label>
                    <textarea
                      id="ticket-details"
                      name="details"
                      className="w-full p-space-md bg-surface-container-low rounded font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Expliquez-nous précisément vos besoins ou contraintes..."
                      required
                      rows={3}
                    ></textarea>
                  </div>
                  <button
                    className="h-12 w-full rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-sm hover:bg-on-primary-fixed-variant transition-colors"
                    type="submit"
                  >
                    Transmettre au concierge référent
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
