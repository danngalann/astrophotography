import { emitTelemetry, requestContext } from "../../lib/telemetry";

const MAX_BODY_BYTES = 4096;
const RATE_LIMIT = 120;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

const VITALS = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);
const RATINGS = new Set(["good", "needs-improvement", "poor"]);

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [key, entry] of hits) if (entry.resetAt < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function str(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.length > 0
    ? value.slice(0, max)
    : undefined;
}

function num(value: unknown, min: number, max: number): number | undefined {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
    ? value
    : undefined;
}

function pathOnly(value: unknown, max: number): string | undefined {
  const text = str(value, 500);
  if (!text) return undefined;
  return text.split(/[?#]/)[0].slice(0, max);
}

export async function POST(req: Request) {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return new Response(null, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 400 });
  }

  const context = requestContext(req.headers);
  if (rateLimited(context.ip)) return new Response(null, { status: 429 });

  const path = pathOnly(body.path, 200);
  if (!path?.startsWith("/")) return new Response(null, { status: 400 });

  const common = {
    ...context,
    path,
    session: str(body.session, 40),
  };

  if (body.event === "pageview") {
    emitTelemetry({
      event: "pageview",
      ...common,
      referrer: pathOnly(body.referrer, 200),
      lang: str(body.lang, 16),
      tz: str(body.tz, 64),
      viewport: str(body.viewport, 16),
      screen: str(body.screen, 16),
      dpr: num(body.dpr, 0, 10),
      connection: str(body.connection, 16),
    });
  } else if (body.event === "web_vital") {
    const name = str(body.name, 8);
    const value = num(body.value, 0, 1_000_000);
    const rating = str(body.rating, 24);
    if (!name || !VITALS.has(name) || value === undefined) {
      return new Response(null, { status: 400 });
    }
    emitTelemetry({
      event: "web_vital",
      ...common,
      name,
      value,
      rating: rating && RATINGS.has(rating) ? rating : undefined,
      nav_type: str(body.navType, 24),
    });
  } else {
    return new Response(null, { status: 400 });
  }

  return new Response(null, { status: 204 });
}
