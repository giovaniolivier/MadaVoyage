"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "./session";

type Lang = "FR" | "MG" | "EN";
type Tab = "login" | "register";

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  FR: {
    titleLogin: "Tonga Soa, Voyageur",
    subtitleLogin: "Retrouvez vos séjours éco-responsables, billets d'avion et circuits privatifs.",
    titleRegister: "Créer votre carnet MadaVoyage",
    subtitleRegister: "Compte gratuit : vos réservations, billets et carnets de voyage réunis au même endroit.",
    phoneLabel: "Numéro de mobile",
    channelLabel: "Recevoir le code par",
    dividerPhone: "ou avec votre numéro",
    dividerEmail: "ou avec votre e-mail",
    guest: "Continuer sans compte",
    verifyTitle: "Vérifiez votre numéro",
    back: "Retour",
    phoneBtn: "Recevoir le code à 6 chiffres",
    emailBtnLogin: "Accéder à mes réservations",
    emailBtnRegister: "Créer mon compte voyageur",
    methodPhone: "Téléphone",
    methodEmail: "E-mail",
    socialLogin: "Continuer avec",
    socialRegister: "S'inscrire avec",
    firstName: "Prénom (facultatif)",
    noPassword: "Pas de mot de passe à retenir : un code à usage unique vous est envoyé à chaque connexion.",
    noPasswordShort: "Pas de mot de passe à retenir.",
  },
  MG: {
    titleLogin: "Tongasoa eto amin'ny MadaVoyage",
    subtitleLogin: "Midira ato hijery ny dianao, trano fandraisam-bahiny ary ny torolalana.",
    titleRegister: "Hisoratra anarana ho mpikambana",
    subtitleRegister: "Maimaim-poana ny kaonty : ao anatiny daholo ny famandrihanao, ny tapakila ary ny diaryn'ny dianao.",
    phoneLabel: "Laharana finday",
    channelLabel: "Handray ny kaody amin'ny",
    dividerPhone: "na amin'ny laharanao",
    dividerEmail: "na amin'ny mailakao",
    guest: "Hanohy tsy misy kaonty",
    verifyTitle: "Hamarino ny laharanao",
    back: "Hiverina",
    phoneBtn: "Handray ny kaody tarehimarika 6",
    emailBtnLogin: "Hiditra amin'ny kaonty",
    emailBtnRegister: "Hamorona kaonty vaovao",
    methodPhone: "Finday",
    methodEmail: "Mailaka",
    socialLogin: "Hiditra amin'ny",
    socialRegister: "Hisoratra amin'ny",
    firstName: "Anarana (tsy voatery)",
    noPassword: "Tsy mila teny miafina hotadidina : kaody tokana no alefa aminao isaky ny miditra.",
    noPasswordShort: "Tsy mila teny miafina hotadidina.",
  },
  EN: {
    titleLogin: "Welcome to MadaVoyage",
    subtitleLogin: "Access your eco-lodge stays, offline itineraries, and private expedition guides.",
    titleRegister: "Create your Traveler Account",
    subtitleRegister: "Free account: your bookings, tickets and travel notebooks all in one place.",
    phoneLabel: "Mobile number",
    channelLabel: "Receive the code via",
    dividerPhone: "or with your phone number",
    dividerEmail: "or with your email",
    guest: "Continue without an account",
    verifyTitle: "Verify your number",
    back: "Back",
    phoneBtn: "Get 6-digit verification code",
    emailBtnLogin: "Access my bookings",
    emailBtnRegister: "Create traveler account",
    methodPhone: "Phone",
    methodEmail: "Email",
    socialLogin: "Continue with",
    socialRegister: "Sign up with",
    firstName: "First name (optional)",
    noPassword: "No password to remember: we send you a one-time code each time you sign in.",
    noPasswordShort: "No password to remember.",
  },
};

const LANGS: { id: Lang; name: string; code: string }[] = [
  { id: "FR", name: "Français", code: "fr" },
  { id: "MG", name: "Malagasy", code: "mg" },
  { id: "EN", name: "English", code: "en" },
];

type Country = { iso: string; code: string; name: string; groups: number[]; trunk: boolean; sample: string };

const COUNTRIES: Country[] = [
  { iso: "MG", code: "+261", name: "Madagascar", groups: [2, 2, 3, 2], trunk: true, sample: "34 12 345 67" },
  { iso: "FR", code: "+33", name: "France", groups: [1, 2, 2, 2, 2], trunk: true, sample: "6 12 34 56 78" },
  { iso: "RE", code: "+262", name: "La Réunion / Mayotte", groups: [3, 2, 2, 2], trunk: true, sample: "692 12 34 56" },
  { iso: "BE", code: "+32", name: "Belgique", groups: [3, 2, 2, 2], trunk: true, sample: "470 12 34 56" },
  { iso: "CH", code: "+41", name: "Suisse", groups: [2, 3, 2, 2], trunk: true, sample: "78 123 45 67" },
  { iso: "DE", code: "+49", name: "Allemagne", groups: [3, 4, 4], trunk: true, sample: "151 2345 6789" },
  { iso: "IT", code: "+39", name: "Italie", groups: [3, 3, 4], trunk: false, sample: "312 345 6789" },
  { iso: "GB", code: "+44", name: "Royaume-Uni", groups: [4, 6], trunk: true, sample: "7400 123456" },
  { iso: "US", code: "+1", name: "États-Unis / Canada", groups: [3, 3, 4], trunk: false, sample: "201 555 0123" },
];

const REGION_TO_ISO: Record<string, string> = { CA: "US", YT: "RE", AT: "DE", LU: "FR", MC: "FR" };
const LANG_TO_ISO: Record<string, string> = { mg: "MG", fr: "FR", de: "DE", it: "IT", en: "GB" };

function detectCountry(): string {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (zone === "Indian/Antananarivo") return "MG";
  if (zone === "Indian/Reunion" || zone === "Indian/Mayotte") return "RE";
  for (const tag of navigator.languages ?? [navigator.language]) {
    const [language, region] = tag.split("-");
    const iso = region ? (REGION_TO_ISO[region.toUpperCase()] ?? region.toUpperCase()) : undefined;
    if (iso && COUNTRIES.some((c) => c.iso === iso)) return iso;
    if (!region && LANG_TO_ISO[language.toLowerCase()]) return LANG_TO_ISO[language.toLowerCase()];
  }
  return "MG";
}

function detectLang(): Lang {
  const language = (navigator.language ?? "").slice(0, 2).toLowerCase();
  return language === "fr" ? "FR" : language === "mg" ? "MG" : "EN";
}

function nationalDigits(country: Country, raw: string) {
  const digits = raw.replace(/\D/g, "");
  return country.trunk ? digits.replace(/^0/, "") : digits;
}

function formatNational(country: Country, digits: string) {
  const parts: string[] = [];
  let rest = digits;
  for (const size of country.groups) {
    if (!rest) break;
    parts.push(rest.slice(0, size));
    rest = rest.slice(size);
  }
  if (rest) parts.push(rest);
  return parts.join(" ");
}
const CODE_LENGTH = 6;
const OTP_SECONDS = 299;
const RESEND_SECONDS = 30;
const MAX_ATTEMPTS = 5;
const BLOCK_SECONDS = 15 * 60;
const DEMO_CODE = "123456";
const REDIRECT_TO = "/compte";
const LANG_KEY = "mv_lang";

type Channel = "WhatsApp" | "SMS";

const AuthContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void } | null>(null);

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("FR");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    setLangState(saved === "FR" || saved === "MG" || saved === "EN" ? saved : detectLang());
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem(LANG_KEY, next);
  }

  return <AuthContext.Provider value={{ lang, setLang }}>{children}</AuthContext.Provider>;
}

export function GuestLink({ className = "" }: { className?: string }) {
  const { lang } = useAuth();
  return (
    <Link className={`items-center gap-1 font-label-md text-label-md text-primary hover:underline ${className}`} href="/">
      {TRANSLATIONS[lang].guest}
      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
    </Link>
  );
}

export function LanguageSwitcher() {
  const { lang, setLang } = useAuth();
  return (
    <div aria-label="Langue" className="relative inline-flex items-center bg-surface-container-low p-1 rounded-full" role="group">
      {LANGS.map((l) => (
        <button
          key={l.id}
          aria-label={l.name}
          aria-pressed={lang === l.id}
          className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all duration-200 ${
            lang === l.id ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
          onClick={() => setLang(l.id)}
          type="button"
        >
          <span aria-hidden="true">{l.id}</span>
        </button>
      ))}
    </div>
  );
}

function formatTime(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatShort(total: number) {
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function useRedirectAfterSuccess(done: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (!done) return;
    signIn({ name: "Alexandre Fontaine" });
    const t = setTimeout(() => router.push(REDIRECT_TO), 1200);
    return () => clearTimeout(t);
  }, [done, router]);
}

const inputClass =
  "w-full h-[52px] short:h-12 tiny:h-10 bg-surface-container-low rounded px-4 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/80 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary";
const primaryBtn =
  "w-full h-[52px] mt-2 short:h-12 short:mt-1 tiny:h-10 tiny:mt-0 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed";

function OtpStep({
  destination,
  channel: initialChannel,
  onBack,
  onUseEmail,
}: {
  destination: string;
  channel: Channel;
  onBack: () => void;
  onUseEmail: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const [channel, setChannel] = useState<Channel>(initialChannel);
  const [seconds, setSeconds] = useState(OTP_SECONDS);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const [status, setStatus] = useState<"idle" | "verifying" | "done">("idle");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [blockedFor, setBlockedFor] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const wasBlocked = useRef(false);
  const blocked = blockedFor > 0;
  const expired = seconds <= 0 && !blocked;
  const busy = status !== "idle";
  const complete = digits.every((d) => d !== "");
  const inputsDisabled = busy || blocked || expired;
  const canResend = !busy && !blocked && (cooldown <= 0 || expired);
  const otherChannel: Channel = channel === "WhatsApp" ? "SMS" : "WhatsApp";

  useRedirectAfterSuccess(status === "done");

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const ticking = status === "idle" && (seconds > 0 || cooldown > 0 || blocked);
  useEffect(() => {
    if (!ticking) return;
    const t = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
      setCooldown((c) => Math.max(0, c - 1));
      setBlockedFor((b) => Math.max(0, b - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [ticking]);

  useEffect(() => {
    if (blocked) {
      wasBlocked.current = true;
    } else if (wasBlocked.current) {
      wasBlocked.current = false;
      setAttemptsLeft(MAX_ATTEMPTS);
      setNotice("Vous pouvez à nouveau demander un code.");
    }
  }, [blocked]);

  useEffect(() => {
    if (status === "idle" && !blocked && !expired && complete) {
      setError(null);
      setStatus("verifying");
    }
  }, [status, blocked, expired, complete]);

  useEffect(() => {
    if (status !== "verifying") return;
    const t = setTimeout(() => {
      if (digits.join("") === DEMO_CODE) {
        setStatus("done");
        return;
      }
      const left = attemptsLeft - 1;
      setAttemptsLeft(left);
      setDigits(Array(CODE_LENGTH).fill(""));
      if (left <= 0) {
        setBlockedFor(BLOCK_SECONDS);
        setSeconds(0);
        setError(null);
        setNotice(null);
      } else {
        setError(`Code incorrect. Il vous reste ${left} essai${left > 1 ? "s" : ""}.`);
      }
      setStatus("idle");
    }, 1200);
    return () => clearTimeout(t);
  }, [status, digits, attemptsLeft]);

  useEffect(() => {
    if (status === "idle" && error) inputs.current[0]?.focus();
  }, [status, error]);

  function focusAt(index: number) {
    inputs.current[Math.max(0, Math.min(CODE_LENGTH - 1, index))]?.focus();
  }

  function fillFrom(index: number, value: string) {
    const chars = value
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH - index)
      .split("");
    if (chars.length === 0) return;
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((c, i) => (next[index + i] = c));
      return next;
    });
    setError(null);
    focusAt(index + chars.length);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index]) {
      e.preventDefault();
      setDigits((prev) => prev.map((d, j) => (j === index - 1 ? "" : d)));
      focusAt(index - 1);
    } else if (e.key === "ArrowLeft") {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      focusAt(index + 1);
    } else if (e.key === "Enter") {
      confirm();
    }
  }

  function resend(via: Channel) {
    if (!canResend) return;
    setChannel(via);
    setDigits(Array(CODE_LENGTH).fill(""));
    setSeconds(OTP_SECONDS);
    setCooldown(RESEND_SECONDS);
    setError(null);
    setHelpOpen(false);
    setNotice(`Un nouveau code à 6 chiffres a été envoyé par ${via}.`);
    setTimeout(() => focusAt(0));
  }

  function confirm() {
    if (expired) {
      resend(channel);
      return;
    }
    if (busy || blocked || !complete) return;
    setError(null);
    setStatus("verifying");
  }

  const actionBase =
    "w-full h-[52px] short:h-12 tiny:h-10 rounded-full font-label-lg text-label-lg transition-all flex items-center justify-center gap-2";
  const actionOn = "bg-primary text-on-primary shadow-md";
  const actionOff = "bg-surface-container-high text-on-surface-variant cursor-not-allowed";
  const actionEnabled = expired || (status === "idle" && !blocked && complete);

  return (
    <div className="flex flex-col">
      <div className="p-space-md tiny:py-space-sm bg-surface-container-low rounded mb-space-md tiny:mb-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Code envoyé avec succès
          </span>
          <button
            className="font-body-sm text-body-sm text-primary hover:underline disabled:opacity-50"
            disabled={busy}
            onClick={onBack}
            type="button"
          >
            Modifier le numéro
          </button>
        </div>
        <p className="font-body-md text-body-md text-on-surface mt-1">
          Code envoyé par {channel} au <strong className="whitespace-nowrap">{destination}</strong>
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          Démo : le code <strong className="tabular-nums">{DEMO_CODE}</strong> est accepté, tout autre code est refusé.
        </p>
      </div>

      <p className="font-label-sm text-label-sm text-on-surface block mb-2 text-center" id="otp-label">
        Saisissez les 6 chiffres reçus
      </p>
      <div
        aria-describedby={error ? "otp-error" : undefined}
        aria-labelledby="otp-label"
        className="flex justify-between items-center gap-2 mb-space-sm"
        role="group"
      >
        {digits.map((digit, i) => (
          <div key={i} className="contents">
            {i === CODE_LENGTH / 2 && (
              <span aria-hidden="true" className="font-headline-sm text-outline-variant font-bold">
                -
              </span>
            )}
            <input
              ref={(el) => {
                inputs.current[i] = el;
              }}
              aria-invalid={error ? true : undefined}
              aria-label={`Chiffre ${i + 1} sur ${CODE_LENGTH}`}
              autoComplete="one-time-code"
              className={`w-11 sm:w-12 h-14 tiny:h-12 text-center font-headline-md text-headline-md rounded border-2 bg-surface-container-lowest text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:opacity-60 ${
                error ? "border-error" : digit ? "border-primary/60" : "border-outline"
              }`}
              disabled={inputsDisabled}
              inputMode="numeric"
              maxLength={CODE_LENGTH}
              onChange={(e) => {
                let value = e.target.value;
                if (value === "") {
                  setDigits((prev) => prev.map((d, j) => (j === i ? "" : d)));
                  return;
                }
                if (digit && value.length > 1) {
                  value = value.startsWith(digit) ? value.slice(digit.length) : value.slice(0, -digit.length);
                }
                fillFrom(i, value);
              }}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => {
                e.preventDefault();
                fillFrom(i, e.clipboardData.getData("text"));
              }}
              type="text"
              value={digit}
            />
          </div>
        ))}
      </div>
      <p className="min-h-[1.25rem] mb-space-sm font-body-sm text-body-sm text-error text-center" id="otp-error" role="alert">
        {error}
      </p>

      {blocked ? (
        <div
          className="flex items-start gap-2 p-space-sm rounded-lg bg-error-container text-on-error-container mb-space-md tiny:mb-space-sm"
          role="alert"
        >
          <span className="material-symbols-outlined text-[20px]">lock_clock</span>
          <div className="font-body-sm text-body-sm">
            <p className="font-semibold">Trop d&apos;essais incorrects</p>
            <p>
              Par sécurité, la saisie est bloquée pendant <span className="font-semibold tabular-nums">{formatShort(blockedFor)}</span>.{" "}
              <button className="underline font-semibold" onClick={onUseEmail} type="button">
                Utiliser mon e-mail
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 tiny:gap-1 mb-space-lg short:mb-space-md tiny:mb-space-sm">
          <div className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">timer</span>
            {expired ? (
              <span className="font-semibold text-error" role="status">
                Code expiré : demandez un nouveau code
              </span>
            ) : (
              <>
                <span>Validité du code :</span>
                <span className={`font-semibold tabular-nums ${seconds <= 60 ? "text-tertiary" : "text-on-surface-variant"}`}>
                  {formatTime(seconds)}
                </span>
              </>
            )}
          </div>
          {canResend ? (
            <div className="flex items-center gap-4">
              <button
                className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-1"
                onClick={() => resend("WhatsApp")}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  chat
                </span>
                Renvoyer via WhatsApp
              </button>
              <span aria-hidden="true" className="text-outline-variant">
                •
              </span>
              <button
                className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1"
                onClick={() => resend("SMS")}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">sms</span>
                Renvoyer par SMS
              </button>
            </div>
          ) : (
            <p className="font-label-sm text-label-sm text-on-surface-variant tabular-nums">
              Renvoyer le code dans {formatShort(cooldown)}
            </p>
          )}
          <p className="min-h-[1.25rem] font-body-sm text-body-sm text-secondary text-center" role="status">
            {notice}
          </p>
        </div>
      )}

      <div
        className="relative mb-space-md tiny:mb-space-sm rounded-lg bg-surface-container-low"
        onKeyDown={(e) => {
          if (e.key === "Escape") setHelpOpen(false);
        }}
      >
        <button
          aria-controls="otp-help"
          aria-expanded={helpOpen}
          className="w-full flex items-center justify-between gap-2 px-space-md py-3 tiny:py-2 font-label-md text-label-md text-on-surface"
          onClick={() => setHelpOpen((o) => !o)}
          type="button"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">help</span>
            Je ne reçois pas le code
          </span>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{helpOpen ? "expand_less" : "expand_more"}</span>
        </button>
        {helpOpen && (
          <div
            className="absolute bottom-full inset-x-0 mb-2 z-20 p-space-md rounded-lg bg-surface-container-lowest shadow-xl ring-1 ring-surface-container-high flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant"
            id="otp-help"
          >
            <p>Le réseau peut retarder l&apos;arrivée du code de quelques minutes. Vous pouvez aussi :</p>
            <button
              className="flex items-center gap-2 p-3 rounded bg-surface-container-low text-left text-on-surface hover:bg-surface-container disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!canResend}
              onClick={() => resend(otherChannel)}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">{otherChannel === "SMS" ? "sms" : "chat"}</span>
              <span className="flex-1">
                Recevoir le code par {otherChannel}
                {!canResend && <span className="block text-on-surface-variant tabular-nums">Disponible dans {formatShort(cooldown)}</span>}
              </span>
            </button>
            <button
              className="flex items-center gap-2 p-3 rounded bg-surface-container-low text-left text-on-surface hover:bg-surface-container disabled:opacity-60"
              disabled={busy}
              onClick={onUseEmail}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
              <span className="flex-1">Me connecter avec mon adresse e-mail</span>
            </button>
            <Link
              className="flex items-center gap-2 p-3 rounded bg-surface-container-low text-on-surface hover:bg-surface-container"
              href="/aide"
            >
              <span className="material-symbols-outlined text-[18px] text-tertiary">support_agent</span>
              <span className="flex-1">Contacter l&apos;assistance 24h/24</span>
            </Link>
          </div>
        )}
      </div>

      <button
        aria-busy={status === "verifying"}
        className={`${actionBase} ${
          actionEnabled ? `${actionOn} hover:bg-primary-container active:scale-[0.99]` : busy ? `${actionOn} cursor-wait` : actionOff
        }`}
        disabled={!actionEnabled}
        onClick={confirm}
        type="button"
      >
        {status === "verifying" ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            <span>Vérification du code…</span>
          </>
        ) : status === "done" ? (
          <>
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Session ouverte, redirection…</span>
          </>
        ) : blocked ? (
          <span className="tabular-nums">Réessayez dans {formatShort(blockedFor)}</span>
        ) : expired ? (
          <>
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Recevoir un nouveau code par {channel}</span>
          </>
        ) : (
          <>
            <span>Valider le code</span>
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </>
        )}
      </button>
    </div>
  );
}

export function AuthPanel() {
  const { lang } = useAuth();
  const dict = TRANSLATIONS[lang];
  const [tab, setTab] = useState<Tab>("login");
  const [method, setMethod] = useState<"mobile" | "email">("mobile");
  const [otpFor, setOtpFor] = useState<{ destination: string; channel: Channel } | null>(null);
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [countryIso, setCountryIso] = useState(COUNTRIES[0].iso);
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "done">("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const country = COUNTRIES.find((c) => c.iso === countryIso) ?? COUNTRIES[0];

  useRedirectAfterSuccess(emailStatus === "done");

  useEffect(() => {
    setCountryIso(detectCountry());
  }, []);

  useEffect(() => {
    if (emailStatus !== "loading") return;
    const t = setTimeout(() => setEmailStatus("done"), 1000);
    return () => clearTimeout(t);
  }, [emailStatus]);

  function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    const digits = nationalDigits(country, phone);
    if (digits.length < 6 || digits.length > 12) {
      setPhoneError("Saisissez un numéro de mobile valide (6 à 12 chiffres, sans l'indicatif).");
      return;
    }
    if (tab === "register" && !consent) {
      setConsentError(true);
      return;
    }
    setPhoneError(null);
    setNotice(null);
    setOtpFor({ destination: `${country.code} ${formatNational(country, digits)}`, channel: channel === "whatsapp" ? "WhatsApp" : "SMS" });
  }

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    setEmailStatus("loading");
  }

  function forgotPassword() {
    const input = emailRef.current;
    if (!input || !email || !input.checkValidity()) {
      setNotice("Saisissez d'abord votre adresse e-mail pour recevoir un lien de réinitialisation.");
      input?.focus();
      return;
    }
    setNotice(`Un lien de réinitialisation a été envoyé à ${email}.`);
  }

  const consentField = tab === "register" && (
    <div>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          aria-describedby={consentError ? "consent-error" : undefined}
          aria-invalid={consentError ? true : undefined}
          checked={consent}
          className="mt-1 w-4 h-4 rounded accent-primary shrink-0"
          onChange={(e) => {
            setConsent(e.target.checked);
            setConsentError(false);
          }}
          required
          type="checkbox"
        />
        <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug tiny:text-[12px] tiny:leading-tight">
          J&apos;accepte les{" "}
          <Link className="text-primary hover:underline" href="/mentions-legales#cgv">
            conditions générales d&apos;utilisation
          </Link>{" "}
          et la{" "}
          <Link className="text-primary hover:underline" href="/mentions-legales#rgpd">
            politique de confidentialité
          </Link>
          .
        </span>
      </label>
      {consentError && (
        <p className="mt-1 font-body-sm text-body-sm text-error" id="consent-error" role="alert">
          Veuillez accepter les conditions pour créer votre compte.
        </p>
      )}
    </div>
  );

  const tabClass = (active: boolean) =>
    `flex-1 py-2.5 short:py-2 tiny:py-1 rounded-full font-label-md text-label-md text-center transition-all duration-200 ${
      active ? "bg-surface-container-lowest text-primary shadow-sm font-semibold" : "text-on-surface-variant hover:text-on-surface"
    }`;

  return (
    <div className="max-w-[480px] w-full mx-auto flex flex-col" lang={LANGS.find((l) => l.id === lang)?.code}>
      {otpFor ? (
        <div className="flex items-center gap-1 mb-space-md tiny:mb-space-sm -ml-2.5">
          <button
            aria-label={dict.back}
            className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-low"
            onClick={() => setOtpFor(null)}
            type="button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-lg text-headline-lg tiny:text-headline-md text-on-surface tracking-tight">{dict.verifyTitle}</h1>
        </div>
      ) : (
        <>
          <div
            aria-label="Type d'accès"
            className="flex items-center bg-surface-container-low p-1.5 tiny:p-1 rounded-full mb-space-md tiny:mb-space-sm w-full"
            role="group"
          >
            {(
              [
                ["login", "Connexion"],
                ["register", "Créer un compte"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                aria-pressed={tab === id}
                className={tabClass(tab === id)}
                lang="fr"
                onClick={() => {
                  setTab(id);
                  setNotice(null);
                  setConsentError(false);
                }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mb-space-md">
            <h1 className="font-headline-lg text-headline-lg tiny:text-headline-md text-on-surface tracking-tight">
              {tab === "login" ? dict.titleLogin : dict.titleRegister}
            </h1>
            <p className={`font-body-md text-body-md text-on-surface-variant mt-1 ${tab === "register" ? "short:hidden" : "tiny:hidden"}`}>
              {tab === "login" ? dict.subtitleLogin : dict.subtitleRegister}
            </p>
          </div>
        </>
      )}

      {otpFor ? (
        <OtpStep
          channel={otpFor.channel}
          destination={otpFor.destination}
          onBack={() => setOtpFor(null)}
          onUseEmail={() => {
            setOtpFor(null);
            setMethod("email");
            setNotice(null);
          }}
        />
      ) : (
        <div className="flex flex-col gap-space-md short:gap-3 tiny:gap-space-sm">
          <div className="grid grid-cols-2 gap-space-sm mb-1">
            {(["Google", "Apple"] as const).map((provider) => (
              <button
                key={provider}
                className="flex items-center justify-center gap-2 h-12 short:h-11 tiny:h-9 px-2 rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors shadow-sm"
                onClick={() =>
                  setNotice(
                    `${tab === "login" ? "La connexion" : "L'inscription"} via ${provider} arrive bientôt : utilisez votre mobile ou votre e-mail en attendant.`,
                  )
                }
                type="button"
              >
                {provider === "Google" ? (
                  <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                ) : (
                  <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.53-9.93-11.75-21.2-15.66-33.82-3.91-12.63-5.87-24.67-5.87-36.14 0-15.11 3.91-27.56 11.74-37.33 7.83-9.77 17.58-14.77 29.26-15 4.35 0 9.4 1.17 15.15 3.51 5.75 2.34 9.4 3.58 10.95 3.72 2.34-.35 6.23-1.68 11.66-3.98 5.43-2.3 10.23-3.32 14.4-3.07 10.92.54 19.86 4.67 26.83 12.39-9.59 5.82-14.28 13.91-14.07 24.28.21 8.27 3.38 15.15 9.52 20.64 6.13 5.49 13.25 8.71 21.36 9.68-2.24 6.94-5.06 14.13-8.47 21.57zM119.22 33.15c0-7.39 2.63-14.2 7.89-20.43 5.26-6.23 11.71-10.15 19.35-11.76.21 1.25.32 2.44.32 3.57 0 7.39-2.73 14.31-8.2 20.76-5.47 6.45-11.89 10.26-19.26 11.43-.07-1.18-.1-2.37-.1-3.57z"></path>
                  </svg>
                )}
                <span className="font-label-md text-label-md leading-tight text-center">
                  {tab === "login" ? dict.socialLogin : dict.socialRegister} {provider}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center my-1 short:my-0 tiny:hidden">
            <div className="flex-1 h-px bg-surface-container-high"></div>
            <span className="px-3 font-body-sm text-body-sm text-on-surface-variant">
              {method === "mobile" ? dict.dividerPhone : dict.dividerEmail}
            </span>
            <div className="flex-1 h-px bg-surface-container-high"></div>
          </div>

          <div aria-label="Méthode d'identification" className="grid grid-cols-2 p-1 rounded-lg bg-surface-container-low" role="group">
            {(
              [
                ["mobile", "phone_iphone", dict.methodPhone],
                ["email", "mail", dict.methodEmail],
              ] as const
            ).map(([id, icon, label]) => (
              <button
                key={id}
                aria-pressed={method === id}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-md font-label-md text-label-md transition-all ${
                  method === id
                    ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => {
                  setMethod(id);
                  setNotice(null);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {tab === "register" && (
            <div>
              <label className="font-label-sm text-label-sm text-on-surface block mb-1 short:sr-only" htmlFor="auth-first-name">
                {" "}
                {dict.firstName}
              </label>
              <input
                autoComplete="given-name"
                className={inputClass}
                id="auth-first-name"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={dict.firstName}
                type="text"
                value={firstName}
              />
            </div>
          )}

          {method === "mobile" ? (
            <form className="flex flex-col gap-3 tiny:gap-2" noValidate onSubmit={requestOtp}>
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="phone-number">
                {dict.phoneLabel}
              </label>
              <div className="flex items-stretch gap-2">
                <div className="relative w-[7.5rem] shrink-0">
                  <select
                    aria-label={`Indicatif pays : ${country.name} ${country.code}`}
                    className="w-full h-[52px] short:h-12 tiny:h-10 bg-surface-container-low rounded px-3 pr-8 font-label-md text-label-md text-transparent focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                    onChange={(e) => {
                      setCountryIso(e.target.value);
                      setPhoneError(null);
                    }}
                    value={country.iso}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.iso} className="text-on-surface" value={c.iso}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-3 flex items-center gap-1.5 pointer-events-none font-label-md text-label-md text-on-surface"
                  >
                    <span className="text-on-surface-variant text-[12px] font-semibold">{country.iso}</span>
                    {country.code}
                  </span>
                  <span className="material-symbols-outlined absolute right-2.5 top-3.5 short:top-3 tiny:top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
                <input
                  aria-describedby={phoneError ? "phone-error" : undefined}
                  aria-invalid={phoneError ? true : undefined}
                  autoComplete="tel-national"
                  className={`${inputClass} flex-1`}
                  id="phone-number"
                  inputMode="tel"
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError(null);
                  }}
                  placeholder={country.sample}
                  type="tel"
                  value={phone}
                />
              </div>
              {phoneError && (
                <p className="font-body-sm text-body-sm text-error" id="phone-error" role="alert">
                  {phoneError}
                </p>
              )}

              <div aria-labelledby="otp-channel-label" className="flex items-center gap-3" role="group">
                <span className="font-body-sm text-body-sm text-on-surface-variant shrink-0" id="otp-channel-label">
                  {dict.channelLabel}
                </span>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {(
                    [
                      ["whatsapp", "chat", "WhatsApp"],
                      ["sms", "sms", "SMS"],
                    ] as const
                  ).map(([id, icon, label]) => (
                    <button
                      key={id}
                      aria-pressed={channel === id}
                      className={`h-11 tiny:h-9 rounded-lg border-2 flex items-center justify-center gap-1.5 font-label-md text-label-md transition-colors ${
                        channel === id
                          ? "border-primary bg-primary/5 text-primary font-semibold"
                          : "border-surface-container-high text-on-surface-variant hover:border-outline hover:text-on-surface"
                      }`}
                      onClick={() => setChannel(id)}
                      type="button"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={channel === id ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {icon}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {consentField}

              <button className={primaryBtn} type="submit">
                <span>{dict.phoneBtn}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              {tab === "register" && (
                <p className="flex items-start gap-1.5 font-body-sm text-body-sm text-on-surface-variant [@media(min-width:1024px)_and_(max-height:560px)]:hidden">
                  <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">key_off</span>
                  <span className="short:hidden">{dict.noPassword}</span>
                  <span className="hidden short:inline">{dict.noPasswordShort}</span>
                </p>
              )}
            </form>
          ) : (
            <form className="flex flex-col gap-3 tiny:gap-1" onSubmit={submitEmail}>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface block mb-1 tiny:mb-0.5" htmlFor="auth-email">
                  Adresse e-mail voyageur
                </label>
                <input
                  ref={emailRef}
                  autoComplete="email"
                  className={inputClass}
                  id="auth-email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nomad@madavoyage.mg"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 tiny:mb-0.5">
                  <label className="font-label-sm text-label-sm text-on-surface" htmlFor="auth-password">
                    Mot de passe
                  </label>
                  {tab === "login" && (
                    <button className="font-body-sm text-body-sm text-primary hover:underline" onClick={forgotPassword} type="button">
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                    className={`${inputClass} pr-11`}
                    id="auth-password"
                    minLength={tab === "register" ? 8 : undefined}
                    placeholder="••••••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-3.5 short:top-3 tiny:top-2.5 text-on-surface-variant hover:text-on-surface"
                    onClick={() => setShowPassword((v) => !v)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {tab === "register" && (
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant short:hidden">8 caractères minimum.</p>
                )}
              </div>
              {consentField}
              <button className={primaryBtn} disabled={emailStatus !== "idle"} type="submit">
                {emailStatus === "loading" ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    <span>Authentification en cours…</span>
                  </>
                ) : emailStatus === "done" ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Session ouverte, redirection…</span>
                  </>
                ) : (
                  <>
                    <span>{tab === "login" ? dict.emailBtnLogin : dict.emailBtnRegister}</span>
                    <span className="material-symbols-outlined text-[18px]">{tab === "login" ? "lock_open" : "person_add"}</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="min-h-[1.25rem] short:min-h-0 font-body-sm text-body-sm text-on-surface-variant" lang="fr" role="status">
            {notice}
          </p>
          <GuestLink className="flex self-center sm:hidden" />
        </div>
      )}
    </div>
  );
}
