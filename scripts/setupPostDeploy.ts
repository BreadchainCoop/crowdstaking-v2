import {
  setClaimer,
  castVote,
  lockLpTokens,
  anvilConfig,
  distributeYield,
  mineBlocks,
} from "./lib";

async function main() {
  const DISTRIBUTOR_ADDRESS = anvilConfig.DISBURSER.address;
  if (DISTRIBUTOR_ADDRESS === "0x")
    throw new Error("invalid DISTRIBUTOR_ADDRESS");

  await lockLpTokens();

  await setClaimer(DISTRIBUTOR_ADDRESS);

  await castVote();

  await mineBlocks(60);

  await distributeYield();
}

main();
