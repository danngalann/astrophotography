"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

const ENDPOINT = "/api/telemetry";
let firstPageview = true;

function sessionId(): string | undefined {
  try {
    let id = sessionStorage.getItem("telemetry-session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("telemetry-session", id);
    }
    return id;
  } catch {
    return undefined;
  }
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify({
    ...payload,
    session: sessionId(),
    path: window.location.pathname,
  });
  try {
    if (navigator.sendBeacon?.(ENDPOINT, body)) return;
    void fetch(ENDPOINT, { method: "POST", body, keepalive: true });
  } catch {
    // Telemetry must never break the page.
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string } }
    ).connection;
    const referrer = firstPageview ? document.referrer : "";
    firstPageview = false;
    send({
      event: "pageview",
      referrer,
      lang: navigator.language,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screen: `${screen.width}x${screen.height}`,
      dpr: window.devicePixelRatio,
      connection: connection?.effectiveType,
    });
  }, [pathname]);

  useReportWebVitals((metric) => {
    send({
      event: "web_vital",
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      navType: metric.navigationType,
    });
  });

  return null;
}
