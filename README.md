# Crowdstaking

### Terminology

These few terms are used throughout the codebase.

- *BREAD* - xDAI derrived yield-bearing token.
- *Baking* - converting xDAI into BREAD.
- *Buttering* - converting BREAD to Curve LP tokens.
- *Buttered BREAD* - LP tokens from buttering staked to be used for voting.

## Development Setup
With foundry, nodejs etc installed

### Install dependencies

Node modules and foundry dependencies for compiling the smart contracts.

```sh
$ pnpm install
# run forge install from contracts directory
$ cd contracts
$ forge install
```

### Create .env.local file
```sh
$ cp .env.example .env.local
```

### Obtain necessary API keys
1. [Alchemy](https://www.alchemy.com) is used to resolve ENS domains. Copy the API key into `NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY` variable in `.env.local`.
2. [Reown](https://cloud.reown.com) is used for WalletConnect functionality. Create an "Appkit" and copy the project id into `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` variable in `.env.local`.

### Start local node

[Anvil](https://book.getfoundry.sh/reference/anvil/) starts a local fork from the most recent block based on the rpc url provided. The chain id is used to identify the anvil network in the app config. Block time is 5 seconds to match gnosis chain.

```sh
$ anvil --fork-url https://rpc.gnosis.gateway.fm --chain-id 31337 --block-time 5
```

### Setup wallet

1. We need a wallet for working locally. To set this up take the private key for the first wallet in the list displayed when you start anvil and add this account to metamask. This is the `DEV_ACCOUNT` address in the setup script.

2. Add the Anvil RPC url to metamask: `http://127.0.0.1:8545` with chain id `31337`

3. Because of how the distributor contract works the developer wallet needs to hold some bread before we deploy the contracts for us to be able to vote. The setup script takes care of this as well as funding the wallet with LP tokens which is needed for the LP locking feature.

```sh
$ pnpm run chain:setup
```

### Deploy contracts

We have the bread smart contracts in this repo as a submodule so we can compile and deploy any version we like to our anvil node.

```sh
$ cd contracts
$ forge script script/Deploy.s.sol:Deploy --broadcast --rpc-url http://localhost:8545 --private-key 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6 --legacy
```

This will run the solidity script in contracts/script/Deploy.s.sol to deploy both the yield distributor contract (voting) and the buttered bread contract (lp token locking). Dont' worry about the bread contract itself as it rarely changes, we can rely on the version available on the fork.

The contract addresses will be written to file as JSON in `contracts/out` so they can be imported in `src/chainConfig.ts`

### What else?

Dont forget to start the dev server

```sh
$ pnpm run dev
```
