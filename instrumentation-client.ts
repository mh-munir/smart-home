import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const logRocketAppId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;

if (isProduction && sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NEXT_PUBLIC_APP_ENV || "production",
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || 0.1),
    replaysSessionSampleRate: Number(
      process.env.NEXT_PUBLIC_SENTRY_REPLAY_SAMPLE_RATE || 0.05,
    ),
    replaysOnErrorSampleRate: Number(
      process.env.NEXT_PUBLIC_SENTRY_REPLAY_ERROR_SAMPLE_RATE || 1,
    ),
  });
}

if (isProduction && logRocketAppId) {
  import("logrocket").then(({ default: LogRocket }) => {
    LogRocket.init(logRocketAppId, {
      release: process.env.NEXT_PUBLIC_APP_VERSION,
    });

    if (sentryDsn) {
      LogRocket.getSessionURL((sessionURL) => {
        Sentry.setContext("LogRocket", { sessionURL });
      });
    }
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
