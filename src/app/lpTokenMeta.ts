import { Hex } from "viem";

export type LPTokenMeta = {
  tokenName: string;
  poolName: string;
  inspectContract: string;
  visitPool: string;
};

export const lpTokenMeta: {
  [key: Hex]: LPTokenMeta;
} = {
  "0xf3d8f3de71657d342db60dd714c8a2ae37eac6b4": {
    tokenName: "BREAD/WXDAI LP",
    poolName: "BREAD/WXDAI",
    inspectContract:
      "https://gnosisscan.io/address/DEPLOYED_CONTRACT_ADDRESS#code",
    visitPool: "https://curve.fi/#/xdai/pools/factory-stable-ng-15",
  },
};
