---
name: Lémurie & Lagon
colors:
  surface: '#f7f9ff'
  surface-dim: '#d1dbe8'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e4effd'
  surface-container-high: '#dfe9f7'
  surface-container-highest: '#d9e3f1'
  on-surface: '#121d26'
  on-surface-variant: '#3d494b'
  inverse-surface: '#27313c'
  inverse-on-surface: '#e8f2ff'
  outline: '#6d797b'
  outline-variant: '#bcc9cb'
  surface-tint: '#006972'
  primary: '#006972'
  on-primary: '#ffffff'
  primary-container: '#0fa3b1'
  on-primary-container: '#003237'
  inverse-primary: '#60d7e5'
  secondary: '#006c44'
  on-secondary: '#ffffff'
  secondary-container: '#8df8bd'
  on-secondary-container: '#007349'
  tertiary: '#a7391e'
  on-tertiary: '#ffffff'
  tertiary-container: '#ed6d4d'
  on-tertiary-container: '#5b0f00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#8ef2ff'
  primary-fixed-dim: '#60d7e5'
  on-primary-fixed: '#001f23'
  on-primary-fixed-variant: '#004f56'
  secondary-fixed: '#8df8bd'
  secondary-fixed-dim: '#71dba2'
  on-secondary-fixed: '#002112'
  on-secondary-fixed-variant: '#005232'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a2'
  on-tertiary-fixed: '#3c0700'
  on-tertiary-fixed-variant: '#862208'
  background: '#f7f9ff'
  on-background: '#121d26'
  surface-variant: '#d9e3f1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

### Brand Identity & Emotional Response
The brand narrative celebrates the biodiversity, raw landscapes, and cultural heritage of Madagascar. The visual language balances warmth, refined wanderlust, and contemporary digital ergonomics. The interface evokes:
- **Serenity & Escape:** Evoking crystalline coral reefs (Ifaty, Nosy Be) and pristine rainforests (Andasibe, Marojejy).
- **Warmth & Hospitality:** Channeling the spirit of "Fihavanana" (solidarity and welcoming community) through organic curves, generous padding, and golden hour accents.
- **Trust & Expedition Clarity:** Providing foolproof navigation, clear pricing in dual currencies (MGA and EUR/USD), and structured travel itineraries for remote logistics.

### Design Movement
**Warm Modern Minimalism with Tactile Depth:**
- Generous structural whitespace against warm off-white canvases.
- Frosted micro-surfaces (subtle glassmorphism) applied strictly to floating status chips and sticky navigation controls.
- Soft, tinted ambient illumination instead of stark neutral drop shadows.
- Vivid, editorial-scale imagery celebrating biodiversity, endemism, and authentic encounters.

## Colors

### Palette Architecture
- **Primary (`#0FA3B1` — Lagon Turquoise):** Dominates key interactive states, active indicators, brand markers, and oceanographic travel tags. Communicates clarity, freshness, and the Mozambique Channel's waters.
- **Secondary (`#2E9E6B` — Émeraude Primaire):** Applied to sustainable travel badges, eco-certified lodges, national park circuits, and confirmed availability markers.
- **Tertiary / Accent (`#FF7A59` — Corail Coucher de Soleil):** Reserved strictly for primary conversion actions (e.g., "Réserver l'expédition", "Confirmer le paiement"), urgency alerts, and promotional highlights.
- **Neutral Dark (`#1F2933` — Anthracite Profond):** Anchors headlines, primary text, and high-emphasis icons with strict WCAG AAA contrast against light bases.
- **Canvas & Surface System:**
  - `surface-canvas`: `#FAFAF7` (Warm cream base preventing eye fatigue).
  - `surface-card`: `#FFFFFF` (Elevated card containers, sheets, and forms).
  - `surface-muted`: `#F3F4F6` (Input backgrounds, inactive pill chips, stepper troughs).
  - `border-subtle`: `#E5E7EB` (Subtle boundary definition for structural accessibility).
- **Functional Semantics:**
  - Success: `#10B981` (Completed milestone, instant booking confirmed).
  - Warning / Budget Alert: `#F59E0B` (Limited seats remaining, rainy season notice).
  - Destructive / Error: `#EF4444` (Validation failure, booking cancellation).

## Typography

### Hierarchy & Legibility Rules
- **Display & Headings (Plus Jakarta Sans):** Crafted with balanced geometric apertures and modern curves. Display treatments feature negative letter tracking to provide editorial density when overlaying hero landscapes.
- **Body & Numerical Readouts (Inter):** Deployed for all itineraries, logistical details, passenger forms, and multi-currency pricing lists (`EUR`, `MGA`, `USD`) to safeguard vertical rhythm and optical legibility on compact screens.
- **Currency & Monospaced Digits:** When rendering prices in Malagasy Ariary (`Ar 450 000`), always activate tabular figures (`font-variant-numeric: tabular-nums`) to ensure scannable vertical alignment across summary totals.

## Layout & Spacing

### Grid Philosophy
The application relies on an 8-point structural grid rhythm:
- **Mobile (< 768px):** Single-column fluid stream with `1rem` outer canvas padding. Carousel cards peek off-screen with `12px` negative margin offsets to encourage horizontal gestural browsing.
- **Tablet (768px – 1024px):** 8-column layout with `1.5rem` gutters. Discovery feeds transform into staggered 2-column editorial grids.
- **Desktop (> 1024px):** 12-column layout capped at a maximum container width of `1280px` (`80rem`), centered with `3rem` margins. The reservation funnel switches to a 7/5 split layout (left: itinerary details; right: sticky booking summary and price calculator).

### Spacing Principles
- Minimum hit target clearance across all touchpoints: `48px`.
- Card internal padding: `space-md` (`1rem`) on compact summary cards; `space-lg` (`1.5rem`) on primary itinerary modules.

## Elevation & Depth

Visual hierarchy combines stacked warm surfaces and lagoon-tinted ambient shadows:

### Elevation Scale
1. **Level 0 (Flat Canvas):** `#FAFAF7` — Background canvas, unstacked form backgrounds.
2. **Level 1 (Cards & Modules):** `#FFFFFF` with `0 2px 8px -2px rgba(15, 163, 177, 0.06), 0 1px 3px 0 rgba(31, 41, 51, 0.04)`. Outlined with a `1px` stroke of `#E5E7EB`.
3. **Level 2 (Hover & Floating Elements):** `0 10px 24px -4px rgba(15, 163, 177, 0.12), 0 4px 8px -2px rgba(31, 41, 51, 0.04)`.
4. **Level 3 (Modals, Sticky Booking Bars & Floating Tab Bar):** `0 20px 32px -8px rgba(31, 41, 51, 0.14), 0 8px 16px -4px rgba(15, 163, 177, 0.08)`.

### Glassmorphism Overlays
Floating photo indicators (e.g., photo counts, duration pills, currency toggles) apply `rgba(255, 255, 255, 0.85)` with a backdrop blur of `12px` and a `1px` border of `rgba(255, 255, 255, 0.4)`.

## Shapes

### Form Geometry
The shape system uses soft, pill-inspired corners that evoke natural coastlines and friendly, welcoming touchpoints:
- **Chips, Badges & Small Action Buttons:** Fully pill-shaped (`rounded-full`, radius `9999px`).
- **Cards & Sheets:** Rounded with `1.5rem` (`24px`) radii on standard cards, extending to `2rem` (`32px`) top radii on mobile modal sheets.
- **Form Inputs & Interactive Fields:** `1rem` (`16px`) corner radius, maintaining a soft tactile feel without losing structural boundary definition.
- **Image Containers:** Clamped at `1.25rem` (`20px`) inner corner radius when embedded inside parent cards.

## Components

### Buttons
- **Primary CTA ("Réserver"):** Solid Coral `#FF7A59`, text `#FFFFFF`, minimum height `48px` (desktop: `52px`), font `label-lg`, radius `9999px`. Subtle shadow `0 4px 14px rgba(255, 122, 89, 0.35)`. Active state compresses slightly (`scale: 0.98`).
- **Secondary Action:** Solid Turquoise `#0FA3B1`, text `#FFFFFF`, minimum height `48px`, radius `9999px`.
- **Ghost / Outlined:** Background `transparent`, border `1.5px solid #E5E7EB`, text `#1F2933`. Hover background: `rgba(15, 163, 177, 0.06)`.

### Chips & Badges
- **Status & Availability:** Pill badges (`height: 28px`), font `label-sm`, padding `0.25rem 0.75rem`.
  - Available: Background `rgba(46, 158, 107, 0.12)`, text `#2E9E6B`.
  - Limited/Popular: Background `rgba(245, 158, 11, 0.12)`, text `#B45309`.
- **Eco-Tourisme Tag:** Left icon (leaf), background `rgba(46, 158, 107, 0.15)`, text `#2E9E6B`.
- **Currency Switcher (`EUR | MGA | USD`):** Segmented pill container in `#F3F4F6` with active segment in `#FFFFFF` elevated by soft shadow.

### Cards (Travel Offers & Packages)
- **Visual Ratio:** 16:10 or 4:3 image container with lazy-loaded zoom transitions on hover.
- **Card Content:** White `#FFFFFF` card body with `1.5rem` radius, containing:
  - Top-right floating glassmorphism badge: Wishlist heart or duration pill.
  - Title in `headline-sm`, subtitle/location in `body-sm` with location pin.
  - Bottom strip: Dual price display (`€ 140 / ~ 680 000 Ar`) in `label-lg` adjacent to primary mini-action.

### Reservation Stepper (4 Steps)
1. *Dates & Voyageurs* -> 2. *Options & Guide* -> 3. *Coordonnées* -> 4. *Paiement Sécurisé*
- **Visual Model:** Continuous horizontal track (`height: 4px`, color `#E5E7EB`) overlaid with an animated fill bar in `#0FA3B1`.
- **Step Indicators:** `32px` circular nodes.
  - Completed: Filled `#0FA3B1` with a white checkmark.
  - Active: Filled `#FFFFFF`, border `3px solid #0FA3B1`, inner core `#0FA3B1`.
  - Upcoming: Filled `#F3F4F6`, border `1px solid #E5E7EB`, text `#1F2933` at 40% opacity.

### Form Inputs
- Height `52px`, background `#FFFFFF`, border `1px solid #E5E7EB`, radius `1rem`.
- Focus state: Border color `#0FA3B1`, ring `0 0 0 4px rgba(15, 163, 177, 0.15)`.

### Floating Bottom Navigation Bar (Mobile)
- Docked or floating `16px` above the bottom screen edge, radius `28px`.
- Background `rgba(255, 255, 255, 0.92)` with `backdrop-filter: blur(16px)` and border `1px solid rgba(229, 231, 235, 0.8)`.
- 4 Tabs: *Accueil*, *Explorer*, *Mes Voyages*, *Profil*.
- Active tab displays a solid `#0FA3B1` icon and indicator pill; inactive tabs display `#1F2933` at 45% opacity.