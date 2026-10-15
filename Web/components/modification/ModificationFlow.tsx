"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { SOLIDARITY_RATE, WHATSAPP } from "@/lib/site";

type ActionTab = "modif" | "annul";
type RefundChoice = "voucher" | "cash";

const REFUNDS: Record<RefundChoice, { label: string; amount: string; summaryLabel: string }> = {
  voucher: { label: "Avoir Éco-Solidaire 100%", amount: "493,50 €", summaryLabel: "Valeur Avoir Conservée :" },
  cash: { label: "Virement Bancaire & Mobile Money", amount: "493,50 €", summaryLabel: "Montant Net Remboursé :" },
};

const REASONS = [
  { value: "medical", label: "Raison médicale ou certificat d'inaptitude" },
  { value: "pro", label: "Contrainte professionnelle impérative" },
  { value: "logistique", label: "Imprévu de vol international / visa" },
  { value: "famille", label: "Raison familiale impérieuse" },
  { value: "autre", label: "Autre motif personnel" },
];

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

type FlowState = {
  tab: ActionTab;
  setTab: (tab: ActionTab) => void;
  refund: RefundChoice;
  setRefund: (refund: RefundChoice) => void;
};

const FlowContext = createContext<FlowState | null>(null);

function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow doit être utilisé dans <ModificationProvider>");
  return ctx;
}

export function ModificationProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<ActionTab>("annul");
  const [refund, setRefund] = useState<RefundChoice>("voucher");
  return <FlowContext.Provider value={{ tab, setTab, refund, setRefund }}>{children}</FlowContext.Provider>;
}

export function ActionTabs() {
  const { tab, setTab } = useFlow();
  const base = "px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all flex items-center gap-1";
  const inactive = "text-on-surface-variant hover:text-on-surface";
  return (
    <div
      className="flex items-center gap-space-sm self-start xl:self-center bg-surface-container-low p-1.5 rounded-full"
      role="group"
      aria-label="Type de demande"
    >
      <button
        aria-pressed={tab === "modif"}
        className={`${base} ${tab === "modif" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : inactive}`}
        onClick={() => setTab("modif")}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
        <span>Reporter ou Modifier</span>
      </button>
      <button
        aria-pressed={tab === "annul"}
        className={`${base} ${tab === "annul" ? "bg-surface-container-lowest text-tertiary font-bold shadow-sm" : inactive}`}
        onClick={() => setTab("annul")}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">cancel</span>
        <span>Simulateur d&apos;Annulation</span>
      </button>
    </div>
  );
}

export function ActionPanels({ cancellation }: { cancellation: React.ReactNode }) {
  const { tab } = useFlow();
  return <div className="lg:col-span-7 flex flex-col gap-space-xl">{tab === "annul" ? cancellation : <ReschedulePanel />}</div>;
}

export function RefundOptions() {
  const { refund, setRefund } = useFlow();
  const cardClass = (choice: RefundChoice) =>
    `relative flex items-start gap-space-md p-space-lg rounded cursor-pointer transition-all ${
      refund === choice
        ? "bg-surface-container-low ring-2 ring-primary/40"
        : "bg-surface-container-lowest hover:bg-surface-container-low/40"
    }`;

  return (
    <fieldset className="flex flex-col gap-space-md">
      <legend className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider mb-space-md">
        Sélectionnez le mode de dédommagement souhaité :
      </legend>

      <label className={cardClass("voucher")}>
        <input
          checked={refund === "voucher"}
          className="mt-1 w-5 h-5 accent-primary cursor-pointer"
          name="refund_choice"
          onChange={() => setRefund("voucher")}
          type="radio"
          value="voucher"
        />
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Option A · Avoir Éco-Solidaire 100%</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold uppercase">
                Recommandé
              </span>
            </div>
            <span className="font-headline-md text-headline-md font-extrabold text-secondary">493,50 €</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Crédit intégral sans aucune retenue, valable <strong>18 mois</strong> pour toute aventure ou écolodge MadaVoyage (Nosy Be,
            Isalo, Sainte-Marie, Andasibe).
          </p>
          <div className="mt-space-xs flex items-center gap-space-sm text-secondary font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">nature</span>
            <span>Votre contribution au fonds Fihavanana ({SOLIDARITY_RATE} du prix) suit le montant modifié.</span>
          </div>
        </div>
      </label>

      <label className={cardClass("cash")}>
        <input
          checked={refund === "cash"}
          className="mt-1 w-5 h-5 accent-primary cursor-pointer"
          name="refund_choice"
          onChange={() => setRefund("cash")}
          type="radio"
          value="cash"
        />
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Option B · Virement Bancaire & Mobile Money</span>
            <span className="font-headline-md text-headline-md font-extrabold text-on-surface">493,50 €</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Remboursement direct sous 5 à 7 jours ouvrés sur la carte Visa se terminant par •••• 4289 (ou compte MVola / Orange Money sur
            demande).
          </p>
          <div className="mt-space-xs p-space-sm rounded bg-surface-container-high/50 font-body-sm text-body-sm text-on-surface-variant flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Acompte initial versé :</span>
              <span className="font-semibold">+ 493,50 €</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Retenue (annulation à plus de 7 jours du départ) :</span>
              <span className="font-semibold">0,00 €</span>
            </div>
            <div className="flex justify-between font-bold text-on-surface pt-1">
              <span>Montant net recrédité :</span>
              <span className="font-bold text-primary">493,50 € (~ 2 418 150 Ar)</span>
            </div>
          </div>
        </div>
      </label>
    </fieldset>
  );
}

export function RefundSummaryRow() {
  const { refund } = useFlow();
  const r = REFUNDS[refund];
  return (
    <div className="pt-2 flex justify-between items-baseline" aria-live="polite">
      <span className="font-label-md text-label-md font-bold text-on-surface">{r.summaryLabel}</span>
      <span className={`font-headline-sm text-headline-sm font-extrabold ${refund === "voucher" ? "text-secondary" : "text-primary"}`}>
        {r.amount}
      </span>
    </div>
  );
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} Ko` : `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}

export function CancellationForm() {
  const { refund, setTab } = useFlow();
  const [reason, setReason] = useState(REASONS[0].value);
  const [phone, setPhone] = useState("+33 6 42 19 88 02");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = useCallback(() => setDialogOpen(false), []);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const ids = useId();

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const pickFile = (candidate: File | undefined) => {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setFileError("Format non accepté : utilisez un PDF, JPG ou PNG.");
      return;
    }
    if (candidate.size > MAX_FILE_BYTES) {
      setFileError(`Fichier trop volumineux (${formatBytes(candidate.size)}) : 10 Mo maximum.`);
      return;
    }
    setFileError(null);
    setFile(candidate);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const requestCancellation = () => {
    if (!confirmed) {
      setConfirmError(true);
      checkboxRef.current?.focus();
      return;
    }
    setDialogOpen(true);
  };

  const submit = () => {
    setDialogOpen(false);
    setStatus("sending");
    timerRef.current = window.setTimeout(() => setStatus("done"), 900);
  };

  const r = REFUNDS[refund];
  const reasonLabel = REASONS.find((x) => x.value === reason)?.label ?? "";

  if (status === "done") {
    return (
      <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md" role="status">
        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">task_alt</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Demande d&apos;annulation enregistrée</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Dossier #MDV-2026-8902 · {r.label}</span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {refund === "voucher"
            ? `Votre Avoir Éco-Solidaire de ${r.amount} est en cours d'émission. Le code de crédit sera envoyé au ${phone} et vos guides Faly & Mamy ont été prévenus.`
            : `Votre remboursement de ${r.amount} a été transmis à notre service comptable. Le virement sera émis sous 5 à 7 jours ouvrés ; une confirmation sera envoyée au ${phone}.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-space-sm">
          <Link
            className="px-space-lg h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            href="/compte"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Retour à mon compte
          </Link>
          <button
            className="px-space-lg h-12 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all"
            onClick={() => setTab("modif")}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
            Plutôt reporter ?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-lg">
      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary text-[22px]">assignment</span>
        Motif de la Demande & Justificatif
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor={`${ids}-reason`}>
            Motif principal de rétractation *
          </label>
          <div className="relative">
            <select
              className="w-full h-[52px] bg-surface-container-low px-space-md rounded font-body-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              id={`${ids}-reason`}
              onChange={(e) => setReason(e.target.value)}
              value={reason}
            >
              {REASONS.map((x) => (
                <option key={x.value} value={x.value}>
                  {x.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-3.5 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor={`${ids}-phone`}>
            Numéro pour confirmation SMS/WhatsApp
          </label>
          <input
            autoComplete="tel"
            className="w-full h-[52px] bg-surface-container-low px-space-md rounded font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            id={`${ids}-phone`}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            value={phone}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-label-md text-label-md text-on-surface font-semibold" id={`${ids}-file-label`}>
          Pièce justificative (optionnelle pour l&apos;avoir, obligatoire pour franchise assurance)
        </span>
        <input
          ref={fileInputRef}
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          aria-labelledby={`${ids}-file-label`}
          className="sr-only"
          id={`${ids}-file`}
          onChange={(e) => pickFile(e.target.files?.[0])}
          type="file"
        />
        {file ? (
          <div className="p-space-md rounded bg-surface-container-low flex items-center justify-between gap-space-sm">
            <span className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary text-[24px]">description</span>
              <span className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md font-bold text-on-surface truncate">{file.name}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{formatBytes(file.size)}</span>
              </span>
            </span>
            <button
              aria-label={`Retirer ${file.name}`}
              className="p-2 rounded-full text-on-surface-variant hover:text-tertiary hover:bg-surface-container-high transition-colors"
              onClick={removeFile}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        ) : (
          <label
            className={`p-space-lg rounded flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              dragging ? "bg-primary-container/20 ring-2 ring-primary" : "bg-surface-container-low hover:bg-surface-container-high/60"
            }`}
            htmlFor={`${ids}-file`}
            onDragLeave={() => setDragging(false)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
          >
            <span className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">upload_file</span>
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Glissez votre document ici ou <span className="text-primary underline">parcourez vos fichiers</span>
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              PDF, JPG, PNG jusqu&apos;à 10 Mo (certificat médical, attestation employeur)
            </span>
          </label>
        )}
        {fileError && (
          <p className="font-body-sm text-body-sm text-error flex items-center gap-1" role="alert">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {fileError}
          </p>
        )}
      </div>

      <div className="p-space-md rounded bg-tertiary-container/10 flex items-start gap-space-md">
        <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary flex-shrink-0">
          <span className="material-symbols-outlined text-[22px]">diversity_1</span>
        </div>
        <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
          <span className="font-label-md text-label-md font-bold text-tertiary">Impact sur vos guides référents : Faly & Mamy</span>
          <p>
            Nosy Be vit en grande partie de l&apos;écosystème guidé. En choisissant l&apos;<strong>Avoir Éco-Solidaire</strong>, 50% de la
            prime guide leur reste versée pour sécuriser leur semaine. En annulation sèche, notre fonds de prévoyance MadaVoyage couvrira
            leur manque à gagner partiel.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-space-xs pt-space-xs">
        <label className="flex items-start gap-space-sm cursor-pointer select-none">
          <input
            ref={checkboxRef}
            aria-describedby={confirmError ? `${ids}-confirm-error` : undefined}
            aria-invalid={confirmError}
            checked={confirmed}
            className="mt-1 w-4 h-4 accent-tertiary cursor-pointer"
            onChange={(e) => {
              setConfirmed(e.target.checked);
              if (e.target.checked) setConfirmError(false);
            }}
            type="checkbox"
          />
          <span className="font-body-sm text-body-sm text-on-surface">
            Je confirme en tant que titulaire du dossier avoir pris connaissance des répercussions contractuelles de l&apos;annulation pour
            les 3 voyageurs inscrits et mandate MadaVoyage à procéder au règlement sélectionné.
          </span>
        </label>
        {confirmError && (
          <p className="font-body-sm text-body-sm text-error flex items-center gap-1 pl-6" id={`${ids}-confirm-error`} role="alert">
            <span className="material-symbols-outlined text-[16px]">error</span>
            Veuillez cocher la confirmation d&apos;engagement du titulaire avant de valider votre demande.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm">
        <button
          className="w-full sm:w-auto px-space-lg h-12 rounded-full bg-surface-container-high text-tertiary font-label-lg text-label-lg font-bold hover:bg-tertiary hover:text-on-tertiary transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
          disabled={status === "sending"}
          onClick={requestCancellation}
          type="button"
        >
          <span className={`material-symbols-outlined text-[20px] ${status === "sending" ? "animate-spin" : ""}`}>
            {status === "sending" ? "progress_activity" : "assignment_turned_in"}
          </span>
          <span>{status === "sending" ? "Envoi en cours…" : "Confirmer l'annulation"}</span>
        </button>

        <a
          className="w-full sm:w-auto px-space-lg h-12 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
          href={`${WHATSAPP.href}?text=Bonjour%2C%20je%20souhaite%20garder%20mon%20voyage%20MDV-2026-8902%20et%20discuter%20d%27un%20report`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>Garder mon voyage & Conciergerie</span>
        </a>
      </div>

      {dialogOpen && (
        <ConfirmDialog
          onCancel={closeDialog}
          onConfirm={submit}
          refundLabel={r.label}
          refundAmount={r.amount}
          reasonLabel={reasonLabel}
          fileName={file?.name ?? null}
        />
      )}
    </div>
  );
}

type ConfirmDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
  refundLabel: string;
  refundAmount: string;
  reasonLabel: string;
  fileName: string | null;
};

function ConfirmDialog({ onCancel, onConfirm, refundLabel, refundAmount, reasonLabel, fileName }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true"></div>
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="relative w-full max-w-md bg-surface-container-lowest rounded-lg shadow-2xl p-space-lg flex flex-col gap-space-md"
        role="dialog"
      >
        <div className="flex items-center gap-space-sm">
          <span className="w-10 h-10 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold" id={titleId}>
            Confirmer l&apos;annulation du voyage ?
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Le dossier #MDV-2026-8902 (Nosy Be, 14 – 24 octobre 2026, 3 voyageurs) sera annulé. Cette action est définitive.
        </p>
        <dl className="p-space-md rounded bg-surface-container-low font-body-sm text-body-sm flex flex-col gap-1.5">
          <div className="flex justify-between gap-4">
            <dt className="text-on-surface-variant">Dédommagement</dt>
            <dd className="font-semibold text-on-surface text-right">{refundLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-on-surface-variant">Montant</dt>
            <dd className="font-bold text-primary">{refundAmount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-on-surface-variant">Motif</dt>
            <dd className="font-semibold text-on-surface text-right">{reasonLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-on-surface-variant">Justificatif</dt>
            <dd className="font-semibold text-on-surface text-right truncate">{fileName ?? "Aucun"}</dd>
          </div>
        </dl>
        <div className="flex flex-col-reverse sm:flex-row gap-space-sm justify-end">
          <button
            ref={cancelRef}
            className="px-space-lg h-11 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-highest transition-colors"
            onClick={onCancel}
            type="button"
          >
            Garder mon voyage
          </button>
          <button
            className="px-space-lg h-11 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md font-bold hover:opacity-95 transition-opacity"
            onClick={onConfirm}
            type="button"
          >
            Oui, annuler
          </button>
        </div>
      </div>
    </div>
  );
}

const RESCHEDULE_PERIODS = [
  "Novembre 2026",
  "Décembre 2026",
  "Avril 2027",
  "Mai 2027",
  "Juin 2027",
  "Juillet 2027",
  "Août 2027",
  "Septembre 2027",
  "Octobre 2027",
  "Novembre 2027",
];

function ReschedulePanel() {
  const [period, setPeriod] = useState(RESCHEDULE_PERIODS[4]);
  const [flexible, setFlexible] = useState(true);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const timerRef = useRef<number | null>(null);
  const ids = useId();

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  if (status === "done") {
    return (
      <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md" role="status">
        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">event_available</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Demande de report envoyée</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Période souhaitée : {period}
              {flexible ? " (dates flexibles)" : ""}
            </span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Notre équipe de Nosy Be vérifie la disponibilité du Manga Soa Lodge et de vos guides Faly & Mamy, puis vous propose de nouvelles
          dates sous 24 h. Votre acompte de 493,50 € reste intégralement acquis au dossier.
        </p>
        <button
          className="self-start px-space-lg h-11 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-highest transition-colors"
          onClick={() => setStatus("idle")}
          type="button"
        >
          Modifier ma demande
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-lg">
      <div className="flex flex-col gap-space-xs">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">edit_calendar</span>
          Reporter votre voyage sans frais
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Décalez votre circuit Nosy Be & Archipels Sauvages jusqu&apos;à <strong>Novembre 2027</strong> sans pénalité : votre acompte de
          493,50 € est conservé, et nous réservons en priorité le même écolodge et les mêmes guides.
        </p>
      </div>

      <form
        className="flex flex-col gap-space-md"
        onSubmit={(e) => {
          e.preventDefault();
          setStatus("sending");
          timerRef.current = window.setTimeout(() => setStatus("done"), 900);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor={`${ids}-period`}>
              Nouvelle période de départ *
            </label>
            <div className="relative">
              <select
                className="w-full h-[52px] bg-surface-container-low px-space-md rounded font-body-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                id={`${ids}-period`}
                onChange={(e) => setPeriod(e.target.value)}
                value={period}
              >
                {RESCHEDULE_PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-3.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Durée du séjour</span>
            <span className="h-[52px] bg-surface-container-low px-space-md rounded font-body-md text-on-surface-variant flex items-center">
              10 nuits · 3 voyageurs (inchangé)
            </span>
          </div>
        </div>

        <label className="flex items-start gap-space-sm cursor-pointer select-none">
          <input
            checked={flexible}
            className="mt-1 w-4 h-4 accent-primary cursor-pointer"
            onChange={(e) => setFlexible(e.target.checked)}
            type="checkbox"
          />
          <span className="font-body-sm text-body-sm text-on-surface">
            Mes dates sont flexibles (± 7 jours) pour profiter des meilleures disponibilités et marées.
          </span>
        </label>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor={`${ids}-note`}>
            Précisions pour notre équipe (optionnel)
          </label>
          <textarea
            className="w-full min-h-[96px] bg-surface-container-low p-space-md rounded font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            id={`${ids}-note`}
            maxLength={500}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex. : éviter la période cyclonique, ajouter une nuit à Nosy Komba…"
            value={note}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
          <button
            className="w-full sm:w-auto px-space-lg h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={status === "sending"}
            type="submit"
          >
            <span className={`material-symbols-outlined text-[20px] ${status === "sending" ? "animate-spin" : ""}`}>
              {status === "sending" ? "progress_activity" : "send"}
            </span>
            <span>{status === "sending" ? "Envoi en cours…" : "Envoyer la demande de report"}</span>
          </button>
          <Link
            className="w-full sm:w-auto px-space-lg h-12 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg font-bold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
            href="/reservation/dates"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            <span>Voir les disponibilités</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
