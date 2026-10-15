/** Chiffres et coordonnées affichés sur plusieurs écrans : à modifier ici uniquement. */

/** Part de chaque réservation reversée au Fonds Fihavanana (même taux que `impact` dans le moteur de devis). */
export const SOLIDARITY_RATE = "1\u00a0%";
/** Seul engagement solidaire du site, avec la même formulation partout. */
export const SOLIDARITY_USES = "reboisement, écoles et dispensaires des villages hôtes";
export const SOLIDARITY_TEXT = `${SOLIDARITY_RATE} de chaque réservation finance le fonds Fihavanana : ${SOLIDARITY_USES}.`;

export const SEASON_LABEL = "Réservations ouvertes jusqu'à fin 2027";

/**
 * Note, nombre d'avis et voyageurs accompagnés : tant que `REVIEWS_VERIFIED` vaut `false`, les écrans affichent
 * « en attente » à la place des chiffres. Ne passer à `true` qu'une fois la fiche publique en ligne avec ces valeurs.
 */
export const REVIEWS_VERIFIED = false;
export const RATING = "4,9";
export const REVIEWS_COUNT = "1\u00a0248";
export const TRAVELERS_COUNT = "3\u00a0200";
export const REVIEWS_SOURCE = { name: "Trustpilot", href: "https://fr.trustpilot.com/review/madavoyage.mg" };

/**
 * Chiffre d'impact mis en avant sur l'accueil, toujours affiché avec sa période et sa source.
 * `verified` ne passe à `true` qu'à la publication du rapport d'impact correspondant.
 */
export const FAMILIES_SUPPORTED = "1\u00a0840";
export const FAMILIES_IMPACT = { since: "20XX", source: "rapport d'impact", href: "/engagement", verified: false };

/** Signature affichée sous le logo, identique sur toutes les pages. */
export const TAGLINE = "Écotourisme";

/** Même promesse sur les guides partout : l'accueil, le catalogue et les filtres ne doivent pas affirmer des choses différentes. */
export const GUIDES = { claim: "Guides 100 % locaux", detail: "agréés dans chaque parc national" };

export const LICENSE_NUMBER = "2026-082";
export const LICENSE = `Agrément ONTM n°\u00a0${LICENSE_NUMBER}`;

/**
 * Badges d'agrément et de partenariat du pied de page. Le logo officiel (`logo`, chemin dans `public/`) ne s'affiche que
 * si `displayAllowed` est à `true`, c'est-à-dire une fois l'autorisation écrite reçue (arrêté d'agrément ONTM, convention
 * de partenariat Madagascar National Parks). Le numéro d'agrément, mention obligatoire, reste affiché dans tous les cas.
 */
export const ACCREDITATIONS: Record<"ontm" | "mnp", { name: string; short: string; displayAllowed: boolean; logo: string | null }> = {
  ontm: { name: "Office National du Tourisme de Madagascar", short: "ONTM", displayAllowed: false, logo: null },
  mnp: { name: "Madagascar National Parks", short: "MNP", displayAllowed: false, logo: null },
};

/** Coordonnées de démonstration : à remplacer par les vrais numéros avant la mise en ligne. */
export const PHONE = { display: "+261 20 22 641 18", href: "tel:+261202264118" };
export const WHATSAPP = { display: "+261 34 05 480 12", href: "https://wa.me/261340548012" };
export const PARTNERS_EMAIL = { display: "partenaires@madavoyage.mg", href: "mailto:partenaires@madavoyage.mg" };
/** Ligne d'urgence des voyageurs sur place, de l'arrivée au départ : le même mobile, joignable par appel ou WhatsApp, 24 h/24. */
export const EMERGENCY = { display: WHATSAPP.display, call: "tel:+261340548012", whatsapp: WHATSAPP.href };

/** Numéros publics malgaches, à revérifier à chaque mise à jour de la source. */
export const LOCAL_EMERGENCY = {
  numbers: [
    { label: "Police", number: "17" },
    { label: "Gendarmerie", number: "119" },
    { label: "Pompiers", number: "118", note: "depuis un mobile" },
  ],
  consulate: { display: "+261 32 12 11 010", href: "tel:+261321211010" },
  source: { label: "Ambassade de France à Madagascar", href: "https://mg.diplomatie.gouv.fr/en-cas-durgence" },
  checked: "13 octobre 2026",
};

/** Grille horaire unique, à l'heure de Madagascar (UTC+3, sans heure d'été) : toutes les pages en dérivent. */
export const SUPPORT_TIMEZONE = "Indian/Antananarivo";
export const SUPPORT_OPEN = { from: 8, to: 20 };
export const SUPPORT_HOURS = {
  short: "7 j/7, 8 h – 20 h",
  long: "Tous les jours, de 8 h à 20 h (heure de Madagascar, UTC+3)",
  urgent: "Urgence sur place : WhatsApp 24 h/24",
};

/** Canal par canal : ce qui est joignable, quand, et ce qui se passe en dehors des horaires. */
export const SUPPORT_CHANNELS = [
  {
    id: "phone",
    label: "Téléphone",
    hours: "Tous les jours, 8 h – 20 h",
    after: "Hors horaires : écrivez-nous sur WhatsApp ou par demande écrite.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    hours: "Tous les jours, 8 h – 20 h",
    after: "Hors horaires : réponse le lendemain à partir de 8 h. Sur place, les urgences sont prises 24 h/24.",
  },
  {
    id: "ticket",
    label: "Demande écrite",
    hours: "Dépôt à toute heure",
    after: "Traitée par ordre d'arrivée, pendant les horaires d'ouverture.",
  },
  { id: "urgent", label: "Urgence sur place", hours: "24 h/24, 7 j/7", after: "De votre arrivée à Madagascar jusqu'à votre départ." },
] as const;
export const EMAIL = { display: "contact@madavoyage.mg", href: "mailto:contact@madavoyage.mg" };

/** Même adresse que dans les mentions légales. */
export const HEAD_OFFICE = "Immeuble Aro, rue Pasteur, Antanimena, Antananarivo 101";
export const AGENCIES = ["Nosy Be", "Diego-Suarez", "Tuléar"];

/** Conditions de vente reprises par la FAQ, les CGV, le tunnel et l'espace de modification. */
export const CANCELLATION = {
  freeDays: 7,
  short: "Annulation gratuite jusqu'à J-7",
  free: "Annulation gratuite jusqu'à 7 jours avant le départ : remboursement intégral, sans justificatif ni frais de dossier.",
  late: "À moins de 7 jours, l'acompte de 30 % est conservé, ou transformé en avoir valable 18 mois.",
};
/** Règle tarifaire des bébés, conforme au calcul des devis (ils ne sont comptés dans aucun poste). */
export const INFANT_POLICY = {
  short: "Gratuit, un bébé par adulte",
  text: "Les bébés de moins de 2 ans voyagent gratuitement : aucun supplément pour l'hébergement, les vols intérieurs, les transferts et les excursions. En vol, chaque bébé voyage sur les genoux d'un adulte, d'où la limite d'un bébé par adulte. Un lit parapluie est fourni gratuitement sur demande, selon le lodge ; les petits pots et le lait ne sont pas compris.",
};

export const DEPOSIT_RATE = "30\u00a0%";
export const BALANCE_DUE_DAYS = 15;
export const PAYMENT_FEES =
  "Aucun frais de paiement : par carte, Mobile Money ou virement, vous réglez le prix affiché. Les commissions des opérateurs sont à notre charge.";

/** Promesse de service : réservation en libre-service, l'équipe humaine intervient en assistance. */
export const SERVICE_PROMISE = "Prix ferme à chaque étape, billets et carnet de voyage envoyés dès la confirmation.";

/** Mêmes noms que le fil d'étapes du tunnel de réservation. */
export const BOOKING_STEPS = [
  { label: "Séjour", href: "/reservation/dates" },
  { label: "Destination", href: "/reservation/destination" },
  { label: "Budget", href: "/reservation/budget" },
  { label: "Offre", href: "/reservation/composition" },
  { label: "Paiement", href: "/reservation/recapitulatif" },
] as const;

/** Comptes de démonstration : à remplacer par les vraies pages avant la mise en ligne. */
export const SOCIALS = {
  facebook: "https://www.facebook.com/madavoyage",
  instagram: "https://www.instagram.com/madavoyage",
  youtube: "https://www.youtube.com/@madavoyage",
};
