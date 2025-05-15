import { Hex } from "viem";

export type ProjectMeta = {
  name: string;
  order: number;
  ydIndex: number; // the index of this project in the deployed YieldDistributor contract
  description: string;
  logoSrc: string;
  links: {
    notion: string;
  };
};

export const projectsMeta: {
  [key: Hex]: ProjectMeta;
} = {
  "0x7E1367998e1fe8Fab8f0bbF41e97cD6E0C891B64": {
    name: "Labour DAO",
    order: 1,
    ydIndex: 0,
    description:
      "A DAO supporting workers who want to organize in web3 and out.",
    logoSrc: "project/labor_dao.png",
    links: {
      notion:
        "https://breadchain.notion.site/Labor-DAO-cbb5a4c374494cada57ad6b1aff21323",
    },
  },
  "0x5405e2D4D12AAdB57579E780458c9a1151b560F1": {
    name: "Symbiota",
    order: 2,
    ydIndex: 1,
    description:
      "Event-focused organisations devoted to new forms of culture and enquiry.",
    logoSrc: "project/symbiota.png",
    links: {
      notion:
        "https://breadchain.notion.site/Symbiota-Coop-63a0ddf2702b4239b23d7eb0bf3141b7",
    },
  },
  "0x5c22B3F03b3d8FFf56C9B2e90151512Cb3F3dE0F": {
    name: "Crypto Commons Acc",
    order: 3,
    ydIndex: 2,
    description:
      "Creating research and events on decentralized tech and the commons.",
    logoSrc: "project/cca.png",
    links: {
      notion:
        "https://breadchain.notion.site/Crypto-Commons-Association-77818c4f425942479835e8bfec0b951b",
    },
  },
  "0xA232F16aB37C9a646f91Ba901E92Ed1Ba4B7b544": {
    name: "Citizen Wallet",
    order: 4,
    ydIndex: 6,
    description: "Open source tool stack to support Web3 community currencies.",
    logoSrc: "project/citizen_wallet.png",
    links: {
      notion:
        "https://breadchain.notion.site/Citizen-Wallet-0139bb3030f7442a8804459d717adb52?pvs=74",
    },
  },
  "0x918dEf5d593F46735f74F9E2B280Fe51AF3A99ad": {
    name: "Breadchain Core",
    order: 6,
    ydIndex: 4,
    description:
      "The core team developing the tech and design used by Breadchain.",
    logoSrc: "project/core.png",
    links: {
      notion:
        "https://breadchain.notion.site/Breadchain-Core-208dcd81c6da49d1b1b00635f727d902",
    },
  },
  "0x6A148b997e6651237F2fCfc9E30330a6480519f0": {
    name: "Breadchain Treasury",
    order: 7,
    ydIndex: 3,
    description:
      "A co-owned treasury in Breadchain used for grants and sponsorships.",
    logoSrc: "project/treasury.png",
    links: {
      notion:
        "https://breadchain.notion.site/Breadchain-Core-208dcd81c6da49d1b1b00635f727d902",
    },
  },
  "0x68060388C7D97B4bF779a2Ead46c86e5588F073f": {
    name: "ReFi DAO",
    order: 5,
    ydIndex: 5,
    description: "Global network driving the Regenerative Finance movement.",
    logoSrc: "project/refi_dao.png",
    links: {
      notion:
        "https://breadchain.notion.site/ReFi-DAO-1540ad9b1279805bb54de4ffd0d5d52d",
    },
  },
};
