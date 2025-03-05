import { Hex } from "viem";
import {
  BREAD_ADDRESS,
  BUTTER_ADDRESS,
  BUTTERED_BREAD_ADDRESS,
} from "./constants";

interface IToken {
  address: Hex;
  symbol: string;
  decimals: number;
}

export interface ChainConfiguration {
  ID: number;
  NETWORK_STRING: string;
  EXPLORER: string;
  BREAD: IToken;
  DISBURSER: {
    address: Hex;
  };
  BUTTER: {
    address: Hex;
  };
  BUTTERED_BREAD: {
    address: Hex;
  };
  SDAI_ADAPTOR: {
    address: Hex;
  };
}

export interface IConfig {
  [chainId: number]: ChainConfiguration;
  DEFAULT: ChainConfiguration;
}

function makeAllConfigs() {
  let DISTRIBUTOR_DEPLOYED = { ADDRESS: "0x" };
  let BUTTERED_BREAD_DEPLOYED = { ADDRESS: "0x" };

  if (process.env.NODE_ENV === "development") {
    DISTRIBUTOR_DEPLOYED = require("../contracts/out/DISTRIBUTOR.json");
    BUTTERED_BREAD_DEPLOYED = require("../contracts/out/BUTTERED_BREAD.json");
  }

  const sepolia: ChainConfiguration = {
    ID: 11155111,
    NETWORK_STRING: "Sepolia",
    EXPLORER: "NONE",
    BREAD: {
      symbol: "BREAD",
      decimals: 18,
      address: "0x689666145b8e80f705b87f4e4190820d9a4c1646",
    },
    DISBURSER: {
      address: "0xeE95A62b749d8a2520E0128D9b3aCa241269024b",
    },
    BUTTERED_BREAD: {
      address: "0x",
    },
    BUTTER: {
      address: BUTTER_ADDRESS,
    },
    SDAI_ADAPTOR: {
      address: "0x",
    },
  };

  const gnosis: ChainConfiguration = {
    ID: 100,
    NETWORK_STRING: "Gnosis",
    EXPLORER: "https://gnosisscan.io",
    BREAD: {
      symbol: "BREAD",
      decimals: 18,
      address: BREAD_ADDRESS,
    },
    DISBURSER: {
      address: "0xeE95A62b749d8a2520E0128D9b3aCa241269024b",
    },
    BUTTERED_BREAD: {
      address: BUTTERED_BREAD_ADDRESS,
    },
    BUTTER: {
      address: BUTTER_ADDRESS,
    },
    SDAI_ADAPTOR: {
      address: "0xD499b51fcFc66bd31248ef4b28d656d67E591A94",
    },
  };

  const anvil: ChainConfiguration = {
    ID: 31337,
    NETWORK_STRING: "Anvil",
    EXPLORER: "https://gnosisscan.io",
    BREAD: {
      symbol: "BREAD",
      decimals: 18,
      address: BREAD_ADDRESS,
    },
    DISBURSER: {
      address:
        (!!DISTRIBUTOR_DEPLOYED && (DISTRIBUTOR_DEPLOYED.ADDRESS as Hex)) ||
        "0x",
    },
    BUTTERED_BREAD: {
      address:
        (!!BUTTERED_BREAD_DEPLOYED &&
          (BUTTERED_BREAD_DEPLOYED.ADDRESS as Hex)) ||
        "0x",
    },
    BUTTER: {
      address: BUTTER_ADDRESS,
    },
    SDAI_ADAPTOR: {
      address: "0xD499b51fcFc66bd31248ef4b28d656d67E591A94",
    },
  };

  const developmentConfig: IConfig = {
    100: gnosis,
    11155111: sepolia,
    31337: anvil,
    DEFAULT: anvil,
  };

  const stagingConfig: IConfig = {
    100: gnosis,
    11155111: sepolia,
    DEFAULT: sepolia,
  };

  const prodConfig: IConfig = {
    100: gnosis,
    DEFAULT: gnosis,
  };

  return {
    developmentConfig,
    stagingConfig,
    prodConfig,
  };
}

export function getChain(id: number | "DEFAULT"): ChainConfiguration {
  const { developmentConfig, stagingConfig, prodConfig } = makeAllConfigs();
  if (process.env.NODE_ENV === "development") {
    return developmentConfig[id] || developmentConfig["DEFAULT"];
  }

  if (process.env.NEXT_PUBLIC_TESTNET === "true") {
    return stagingConfig[id] || stagingConfig["DEFAULT"];
  }

  return prodConfig[id] || prodConfig["DEFAULT"];
}

export function isChainSupported(id: number) {
  const { developmentConfig, stagingConfig, prodConfig } = makeAllConfigs();
  if (process.env.NODE_ENV === "development") {
    return !!developmentConfig[id];
  }

  if (process.env.NEXT_PUBLIC_TESTNET === "true") {
    return !!stagingConfig[id];
  }

  return !!prodConfig[id];
}
