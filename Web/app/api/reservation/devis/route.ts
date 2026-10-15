import { NextResponse } from "next/server";
import { serverQuote } from "@/lib/reservation-server";

const MAX_BODY = 8_000;
const PROMO_ATTEMPTS = 10;
const WINDOW_MS = 60_000;
const attempts = new Map<string, { count: number; reset: number }>();

function tooManyPromoAttempts(ip: string) {
  const now = Date.now();
  if (attempts.size > 1_000) for (const [key, value] of attempts) if (value.reset < now) attempts.delete(key);
  const entry = attempts.get(ip);
  if (!entry || entry.reset < now) {
    attempts.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > PROMO_ATTEMPTS;
}

/** Devis de référence : recalcule les montants et vérifie le code promo côté serveur. */
export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY) return NextResponse.json({ error: "Requête trop volumineuse." }, { status: 413 });

  let body: { booking?: unknown; promo?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const promo = typeof body.promo === "string" ? body.promo : body.promo === null ? null : undefined;
  if (typeof promo === "string") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
    if (tooManyPromoAttempts(ip)) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 });
    }
  }

  return NextResponse.json(serverQuote(body.booking, promo), { headers: { "Cache-Control": "no-store" } });
}
