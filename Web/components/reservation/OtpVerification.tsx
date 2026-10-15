"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CODE_LENGTH = 6;
const INITIAL_SECONDS = 278;
const RESEND_SECONDS = 300;

type Status = "idle" | "verifying" | "confirmed";

function formatTime(total: number) {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function OtpVerification({ amountLabel }: { amountLabel: React.ReactNode }) {
  const [digits, setDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [status, setStatus] = useState<Status>("idle");
  const [resentVia, setResentVia] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const expired = secondsLeft <= 0;
  const complete = digits.every((d) => d !== "");
  const locked = status !== "idle";

  useEffect(() => {
    if (expired || status === "confirmed") return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [expired, status]);

  useEffect(() => {
    if (status === "idle") return;
    const timeout =
      status === "verifying"
        ? setTimeout(() => setStatus("confirmed"), 1800)
        : setTimeout(() => router.push("/reservation/confirmation"), 1200);
    return () => clearTimeout(timeout);
  }, [status, router]);

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
    focusAt(index + chars.length);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index]) {
      e.preventDefault();
      setDigits((prev) => {
        const next = [...prev];
        if (index > 0) next[index - 1] = "";
        return next;
      });
      focusAt(index - 1);
    } else if (e.key === "ArrowLeft") {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      focusAt(index + 1);
    }
  }

  function resend(channel: string) {
    setDigits(Array(CODE_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    setResentVia(channel);
    focusAt(0);
  }

  return (
    <>
      <div className="mt-space-xl p-space-lg rounded-lg bg-surface-container-low flex flex-col items-center">
        <div className="flex items-center gap-space-xs mb-space-sm text-primary">
          <span className="material-symbols-outlined text-[20px]">pin</span>
          <span className="font-label-lg text-label-lg font-bold" id="otp-label">
            Saisissez votre code de sécurité à 6 chiffres
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center max-w-md mb-space-lg">
          Ce code éphémère certifie la conformité de l&apos;ordre de débit avec la politique anti-fraude de la Banque Centrale.
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-4 my-space-xs" role="group" aria-labelledby="otp-label">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={digit}
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
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => {
                e.preventDefault();
                fillFrom(i, e.clipboardData.getData("text"));
              }}
              onFocus={(e) => e.target.select()}
              disabled={locked || expired}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={CODE_LENGTH}
              aria-label={`Chiffre ${i + 1} sur ${CODE_LENGTH}`}
              className="w-12 h-16 sm:w-14 sm:h-16 rounded bg-surface-container-lowest text-on-surface text-center font-headline-lg text-headline-lg font-extrabold shadow-sm caret-primary outline-none focus:ring-2 focus:ring-primary focus:shadow-md disabled:opacity-60 transition-shadow"
            />
          ))}
        </div>

        <div className="mt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm w-full max-w-lg px-space-xs">
          <div className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant" aria-live="polite">
            <span className="material-symbols-outlined text-[18px] text-tertiary">timer</span>
            {expired ? (
              <span className="font-bold text-error">Code expiré — demandez un nouveau code</span>
            ) : (
              <>
                <span>Code valable pendant</span>
                <span className="font-bold text-tertiary tabular-nums">{formatTime(secondsLeft)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="font-label-md text-label-md text-primary hover:text-on-primary-container font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              type="button"
              disabled={locked}
              onClick={() => resend("SMS")}
            >
              <span className="material-symbols-outlined text-[16px]">sms</span>
              SMS
            </button>
            <span className="text-outline-variant">·</span>
            <button
              className="font-label-md text-label-md text-secondary hover:text-on-secondary-container font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              type="button"
              disabled={locked}
              onClick={() => resend("WhatsApp")}
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              WhatsApp
            </button>
          </div>
        </div>
        {resentVia && !locked && (
          <p className="mt-space-sm font-body-sm text-body-sm text-secondary" role="status">
            Nouveau code envoyé par {resentVia}.
          </p>
        )}
      </div>

      <div className="mt-space-xl flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <Link
          className="w-full sm:w-auto order-2 sm:order-1 px-space-lg py-space-sm rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          href="/reservation/recapitulatif"
        >
          <span className="material-symbols-outlined text-[20px]">credit_card</span>
          <span>Changer de moyen de paiement (CB / Visa)</span>
        </Link>
        <button
          className={`w-full sm:w-auto order-1 sm:order-2 px-space-xl py-4 rounded-full ${
            status === "confirmed" ? "bg-primary" : "bg-secondary hover:bg-primary"
          } text-on-secondary font-label-lg text-label-lg font-bold shadow-lg shadow-secondary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100`}
          type="button"
          disabled={!complete || expired || locked}
          aria-live="polite"
          onClick={() => setStatus("verifying")}
        >
          {status === "verifying" ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              <span>Vérification auprès de la BCM...</span>
            </>
          ) : status === "confirmed" ? (
            <>
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
              <span>Transaction Confirmée !</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
              <span>Confirmer &amp; émettre mes vouchers</span>
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-on-secondary/20 font-label-sm text-label-sm">
                {amountLabel}
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
