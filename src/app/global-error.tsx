"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.captureException(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Error statusCode={undefined as any} />
      </body>
    </html>
  );
}
