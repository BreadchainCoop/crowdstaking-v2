import * as Sentry from "@sentry/react";
import { useEffect } from "react";

export function useSentry() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN)
      Sentry.init({
        dsn: "https://66f7b14e1a7db13048d8bfa0b3bc8f40@o4508496099803136.ingest.de.sentry.io/4508496103342160",
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
        ],
        tracesSampleRate: 1.0,

        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost"],

        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
  }, []);
}
