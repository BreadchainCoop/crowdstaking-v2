/** @type {import('next').NextConfig} */
const nextConfig = {
	// output: "export",
	env: {
		SUBGRAPH_API_KEY: process.env.SUBGRAPH_API_KEY,
	},
	images: {
		unoptimized: true,
	},
	webpack: (config) => {
		// Polyfills for Node.js core modules needed by WalletConnect v2
		config.resolve.fallback = {
			...config.resolve.fallback,
			buffer: require.resolve("buffer/"),
			events: require.resolve("events/"),
			stream: require.resolve("stream-browserify"),
			process: require.resolve("process/browser"),
		};

		return config;
	},
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

// Determine if we should upload source maps to Sentry
// Only upload in production deployments or when explicitly enabled via env var
// This prevents unnecessary uploads in preview/branch deployments and avoids
// potential network issues that could fail the build
const shouldUploadSourceMaps =
	process.env.CONTEXT === "production" ||
	process.env.ENABLE_SENTRY_UPLOAD === "true";

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

	// Uploads a larger set of source maps for better stack traces
	// Trade-off: increases build time but provides more detailed error context
	// Helps debug minified production code by mapping back to original source
	widenClientFileUpload: true,

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
