import clsx from "clsx";

import { pressStart, redhat } from "@/app/core/components/Fonts";
import { AppProvider } from "./core/hooks/AppProvider";

import "./app.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import Script from "next/script";
import { ReactNode } from "react";
import Header from "./core/components/Header/Header";
import { ModalPresenter } from "./core/components/Modal/ModalPresenter";
import { Toaster } from "./core/components/Toaster/Toaster";
import { Footer } from "./core/components/Footer";
import { parseFeatureVar } from "./core/util/parseFeatureVar";

const features = {
  governancePage: parseFeatureVar(process.env.FEATURE_GOVERNANCE),
  breadCounter: parseFeatureVar(process.env.FEATURE_BREAD_COUNTER),
  recastVote: parseFeatureVar(process.env.FEATURE_RECAST_VOTE),
  votingHistory: parseFeatureVar(process.env.FEATURE_VOTING_HISTORY),
  lpVaults: parseFeatureVar(process.env.FEATURE_LP_VAULTS),
  bridge: parseFeatureVar(process.env.FEATURE_BRIDGE),
};

export type Features = {
  [K in keyof typeof features]: boolean;
};

export const metadata: Metadata = {
	metadataBase: new URL("https://fund.bread.coop/"),
	title: "Bread Crowdstaking",
	description: "Bake and burn BREAD. Fund post-capitalist web3.",
	openGraph: {
		title: "Bread Crowdstaking",
		description: "Bake and burn BREAD. Fund post-capitalist web3.",
		url: "https://fund.bread.coop/",
		siteName: "Bread Crowdstaking",
		images: [
			{
				url: "https://fund.bread.coop/preview.png",
				width: 1200,
				height: 630,
				alt: "Bread Crowdstaking",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Bread Crowdstaking",
		description: "Bake and burn BREAD. Fund post-capitalist web3.",
		images: ["https://fund.bread.coop/preview.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
		],
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
	manifest: "/manifest.json",
	themeColor: "#ffffff",
	other: {
		"msapplication-TileColor": "#da532c",
	},
};

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
				<link rel="icon" type="image/svg+xml" href="/favicon.ico" />

				<Script
					defer
					data-domain="app.breadchain.xyz"
					src="https://analytics.breadchain.xyz/js/script.tagged-events.outbound-links.js"
				/>
			</head>

      <body
        className={clsx(
          "relative bg-[#F0F0F0] dark:bg-breadgray-grey100 dark:text-breadgray-white",
          pressStart.variable,
          redhat.variable
        )}
      >
        <AppProvider features={features}>
          <Layout>{children}</Layout>
        </AppProvider>
      </body>
    </html>
  );
}

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col overflow-x-hidden md:overflow-x-visible">
			<Header />
			<main className="grow relative">
				<ModalPresenter />
				<Toaster />
				{children}
			</main>
			<Footer />
		</div>
	);
}
