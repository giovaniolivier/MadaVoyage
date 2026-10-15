import type { HotelId } from "./booking-store";

/** Hébergements partenaires de Nosy Be : étape 3 du tunnel et page « Tous nos hébergements ». */
export const HOTEL_CARDS: {
  id: HotelId;
  img: string;
  alt: string;
  rating: string;
  reviews: number;
  location: string;
  title: string;
  text: string;
  tags: { icon?: string; label: string }[];
  badge?: string;
}[] = [
  {
    id: "manga-soa",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeLSiJB7o2GLO5hTjCna3Q3anVfiGQu75xVTp70A0UkT-Xql6IlRUK7Ll6bFN7LwSGsvOqAv8DFfFp2SpKaTkufAOENM6sMhwQTtvVEDMkTlWnVEqlzx3aW3abWHSW0zIUAseXxkA4nborqYJaHMly8IbYNzTyCP5ywXRxXZqRcKrHbaiibW5P9X531JDM0n9sVA-S7PUA-lPY2l0dOMCn-iVikqH6uiFkMiOiawreoykM7IrqN_g",
    alt: "Manga Soa Lodge, écolodge privé à Nosy Be",
    rating: "4.9",
    reviews: 96,
    location: "Presqu'île de Befefika, Nosy Be",
    title: "Manga Soa Lodge 4★ Éco-Luxe",
    text: "Lodge intimiste en bordure de crique sauvage. Suites familiales, piscine d'eau de source et protection du lagon.",
    tags: [
      { icon: "kayaking", label: "Kayak & Snorkeling" },
      { icon: "solar_power", label: "100% Solaire" },
    ],
    badge: "Lodge Refuge MNP",
  },
  {
    id: "vanila",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEWiA-LgYNUvuEdx8Ke9zZFdh3rYKFktF8ce2aREPRBtvbaD22h48PF6Z7Fmw-fcAze7YKTS7hZvu24r95jW9qY5Iaw2SGpP9axdXEBOtMX1lXqd2fbDrn-hHBCmmccvDcTz1nDueWcetxMu_tryZONW1tQRBJugAUCxld_Yx5qNorNuFkqFy0rBtIMZuYOHlP8AsQn19j5JbYr3r9evQeC7S-hzoqCMoXAjig_w15Si1G4LEKNY0",
    alt: "Piscine en bord de plage du Vanila Hotel & Spa à Nosy Be",
    rating: "4.8",
    reviews: 184,
    location: "Plage de Dzamandzar, Nosy Be",
    title: "Vanila Hotel & Spa 4★",
    text: "Chambres avec boiseries traditionnelles face à Sakatia, deux piscines à débordement et club famille.",
    tags: [{ label: "Piscine infinie" }, { label: "Plage privée" }],
  },
  {
    id: "heure-bleue",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4Z3miw706aflX3kstPU-J7LY7pGcQEymxw7RBkbwjbmzU3wAfrDgYNJLxqXtfiN80mWoQY17IP0ohZ78xDN8vKWG0ws6c6fehrgKzT72Bn78F7vo1aPLYo8qUoE53ZpPVYRzQt4nZLzARYDcQy70p2Po7T3xS1l3wXDgNrfNFDV81Wn7J8BSnc0zBfy21bLqCfKYdcWTc8O2EYXjwZ5oI1HxK5OTvvpkMnmLB4zqgLrmqg1G4jdA",
    alt: "Bungalow de l'hôtel L'Heure Bleue à Madirokely, Nosy Be",
    rating: "4.6",
    reviews: 142,
    location: "Baie de Madirokely, Nosy Be",
    title: "L'Heure Bleue 3★ Charme",
    text: "Bungalows sur pilotis en bois précieux dominant la baie avec démarche d'écolabel 100% solaire.",
    tags: [{ label: "100% Solaire" }, { label: "2 Piscines eau de mer" }],
  },
];
