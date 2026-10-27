import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (projectToken && host) {
	posthog.init(projectToken, {
		api_host: host,
		defaults: "2026-01-30",
		capture_exceptions: true,
		debug: process.env.NODE_ENV === "development",
	});
} else if (process.env.NODE_ENV === "development") {
	// Warn rather than throw so contributors without PostHog credentials can
	// still run the app; every capture call is a no-op until both are set.
	console.warn(
		"PostHog is disabled: set NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN and NEXT_PUBLIC_POSTHOG_HOST to enable analytics.",
	);
}
