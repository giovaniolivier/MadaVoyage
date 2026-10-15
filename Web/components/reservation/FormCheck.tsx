"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useRef, useState } from "react";

type Field = HTMLInputElement | HTMLSelectElement;
type Rule = (value: string, el: Field) => string | null;

const digits = (v: string) => v.replace(/[\s.-]/g, "");

function luhn(num: string) {
  let sum = 0;
  for (let i = 0; i < num.length; i++) {
    let d = Number(num[num.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function parseFrDate(v: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v.trim());
  if (!m) return null;
  const date = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return date.getMonth() === Number(m[2]) - 1 ? date : null;
}

export const RULES: Record<string, Rule> = {
  name: (v) => (/^[\p{L}][\p{L}' -]{1,59}$/u.test(v.trim()) ? null : "Indiquez un nom valide (lettres uniquement)."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "Adresse email invalide (ex. : nom@domaine.fr)."),
  phone: (v) => (/^\+?\d{8,15}$/.test(digits(v)) ? null : "Numéro de téléphone invalide."),
  card: (v) => {
    const n = digits(v);
    if (!/^\d{13,19}$/.test(n)) return "Le numéro de carte doit comporter entre 13 et 19 chiffres.";
    return luhn(n) ? null : "Ce numéro de carte n'est pas valide.";
  },
  cardExpiry: (v) => {
    const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.trim());
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return "Format attendu : MM / AA.";
    const endOfMonth = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59);
    return endOfMonth >= new Date() ? null : "Cette carte est expirée.";
  },
  cvv: (v) => (/^\d{3,4}$/.test(v.trim()) ? null : "3 chiffres au dos de la carte (4 pour Amex)."),
  mobileMoney: (v) => {
    const n = digits(v).replace(/^(\+?261|00261)/, "0");
    return /^03[2348]\d{7}$/.test(n) ? null : "Numéro malgache attendu : 034, 032, 038 ou 033 suivi de 7 chiffres.";
  },
  passport: (v) => (/^[A-Z0-9]{6,9}$/i.test(v.trim()) ? null : "Numéro de passeport : 6 à 9 lettres ou chiffres."),
  passportExpiry: (v, el) => {
    const date = parseFrDate(v);
    if (!date) return "Date attendue au format JJ/MM/AAAA.";
    const minIso = el.dataset.minDate;
    if (minIso) {
      const min = new Date(`${minIso}T00:00:00`);
      min.setMonth(min.getMonth() + 6);
      if (date < min) return "Le passeport doit être valide 6 mois après la date de retour.";
    }
    return null;
  },
  text: (v) => (v.trim().length >= 2 ? null : "Ce champ est obligatoire."),
};

type Ctx = { errors: Record<string, string>; validate: () => boolean };
const FormCheckContext = createContext<Ctx>({ errors: {}, validate: () => true });

const isVisible = (el: HTMLElement) => el.getClientRects().length > 0;

function check(el: Field) {
  const rule = RULES[el.dataset.rule ?? ""];
  return rule ? rule(el.value, el) : null;
}

/**
 * Valide les champs marqués `data-rule` (et un `name` unique) contenus dans ce bloc.
 * Les champs masqués (autre moyen de paiement) sont ignorés.
 */
export function FormCheck({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mark = (el: Field, message: string | null) => {
    if (message) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  };

  const validate = useCallback(() => {
    const fields = [...(ref.current?.querySelectorAll<Field>("[data-rule]") ?? [])].filter(isVisible);
    const next: Record<string, string> = {};
    for (const el of fields) {
      const message = check(el);
      mark(el, message);
      if (message) next[el.name] = message;
    }
    setErrors(next);
    const first = fields.find((el) => next[el.name]);
    first?.focus();
    first?.scrollIntoView({ block: "center", behavior: "smooth" });
    return !first;
  }, []);

  const recheck = (e: React.FormEvent<HTMLDivElement>) => {
    const el = e.target as Field;
    if (!el.dataset?.rule || !(el.name in errors)) return;
    const message = check(el);
    mark(el, message);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[el.name] = message;
      else delete next[el.name];
      return next;
    });
  };

  return (
    <FormCheckContext.Provider value={{ errors, validate }}>
      <div className="contents" onBlur={recheck} onInput={recheck} ref={ref}>
        {children}
      </div>
    </FormCheckContext.Provider>
  );
}

export const useFormCheck = () => useContext(FormCheckContext);

export function FieldError({ name }: { name: string }) {
  const { errors } = useFormCheck();
  if (!errors[name]) return null;
  return (
    <p className="mt-1 text-[12px] text-error font-medium flex items-center gap-1" id={`${name}-error`} role="alert">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {errors[name]}
    </p>
  );
}

type CheckedLinkProps = React.ComponentProps<typeof Link> & {
  /** Vérification asynchrone (ex. devis serveur) ; renvoie un message pour bloquer la navigation. */
  confirm?: () => Promise<string | null>;
};

/** Lien qui ne navigue que si tous les champs visibles du bloc `FormCheck` sont valides. */
export function CheckedLink({ onClick, confirm, children, className, ...props }: CheckedLinkProps) {
  const { validate } = useFormCheck();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  return (
    <>
      <Link
        {...props}
        aria-busy={pending || undefined}
        aria-disabled={pending || undefined}
        className={`${className ?? ""} ${pending ? "opacity-70 pointer-events-none" : ""}`}
        onClick={async (e) => {
          if (!validate()) return e.preventDefault();
          onClick?.(e);
          if (!confirm) return;
          e.preventDefault();
          setPending(true);
          setMessage(null);
          const problem = await confirm();
          setPending(false);
          if (problem) setMessage(problem);
          else router.push(String(props.href));
        }}
      >
        {pending ? (
          <>
            <span className="material-symbols-outlined text-[22px] animate-spin">sync</span>
            <span className="font-bold">Vérification du devis…</span>
          </>
        ) : (
          children
        )}
      </Link>
      {message && (
        <p className="text-[13px] text-error font-medium text-center" role="alert">
          {message}
        </p>
      )}
    </>
  );
}

/** Résumé affiché près du bouton de paiement. */
export function FormErrorSummary() {
  const { errors } = useFormCheck();
  const count = Object.keys(errors).length;
  if (!count) return null;
  return (
    <p className="text-[13px] text-error font-medium text-center" role="alert">
      {count === 1 ? "Un champ est à corriger" : `${count} champs sont à corriger`} avant de poursuivre le paiement.
    </p>
  );
}
