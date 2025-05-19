import {
  BREAD_ABI,
  BUTTERED_BREAD_ABI,
  DISTRIBUTOR_ABI,
  ERC20_ABI,
} from "../src/abi";
import { getChain } from "../src/chainConfig";
import {
  Hex,
  TransactionReceipt,
  createPublicClient,
  createTestClient,
  http,
  parseEther,
  parseUnits,
  walletActions,
} from "viem";
import { foundry } from "viem/chains";
import { BREAD_ADDRESS, BUTTER_ADDRESS } from "../src/constants";

// Wrapped into a function so we do not initialize on import, before all contracts are deployed
export function getAnvilConfig() {
  return getChain(31337);
}

export const DEV_ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const BUTTER_WHALE = "0xc2fB4B3EA53E10c88D193E709A81C4dc7aEC902e" as Hex;
const BREAD_OWNER = "0x918dEf5d593F46735f74F9E2B280Fe51AF3A99ad" as Hex;

// test client is useful as you can use it to send transactions
// with any wallet without having the private key
// https://viem.sh/docs/clients/test.html
export const testClient = createTestClient({
  chain: foundry,
  mode: "anvil",
  transport: http(),
}).extend(walletActions);

export const publicClient = createPublicClient({
  chain: foundry,
  transport: http(),
});

// bake bread with provided account
export async function bakeBread(
  account: Hex = DEV_ACCOUNT,
  value: number = 5000
) {
  await testClient.impersonateAccount({
    address: account,
  });

  try {
    const hash = await testClient.writeContract({
      account: account,
      address: BREAD_ADDRESS,
      abi: BREAD_ABI,
      functionName: "mint",
      // mint is a payable function so we pass the value like this
      value: parseEther(value.toString()),
      args: [account],
    });

    // get the hash then wait for the tx to complete
    const transaction = await publicClient.waitForTransactionReceipt({ hash });

    console.log(`Bread baked by ${account} - ${transaction.status}`);
  } catch (err) {
    console.log(err);
  }
}

// funds provided account with LP tokens
export async function fundLpTokens(account: Hex = DEV_ACCOUNT) {
  await testClient.impersonateAccount({
    address: account,
  });

  // sending the account with LP tokens some xdai first
  // so it can pay the gas fees to send the LP tokens
  await testClient.sendTransaction({
    account: account,
    to: BUTTER_WHALE,
    value: parseUnits("5", 18),
  });

  // impersonate the account with the LP tokens
  await testClient.impersonateAccount({
    address: BUTTER_WHALE,
  });

  await testClient.writeContract({
    account: BUTTER_WHALE,
    address: BUTTER_ADDRESS,
    abi: ERC20_ABI,
    functionName: "transfer",
    // this isn't a payable function so we pass the value as an argument
    args: [DEV_ACCOUNT, parseUnits("10000", 18)],
  });
}

export async function balanceOf(anvilAccount: Hex) {
  await testClient.impersonateAccount({
    address: anvilAccount,
  });

  const res = await publicClient.readContract({
    address: getAnvilConfig().BREAD.address,
    abi: BREAD_ABI,
    functionName: "balanceOf",
    args: [anvilAccount],
  });

  console.log(`Bread balance of ${anvilAccount} - ${res}`);
}

function generateVote() {
  const vote = Math.floor(Math.random() * 10) + 1;
  console.log(`Vote: ${vote}`);
  return vote;
}

export async function castVote(account: Hex = DEV_ACCOUNT) {
  await testClient.impersonateAccount({
    address: account,
  });

  try {
    const hash = await testClient.writeContract({
      address: getAnvilConfig().DISBURSER.address,
      abi: DISTRIBUTOR_ABI,
      functionName: "castVote",
      account: account,
      args: [
        [
          BigInt(generateVote()),
          BigInt(generateVote()),
          BigInt(generateVote()),
          BigInt(generateVote()),
          BigInt(generateVote()),
          BigInt(generateVote()),
          BigInt(generateVote()),
        ],
      ],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status !== "success") {
      console.log(`Failed to vote: ${account} - `, Object.keys(receipt));

      await logRevertReason(receipt);

      return;
    }

    console.log(`vote cast: ${account} - ${receipt.status}`);
  } catch (err) {
    console.log(err);
  }
}

export async function getCurrentDistribution() {
  const res = await publicClient.readContract({
    address: getAnvilConfig().DISBURSER.address,
    abi: DISTRIBUTOR_ABI,
    functionName: "getCurrentVotingDistribution",
  });

  console.log(`Current distribution: - ${res}`);
}

export async function setClaimer(newClaimer: Hex) {
  await testClient.impersonateAccount({
    address: BREAD_OWNER,
  });

  try {
    const hash = await testClient.writeContract({
      address: getAnvilConfig().BREAD.address,
      abi: BREAD_ABI,
      functionName: "setYieldClaimer",
      account: BREAD_OWNER,
      args: [newClaimer],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "reverted") {
      console.log("setYieldClaimer reverted: ", receipt);
    }
    console.log("setYieldClaimer: ", receipt.status);
  } catch (err) {
    console.log("failed to set claimer: ", err);
  }
}

export async function lockLpTokens(account: Hex = DEV_ACCOUNT) {
  await testClient.impersonateAccount({
    address: account,
  });

  try {
    const hash = await testClient.writeContract({
      account: account,
      address: getAnvilConfig().BUTTER.address,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [getAnvilConfig().BUTTERED_BREAD.address, parseUnits("5000", 18)],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status !== "success") {
      await logRevertReason(receipt);
      return;
    }
    console.log("allowance transaction: ", receipt.status);
  } catch (err) {
    console.log("allowance transaction failed: ", err);
  }

  try {
    const hash = await testClient.writeContract({
      account: account,
      address: getAnvilConfig().BUTTERED_BREAD.address,
      abi: BUTTERED_BREAD_ABI,
      functionName: "deposit",
      args: [getAnvilConfig().BUTTER.address, parseUnits("5000", 18)],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status !== "success") {
      await logRevertReason(receipt);
      return;
    }
    console.log("deposit transaction: ", receipt.status);
  } catch (err) {
    console.log("deposit transaction failed: ", err);
  }
}

export async function distributeYield(account: Hex = DEV_ACCOUNT) {
  await testClient.impersonateAccount({
    address: account,
  });

  try {
    const hash = await testClient.writeContract({
      account: account,
      address: getAnvilConfig().DISBURSER.address,
      abi: DISTRIBUTOR_ABI,
      functionName: "distributeYield",
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status !== "success") {
      await logRevertReason(receipt);
      return;
    }
    console.log("distributeYield transaction: ", receipt.status);
  } catch (err) {
    console.log("distributeYield transaction failed: ", err);
  }
}

export async function mineBlocks(blocks: number) {
  await testClient.mine({ blocks });
}

async function logRevertReason(receipt: TransactionReceipt) {
  const transaction = await publicClient.getTransaction({
    hash: receipt.transactionHash,
  });

  await publicClient
    .call({ data: transaction.input, blockNumber: receipt.blockNumber })
    .catch((error) => {
      const revertReason = error.data;
      console.log("Revert error:", error);
      console.log("Revert reason:", revertReason);
    });
}
