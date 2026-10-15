"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const CARD =
  "bg-surface-container-lowest rounded-lg p-space-xl shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06),0_1px_3px_0_rgba(31,41,51,0.04)]";

const DRAFT_KEY = "mv_review_draft_MDV-2025-4102";
const TITLE_MAX = 80;
const COMMENT_MIN_CHARS = 30;
const RECOMMENDED_WORDS = 150;
const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png"];

const RATING_LABELS: Record<number, { long: string; short: string }> = {
  1: { long: "Expérience insuffisante", short: "Insuffisant" },
  2: { long: "Mitigée avec points d'amélioration", short: "Mitigé" },
  3: { long: "Conforme aux attentes", short: "Correct" },
  4: { long: "Très belle aventure responsable", short: "Très bien" },
  5: { long: "Expérience exceptionnelle et respectueuse", short: "Excellent" },
};

const CRITERIA = [
  {
    id: "lodging",
    icon: "cabin",
    iconClass: "bg-primary/10 text-primary",
    title: "Hébergements & Éco-Lodges",
    description: "Confort thermique, autonomie solaire, gestion de l'eau (Camp Catta, Isalo Rock Lodge)",
    top: "Exemplaire",
  },
  {
    id: "guide",
    icon: "badge",
    iconClass: "bg-secondary/10 text-secondary",
    title: "Guide Naturaliste & Équipier Local",
    description: "Faly Ramanoelina (Accréditation MNP #MG-RN7-440), pédagogie & éthique",
    top: "Passionné",
  },
  {
    id: "wildlife",
    icon: "pets",
    iconClass: "bg-tertiary-container/15 text-tertiary-container",
    title: "Respect de la Biodiversité & Éthique Animale",
    description: "Distances d'approche respectées, silence nocturne à Ranomafana, zéro nourrissage",
    top: "Irréprochable",
  },
  {
    id: "food",
    icon: "restaurant",
    iconClass: "bg-primary/10 text-primary",
    title: "Restauration & Produits Locaux du Terroir",
    description: "Circuits courts, fruits de saison, approvisionnement auprès des coopératives rurales",
    top: "Authentique",
  },
  {
    id: "transport",
    icon: "directions_car",
    iconClass: "bg-on-surface-variant/10 text-on-surface-variant",
    title: "Logistique & Véhicule 4x4 Éco-conduit",
    description: "Entretien rigoureux, conduite souple, limitation des émissions sur pistes sablonneuses",
    top: "Sécurisé & Propre",
  },
] as const;

type CriterionId = (typeof CRITERIA)[number]["id"];

const CRITERION_QUALIFIERS: Record<number, string> = { 1: "Insuffisant", 2: "Perfectible", 3: "Correct", 4: "Très bien" };

const HIGHLIGHTS = [
  "Guide naturaliste passionné",
  "Lémuriens makis en liberté",
  "Paysages grandioses de l'Isalo",
  "Immersion villageoise Bara",
  "Pirogue traditionnelle Vezo",
  "Ciel étoilé sans pollution lumineuse",
  "Cuisine bio du terroir",
];

type Photo = { id: string; src: string; name: string; alt: string; local: boolean };

const INITIAL_PHOTOS: Photo[] = [
  {
    id: "baobabs",
    name: "Baobabs_Sud.jpg",
    alt: "Silhouettes de grands baobabs sur un ciel de coucher de soleil ambré et violet, sud-ouest de Madagascar",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiswKRj4zWX97kiUFyTAhGeiopKF-W29pfSxsbZ7lbK7fTUEkxZQLP7MbO_74LbsKaHXVLgvgUeAdZYLplV6PIwcAFIJlI85WpBs--NdnTTRqEpLE1M3AXxt_aNMxyjZFUIQlIcXJz4lomPOqvY7oRHvbLmsbLLX9uVGqV1BTQcb3wTdLYOn_JeGPWqdq9dcu0s2aJmN0ivfqL7XU3u0Q6QAwWza-2xi4g_8Ju8cuQF7ns41YVNUg",
    local: false,
  },
  {
    id: "maki",
    name: "Maki_Anja.jpg",
    alt: "Maki catta assis sur un rocher de granit ensoleillé dans la réserve d'Anja",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpA3_tvt4mp_Sq9I_AUfjVswLJLYpWQKZnnE04O7EjAoziMjvIF1VDHNiE1A4KiCwigA_Kf-hVBqfO95W46K-gh3CBprRiLO1YSx3uhSD5G66ULOx2IhwQXXvELo3D2KZS-XhDxeDc0yoUdrZHgoQW74_DfLt2tp4PdIl1oe1nPCr8-teyfWui_7lgY1s7esG7fW9HC0MSAbbSikr07xK2uiIm6KJadEr5N-E2m2xjM0l9fZxBNvo",
    local: false,
  },
  {
    id: "canyon",
    name: "Canyon_Isalo.jpg",
    alt: "Canyon de grès du parc national de l'Isalo avec une piscine naturelle émeraude et des palmiers",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpoooK--JxTGAFmPb6D6xIISTfgK-21TWCCKOTaL39t562UYtQ3HTvI-ax7WQ4Tc0jgN73lUtg07pUZk4RDkLHKRFHo3czmO70bnaJm5vDQn7AFkmu4Vs8AGA29Dq2e8Vy_KZikn9Xa-bzmxdhjwG74VRVrVeylH_BhDzXAORYi2ANOF3BJMjUPKHpAq66q_m3lHDNRCdLNgGSCwOTEMEAne6XUuD9vK31OlUnowAGEiceoBapSic",
    local: false,
  },
];

const INITIAL_COMMENT =
  "Dix jours suspendus hors du temps. Notre guide Faly a su allier une érudition botanique impressionnante à un respect scrupuleux des communautés traversées. L'approche des Makis Catta dans la réserve d'Anja à l'aube reste gravée à jamais : nous étions les seuls dans le vallon granitique, sans jamais déranger la troupe. Les hébergements choisis par MadaVoyage soutiennent une énergie 100% solaire et un approvisionnement direct avec les cultivateurs locaux de Ranohira. Une véritable immersion éco-régénératrice.";

type Draft = {
  rating: number;
  criteria: Record<CriterionId, number>;
  title: string;
  comment: string;
  highlights: string[];
  publishConsent: boolean;
  donatePoints: boolean;
};

const INITIAL_DRAFT: Draft = {
  rating: 5,
  criteria: { lodging: 5, guide: 5, wildlife: 5, food: 5, transport: 5 },
  title: "Un voyage initiatique inoubliable au cœur des sanctuaires malgaches",
  comment: INITIAL_COMMENT,
  highlights: HIGHLIGHTS.slice(0, 4),
  publishConsent: true,
  donatePoints: true,
};

type Errors = Partial<Record<"title" | "comment" | "publishConsent", string>>;

const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      ...INITIAL_DRAFT,
      ...parsed,
      criteria: { ...INITIAL_DRAFT.criteria, ...(parsed.criteria ?? {}) },
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights.filter((h) => HIGHLIGHTS.includes(h)) : INITIAL_DRAFT.highlights,
    };
  } catch {
    return null;
  }
}

export default function ReviewForm() {
  const [form, setForm] = useState<Draft>(INITIAL_DRAFT);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [draftNotice, setDraftNotice] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "publishing" | "published">("idle");
  const photosRef = useRef(photos);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const ids = useId();

  photosRef.current = photos;

  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setForm(draft);
      setDraftNotice("Brouillon restauré depuis votre dernière visite.");
    }
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      photosRef.current.forEach((p) => p.local && URL.revokeObjectURL(p.src));
    };
  }, []);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleHighlight = (tag: string) =>
    update("highlights", form.highlights.includes(tag) ? form.highlights.filter((h) => h !== tag) : [...form.highlights, tag]);

  const addPhotos = (files: FileList | null | undefined) => {
    if (!files?.length) return;
    const room = MAX_PHOTOS - photos.length;
    const accepted: Photo[] = [];
    let error: string | null = null;
    for (const file of Array.from(files)) {
      if (accepted.length >= room) {
        error = `Maximum ${MAX_PHOTOS} photos : certaines n'ont pas été ajoutées.`;
        break;
      }
      if (!PHOTO_TYPES.includes(file.type)) {
        error = `« ${file.name} » ignoré : formats acceptés JPG et PNG.`;
        continue;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        error = `« ${file.name} » ignoré : 10 Mo maximum.`;
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        src: URL.createObjectURL(file),
        name: file.name,
        alt: `Photo de voyage : ${file.name}`,
        local: true,
      });
    }
    setPhotos((prev) => [...prev, ...accepted]);
    setPhotoError(error);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (photo: Photo) => {
    if (photo.local) URL.revokeObjectURL(photo.src);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setPhotoError(null);
  };

  const saveDraft = () => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      setDraftNotice(`Brouillon enregistré à ${time} (les photos ne sont pas conservées).`);
    } catch {
      setDraftNotice("Impossible d'enregistrer le brouillon sur cet appareil.");
    }
  };

  const publish = () => {
    const next: Errors = {};
    if (form.title.trim().length < 5) next.title = "Donnez un titre à votre avis (5 caractères minimum).";
    if (form.comment.trim().length < COMMENT_MIN_CHARS) next.comment = `Votre commentaire doit faire au moins ${COMMENT_MIN_CHARS} caractères.`;
    if (!form.publishConsent) next.publishConsent = "La certification d'authenticité est nécessaire pour publier un avis vérifié.";
    setErrors(next);
    if (next.title) return titleRef.current?.focus();
    if (next.comment) return commentRef.current?.focus();
    if (next.publishConsent) return consentRef.current?.focus();

    setStatus("publishing");
    timerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Stockage indisponible : rien à nettoyer.
      }
      setStatus("published");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  const displayedRating = hoverRating ?? form.rating;
  const words = countWords(form.comment);
  const averageCriteria = Object.values(form.criteria).reduce((a, b) => a + b, 0) / CRITERIA.length;

  if (status === "published") {
    return (
      <div className="lg:col-span-8 flex flex-col gap-space-xl">
        <section className={`${CARD} flex flex-col gap-space-md`} role="status">
          <div className="flex items-center gap-space-sm">
            <div className="w-14 h-14 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[32px]">done_all</span>
            </div>
            <div className="flex flex-col">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Avis certifié envoyé !</h2>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Note {form.rating}/5 · {photos.length} photo{photos.length > 1 ? "s" : ""} · {form.highlights.length} coup{form.highlights.length > 1 ? "s" : ""} de cœur
              </span>
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Merci pour « {form.title.trim()} ». Votre avis sera publié sur la page du circuit RN7 sous 24 à 48 heures, après vérification.
            {form.donatePoints
              ? " Vos 250 points Fihavanana financeront un panier scolaire à l'école primaire de Ranohira."
              : " Vos 250 points Fihavanana ont été crédités sur votre compte."}
            {averageCriteria >= 4.5 && " Votre évaluation déclenche la prime d'excellence de votre guide Faly Ramanoelina."}
          </p>
          <div className="flex flex-col sm:flex-row gap-space-sm">
            <Link
              className="px-space-lg h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              href="/circuits/rn7"
            >
              <span className="material-symbols-outlined text-[20px]">route</span>
              Voir le circuit RN7
            </Link>
            <Link
              className="px-space-lg h-12 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all"
              href="/compte"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
              Retour à mon compte
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <form
      className="lg:col-span-8 flex flex-col gap-space-xl"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        publish();
      }}
    >
      <section className={`${CARD} flex flex-col gap-space-md`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Étape 1 sur 4</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1" id={`${ids}-rating-title`}>
              Évaluation Globale
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-md text-label-md font-bold">
            {form.rating} / 5 {RATING_LABELS[form.rating].short}
          </span>
        </div>

        <div className="p-space-lg bg-surface-container-low rounded flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div
            aria-labelledby={`${ids}-rating-title`}
            className="flex items-center gap-space-sm"
            onMouseLeave={() => setHoverRating(null)}
            role="radiogroup"
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const filled = value <= displayedRating;
              return (
                <button
                  key={value}
                  aria-checked={form.rating === value}
                  aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                  className={`hover:scale-110 active:scale-95 transition-transform ${filled ? "text-tertiary-container" : "text-outline-variant"}`}
                  onClick={() => update("rating", value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                      e.preventDefault();
                      update("rating", Math.min(5, form.rating + 1));
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                      e.preventDefault();
                      update("rating", Math.max(1, form.rating - 1));
                    }
                  }}
                  onMouseEnter={() => setHoverRating(value)}
                  role="radio"
                  tabIndex={form.rating === value ? 0 : -1}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[44px]" style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}>
                    star
                  </span>
                </button>
              );
            })}
          </div>
          <div className="text-center sm:text-right" aria-live="polite">
            <p className="font-headline-sm text-headline-sm text-on-surface font-extrabold">{RATING_LABELS[displayedRating].long}</p>
            <p className="font-body-sm text-body-sm text-secondary font-medium mt-0.5">
              {form.rating >= 4 ? "100% en accord avec les valeurs éco-responsables MNP" : "Votre retour sera transmis à l'équipe qualité et à votre guide"}
            </p>
          </div>
        </div>
      </section>

      <section className={`${CARD} flex flex-col gap-space-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Étape 2 sur 4</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">Critères d&apos;Impact & Prestations</h2>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-secondary">eco</span> Charte Bas Carbone
          </span>
        </div>
        <div className="space-y-space-lg">
          {CRITERIA.map((c) => {
            const value = form.criteria[c.id];
            const qualifier = value === 5 ? c.top : CRITERION_QUALIFIERS[value];
            return (
              <div key={c.id} className="p-space-md rounded bg-surface-container-low/50 hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${c.iconClass}`}>
                      <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight" id={`${ids}-${c.id}`}>
                        {c.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{c.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-label-md text-label-md font-bold text-on-surface shrink-0 self-end sm:self-auto">
                    <span className="text-primary">{value}</span>
                    <span className="text-outline-variant font-normal">/ 5</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-md">
                  <input
                    aria-labelledby={`${ids}-${c.id}`}
                    aria-valuetext={`${value} sur 5 — ${qualifier}`}
                    className="w-full accent-primary h-2 bg-surface-container-high rounded-full cursor-pointer"
                    max={5}
                    min={1}
                    onChange={(e) => update("criteria", { ...form.criteria, [c.id]: Number(e.target.value) })}
                    step={1}
                    type="range"
                    value={value}
                  />
                  <span
                    className={`font-label-sm text-label-sm font-bold whitespace-nowrap px-2.5 py-0.5 rounded-full ${
                      value >= 4 ? "text-secondary bg-secondary/10" : value === 3 ? "text-on-surface-variant bg-surface-container-high" : "text-tertiary bg-tertiary/10"
                    }`}
                  >
                    {qualifier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={`${CARD} flex flex-col gap-space-lg`}>
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Étape 3 sur 4</span>
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">Témoignage & Récit de Voyage</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Aidez les futurs explorateurs à préparer leur itinéraire en partageant vos moments forts.</p>
        </div>

        <div className="space-y-space-xs">
          <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor={`${ids}-title`}>
            <span>Titre de votre retour d&apos;expérience</span>
            <span className={`font-normal font-body-sm ${form.title.length >= TITLE_MAX ? "text-tertiary" : "text-outline"}`}>
              {form.title.length} / {TITLE_MAX} caractères
            </span>
          </label>
          <input
            ref={titleRef}
            aria-describedby={errors.title ? `${ids}-title-error` : undefined}
            aria-invalid={!!errors.title}
            className="w-full h-[52px] px-space-md rounded bg-surface-container-low font-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all"
            id={`${ids}-title`}
            maxLength={TITLE_MAX}
            onChange={(e) => update("title", e.target.value)}
            type="text"
            value={form.title}
          />
          {errors.title && <FieldError id={`${ids}-title-error`}>{errors.title}</FieldError>}
        </div>

        <div className="space-y-space-xs">
          <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor={`${ids}-comment`}>
            <span>Votre commentaire détaillé</span>
            <span className={`font-label-sm font-semibold ${words >= RECOMMENDED_WORDS ? "text-secondary" : "text-outline"}`}>
              {words} mot{words > 1 ? "s" : ""} · conseillé : min. {RECOMMENDED_WORDS}
            </span>
          </label>
          <textarea
            ref={commentRef}
            aria-describedby={errors.comment ? `${ids}-comment-error` : undefined}
            aria-invalid={!!errors.comment}
            className="w-full p-space-md rounded bg-surface-container-low font-body-md text-on-surface leading-relaxed focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all resize-none"
            id={`${ids}-comment`}
            maxLength={5000}
            onChange={(e) => update("comment", e.target.value)}
            placeholder="Racontez votre réveil au chant de l'Indri à Andasibe, la traversée des hauts plateaux en éco-bivouac, le professionnalisme de votre guide ou la délicatesse des plats préparés dans les éco-lodges..."
            rows={6}
            value={form.comment}
          />
          {errors.comment && <FieldError id={`${ids}-comment-error`}>{errors.comment}</FieldError>}
        </div>

        <fieldset className="space-y-space-sm">
          <legend className="font-label-md text-label-md text-on-surface font-semibold block mb-space-sm">
            Points forts de votre itinéraire (sélectionnez vos coups de cœur)
          </legend>
          <div className="flex flex-wrap gap-space-xs">
            {HIGHLIGHTS.map((tag) => {
              const selected = form.highlights.includes(tag);
              return (
                <button
                  key={tag}
                  aria-pressed={selected}
                  className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                    selected ? "bg-primary text-on-primary shadow-sm font-semibold" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                  onClick={() => toggleHighlight(tag)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">{selected ? "check" : "add"}</span>
                  {tag}
                </button>
              );
            })}
          </div>
        </fieldset>
      </section>

      <section className={`${CARD} flex flex-col gap-space-lg`}>
        <div className="flex items-center justify-between gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Étape 4 sur 4</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
              Vos Photos Souvenirs ({photos.length} / {MAX_PHOTOS})
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Partagez vos clichés authentiques. Ils seront validés avant publication.</p>
          </div>
          <span className="font-label-sm text-label-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full font-bold flex items-center gap-1 shrink-0">
            <span className="material-symbols-outlined text-[16px]">photo_library</span> JPG, PNG · Max 10 Mo
          </span>
        </div>

        <input
          ref={fileInputRef}
          accept="image/jpeg,image/png"
          aria-label="Ajouter des photos"
          className="sr-only"
          id={`${ids}-photos`}
          multiple
          onChange={(e) => addPhotos(e.target.files)}
          type="file"
        />

        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
          {photos.map((photo) => (
            <li key={photo.id} className="relative group rounded overflow-hidden aspect-square bg-surface-container shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={photo.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src={photo.src} />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-transparent to-transparent flex flex-col justify-between p-2">
                <button
                  aria-label={`Supprimer ${photo.name}`}
                  className="self-end w-7 h-7 rounded-full bg-surface-container-lowest/90 text-on-surface hover:text-error flex items-center justify-center transition-colors shadow-sm"
                  onClick={() => removePhoto(photo)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
                <span className="font-label-sm text-label-sm text-on-primary font-bold truncate">{photo.name}</span>
              </div>
            </li>
          ))}
          {photos.length < MAX_PHOTOS && (
            <li>
              <label
                className={`aspect-square rounded transition-all flex flex-col items-center justify-center p-space-sm text-center cursor-pointer group ${
                  dragging ? "bg-primary-container/20 ring-2 ring-primary" : "bg-surface-container-low hover:bg-surface-container-high"
                }`}
                htmlFor={`${ids}-photos`}
                onDragLeave={() => setDragging(false)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addPhotos(e.dataTransfer.files);
                }}
              >
                <span className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary group-hover:scale-110 flex items-center justify-center transition-transform shadow-sm mb-space-xs">
                  <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                </span>
                <span className="font-label-md text-label-md text-on-surface font-bold group-hover:text-primary transition-colors">Ajouter photo</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Glisser ou cliquer</span>
              </label>
            </li>
          )}
        </ul>
        {photoError && <FieldError>{photoError}</FieldError>}
      </section>

      <section className={`${CARD} space-y-space-md`}>
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary">handshake</span>
          Engagements Éthiques & Pacte Fihavanana
        </h3>

        <label className="flex items-start gap-space-md p-space-md rounded bg-surface-container-low hover:bg-surface-container-high cursor-pointer transition-colors">
          <input
            ref={consentRef}
            aria-describedby={errors.publishConsent ? `${ids}-consent-error` : undefined}
            aria-invalid={!!errors.publishConsent}
            checked={form.publishConsent}
            className="mt-1 w-5 h-5 rounded text-primary accent-primary cursor-pointer shrink-0"
            onChange={(e) => update("publishConsent", e.target.checked)}
            type="checkbox"
          />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Certification d&apos;authenticité et publication vérifiée</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              J&apos;autorise MadaVoyage à afficher mon avis sur la page officielle du circuit RN7 et certifie l&apos;authenticité de mon retour conformément aux standards de vérification de l&apos;Office National du Tourisme de Madagascar (ONTM).
            </span>
          </div>
        </label>
        {errors.publishConsent && <FieldError id={`${ids}-consent-error`}>{errors.publishConsent}</FieldError>}

        <label className="flex items-start gap-space-md p-space-md rounded bg-secondary/10 hover:bg-secondary/15 cursor-pointer transition-colors">
          <input
            checked={form.donatePoints}
            className="mt-1 w-5 h-5 rounded text-secondary accent-secondary cursor-pointer shrink-0"
            onChange={(e) => update("donatePoints", e.target.checked)}
            type="checkbox"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Convertir mes points Fihavanana en don solidaire</span>
              <span className="font-label-sm text-label-sm bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold">+250 pts</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Faire don des 250 points générés par cet avis pour financer un panier scolaire complet (cahiers, crayons, lampes solaires) à l&apos;école primaire publique de Ranohira.
            </span>
          </div>
        </label>
      </section>

      <div className="flex flex-col gap-space-sm pt-space-sm pb-space-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <button
            className="w-full sm:w-auto px-space-xl h-[52px] rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg font-bold transition-all flex items-center justify-center gap-2"
            onClick={saveDraft}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Enregistrer en brouillon</span>
          </button>
          <button
            className="w-full sm:w-auto px-space-xl h-[52px] rounded-full bg-primary hover:bg-surface-tint active:scale-95 text-on-primary font-label-lg text-label-lg font-bold shadow-[0_4px_14px_rgba(0,105,114,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            disabled={status === "publishing"}
            type="submit"
          >
            <span className={`material-symbols-outlined text-[20px] ${status === "publishing" ? "animate-spin" : ""}`}>
              {status === "publishing" ? "sync" : "cloud_upload"}
            </span>
            <span>{status === "publishing" ? "Publication en cours…" : "Publier mon avis vérifié"}</span>
          </button>
        </div>
        {draftNotice && (
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1" role="status">
            <span className="material-symbols-outlined text-[16px] text-secondary">cloud_done</span>
            {draftNotice}
          </p>
        )}
      </div>
    </form>
  );
}

function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p className="font-body-sm text-body-sm text-error flex items-center gap-1" id={id} role="alert">
      <span className="material-symbols-outlined text-[16px]">error</span>
      {children}
    </p>
  );
}
