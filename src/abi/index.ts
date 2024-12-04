import { sdaiAdaptorAbi } from "./SDAIAdaptor";
import { breadAbi } from "./Bread";
import { distributorAbi } from "./Distributor";
import { butteredBreadAbi } from "./ButteredBread";
import { multicall3Abi } from "./Multicall3";
import { erc20ABI } from "wagmi";

export const BREAD_ABI = breadAbi;
export const ERC20_ABI = erc20ABI;
export const MULTICALL3_ABI = multicall3Abi;
export const DISTRIBUTOR_ABI = distributorAbi;
export const SDAI_ADAPTOR_ABI = sdaiAdaptorAbi;
export const BUTTERED_BREAD_ABI = butteredBreadAbi;
