// Netlify sets NETLIFY=true. Its production builds also generate Sentry
// source maps, and running type-check + lint in the same `next build` pushes
// the container past its memory cap (killed with exit 137). GitHub CI
// (integration.yml) still runs `pnpm lint` and a full `pnpm build` with
// type-checking on every push/PR to main and development, so skip both here
// only on Netlify.
const isNetlify = process.env.NETLIFY === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
	// output: "export",
	eslint: { ignoreDuringBuilds: isNetlify },
	typescript: { ignoreBuildErrors: isNetlify },
	env: {
		SUBGRAPH_API_KEY: process.env.SUBGRAPH_API_KEY,
	},
	images: {
		unoptimized: true,
	},
	experimental: {
		// @breadcoop/ui@2.0.4 added sideEffects:false, but the Home route's
		// specific mix of imports still doesn't tree-shake cleanly without
		// this (verified: removing it regresses `/` from ~306kB to ~526kB
		// First Load JS while other routes stay fine). Keep it.
		optimizePackageImports: ["@breadcoop/ui"],
	},
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

// Generate + upload source maps to Sentry only when explicitly enabled.
// This used to be on for every Netlify production deploy
// (CONTEXT=production), but generating + uploading them in `next build`
// got the build killed for running out of memory (exit 134 at a 4 GB heap,
// exit 137 at 6 GB). Preview builds with source maps off pass, so production
// now matches them. Trade-off: Sentry shows minified stack traces. Set
// ENABLE_SENTRY_UPLOAD=true to opt back in.
const shouldUploadSourceMaps = process.env.ENABLE_SENTRY_UPLOAD === "true";

module.exports = withSentryConfig(module.exports, {
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options

	// Sentry organization slug - identifies your Sentry account
	org: "breadchain-cooperative",

	// Sentry project slug - identifies which project to send errors to
	project: "crowdstaking-app",

	// Controls console output during build
	// Only show logs in CI environments (like Netlify) for debugging
	// Keeps local builds cleaner by suppressing Sentry logs
	silent: !process.env.CI,

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// When true, also uploads source maps for Next.js framework chunks
	// (better stack traces inside Next internals). Kept off to limit memory
	// if source-map uploads are re-enabled via ENABLE_SENTRY_UPLOAD.
	widenClientFileUpload: false,

	// Routes browser requests to Sentry through Next.js instead of directly
	// Bypasses ad-blockers that might block sentry.io domain
	// Uses /monitoring route as a proxy to Sentry's ingest endpoint
	// Note: This increases server load and hosting costs as requests go through your server
	tunnelRoute: "/monitoring",

	// Removes source maps from the client bundle sent to users
	// Prevents users from viewing your original source code in browser dev tools
	// Source maps are only uploaded to Sentry for internal debugging
	hideSourceMaps: true,

	// Removes Sentry's debug logging statements from production bundles
	// Reduces bundle size by tree-shaking console.log statements
	// Sentry will still capture errors, just won't log debug info to console
	disableLogger: true,

	// Automatically instruments Vercel Cron Monitors
	// Tracks scheduled job execution and failures in Sentry
	// Note: Currently only works with Pages Router, not App Router route handlers
	automaticVercelMonitors: true,

	// NEW: Skip source map upload in non-production environments
	// When true, performs a "dry run" - validates config but doesn't upload
	// Prevents build failures from Sentry network issues in preview deployments
	// Only actually uploads when shouldUploadSourceMaps is true
	dryRun: !shouldUploadSourceMaps,

	// Fully disable source-map GENERATION unless uploads are enabled. `dryRun`
	// only skips the upload — the plugin still generates maps, which is
	// memory-heavy and OOMs the Netlify builder on the Privy/wagmi/LiFi
	// graph (see shouldUploadSourceMaps above).
	sourcemaps: {
		disable: !shouldUploadSourceMaps,
	},

	// Custom error handler for Sentry CLI failures
	// Logs warnings instead of failing the entire build
	// Ensures deployment succeeds even if Sentry upload has network issues
	// The build will continue and your app will deploy successfully
	errorHandler: (err, invokeErr, compilation) => {
		console.warn("Sentry CLI error (non-blocking):", err.message);
	},

	// Disables Sentry's anonymous usage telemetry
	// Reduces network requests during build
	// Slightly faster builds and one less potential point of failure
	telemetry: false,

	// Controls release finalization behavior
	// finalize: false means don't mark the release as "complete" in Sentry
	// Useful when you want to associate additional data with the release later
	// Also makes the upload process more resilient to failures
	release: {
		finalize: false,
	},
});
