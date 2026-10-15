"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  type Booking,
  type TripTypeId,
  BOOKING_KEY,
  DEFAULT_BOOKING,
  LIMITS,
  addDays,
  childAgesFor,
  daysBetween,
  nightsOf,
  parseDate,
  readBooking,
  stayStart,
  toIso,
  travelersCount,
  useBooking,
} from "./booking-store";
import { DESTINATIONS } from "./pricing";
import { type DatesText, useDatesText } from "./dates-i18n";
import { CIRCUITS } from "@/components/circuits/catalog-data";
import { FAQ_ITEMS, SOURCES } from "@/components/aide/faq-data";
import { EMAIL, WHATSAPP } from "@/lib/site";
import { useSession } from "@/components/auth/session";
import { SEASON_RULES, seasonOf, type SeasonRule } from "@/lib/season-rules";

const seasonText = (t: DatesText, rule: SeasonRule) => t.seasons[SEASON_RULES.indexOf(rule)] ?? rule;

const SEASON_STYLE: Record<SeasonRule["tone"], { badge: string; text: string }> = {
  recommended: { badge: "text-secondary bg-secondary-fixed/50", text: "text-secondary" },
  high: { badge: "text-on-surface bg-tertiary-fixed/60", text: "text-tertiary" },
  neutral: { badge: "text-on-surface-variant bg-surface-container-high", text: "text-primary" },
  warning: { badge: "text-error bg-error-container", text: "text-error" },
};

const seasonIcon = (rule: SeasonRule) => (rule.tone === "warning" ? "thunderstorm" : rule.dry ? "wb_sunny" : "rainy");

/** Aujourd'hui et première arrivée possible, calculés côté client pour éviter un écart d'hydratation. */
function useBounds() {
  const [bounds, setBounds] = useState<{ today: string; first: string } | null>(null);
  useEffect(() => {
    const today = toIso(new Date());
    setBounds({ today, first: addDays(today, LIMITS.minLeadDays) });
  }, []);
  return bounds;
}

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}

/** Deux mois côte à côte à partir de 768 px, un seul en dessous. */
const WIDE = "(min-width: 768px)";
const subscribeWide = subscribeMedia(WIDE);
function useWide() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
}

type IssueId = "dates" | "departure" | "ages" | "tripType";
type Issue = { id: IssueId; target: string; short: string; text: string };

/** Ce qui manque pour passer à l'étape suivante, dans l'ordre de la page. */
export function stepIssues(b: Booking, t: DatesText): Issue[] {
  const issues: Issue[] = [];
  if (!b.travelMonth && !b.arrival) {
    issues.push({ id: "dates", target: "champ-arrivee", short: t.issueDatesShort, text: t.issueDates });
  } else if (!b.travelMonth && !b.departure) {
    issues.push({ id: "departure", target: "champ-depart", short: t.issueDepartureShort, text: t.issueDeparture });
  }
  const missingAge = b.childAges.indexOf(null);
  if (missingAge >= 0) {
    issues.push({ id: "ages", target: `age-enfant-${missingAge}`, short: t.issueAgesShort, text: t.issueAges });
  }
  if (!b.tripType) {
    issues.push({ id: "tripType", target: "type-sejour-detente", short: t.issueTripShort, text: t.issueTrip });
  }
  return issues;
}

/** Vrai après un clic sur « Continuer » alors qu'il manquait quelque chose : les erreurs s'affichent alors dans chaque carte. */
let attempted = false;
const attemptListeners = new Set<() => void>();
function setAttempted(value: boolean) {
  if (attempted === value) return;
  attempted = value;
  attemptListeners.forEach((l) => l());
}
function useAttempted() {
  return useSyncExternalStore(
    (l) => {
      attemptListeners.add(l);
      return () => attemptListeners.delete(l);
    },
    () => attempted,
    () => false,
  );
}

function issueOf(b: Booking, t: DatesText, id: IssueId, shown: boolean) {
  return shown ? (stepIssues(b, t).find((i) => i.id === id) ?? null) : null;
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 font-body-md text-body-md text-error font-semibold">
      <span aria-hidden="true" className="material-symbols-outlined text-[18px] mt-0.5">
        error
      </span>
      <span>{children}</span>
    </p>
  );
}

function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

const monthOf = (iso: string) => {
  const d = parseDate(iso);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

/** Même jour un autre mois, ramené au dernier jour du mois si besoin (31 janvier + 1 mois = 28 février). */
function shiftMonth(iso: string, n: number) {
  const d = parseDate(iso);
  const target = addMonths(d, n);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return toIso(new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last)));
}

const clampIso = (iso: string, min: string, max: string) => (iso < min ? min : iso > max ? max : iso);
const colonOf = (t: DatesText) => (t.html === "en" ? ": " : " : ");

const DAY_SHAPE = "rounded-full flex items-center justify-center font-body-md text-body-md";
const DAY_BASE = `relative z-10 mx-auto w-10 h-10 ${DAY_SHAPE}`;
const DAY = {
  available: "bg-surface-container-lowest text-on-surface ring-1 ring-inset ring-outline-variant/60 hover:bg-primary-container/30",
  selected: "bg-primary text-on-primary font-bold shadow-sm hover:bg-on-primary-fixed-variant",
  inStay: "text-on-surface font-semibold hover:bg-primary-container/40",
  unavailable: "text-on-surface-variant/60 line-through cursor-not-allowed",
};
const STAY_BAND = "bg-primary-container/30";

function SeasonAdvice({ rule }: { rule: SeasonRule }) {
  const t = useDatesText();
  const style = SEASON_STYLE[rule.tone];
  const text = seasonText(t, rule);
  return (
    <p className="flex items-start gap-2 bg-surface-container-low p-2 rounded font-body-md text-body-md text-on-surface-variant leading-snug">
      <span aria-hidden="true" className={`material-symbols-outlined text-[20px] shrink-0 ${style.text}`}>
        {seasonIcon(rule)}
      </span>
      <span>
        <span className={`font-bold ${style.text}`}>{text.label}</span>
        {colonOf(t)}
        {text.advice}
      </span>
    </p>
  );
}

type Bounds = { today: string; first: string } | null;

function MonthCalendar({
  month,
  booking,
  bounds,
  tabIso,
  onPick,
  onKey,
}: {
  month: Date;
  booking: Booking;
  bounds: Bounds;
  tabIso: string;
  onPick: (iso: string) => void;
  onKey: (e: React.KeyboardEvent, iso: string) => void;
}) {
  const t = useDatesText();
  const season = seasonOf(month.getMonth());
  const titleId = `calendrier-${toIso(month).slice(0, 7)}`;
  const lead = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toIso(new Date(month.getFullYear(), month.getMonth(), i + 1))),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const { arrival: start, departure: end } = booking;

  return (
    <div className="bg-surface rounded p-space-md flex flex-col justify-between gap-space-md">
      <div>
        <div className="flex items-center justify-between gap-2 mb-space-sm">
          <h3 id={titleId} className="font-label-lg text-label-lg text-on-surface font-bold capitalize">
            {t.monthTitle(month)}
          </h3>
          <span className={`font-body-md text-body-md font-semibold px-2.5 py-0.5 rounded-full ${SEASON_STYLE[season.tone].badge}`}>
            {seasonText(t, season).label}
          </span>
        </div>

        <table aria-labelledby={titleId} className="w-full table-fixed border-separate border-spacing-y-1" role="grid">
          <thead>
            <tr>
              {t.weekdays.map(([short, long]) => (
                <th key={short} abbr={long} className="pb-1 font-body-md text-body-md font-semibold text-on-surface-variant" scope="col">
                  {short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, w) => (
              <tr key={w}>
                {week.map((iso, d) => {
                  if (!iso) return <td key={`vide-${d}`} />;
                  const isStart = iso === start;
                  const isEnd = iso === end;
                  const inStay = !!start && !!end && iso > start && iso < end;
                  const unavailable = (!!bounds && iso < bounds.first) || iso > LIMITS.lastDate;
                  const band =
                    start && end && start !== end
                      ? isStart
                        ? "left-1/2 right-0"
                        : isEnd
                          ? "left-0 right-1/2"
                          : inStay
                            ? "inset-x-0"
                            : null
                      : null;
                  const state = isStart || isEnd ? DAY.selected : inStay ? DAY.inStay : unavailable ? DAY.unavailable : DAY.available;
                  const label = [t.fullDay(iso)];
                  if (bounds && iso === bounds.today) label.push(t.dayToday);
                  if (isStart) label.push(t.dayArrival);
                  if (isEnd) label.push(t.dayDeparture);
                  if (inStay) label.push(t.dayInStay);
                  if (unavailable) label.push(t.dayUnavailable);
                  return (
                    <td key={iso} aria-selected={isStart || isEnd || inStay} className="relative p-0">
                      {band && <span aria-hidden="true" className={`absolute inset-y-0 ${band} ${STAY_BAND}`}></span>}
                      <button
                        aria-disabled={unavailable || undefined}
                        aria-label={label.join(", ")}
                        className={`${DAY_BASE} ${state} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`}
                        data-iso={iso}
                        onClick={() => onPick(iso)}
                        onKeyDown={(e) => onKey(e, iso)}
                        tabIndex={iso === tabIso ? 0 : -1}
                        type="button"
                      >
                        {Number(iso.slice(8))}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SeasonAdvice rule={season} />
    </div>
  );
}

function CalendarLegend({ bounds }: { bounds: Bounds }) {
  const t = useDatesText();
  const items = [
    { label: t.legendAvailable, className: DAY.available },
    { label: t.legendEndpoint, className: DAY.selected },
    { label: t.legendStay, className: `${STAY_BAND} ${DAY.inStay}` },
    { label: t.legendUnavailable, className: DAY.unavailable },
  ];
  const [before, after] = t.leadKnown(LIMITS.minLeadDays, t.fullDay(LIMITS.lastDate));
  return (
    <div className="mt-space-md flex flex-col gap-space-sm">
      <ul
        aria-label={t.legendLabel}
        className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-space-lg gap-y-2 font-body-md text-body-md text-on-surface-variant"
      >
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true" className={`w-8 h-8 shrink-0 ${DAY_SHAPE} ${item.className}`}>
              12
            </span>
            {item.label}
          </li>
        ))}
      </ul>
      <p className="font-body-md text-body-md text-on-surface-variant">
        {bounds ? (
          <>
            {before}
            <strong className="text-on-surface">{t.fullDay(bounds.first)}</strong>
            {after}
          </>
        ) : (
          t.leadUnknown(LIMITS.minLeadDays, t.fullDay(LIMITS.lastDate))
        )}{" "}
        <span className="hidden md:inline">{t.keyboardHelp}</span>
      </p>
    </div>
  );
}

const CATALOG_NIGHTS = {
  min: Math.min(...CIRCUITS.map((c) => c.nights)),
  max: Math.max(...CIRCUITS.map((c) => c.nights)),
};

export function circuitOf(b: Booking) {
  return b.circuit ? (CIRCUITS.find((c) => c.id === b.circuit) ?? null) : null;
}

const cardClass = "bg-surface-container-lowest rounded p-space-lg shadow-sm";
const titleClass = "font-headline-md text-headline-md text-on-surface";

function CardTitle({ id, children, optional }: { id?: string; children: React.ReactNode; optional?: boolean }) {
  const t = useDatesText();
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-primary"></span>
      <h2 id={id} className={titleClass}>
        {children}
      </h2>
      {optional && (
        <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
          {t.optional}
        </span>
      )}
    </div>
  );
}

/** Champ date saisi au clavier : la saisie reste libre tant qu'elle n'est pas une date valide. */
function DateField({
  id,
  label,
  value,
  min,
  max,
  disabled,
  error,
  onCommit,
}: {
  id: string;
  label: string;
  value: string | null;
  min?: string;
  max?: string;
  disabled?: boolean;
  error?: string | null;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value ?? "");
  useEffect(() => setDraft(value ?? ""), [value]);
  return (
    <div className="flex flex-col gap-1 min-w-0 flex-1">
      <label className="font-body-md text-body-md text-on-surface font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={error ? `${id}-erreur` : undefined}
        aria-invalid={error ? true : undefined}
        className={`${error ? invalidInputClass : inputClass} w-full disabled:opacity-50 disabled:cursor-not-allowed`}
        disabled={disabled}
        id={id}
        max={max}
        min={min}
        onBlur={() => setDraft(value ?? "")}
        onChange={(e) => {
          setDraft(e.target.value);
          if (!e.target.value || e.target.value.slice(0, 4) >= "2000") onCommit(e.target.value);
        }}
        type="date"
        value={draft}
      />
      {error && <FieldError id={`${id}-erreur`}>{error}</FieldError>}
    </div>
  );
}

const pillClass =
  "inline-flex items-center min-h-11 px-space-md rounded-full font-body-md text-body-md font-semibold ring-1 ring-outline-variant text-on-surface transition-colors hover:bg-surface-container-low hover:ring-primary peer-checked:hover:bg-on-primary-fixed-variant peer-checked:bg-primary peer-checked:text-on-primary peer-checked:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary";

export function DatesCard() {
  const t = useDatesText();
  const [booking, update] = useBooking();
  const bounds = useBounds();
  const [month, setMonth] = useState(() => monthOf(stayStart(booking) ?? DEFAULT_BOOKING.arrival ?? toIso(new Date())));
  const [hint, setHint] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const [focusIso, setFocusIso] = useState<string | null>(null);
  const [typedError, setTypedError] = useState<{ field: "arrival" | "departure"; text: string } | null>(null);
  const shownAttempt = useAttempted();
  const wide = useWide();
  const focusPending = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastExact = useRef<Pick<Booking, "arrival" | "departure"> | null>(null);
  const nights = nightsOf(booking);
  const circuit = circuitOf(booking);
  const monthMode = booking.travelMonth !== null;
  const { arrival, departure } = booking;
  const datesIssue = issueOf(booking, t, "dates", shownAttempt);
  const departureIssue = issueOf(booking, t, "departure", shownAttempt);

  function say(text: string) {
    setHint(text);
    setLive(text);
  }

  useEffect(() => {
    if (!bounds) return;
    const b = readBooking();
    if (b.arrival && b.arrival < bounds.first) {
      update({ arrival: null, departure: null });
      say(t.staleDates);
    }
    if (b.travelMonth && b.travelMonth < bounds.first.slice(0, 7)) update({ travelMonth: bounds.first.slice(0, 7) });
    const anchor = b.arrival && b.arrival >= bounds.first ? b.arrival : bounds.first;
    setMonth(monthOf(anchor));
    setFocusIso(anchor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);

  useEffect(() => {
    setAttempted(false);
    return () => setAttempted(false);
  }, []);

  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${focusIso}"]`)?.focus();
  }, [focusIso, month]);

  const minMonth = bounds ? monthOf(bounds.today) : null;
  const lastMonth = monthOf(LIMITS.lastDate);
  const visibleEnd = addMonths(month, wide ? 2 : 1);
  const canGoBack = !minMonth || month > minMonth;
  const canGoForward = visibleEnd <= lastMonth;
  const isVisible = (iso: string) => monthOf(iso) >= month && monthOf(iso) < visibleEnd;
  const tabIso = focusIso && isVisible(focusIso) ? focusIso : toIso(month);
  const earlyText = () => t.tooEarly(bounds ? t.fullDay(bounds.first) : "", LIMITS.minLeadDays);
  const lateText = () => t.tooLate(t.fullDay(LIMITS.lastDate));
  const tooEarly = () => say(earlyText());
  const tooLate = () => say(lateText());

  function showMonthOf(iso: string) {
    const m = monthOf(iso);
    if (m < month) setMonth(m);
    else if (m >= visibleEnd) setMonth(addMonths(m, -1));
  }

  function setStay(from: string, to: string, typed = false) {
    const n = daysBetween(from, to);
    const problem =
      n < LIMITS.minNights
        ? t.tooShort(LIMITS.minNights, t.shortDate(addDays(from, LIMITS.minNights)))
        : n > LIMITS.maxNights
          ? t.tooLong(n, LIMITS.maxNights, t.shortDate(addDays(from, LIMITS.maxNights)))
          : to > LIMITS.lastDate
            ? lateText()
            : null;
    if (problem) {
      if (typed) setTypedError({ field: "departure", text: problem });
      else say(problem);
      return;
    }
    update({ departure: to });
    setTypedError(null);
    setHint(null);
    setLive(t.stayAnnounce(t.fullDay(from), t.fullDay(to), n));
  }

  function setArrival(iso: string, keepDeparture: boolean) {
    update({ arrival: iso, departure: keepDeparture ? departure : null, travelMonth: null });
    setTypedError(null);
    setHint(null);
    setLive(
      keepDeparture && departure
        ? t.stayAnnounce(t.fullDay(iso), t.fullDay(departure), daysBetween(iso, departure))
        : t.arrivalAnnounce(t.fullDay(iso)),
    );
  }

  function pick(iso: string) {
    setFocusIso(iso);
    if (bounds && iso < bounds.first) return tooEarly();
    if (iso > LIMITS.lastDate) return tooLate();
    if (!arrival || departure || iso <= arrival) return setArrival(iso, false);
    if (daysBetween(arrival, iso) > LIMITS.maxNights) {
      setArrival(iso, false);
      say(t.newArrival(LIMITS.maxNights));
      return;
    }
    setStay(arrival, iso);
  }

  function typeArrival(value: string) {
    if (!value) {
      update({ arrival: null, departure: null });
      setTypedError(null);
      return;
    }
    if (bounds && value < bounds.first) return setTypedError({ field: "arrival", text: earlyText() });
    if (value > LIMITS.lastDate) return setTypedError({ field: "arrival", text: lateText() });
    const n = departure ? daysBetween(value, departure) : 0;
    setArrival(value, n >= LIMITS.minNights && n <= LIMITS.maxNights);
    setFocusIso(value);
    showMonthOf(value);
  }

  function typeDeparture(value: string) {
    if (!arrival) return;
    if (!value) {
      update({ departure: null });
      setTypedError(null);
      return;
    }
    setStay(arrival, value, true);
    showMonthOf(value);
  }

  function clearDates() {
    update({ arrival: null, departure: null });
    setTypedError(null);
    setHint(null);
    setLive(t.cleared);
    if (bounds) setFocusIso(bounds.first);
  }

  function chooseMonthMode(on: boolean) {
    if (on === monthMode) return;
    setHint(null);
    if (on) {
      lastExact.current = { arrival, departure };
      const start = arrival ?? bounds?.first ?? toIso(month);
      update({
        travelMonth: start.slice(0, 7),
        monthNights: nights || circuit?.nights || booking.monthNights,
        arrival: null,
        departure: null,
      });
    } else {
      update({ travelMonth: null, ...(lastExact.current ?? {}) });
    }
  }

  function setNights(n: number) {
    if (monthMode) update({ monthNights: n });
    else if (arrival) setStay(arrival, addDays(arrival, n));
  }

  function onKey(e: React.KeyboardEvent, iso: string) {
    const weekday = (parseDate(iso).getDay() + 6) % 7;
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(iso, -1),
      ArrowRight: () => addDays(iso, 1),
      ArrowUp: () => addDays(iso, -7),
      ArrowDown: () => addDays(iso, 7),
      Home: () => addDays(iso, -weekday),
      End: () => addDays(iso, 6 - weekday),
      PageUp: () => shiftMonth(iso, e.shiftKey ? -12 : -1),
      PageDown: () => shiftMonth(iso, e.shiftKey ? 12 : 1),
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    const next = clampIso(move(), minMonth ? toIso(minMonth) : iso, LIMITS.lastDate);
    if (next === iso) return;
    focusPending.current = true;
    setFocusIso(next);
    showMonthOf(next);
  }

  const months: string[] = [];
  if (bounds) for (let m = monthOf(bounds.first); m <= lastMonth; m = addMonths(m, 1)) months.push(toIso(m).slice(0, 7));
  if (booking.travelMonth && !months.includes(booking.travelMonth)) months.unshift(booking.travelMonth);

  return (
    <div className={cardClass}>
      <p className="sr-only" role="status">
        {live}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-2">
        <div>
          <CardTitle>{t.datesTitle}</CardTitle>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">{monthMode ? t.introMonth : t.introDates}</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-low rounded-full self-start sm:self-auto">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">
            calendar_month
          </span>
          <span className="font-label-md text-label-md text-primary font-bold whitespace-nowrap">{t.duration(booking)}</span>
        </div>
      </div>

      <fieldset className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pb-space-md">
        <legend className="sr-only">{t.modeLegend}</legend>
        {(
          [
            [false, t.modeExact],
            [true, t.modeMonth],
          ] as const
        ).map(([on, label]) => (
          <label key={label} className="cursor-pointer flex">
            <input
              checked={monthMode === on}
              className="peer sr-only"
              name="dates-mode"
              onChange={() => chooseMonthMode(on)}
              type="radio"
            />
            <span className={`${pillClass} w-full sm:w-auto justify-center text-center leading-tight py-1.5`}>{label}</span>
          </label>
        ))}
      </fieldset>

      {monthMode ? (
        <div className="flex flex-col gap-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <label className="flex flex-col gap-1 font-body-md text-body-md text-on-surface font-semibold">
              {t.travelMonth}
              <select className={inputClass} onChange={(e) => update({ travelMonth: e.target.value })} value={booking.travelMonth ?? ""}>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {t.monthLabel(m)} · {seasonText(t, seasonOf(Number(m.slice(5, 7)) - 1)).label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 font-body-md text-body-md text-on-surface font-semibold">
              {t.stayLength}
              <select className={inputClass} onChange={(e) => update({ monthNights: Number(e.target.value) })} value={booking.monthNights}>
                {Array.from({ length: LIMITS.maxNights - LIMITS.minNights + 1 }, (_, i) => LIMITS.minNights + i).map((n) => (
                  <option key={n} value={n}>
                    {t.nightsN(n)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {booking.travelMonth && <SeasonAdvice rule={seasonOf(Number(booking.travelMonth.slice(5, 7)) - 1)} />}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:flex sm:flex-row sm:items-start gap-space-sm pb-space-md">
            <DateField
              error={typedError?.field === "arrival" ? typedError.text : datesIssue?.text}
              id="champ-arrivee"
              label={t.arrivalField}
              max={LIMITS.lastDate}
              min={bounds?.first}
              onCommit={typeArrival}
              value={arrival}
            />
            <DateField
              disabled={!arrival}
              error={typedError?.field === "departure" ? typedError.text : departureIssue?.text}
              id="champ-depart"
              label={t.departureField}
              max={arrival ? clampIso(addDays(arrival, LIMITS.maxNights), arrival, LIMITS.lastDate) : LIMITS.lastDate}
              min={arrival ? addDays(arrival, LIMITS.minNights) : bounds?.first}
              onCommit={typeDeparture}
              value={departure}
            />
            {(arrival || departure) && (
              <button
                className="col-span-2 justify-self-start -my-1 sm:my-0 sm:mt-7 h-11 px-space-sm sm:px-space-md rounded-full text-primary font-body-md text-body-md font-semibold hover:bg-primary/10 inline-flex items-center justify-center gap-1.5 shrink-0"
                onClick={clearDates}
                type="button"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  close
                </span>
                {t.clearDates}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pb-space-xs">
            <button
              aria-label={t.prevMonth}
              className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              disabled={!canGoBack}
              onClick={() => setMonth((m) => addMonths(m, -1))}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined">
                chevron_left
              </span>
            </button>
            <div className="flex flex-wrap items-center justify-center gap-x-space-sm gap-y-1 text-center">
              {hint ? (
                <span className="font-body-md text-body-md text-on-surface">{hint}</span>
              ) : !arrival ? (
                <span className="font-body-md text-body-md text-on-surface">{t.pickArrival}</span>
              ) : !departure ? (
                <>
                  <span className="font-body-md text-body-md text-on-surface">{t.pickDeparture}</span>
                  {circuit && (
                    <button
                      className="h-9 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-on-primary-fixed-variant"
                      onClick={() => setStay(arrival, addDays(arrival, circuit.nights))}
                      type="button"
                    >
                      {t.circuitDeparture(t.shortDate(addDays(arrival, circuit.nights)), circuit.nights)}
                    </button>
                  )}
                </>
              ) : null}
            </div>
            <button
              aria-label={t.nextMonth}
              className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              disabled={!canGoForward}
              onClick={() => setMonth((m) => addMonths(m, 1))}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined">
                chevron_right
              </span>
            </button>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-sm">
            <MonthCalendar booking={booking} bounds={bounds} month={month} onKey={onKey} onPick={pick} tabIso={tabIso} />
            {wide && (
              <MonthCalendar booking={booking} bounds={bounds} month={addMonths(month, 1)} onKey={onKey} onPick={pick} tabIso={tabIso} />
            )}
          </div>

          <CalendarLegend bounds={bounds} />
        </>
      )}

      {circuit && nights > 0 && nights !== circuit.nights && (
        <div
          className="mt-space-md p-space-sm rounded bg-tertiary-fixed/40 text-on-surface flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm"
          role="note"
        >
          <p className="flex items-start gap-space-xs font-body-md text-body-md">
            <span aria-hidden="true" className="material-symbols-outlined text-tertiary text-[20px] shrink-0">
              info
            </span>
            <span>{t.circuitNote(circuit.title, circuit.nights, nights)}</span>
          </p>
          <button
            className="h-9 px-space-md rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-sm shrink-0 hover:bg-surface-container-high"
            onClick={() => setNights(circuit.nights)}
            type="button"
          >
            {t.backToNights(circuit.nights)}
          </button>
        </div>
      )}

      <div className="mt-space-md bg-surface-container-low/50 rounded p-space-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-sm">
        <div className="flex flex-col gap-1 font-body-md text-body-md">
          <span className="text-on-surface font-medium">
            {t.yourChoice} <strong>{t.range(booking)}</strong>
          </span>
          <span className="text-on-surface-variant">
            {t.stayRange(LIMITS.minNights, LIMITS.maxNights)}
            {circuit ? "." : t.catalogRange(CATALOG_NIGHTS.min, CATALOG_NIGHTS.max)}
          </span>
        </div>

        {!monthMode && (
          <label className="flex items-center gap-2 cursor-pointer select-none -m-2 p-2 rounded hover:bg-surface-container-low transition-colors">
            <input
              checked={booking.flexible}
              className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
              onChange={(e) => update({ flexible: e.target.checked })}
              type="checkbox"
            />
            <span className="font-body-md text-body-md text-on-surface font-semibold">{t.flexible}</span>
          </label>
        )}
      </div>
    </div>
  );
}

const TRIP_TYPES: { id: TripTypeId; icon: string }[] = [
  { id: "detente", icon: "beach_access" },
  { id: "aventure", icon: "hiking" },
  { id: "culture", icon: "diversity_3" },
  { id: "lune-de-miel", icon: "favorite" },
];

export function TripTypeCard() {
  const t = useDatesText();
  const [booking, update] = useBooking();
  const issue = issueOf(booking, t, "tripType", useAttempted());
  return (
    <fieldset aria-describedby={issue ? "type-sejour-erreur" : undefined} className={`${cardClass} ${issue ? "ring-2 ring-error" : ""}`}>
      <legend className="sr-only">{t.tripTitle}</legend>
      <div aria-hidden="true">
        <CardTitle>{t.tripTitle}</CardTitle>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 mb-space-md">{t.tripIntro}</p>
      {issue && (
        <div className="mb-space-sm">
          <FieldError id="type-sejour-erreur">{issue.text}</FieldError>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
        {TRIP_TYPES.map((type) => {
          const active = booking.tripType === type.id;
          return (
            <label
              key={type.id}
              className={`relative flex flex-col gap-1 p-space-md rounded cursor-pointer transition-all hover:bg-surface-container-low has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                active ? "bg-surface-container-low ring-2 ring-primary" : "bg-surface ring-1 ring-outline-variant/60"
              }`}
            >
              <span className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined text-[24px] ${active ? "text-primary" : "text-on-surface-variant"}`}
                >
                  {type.icon}
                </span>
                {active && (
                  <span aria-hidden="true" className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </span>
                )}
              </span>
              <span className="font-label-lg text-label-lg text-on-surface font-bold">{t.tripTypes[type.id].label}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">{t.tripTypes[type.id].text}</span>
              <input
                checked={active}
                className="sr-only"
                id={`type-sejour-${type.id}`}
                name="trip_type"
                onChange={() => update({ tripType: type.id })}
                type="radio"
                value={type.id}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type Counter = "adults" | "children" | "infants";

const COUNTERS: Counter[] = ["adults", "children", "infants"];

const CHILD_AGES = Array.from({ length: LIMITS.childAge.max - LIMITS.childAge.min + 1 }, (_, i) => LIMITS.childAge.min + i);

const NATIONALITIES = ["Française", "Belge", "Suisse", "Canadienne", "Autre"];
const VISA_REVIEWED = FAQ_ITEMS.find((item) => item.id === "visa")?.reviewed;

const sourceLink = "font-semibold text-primary underline underline-offset-2 hover:text-on-primary-fixed-variant hover:decoration-2";

/** Plafond d'une catégorie : sa propre limite, un bébé par adulte, et le total de voyageurs. */
function counterMax(b: Booking, key: Counter) {
  const own = key === "infants" ? Math.min(LIMITS.infants.max, b.adults) : LIMITS[key].max;
  return Math.min(own, b[key] + LIMITS.maxTravelers - travelersCount(b));
}

export function TravelersCard() {
  const t = useDatesText();
  const [booking, update] = useBooking();
  const session = useSession();
  const total = travelersCount(booking);
  const groupLimit = total >= LIMITS.maxTravelers || booking.adults >= LIMITS.adults.max || booking.children >= LIMITS.children.max;
  const infantLimit = booking.infants > 0 && booking.infants >= booking.adults;
  const agesIssue = issueOf(booking, t, "ages", useAttempted());
  const [blocked, setBlocked] = useState<"adults" | "group" | "infants" | null>(null);

  function change(key: Counter, delta: number) {
    const atMin = delta < 0 && booking[key] <= LIMITS[key].min;
    const atMax = delta > 0 && booking[key] >= counterMax(booking, key);
    if (atMin) return setBlocked(key === "adults" ? "adults" : null);
    if (atMax) return setBlocked(key === "infants" && infantLimit ? "infants" : "group");
    setBlocked(null);
    update((b) => {
      const value = Math.max(LIMITS[key].min, Math.min(counterMax(b, key), b[key] + delta));
      const patch: Partial<Booking> = { [key]: value };
      if (key === "adults" && b.infants > value) patch.infants = value;
      if (key === "children") patch.childAges = childAgesFor(value, b.childAges);
      return patch;
    });
  }

  function setAge(index: number, age: number | null) {
    update((b) => ({ childAges: b.childAges.map((a, i) => (i === index ? age : a)) }));
  }

  const hints: Record<Counter, string> = {
    adults: session ? t.holder(session.name) : t.oneAdult,
    children: t.childHint,
    infants: t.infantShort,
  };
  const limitNote = (key: Counter) =>
    key === "infants" && infantLimit
      ? "voyageurs-bebes"
      : groupLimit && booking[key] >= counterMax(booking, key)
        ? "voyageurs-groupe"
        : undefined;

  const btn =
    "w-11 h-11 rounded-full flex items-center justify-center font-bold text-headline-sm transition-transform active:scale-90 shadow-sm aria-disabled:bg-surface-container-highest aria-disabled:text-on-surface-variant aria-disabled:shadow-none aria-disabled:cursor-not-allowed aria-disabled:active:scale-100 aria-disabled:hover:bg-surface-container-highest";

  return (
    <div className={cardClass}>
      <CardTitle>{t.travelersTitle}</CardTitle>
      <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 mb-space-md">{t.travelersIntro}</p>
      <div className="space-y-space-sm">
        {COUNTERS.map((key) => {
          const { label, age } = t.counters[key];
          const value = booking[key];
          const hint = hints[key];
          return (
            <div key={key} className="flex items-center justify-between p-space-sm rounded bg-surface">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{label}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                    {age}
                  </span>
                </div>
                <span className="font-body-md text-body-md text-on-surface-variant mt-0.5">{hint}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  aria-describedby={key === "adults" && blocked === "adults" ? "voyageurs-adulte" : undefined}
                  aria-disabled={value <= LIMITS[key].min || undefined}
                  aria-label={t.remove(label)}
                  className={`${btn} bg-surface-container-low hover:bg-surface-container text-on-surface`}
                  onClick={() => change(key, -1)}
                  type="button"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                    remove
                  </span>
                </button>
                <span aria-live="polite" className="font-headline-md text-headline-md text-on-surface w-6 text-center font-bold">
                  {value}
                </span>
                <button
                  aria-describedby={limitNote(key)}
                  aria-disabled={value >= counterMax(booking, key) || undefined}
                  aria-label={t.add(label)}
                  className={`${btn} bg-primary hover:bg-on-primary-fixed-variant text-on-primary`}
                  onClick={() => change(key, 1)}
                  type="button"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                    add
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {booking.children > 0 && (
        <fieldset className="mt-space-sm p-space-sm rounded bg-surface">
          <legend className="float-left w-full mb-space-xs font-body-md text-body-md text-on-surface font-semibold">{t.agesLegend}</legend>
          <div className="clear-left grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
            {booking.childAges.map((childAge, i) => (
              <label key={i} className="flex flex-col gap-1 font-body-md text-body-md text-on-surface">
                {t.childN(i + 1)}
                <select
                  aria-describedby={agesIssue && childAge === null ? "ages-enfants-erreur" : undefined}
                  aria-invalid={childAge === null}
                  className={childAge === null ? invalidInputClass : inputClass}
                  id={`age-enfant-${i}`}
                  onChange={(e) => setAge(i, e.target.value ? Number(e.target.value) : null)}
                  value={childAge ?? ""}
                >
                  <option value="">{t.agePick}</option>
                  {CHILD_AGES.map((n) => (
                    <option key={n} value={n}>
                      {t.years(n)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">{t.ageRule}</p>
          {agesIssue && (
            <div className="mt-space-xs">
              <FieldError id="ages-enfants-erreur">{agesIssue.text}</FieldError>
            </div>
          )}
        </fieldset>
      )}

      {booking.infants > 0 && <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">{t.infantText}</p>}

      <div aria-live="polite">
        {blocked === "adults" && (
          <div className="mt-space-sm" id="voyageurs-adulte">
            <FieldError id="voyageurs-adulte-texte">{t.adultError}</FieldError>
          </div>
        )}
        {infantLimit && (
          <p id="voyageurs-bebes" className="mt-space-sm font-body-md text-body-md text-on-surface">
            {t.infantLimit}
          </p>
        )}
        {groupLimit && (
          <p
            id="voyageurs-groupe"
            className={`mt-space-sm p-space-sm rounded font-body-md text-body-md text-on-surface ${
              blocked === "group" ? "bg-error-container ring-1 ring-error" : "bg-tertiary-fixed/40"
            }`}
          >
            {blocked === "group" && <strong className="text-error">{t.limitReached} </strong>}
            {t.groupText(LIMITS.maxTravelers, LIMITS.adults.max, LIMITS.children.max)}
            <a className={sourceLink} href={WHATSAPP.href} rel="noopener noreferrer" target="_blank">
              {t.groupWhatsapp}
              <span className="sr-only"> {t.newTab}</span>
            </a>
            {t.groupOr}
            <a className={sourceLink} href={EMAIL.href}>
              {EMAIL.display}
            </a>
            .
          </p>
        )}
      </div>

      <div className="mt-space-md p-space-md bg-surface-container-low rounded flex flex-col gap-space-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <span className="flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface font-bold">
            <span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">
              badge
            </span>
            {t.formalities}
          </span>
          <label className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface">
            {t.nationality}
            <select
              className="h-10 pl-space-sm pr-8 rounded bg-surface-container-lowest ring-1 ring-outline-variant font-body-md text-body-md text-on-surface"
              onChange={(e) => update({ nationality: e.target.value })}
              value={booking.nationality}
            >
              <option value="">{t.toSpecify}</option>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>
                  {t.nationalities[n] ?? n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {t.passport}
          <a className={sourceLink} href={SOURCES.evisa.href} rel="noopener noreferrer" target="_blank">
            {t.visaSite}
            <span className="sr-only"> {t.newTab}</span>
          </a>
          {booking.nationality === "Française" ? (
            <>
              {t.andOn}
              <a className={sourceLink} href={SOURCES.diplomatieEntree.href} rel="noopener noreferrer" target="_blank">
                France Diplomatie
                <span className="sr-only"> {t.newTab}</span>
              </a>
            </>
          ) : (
            t.otherMinistry
          )}
          .{VISA_REVIEWED && t.reviewed(t.reviewedDate(VISA_REVIEWED))}
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 px-space-md rounded bg-surface ring-1 ring-outline-variant font-body-md text-body-md text-on-surface outline-none transition-shadow hover:ring-primary/70 focus:ring-2 focus:ring-primary";
const invalidInputClass = inputClass
  .replace("ring-outline-variant", "ring-2 ring-error")
  .replace("hover:ring-primary/70", "hover:ring-error");

export function ArrivalCard() {
  const t = useDatesText();
  const [booking, update] = useBooking();
  return (
    <div className={cardClass}>
      <CardTitle optional>{t.arrivalTitle}</CardTitle>
      <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 mb-space-md">{t.arrivalIntro}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface font-semibold">
          {t.fromCity}
          <input
            autoComplete="off"
            className={inputClass}
            maxLength={60}
            onChange={(e) => update({ arrivalFrom: e.target.value })}
            placeholder={t.fromCityPlaceholder}
            value={booking.arrivalFrom}
          />
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface font-semibold">
          {t.flightNumber}
          <input
            autoComplete="off"
            className={`${inputClass} uppercase placeholder:normal-case`}
            maxLength={12}
            onChange={(e) => update({ arrivalFlight: e.target.value.toUpperCase() })}
            placeholder={t.flightPlaceholder}
            value={booking.arrivalFlight}
          />
        </label>
      </div>
    </div>
  );
}

/** « Continuer » reste visible mais inactif tant qu'il manque quelque chose ; un clic montre les erreurs et place le focus sur la première. */
function MissingNote({ id, centered = false }: { id: string; centered?: boolean }) {
  const t = useDatesText();
  const [booking] = useBooking();
  const shown = useAttempted();
  const issues = stepIssues(booking, t);
  if (!issues.length) return null;
  return (
    <p
      className={`font-body-md text-body-md ${centered ? "text-center" : ""} ${shown ? "text-error font-semibold" : "text-on-surface-variant"}`}
      id={id}
      role={shown ? "alert" : undefined}
    >
      {shown ? t.complete : t.missing}
      {colonOf(t)}
      {t.joinList(issues.map((i) => i.short))}.
    </p>
  );
}

export function DatesContinue({ compact = false, describedBy }: { compact?: boolean; describedBy?: string }) {
  const t = useDatesText();
  const [booking] = useBooking();
  const ownId = useId();
  const noteId = describedBy ?? `${ownId}-manque`;
  const issues = stepIssues(booking, t);
  const cls = `w-full inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 text-center ${
    compact ? "h-12 px-space-md font-label-lg text-label-lg font-bold" : "py-space-md px-space-md font-headline-sm text-headline-sm"
  }`;
  const next = booking.destinationChosen
    ? { href: "/reservation/budget", step: t.stepBudget }
    : { href: "/reservation/destination", step: t.stepDestination };
  const label = compact ? (
    <span>
      <span aria-hidden="true">{t.continue}</span>
      <span className="sr-only">{t.continueTo(next.step)}</span>
    </span>
  ) : (
    <span>{t.continueTo(next.step)}</span>
  );
  const arrow = (
    <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
      arrow_forward
    </span>
  );

  if (issues.length) {
    const reveal = () => {
      setAttempted(true);
      const target = document.getElementById(issues[0].target);
      target?.focus({ preventScroll: true });
      target?.closest("label, div")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <button
          aria-describedby={noteId}
          aria-disabled="true"
          className={`${cls} bg-surface-container-highest text-on-surface-variant cursor-not-allowed hover:bg-surface-container-high`}
          onClick={reveal}
          type="button"
        >
          {label}
          {arrow}
        </button>
        {!describedBy && <MissingNote centered id={noteId} />}
      </div>
    );
  }
  return (
    <Link
      className={`${cls} bg-primary hover:bg-on-primary-fixed-variant text-on-primary shadow-lg hover:shadow-xl active:scale-95`}
      href={next.href}
    >
      {label}
      {arrow}
    </Link>
  );
}

/** Fil d'étapes : la destination compte comme validée quand elle vient d'une fiche circuit ou de l'étape 2. */
export function DatesStepper() {
  const t = useDatesText();
  const [booking] = useBooking();
  const done = booking.destinationChosen ? 2 : 0;
  return (
    <ol className="relative flex items-start justify-between" aria-label={t.stepsLabel}>
      <span aria-hidden="true" className="absolute left-6 right-6 top-4 h-1 bg-surface-container -translate-y-1/2">
        <span className={`block h-full bg-primary transition-all duration-500 ${done ? "w-[37%]" : "w-[12%]"}`}></span>
      </span>
      {t.steps.map((label, i) => {
        const n = i + 1;
        const current = n === 1;
        const validated = n === 2 && done === 2;
        return (
          <li key={label} aria-current={current ? "step" : undefined} className="relative z-10 flex flex-col items-center gap-1.5 min-w-0">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md ${
                current
                  ? "bg-primary text-on-primary shadow-md ring-4 ring-primary/20"
                  : validated
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant"
              }`}
            >
              {validated ? (
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  check
                </span>
              ) : (
                n
              )}
            </span>
            <span
              className={`font-label-md text-label-md tracking-tight text-center ${current || validated ? "text-primary font-bold" : "text-on-surface-variant"} ${current ? "" : "sr-only sm:not-sr-only"}`}
            >
              {label}
              {validated && <span className="sr-only">{t.validated}</span>}
            </span>
            {validated && (
              <span className="hidden sm:block font-body-md text-body-md text-on-surface-variant text-center">
                {DESTINATIONS[booking.destination].short}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** En-tête du résumé : le circuit ou la destination seulement s'ils sont déjà choisis. */
export function SummaryHero() {
  const t = useDatesText();
  const [booking] = useBooking();
  const circuit = circuitOf(booking);
  const title = circuit?.title ?? (booking.destinationChosen ? DESTINATIONS[booking.destination].name : t.heroCustom);
  const image = circuit?.image ?? {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpI-1YV5Jf5D63-P3enRhisfk8JqqRfyFrpW0IXc4rycTKK8HeGgPmboNdfnIZpmCkCpFC0T1qzvM563bpIvbQbBNZ7nzhdffEmzhsoOwxaWVvD_hjCv4MgpNS18odVo6Odrb9b7hJAJo8c6Z8N-yIqgjmVAG86n2f7Ra4MVmZ-x9LSvh257BEBJjOoUb_isykTvuZAFyOnVYs3wwbi3lHwVWIL6G6SQjlXIT6FxNh1ZM_Xe5plDA",
    alt: t.heroAlt,
  };
  return (
    <div className="relative h-36 w-full">
      <img className="w-full h-full object-cover" src={image.src} alt={image.alt} />
      <div className="absolute inset-0 bg-gradient-to-t from-on-surface/95 via-on-surface/50 to-on-surface/10"></div>
      <div className="absolute bottom-3 left-4 right-4 text-on-primary [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
        <span className="font-label-lg text-label-lg text-on-primary font-bold">{circuit ? t.heroCircuit : t.heroStay}</span>
        <h2 className="font-headline-md text-headline-md font-bold leading-tight">{title}</h2>
      </div>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-space-sm text-on-surface font-body-md text-body-md">
      <span className="text-on-surface-variant shrink-0">{label}</span>
      <span className="font-semibold text-right">{children}</span>
    </div>
  );
}

export function DatesSummary({ action }: { action?: React.ReactNode }) {
  const t = useDatesText();
  const [booking] = useBooking();
  const nights = nightsOf(booking);
  const circuit = circuitOf(booking);
  const trip = booking.tripType ? t.tripTypes[booking.tripType].label : null;
  return (
    <>
      <div className="bg-surface rounded p-space-sm flex flex-col gap-2">
        <SummaryRow label={t.rowDates}>
          <span className="text-primary font-bold">{t.range(booking)}</span>
        </SummaryRow>
        <SummaryRow label={t.rowDuration}>
          {t.duration(booking)}
          {circuit && nights > 0 && nights !== circuit.nights && (
            <span className="block font-normal text-on-surface-variant">{t.circuitNights(circuit.nights)}</span>
          )}
        </SummaryRow>
        {booking.flexible && !booking.travelMonth && <SummaryRow label={t.rowFlexibility}>{t.flexValue}</SummaryRow>}
        <SummaryRow label={t.rowTravelers}>
          {t.travelers(booking)}
          {booking.children > 0 && (
            <span className="block font-normal text-on-surface-variant">
              {booking.childAges.includes(null)
                ? t.agesToGive
                : t.childrenAges(booking.children, booking.childAges.map((a) => t.years(a ?? 0)).join(", "))}
            </span>
          )}
        </SummaryRow>
        <SummaryRow label={t.rowTripType}>{trip ?? <span className="font-normal text-on-surface-variant">{t.toChoose}</span>}</SummaryRow>
        {booking.destinationChosen && <SummaryRow label={t.rowDestination}>{DESTINATIONS[booking.destination].short}</SummaryRow>}
        {(booking.arrivalFrom || booking.arrivalFlight) && (
          <SummaryRow label={t.rowArrival}>{[booking.arrivalFrom, booking.arrivalFlight].filter(Boolean).join(" · ")}</SummaryRow>
        )}
      </div>
      {action}

      <div className="p-space-sm bg-secondary/10 rounded flex items-center gap-space-sm">
        <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            forest
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-md text-label-md text-secondary font-bold">{t.fund}</span>
          <p className="font-body-md text-body-md text-on-surface-variant leading-tight">{t.solidarity}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-2 pt-1 font-body-md text-body-md text-on-surface-variant">
        <li className="flex items-start gap-2">
          <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            event_available
          </span>
          {t.cancellation}
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            support_agent
          </span>
          {t.emergency}
        </li>
      </ul>
    </>
  );
}

/** Chaque modification est déjà enregistrée sur l'appareil ; ce badge le confirme après chaque changement. */
export function DraftStatus() {
  const t = useDatesText();
  const [booking] = useBooking();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const lastRaw = useRef<string | null>(null);
  const mountedAt = useRef(0);
  useEffect(() => {
    const raw = localStorage.getItem(BOOKING_KEY) ?? "";
    if (lastRaw.current === null) mountedAt.current = Date.now();
    const settling = Date.now() - mountedAt.current < 1500;
    if (lastRaw.current !== null && raw !== lastRaw.current && !settling) setSavedAt(new Date());
    lastRaw.current = raw;
  }, [booking]);
  return (
    <p
      className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary/10 text-secondary font-body-md text-body-md font-semibold"
      role="status"
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
        {savedAt ? "cloud_done" : "cloud"}
      </span>
      {savedAt ? t.draftAt(t.time(savedAt)) : t.draftAuto}
    </p>
  );
}

/** Première étape : le retour ramène au circuit d'origine, sinon à l'accueil. */
export function BackLink() {
  const t = useDatesText();
  const [booking] = useBooking();
  const circuit = circuitOf(booking);
  const target = circuit
    ? circuit.href.startsWith("/circuits/")
      ? { href: circuit.href, label: t.backCircuit }
      : { href: "/circuits", label: t.backCircuits }
    : { href: "/", label: t.backHome };
  return (
    <Link
      className="inline-flex items-center gap-1.5 h-11 pl-space-sm pr-space-md rounded-full text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high hover:text-primary transition-colors"
      href={target.href}
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
        arrow_back
      </span>
      {target.label}
    </Link>
  );
}

/** Mobile : résumé replié dans une barre fixe avec le bouton Continuer ; le détail se déplie au-dessus. */
export function DatesMobileBar() {
  const t = useDatesText();
  const [booking] = useBooking();
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const sync = () => {
      document.body.style.paddingBottom = `${bar.offsetHeight}px`;
    };
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      document.body.style.paddingBottom = "";
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-surface-container-lowest shadow-[0_-4px_16px_rgba(31,41,51,0.12)]"
      lang={t.html}
      ref={barRef}
    >
      {open && (
        <div
          className="max-h-[55vh] overflow-y-auto p-space-md flex flex-col gap-space-sm border-b border-outline-variant/50"
          id="resume-mobile"
        >
          <DatesSummary />
        </div>
      )}
      <div className="px-space-md py-space-sm flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-sm">
          <button
            aria-controls="resume-mobile"
            aria-expanded={open}
            className="flex-1 min-w-0 flex items-center justify-between gap-2 h-12 px-space-sm -ml-space-sm rounded text-left hover:bg-surface-container-low transition-colors"
            onClick={() => setOpen((o) => !o)}
            type="button"
          >
            <span className="min-w-0">
              <span className="block font-label-lg text-label-lg text-primary font-bold truncate">{t.range(booking)}</span>
              <span className="block font-body-md text-body-md text-on-surface-variant truncate">
                {`${t.travelersShort(travelersCount(booking))} · ${t.summary}`}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={`material-symbols-outlined text-[24px] text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}
            >
              expand_less
            </span>
          </button>
          <div className="w-36 shrink-0">
            <DatesContinue compact describedBy="manque-mobile" />
          </div>
        </div>
        <MissingNote id="manque-mobile" />
      </div>
    </div>
  );
}

/** Zone principale de l'étape 1 : porte la langue choisie pour les lecteurs d'écran et le titre de page. */
export function DatesMain({ className, children }: { className?: string; children: React.ReactNode }) {
  const t = useDatesText();
  return (
    <main className={className} lang={t.html}>
      <h1 className="sr-only">{t.pageTitle}</h1>
      {children}
    </main>
  );
}

export function DatesAside({ className, children }: { className?: string; children: React.ReactNode }) {
  const t = useDatesText();
  return (
    <aside aria-label={t.asideLabel} className={className}>
      {children}
    </aside>
  );
}

export function AdviceCard() {
  const t = useDatesText();
  return (
    <div className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-wrap items-center justify-between gap-space-sm">
      <div className="flex items-center gap-space-sm">
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            forum
          </span>
        </div>
        <div>
          <div className="font-label-lg text-label-lg text-on-surface font-bold">{t.adviceTitle}</div>
          <div className="font-body-md text-body-md text-on-surface-variant">{t.adviceText}</div>
        </div>
      </div>
      <a
        className="h-11 px-space-md rounded-full ring-1 ring-primary text-primary font-label-lg text-label-lg font-bold flex items-center gap-1.5 hover:bg-primary/5 transition-colors shrink-0"
        href={WHATSAPP.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
          chat
        </span>
        {t.adviceWhatsapp}
        <span className="sr-only"> {t.newTab}</span>
      </a>
    </div>
  );
}
