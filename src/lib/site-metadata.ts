import { Metadata } from "next";

type MetadataConfig = {
  title?: string;
  description?: string;
  url?: string;
  siteName?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
};

const DEFAULT_METADATA = {
  title: "Bread Crowdstaking",
  description: "Bake and burn BREAD. Fund post-capitalist web3.",
  url: "https://fund.bread.coop/",
  siteName: "Bread Crowdstaking",
  image: {
    url: "https://bread.coop/preview.png?v=33",
    width: 2048,
    height: 1536,
    alt: "Bread Crowdstaking",
  },
} as const;

export const generateMetadata = (config?: MetadataConfig): Metadata => {
  const title = config?.title ?? DEFAULT_METADATA.title;
  const description = config?.description ?? DEFAULT_METADATA.description;
  const url = config?.url ?? DEFAULT_METADATA.url;
  const siteName = config?.siteName ?? DEFAULT_METADATA.siteName;
  const image = {
    url: config?.image?.url ?? DEFAULT_METADATA.image.url,
    width: config?.image?.width ?? DEFAULT_METADATA.image.width,
    height: config?.image?.height ?? DEFAULT_METADATA.image.height,
    alt: config?.image?.alt ?? DEFAULT_METADATA.image.alt,
  };

  return {
    metadataBase: new URL("https://fund.bread.coop/"),
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [image],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
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
};
