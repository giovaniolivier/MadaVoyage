"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PHONE, WHATSAPP } from "@/lib/site";

export default function CircuitsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const onNetwork = () => setOffline(!navigator.onLine);
    onNetwork();
    window.addEventListener("online", onNetwork);
    window.addEventListener("offline", onNetwork);
    return () => {
      window.removeEventListener("online", onNetwork);
      window.removeEventListener("offline", onNetwork);
    };
  }, []);

  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
      <div className="max-w-2xl mx-auto px-margin py-space-xl flex flex-col items-center text-center gap-space-md">
        <span aria-hidden="true" className="material-symbols-outlined text-[56px] text-tertiary">
          {offline ? "wifi_off" : "cloud_off"}
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
          {offline ? "Vous êtes hors ligne" : "Les circuits n'ont pas pu être chargés"}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {offline
            ? "Vérifiez votre connexion Wi-Fi ou mobile, puis réessayez. Vos filtres sont conservés dans l'adresse de la page."
            : "Un incident réseau a interrompu le chargement. Réessayez dans un instant : vos filtres sont conservés dans l'adresse de la page."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-space-sm">
          <button
            className="h-12 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center gap-2"
            onClick={reset}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
              refresh
            </span>
            Réessayer
          </button>
          <Link
            className="h-12 px-6 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center"
            href="/"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Besoin d&apos;aide tout de suite ?{" "}
          <a className="text-primary font-semibold underline underline-offset-4" href={PHONE.href}>
            {PHONE.display}
          </a>{" "}
          ou{" "}
          <a
            className="text-primary font-semibold underline underline-offset-4"
            href={WHATSAPP.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    </main>
  );
}
