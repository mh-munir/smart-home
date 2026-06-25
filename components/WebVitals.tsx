"use client";

import { useReportWebVitals } from "next/web-vitals";

type WebVitalsMetric = Parameters<typeof useReportWebVitals>[0] extends (
  metric: infer Metric,
) => void
  ? Metric
  : never;

/** Track all Core Web Vitals: LCP, CLS, FID, INP, TTFB, FCP */
const VITALS_TO_TRACK = new Set(["LCP", "CLS", "FID", "INP", "TTFB", "FCP"]);

function reportWebVitals(metric: WebVitalsMetric) {
  if (process.env.NODE_ENV !== "production") {
    if (VITALS_TO_TRACK.has(metric.name)) {
      console.log(
        `%c[WebVitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
        `color: ${metric.rating === "good" ? "#16a34a" : metric.rating === "needs-improvement" ? "#ca8a04" : "#dc2626"}; font-weight: bold`
      );
    }
    return;
  }

  // Send to Google Analytics (gtag)
  window.gtag?.("event", metric.name, {
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    navigation_type: metric.navigationType,
  });
}

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Only send to analytics in production
    if (typeof window === "undefined" || process.env.NODE_ENV !== "production") return;

    // Use requestIdleCallback to defer analytics work off the critical path.
    // Wrap the gtag call in a try-catch so any analytics failure is silent.
    const send = () => {
      try {
        reportWebVitals(metric);
      } catch {
        // silently ignore analytics errors
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(send, { timeout: 1500 });
    } else {
      // Fallback: use requestAnimationFrame + setTimeout(0) to yield to the browser
      // before doing non-critical analytics work
      requestAnimationFrame(() => {
        setTimeout(send, 0);
      });
    }
  });
  return null;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
