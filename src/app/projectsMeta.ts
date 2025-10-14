import { Hex } from "viem";

export type ProjectMeta = {
  name: string;
  order: number;
  description: string;
  logoSrc: string;
  active: boolean;
  link: string;
};

export const projectsMeta: {
  [key: Hex]: ProjectMeta;
} = {
  "0x7E1367998e1fe8Fab8f0bbF41e97cD6E0C891B64": {
    name: "Labour DAO",
    order: 1,
    description:
      "A DAO supporting workers who want to organize in web3 and out.",
    logoSrc: "project/labor_dao.png",
    active: false,
    link: "https://breadchain.notion.site/Labor-DAO-cbb5a4c374494cada57ad6b1aff21323",
  },
  "0x5405e2D4D12AAdB57579E780458c9a1151b560F1": {
    name: "Symbiota",
    order: 1,
    description:
      "Event-focused organisations devoted to new forms of culture and enquiry.",
    logoSrc: "project/symbiota.png",
    active: true,
    link: "https://gap.karmahq.xyz/project/symbiota",
  },
  "0x5c22B3F03b3d8FFf56C9B2e90151512Cb3F3dE0F": {
    name: "Crypto Commons Acc",
    order: 2,
    description:
      "Creating research and events on decentralized tech and the commons.",
    logoSrc: "project/cca.png",
    active: true,
    link: "https://gap.karmahq.xyz/project/crypto-commons-association",
  },
  "0xA232F16aB37C9a646f91Ba901E92Ed1Ba4B7b544": {
    name: "Citizen Wallet",
    order: 3,
    description: "Open source tool stack to support Web3 community currencies.",
    logoSrc: "project/citizen_wallet.png",
    active: true,
    link: "https://gap.karmahq.xyz/project/citizen-wallet---an-open-source-wallet-with-account-abstraction-for-your-community-1",
  },
  "0x918dEf5d593F46735f74F9E2B280Fe51AF3A99ad": {
    name: "Bread Coop Core",
    order: 6,
    description:
      "The core team developing the tech and design used by Bread Coop.",
    logoSrc: "project/core.png",
    active: true,
    link: "https://docs.bread.coop/solidarity-primitives/crowdstaking/member-projects/bread-co-op",
  },
  "0x6A148b997e6651237F2fCfc9E30330a6480519f0": {
    name: "Bread Coop Treasury",
    order: 7,
    description:
      "A co-owned treasury in Bread Coop used for grants and sponsorships.",
    logoSrc: "project/treasury.png",
    active: true,
    link: "https://docs.bread.coop/solidarity-primitives/crowdstaking/member-projects/shared-treasury",
  },
  "0x68060388C7D97B4bF779a2Ead46c86e5588F073f": {
    name: "ReFi DAO",
    order: 5,
    description: "Global network driving the Regenerative Finance movement.",
    logoSrc: "project/refi_dao.png",
    active: false,
    link: "https://breadchain.notion.site/ReFi-DAO-1540ad9b1279805bb54de4ffd0d5d52d",
  },
  "0xFCb81c1B0e0D4FEa01e5A0fbf0aebb91e78A67E1": {
    name: "Regen Coordination",
    order: 4,
    description: "Global network driving the Regenerative Finance movement.",
    logoSrc: "project/regen.png",
    active: true,
    link: "https://gap.karmahq.xyz/community/regen-coordination",
  },
  "0x1Bd2212C9aA332d22D61a0Be6bCc55b2A1de6C63": {
    name: "Gardens",
    order: 5,
    description: "Next generation community governance.",
    logoSrc: "project/gardens.png",
    active: true,
    link: "https://gap.karmahq.xyz/project/gardens-",
  },
};
