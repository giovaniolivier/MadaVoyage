"use client";

import { useId, useState } from "react";

function nextFirstOfMonth() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `1er ${next.toLocaleDateString("fr-FR", { month: "long" })}`;
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const id = useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.");
      return;
    }
    setError("");
    setDone(true);
  };

  return (
    <div className="border-y border-outline-variant/50 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">mail</span>
        <div>
          <h2 className="font-label-lg text-label-lg text-on-surface font-bold">La lettre de la Grande Île</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Une fois par mois : les régions à visiter selon la météo et la faune, et les départs qui ont encore des places.
          </p>
        </div>
      </div>

      {done ? (
        <div aria-live="polite" className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-[28px]">mark_email_read</span>
          <div>
            <div className="font-label-lg text-label-lg text-on-surface font-bold">C'est noté !</div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Première lettre le {nextFirstOfMonth()} à l'adresse {email.trim()}.
            </p>
          </div>
        </div>
      ) : (
        <form className="flex flex-col gap-2" noValidate onSubmit={submit}>
          <label className="sr-only" htmlFor={id}>
            Votre adresse e-mail
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              aria-describedby={error ? `${id}-error` : `${id}-hint`}
              aria-invalid={!!error}
              autoComplete="email"
              className={`flex-1 h-12 px-4 rounded-full bg-surface-container-lowest border font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary ${
                error ? "border-error" : "border-outline-variant"
              }`}
              id={id}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@exemple.fr"
              type="email"
              value={email}
            />
            <button
              className="h-12 px-6 rounded-full border border-outline text-primary font-label-lg text-label-lg hover:bg-surface-container transition-colors"
              type="submit"
            >
              S&apos;inscrire
            </button>
          </div>
          {error ? (
            <p className="font-body-md text-body-md text-error" id={`${id}-error`} role="alert">
              {error}
            </p>
          ) : (
            <p className="font-body-md text-body-md text-on-surface-variant" id={`${id}-hint`}>
              Un e-mail le 1er du mois, sans publicité de tiers, désinscription en un clic.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
