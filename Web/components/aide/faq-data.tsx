import type { ReactNode } from "react";
import { BALANCE_DUE_DAYS, CANCELLATION, DEPOSIT_RATE, EMERGENCY, PAYMENT_FEES, SOLIDARITY_TEXT } from "@/lib/site";
import { ON_SITE_MONEY } from "@/lib/on-site-money";
import { CHILD_RATE, CIRCUITS } from "@/components/circuits/catalog-data";

export type FaqCategory = "formalites" | "paiement" | "terrain" | "ecotourisme";

export const FAQ_CATEGORIES: { id: FaqCategory | "all"; label: string; icon: string }[] = [
  { id: "all", label: "Tout", icon: "grid_view" },
  { id: "formalites", label: "Formalités et santé", icon: "medical_services" },
  { id: "paiement", label: "Paiement", icon: "account_balance_wallet" },
  { id: "terrain", label: "Sur place", icon: "explore" },
  { id: "ecotourisme", label: "Éco-engagement", icon: "eco" },
];

export const categoryLabel = (id: FaqCategory) => FAQ_CATEGORIES.find((c) => c.id === id)!.label;

export type FaqSource = { label: string; href: string };

export type FaqItem = {
  id: string;
  category: FaqCategory;
  icon: string;
  question: string;
  keywords: string;
  answer: ReactNode;
  /** Date (AAAA-MM-JJ) de la dernière vérification par l'équipe, affichée avec la réponse : à mettre à jour à chaque relecture. */
  reviewed?: string;
  sources?: FaqSource[];
  /** Ajoute le renvoi vers un médecin ou un centre de médecine des voyages. */
  medical?: boolean;
};

export const SOURCES = {
  diplomatieEntree: {
    label: "France Diplomatie, Madagascar : entrée et séjour",
    href: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/madagascar/#entree",
  },
  diplomatieSante: {
    label: "France Diplomatie, Madagascar : santé",
    href: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/madagascar/#sante",
  },
  diplomatieSecurite: {
    label: "France Diplomatie, Madagascar : sécurité",
    href: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/madagascar/#securite",
  },
  evisa: { label: "Site officiel du visa électronique malgache", href: "https://www.evisamada.gov.mg/" },
  pasteur: { label: "Institut Pasteur, centre médical (conseils aux voyageurs)", href: "https://www.pasteur.fr/fr/centre-medical" },
} satisfies Record<string, FaqSource>;

const box = "bg-surface-container-low p-space-md rounded";
const youngestAge = Math.min(...CIRCUITS.map((c) => c.minAge));

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "visa",
    category: "formalites",
    icon: "badge",
    question: "Comment obtenir le visa touristique pour Madagascar ?",
    keywords: "visa arrivee ivato evisa passeport prix aeroport formalites entree",
    reviewed: "2026-10-01",
    sources: [SOURCES.evisa, SOURCES.diplomatieEntree],
    answer: (
      <>
        <p>
          Pour un séjour touristique de 60 jours au plus, le visa se demande en ligne avant le départ, ou s&apos;obtient à l&apos;arrivée à
          l&apos;aéroport d&apos;Antananarivo (Ivato) ou de Nosy Be (Fascene). Les règles et les tarifs changent : vérifiez-les sur le site
          officiel avant de partir.
        </p>
        <div className={`${box} flex flex-col gap-2`}>
          {[
            ["Jusqu'à 15 jours", "10 € de frais"],
            ["De 16 à 30 jours", "35 €"],
            ["De 31 à 60 jours", "40 €"],
          ].map(([duration, price]) => (
            <div key={duration} className="flex items-center justify-between gap-space-sm">
              <span className="font-label-md text-label-md text-on-surface font-bold">{duration}</span>
              <span className="font-label-md text-label-md text-on-surface font-bold text-right">{price}</span>
            </div>
          ))}
        </div>
        <p>
          Il faut un passeport valable au moins 6 mois après la date de retour, avec des pages vierges, et un billet de retour. Le visa
          n&apos;est pas compris dans nos prix.
        </p>
      </>
    ),
  },
  {
    id: "assurance",
    category: "formalites",
    icon: "health_and_safety",
    question: "Faut-il une assurance voyage ?",
    keywords: "assurance rapatriement assistance evacuation medicale carte bancaire attestation",
    reviewed: "2026-10-01",
    sources: [SOURCES.diplomatieSante],
    answer: (
      <>
        <p>
          Nous la conseillons vivement : une assurance <strong>assistance et rapatriement</strong> n&apos;est pas comprise dans nos prix.
          Les structures de soins les mieux équipées sont à Antananarivo ; depuis un parc isolé, une évacuation peut être nécessaire et
          coûte cher.
        </p>
        <ul className="list-disc pl-space-lg space-y-1">
          <li>
            Vérifiez les plafonds de frais médicaux et d&apos;évacuation, surtout si vous comptez sur l&apos;assurance de votre carte.
          </li>
          <li>
            Envoyez-nous le nom de l&apos;assureur, le numéro de contrat et le numéro d&apos;assistance : nous les ajoutons à votre carnet
            de voyage, consultable hors ligne.
          </li>
          <li>L&apos;assurance annulation est facultative ; nos conditions d&apos;annulation sont détaillées dans la rubrique Paiement.</li>
        </ul>
      </>
    ),
  },
  {
    id: "paludisme",
    category: "formalites",
    icon: "pest_control",
    question: "Faut-il un traitement contre le paludisme ?",
    keywords: "paludisme moustique antipaludique traitement preventif repulsif moustiquaire sante",
    reviewed: "2026-10-01",
    sources: [SOURCES.diplomatieSante, SOURCES.pasteur],
    medical: true,
    answer: (
      <>
        <p>
          Le paludisme est présent dans la plupart des régions, surtout sur les côtes ; le risque est plus faible sur les Hautes Terres. Le
          traitement préventif dépend de votre itinéraire, de la saison et de votre santé : seul un médecin peut le prescrire.
        </p>
        <ul className="list-disc pl-space-lg space-y-1">
          <li>Protégez-vous des piqûres du soir au matin : répulsif adapté aux zones tropicales, vêtements longs, moustiquaire.</li>
          <li>En cas de fièvre pendant le voyage ou dans les mois qui suivent, consultez rapidement en signalant votre séjour.</li>
        </ul>
      </>
    ),
  },
  {
    id: "vaccins",
    category: "formalites",
    icon: "vaccines",
    question: "Quels vaccins faut-il pour Madagascar ?",
    keywords: "vaccin vaccins fievre jaune hepatite typhoide rage dtp sante",
    reviewed: "2026-10-01",
    sources: [SOURCES.diplomatieSante, SOURCES.pasteur],
    medical: true,
    answer: (
      <>
        <p>
          Aucun vaccin n&apos;est exigé si vous arrivez d&apos;Europe. Le vaccin contre la fièvre jaune n&apos;est demandé qu&apos;aux
          voyageurs venant d&apos;un pays où la maladie circule, ou y ayant transité.
        </p>
        <p>
          Sont généralement conseillés : la mise à jour du diphtérie-tétanos-polio, les hépatites A et B, la typhoïde, et parfois la rage
          selon le type de séjour. Votre médecin adapte la liste à votre situation.
        </p>
      </>
    ),
  },
  {
    id: "eau",
    category: "formalites",
    icon: "water_drop",
    question: "Peut-on boire l'eau et manger de tout ?",
    keywords: "eau potable robinet gourde filtre alimentation crudites diarrhee sante",
    reviewed: "2026-10-01",
    sources: [SOURCES.diplomatieSante],
    medical: true,
    answer: (
      <>
        <p>
          Ne buvez pas l&apos;eau du robinet. Nos véhicules ont des bonbonnes d&apos;eau filtrée pour remplir vos gourdes, ce qui évite les
          bouteilles en plastique.
        </p>
        <p>
          Privilégiez les plats cuits et servis chauds, et les fruits que vous pelez vous-même. Emportez de quoi traiter une diarrhée
          simple, sur conseil de votre médecin ou pharmacien.
        </p>
      </>
    ),
  },
  {
    id: "soins",
    category: "formalites",
    icon: "local_hospital",
    question: "Où se soigner sur place ?",
    keywords: "medecin hopital clinique soins pharmacie urgence medicale evacuation sante",
    reviewed: "2026-10-01",
    sources: [SOURCES.diplomatieSante],
    medical: true,
    answer: (
      <>
        <p>
          Les cliniques et les pharmacies les mieux équipées se trouvent à Antananarivo et dans les grandes villes ; elles sont rares en
          brousse. Emportez une trousse de premiers soins et vos traitements habituels en quantité suffisante.
        </p>
        <p>
          En cas de problème, appelez notre ligne d&apos;urgence, joignable 24 h/24 au{" "}
          <a className="font-semibold text-primary underline underline-offset-2 whitespace-nowrap" href={EMERGENCY.call}>
            {EMERGENCY.display}
          </a>
          , puis l&apos;assistance de votre assurance : nous vous orientons vers la structure la plus proche.
        </p>
      </>
    ),
  },
  {
    id: "ariary",
    category: "paiement",
    icon: "payments",
    question: "Faut-il prévoir du liquide en Ariary pour les marchés et les pourboires ?",
    keywords: "monnaie liquide ariary change distributeur dab mastercard pourboire",
    answer: (
      <>
        <p>
          Oui. L&apos;Ariary (MGA) est indispensable dès que vous quittez les villes et les grands lodges. Les distributeurs acceptent
          surtout les cartes Visa ; Mastercard est moins souvent acceptée hors des villes.
        </p>
        <div className={`${box} flex flex-col gap-2`}>
          <span className="font-label-sm text-label-sm text-on-surface font-bold">Repères de pourboires (charte MadaVoyage) :</span>
          <p className="font-body-sm text-body-sm">
            · <strong>Chauffeur-guide :</strong> 25 000 à 40 000 Ar par jour et par groupe
          </p>
          <p className="font-body-sm text-body-sm">
            · <strong>Guide local de parc :</strong> 15 000 à 25 000 Ar par visite
          </p>
          <p className="font-body-sm text-body-sm">
            · <strong>Piroguier :</strong> 10 000 à 15 000 Ar par journée d&apos;excursion
          </p>
        </div>
        <p>Changez une première somme de 150 à 200 € à l&apos;aéroport d&apos;Ivato, en coupures de 10 000 et 20 000 Ar.</p>
      </>
    ),
  },
  {
    id: "mobile-money",
    category: "paiement",
    icon: "contactless",
    question: "Peut-on utiliser le Mobile Money (MVola, Orange Money) ?",
    keywords: "mvola orange money airtel paiement mobile transfert carte bancaire monnaie",
    answer: (
      <>
        <p>Oui : MVola, Orange Money et Airtel Money sont acceptés pour la réservation, comme la carte et le virement. {PAYMENT_FEES}</p>
        <p>
          Pour retirer de l&apos;argent par Mobile Money sur place, {ON_SITE_MONEY.mobileMoneyRequirement.charAt(0).toLowerCase()}
          {ON_SITE_MONEY.mobileMoneyRequirement.slice(1)} {ON_SITE_MONEY.mobileMoneyFee} Pour un retrait par carte, les frais dépendent de
          votre banque. Nos chauffeurs peuvent vous accompagner en agence si vous souhaitez ouvrir un compte.
        </p>
      </>
    ),
  },
  {
    id: "annulation",
    category: "paiement",
    icon: "event_busy",
    question: "Et si je dois annuler ou modifier mon voyage ?",
    keywords: "annulation annuler modifier report remboursement acompte avoir frais dossier",
    answer: (
      <>
        <p>{CANCELLATION.free}</p>
        <p>{CANCELLATION.late}</p>
        <p>
          L&apos;acompte de {DEPOSIT_RATE} est réglé à la réservation, le solde {BALANCE_DUE_DAYS} jours avant le départ. Le montant exact
          de votre remboursement est calculé dans l&apos;espace « Modifier ou annuler ».
        </p>
      </>
    ),
  },
  {
    id: "vols-interieurs",
    category: "terrain",
    icon: "flight",
    question: "Que se passe-t-il si un vol intérieur est retardé ou annulé ?",
    keywords: "vol vols interieur tsaradia retard annulation horaire avion",
    answer: (
      <>
        <p>
          Les horaires des vols intérieurs Madagascar Airlines changent souvent, parfois la veille. Nous suivons vos vols et vous prévenons
          par WhatsApp dès qu&apos;un horaire bouge.
        </p>
        <p>
          Nous réorganisons alors les transferts, les nuits et les visites concernés, ou proposons un trajet par la route quand c&apos;est
          possible. Les frais éventuels et leur prise en charge sont précisés dans votre devis.
        </p>
      </>
    ),
  },
  {
    id: "bagages",
    category: "terrain",
    icon: "luggage",
    question: "Quelles sont les règles de bagages sur Madagascar Airlines et l'électricité dans les lodges ?",
    keywords: "electricite solaire prise chargeur bagages poids tsaradia vols kilo 20kg",
    answer: (
      <>
        <p>
          Sur les vols intérieurs Madagascar Airlines, la franchise standard est de <strong>20 kg en soute</strong> et{" "}
          <strong>5 kg en cabine</strong>. Préférez un sac souple à une valise rigide : il se charge plus facilement sur le toit des 4x4.
        </p>
        <p>
          Dans les camps isolés (Isalo, Tsingy, Ankarana), l&apos;électricité vient souvent de panneaux solaires, le soir seulement.
          Prévoyez une batterie externe de 10 000 à 20 000 mAh. Les prises sont au standard européen (types C et E).
        </p>
      </>
    ),
  },
  {
    id: "meteo-marine",
    category: "terrain",
    icon: "waves",
    question: "Que se passe-t-il si la météo empêche une sortie en mer, par exemple à Nosy Tanikely ?",
    keywords: "meteo mer bateau pirogue nosy tanikely vent houle report sortie",
    answer: (
      <>
        <p>
          La sécurité passe avant le programme. Si la capitainerie ou notre guide annonce un vent fort ou une houle dangereuse, la sortie en
          mer n&apos;a pas lieu.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          <div className={box}>
            <span className="font-label-md text-label-md text-on-surface font-bold block mb-1">Report</span>
            <span className="font-body-sm text-body-sm">La sortie est décalée sur un autre jour de votre séjour, sans frais.</span>
          </div>
          <div className={box}>
            <span className="font-label-md text-label-md text-on-surface font-bold block mb-1">Autre activité ou remboursement</span>
            <span className="font-body-sm text-body-sm">
              Une excursion à terre (par exemple la réserve de Lokobe), ou le remboursement de la sortie en mer.
            </span>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "securite",
    category: "terrain",
    icon: "shield",
    question: "Madagascar est-il un pays sûr pour voyager ?",
    keywords: "securite surete vol agression nuit route conseils voyageurs danger",
    reviewed: "2026-10-01",
    sources: [SOURCES.diplomatieSecurite],
    answer: (
      <>
        <p>
          La plupart des séjours se passent sans incident, mais des précautions s&apos;imposent, surtout à Antananarivo : vols à la tire,
          objets de valeur à garder hors de vue, pas de déplacement à pied la nuit.
        </p>
        <ul className="list-disc pl-space-lg space-y-1">
          <li>Nos trajets sur route se font de jour, avec un chauffeur qui connaît l&apos;itinéraire.</li>
          <li>Consultez les conseils officiels avant de partir : la situation peut évoluer selon les régions.</li>
          <li>
            Inscrivez-vous sur le service de votre pays pour les voyageurs à l&apos;étranger (Ariane pour les Français), afin d&apos;être
            prévenu en cas d&apos;alerte.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "enfants",
    category: "terrain",
    icon: "family_restroom",
    question: "Peut-on voyager avec des enfants ?",
    keywords: "enfant enfants famille bebe age minimum tarif enfant",
    answer: (
      <>
        <p>
          Oui. Selon le circuit, les enfants sont acceptés à partir de {youngestAge} ans : le filtre « Âge du plus jeune enfant » de la page
          Circuits n&apos;affiche que les circuits adaptés. Un enfant paie {Math.round(CHILD_RATE * 100)} % du tarif adulte.
        </p>
        <p>
          Indiquez l&apos;âge de chaque enfant à la réservation : nous adaptons les étapes et les visites. Demandez à votre médecin les
          précautions propres aux enfants, notamment contre le paludisme.
        </p>
      </>
    ),
  },
  {
    id: "fihavanana",
    category: "ecotourisme",
    icon: "nature_people",
    question: "En quoi consiste la charte Fihavanana et le contact avec la faune ?",
    keywords: "fihavanana ethique communaute mnp lemurien contact regles respect fady",
    answer: (
      <>
        <p>
          Le <em>Fihavanana</em> est le principe malgache de solidarité et de respect du vivant. Chez MadaVoyage :
        </p>
        <ul className="list-disc pl-space-lg space-y-1">
          <li>
            <strong>Faune sauvage :</strong> on ne nourrit, ne touche ni n&apos;appelle les lémuriens et les caméléons, et on garde au moins
            2 mètres de distance.
          </li>
          <li>
            <strong>Fonds Fihavanana :</strong> {SOLIDARITY_TEXT}
          </li>
          <li>
            <strong>Fady (interdits) :</strong> votre guide vous signale les interdits des lieux sacrés (arbres, tombeaux, sources).
          </li>
        </ul>
      </>
    ),
  },
];
