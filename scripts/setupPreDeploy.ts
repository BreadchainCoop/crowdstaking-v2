import { bakeBread, fundLpTokens } from "./lib";

/*
  This script sets a dev wallet up with bread and lp tokens

  Not relevant for this repo in it's current state but for when working on
  the application locally the dev wallet needs it's bread balance to be greater than zero before the contracts are deployed to be able to vote on the governance page.
*/
async function main() {
  // anvil wallets start with 10k of the native token eg eth, xdai depending on the chain
  // you can get the private key for the DEV_WALLET from your terminal immediately after
  // starting anvil and add it to metamask if you want.
  // It's also the wallet the mock connector is setup to use.

  // first we bake some bread with one of the anvil wallets
  await bakeBread();

  // then transfer some lp tokens to the same wallet so we can use the
  // lp token locking feature
  await fundLpTokens();
}

main();
