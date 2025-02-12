import { Hex } from "viem";
import { BUTTER_ADDRESS, BUTTERED_BREAD_ADDRESS } from "@/constants";

export type LPTokenMeta = {
  tokenName: string;
  poolName: string;
  inspectContract: string;
  visitPool: string;
};

export const lpTokenMeta: {
  [key: Hex]: LPTokenMeta;
} = {
  [BUTTER_ADDRESS]: {
    tokenName: "BREAD/WXDAI LP",
    poolName: "BREAD/WXDAI",
    inspectContract:
      "https://gnosisscan.io/address/" + BUTTERED_BREAD_ADDRESS + "#code",
    visitPool: "https://curve.fi/#/xdai/pools/factory-stable-ng-15",
  },
};
