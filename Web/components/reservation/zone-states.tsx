"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useDatesText } from "./dates-i18n";
import { useDestinationText } from "./destination-i18n";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/** Vrai au rendu serveur : la page s'affiche comme en ligne jusqu'à l'hydratation. */
export function useOnline() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}

export function OfflineNotice() {
  const tx = useDestinationText();
  return (
    <div
      className="bg-tertiary-fixed/60 text-on-tertiary-fixed-variant p-space-md rounded-lg flex flex-col sm:flex-row sm:items-center gap-space-sm"
      role="status"
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
        wifi_off
      </span>
      <p className="font-body-md text-body-md flex-1">
        <strong className="font-bold">{tx.offlineTitle}</strong> {tx.offlineText}
      </p>
      <button
        className="self-start sm:self-auto h-10 px-5 rounded-full bg-on-tertiary-fixed-variant text-on-tertiary font-label-md text-label-md font-bold"
        onClick={() => window.location.reload()}
        type="button"
      >
        {tx.retry}
      </button>
    </div>
  );
}

/** Texte lu par les lecteurs d'écran pendant le chargement de l'étape 2 (le squelette est rendu côté serveur). */
export function LoadingStatus() {
  const tx = useDestinationText();
  return (
    <p className="sr-only" lang={useDatesText().html} role="status">
      {tx.loading}
    </p>
  );
}

/** Photo de zone avec un repli lisible si elle échoue, rechargée au retour du réseau. */
export function ZonePhoto({ src, alt, className, lazy }: { src: string; alt: string; className: string; lazy?: boolean }) {
  const online = useOnline();
  const tx = useDestinationText();
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && !img.naturalWidth) setFailed(true);
  }, []);

  useEffect(() => {
    if (online) setFailed(false);
  }, [online]);

  if (failed) {
    return (
      <div
        aria-label={alt}
        className={`${className} flex flex-col items-center justify-center gap-1 bg-surface-container-high text-on-surface-variant`}
        role="img"
      >
        <span aria-hidden="true" className="material-symbols-outlined">
          image_not_supported
        </span>
        <span className="font-body-sm text-body-sm">{online ? tx.photoUnavailable : tx.photoOffline}</span>
      </div>
    );
  }

  return <img alt={alt} className={className} loading={lazy ? "lazy" : undefined} onError={() => setFailed(true)} ref={imgRef} src={src} />;
}
