"use client";

import Link from "next/link";
import { useDatesText } from "@/components/reservation/dates-i18n";
import { useDestinationText } from "@/components/reservation/destination-i18n";
import { useOnline } from "@/components/reservation/zone-states";
import { PHONE, WHATSAPP } from "@/lib/site";

export default function DestinationError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const online = useOnline();
  const tx = useDestinationText();
  const dt = useDatesText();

  return (
    <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)]" lang={dt.html}>
      <div className="max-w-2xl mx-auto px-margin py-space-xl flex flex-col items-center text-center gap-space-md">
        <span aria-hidden="true" className="material-symbols-outlined text-[56px] text-tertiary">
          {online ? "cloud_off" : "wifi_off"}
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
          {online ? tx.errorTitle : tx.errorOfflineTitle}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{online ? tx.errorText : tx.errorOfflineText}</p>
        <div className="flex flex-wrap items-center justify-center gap-space-sm">
          <button
            className="h-12 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center gap-2"
            onClick={reset}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
              refresh
            </span>
            {tx.retry}
          </button>
          <Link
            className="h-12 px-6 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center"
            href="/reservation/dates"
          >
            {tx.backToDates}
          </Link>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {tx.helpNow}{" "}
          <a className="text-primary font-semibold underline underline-offset-4" href={PHONE.href}>
            {PHONE.display}
          </a>{" "}
          {tx.or}{" "}
          <a
            className="text-primary font-semibold underline underline-offset-4"
            href={WHATSAPP.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp
            <span className="sr-only"> {dt.newTab}</span>
          </a>
          .
        </p>
      </div>
    </main>
  );
}
