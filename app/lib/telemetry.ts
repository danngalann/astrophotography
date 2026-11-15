import { createHash } from "node:crypto";

export const TELEMETRY_SITE = "astrophotography";

const BOT_PATTERN =
  /bot|crawl|spider|slurp|headless|lighthouse|curl\/|wget\/|python-requests|python-urllib|go-http-client|axios|node-fetch|okhttp|httpclient|scrapy|preview|monitor|uptime/i;

export type ParsedUserAgent = {
  browser: string;
  browser_version: string;
  os: string;
  device: "mobile" | "tablet" | "desktop" | "bot";
};

export function parseUserAgent(ua: string): ParsedUserAgent {
  const browsers: [string, RegExp][] = [
    ["Edge", /\bEdg(?:e|A|iOS)?\/(\d+)/],
    ["Opera", /\b(?:OPR|Opera)\/(\d+)/],
    ["Samsung Internet", /\bSamsungBrowser\/(\d+)/],
    ["Firefox", /\b(?:Firefox|FxiOS)\/(\d+)/],
    ["Chrome", /\b(?:Chrome|CriOS)\/(\d+)/],
    ["Safari", /\bVersion\/(\d+).*Safari\//],
  ];
  let browser = "Other";
  let browser_version = "";
  for (const [name, pattern] of browsers) {
    const match = ua.match(pattern);
    if (match) {
      browser = name;
      browser_version = match[1];
      break;
    }
  }

  let os = "Other";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/CrOS/i.test(ua)) os = "ChromeOS";
  else if (/Linux|X11/i.test(ua)) os = "Linux";

  let device: ParsedUserAgent["device"] = "desktop";
  if (!ua || BOT_PATTERN.test(ua)) device = "bot";
  else if (
    /iPad|Tablet/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua))
  )
    device = "tablet";
  else if (/Mobi|iPhone|iPod|Android/i.test(ua)) device = "mobile";

  return { browser, browser_version, os, device };
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

export function visitorId(ip: string, ua: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${day}|${ip}|${ua}`)
    .digest("hex")
    .slice(0, 16);
}

export function requestContext(headers: Headers) {
  const ip = clientIp(headers);
  const ua = headers.get("user-agent") ?? "";
  return {
    ip,
    visitor: visitorId(ip, ua),
    ua: ua.slice(0, 300),
    ...parseUserAgent(ua),
    accept_language: (headers.get("accept-language") ?? "").slice(0, 64),
  };
}

export function emitTelemetry(event: Record<string, unknown>) {
  try {
    console.log(
      JSON.stringify({
        type: "telemetry",
        site: TELEMETRY_SITE,
        ts: new Date().toISOString(),
        ...event,
      }),
    );
  } catch {
    // Telemetry must never break a request.
  }
}
