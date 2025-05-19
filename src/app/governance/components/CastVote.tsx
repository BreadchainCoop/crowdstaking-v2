import { ReactNode, useEffect } from "react";
import Button from "@/app/core/components/Button";
import { AccountMenu } from "@/app/core/components/Header/AccountMenu";
import { CheckIcon } from "@/app/core/components/Icons/CheckIcon";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { useModal } from "@/app/core/context/ModalContext";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { useWriteContract, useSimulateContract } from "wagmi";
import SafeAppsSDK from "@safe-global/safe-apps-sdk/dist/src/sdk";
import { TransactionStatus } from "@safe-global/safe-apps-sdk/dist/src/types";
import {
  TConnectedUserState,
  TUserConnected,
} from "@/app/core/hooks/useConnectedUser";
import { DISTRIBUTOR_ABI } from "@/abi";

export function CastVotePanel({
  user,
  userVote,
  userHasVoted,
  userCanVote,
  isSafe,
  isRecasting,
  setIsRecasting,
  resetFormState,
}: {
  user: TConnectedUserState;
  userVote: Array<number>;
  userHasVoted: boolean;
  userCanVote: boolean;
  isSafe: boolean;
  isRecasting: boolean;
  setIsRecasting: (val: boolean) => void;
  resetFormState: () => void;
}) {
  const { openChainModal } = useChainModal();

  return (
    <div className="pt-3">
      {user.status === "NOT_CONNECTED" ? (
        <AccountMenu size="large" fullWidth>
          <div className="tracking-wider">Connect to vote</div>
        </AccountMenu>
      ) : user.status === "UNSUPPORTED_CHAIN" ? (
        <Button
          fullWidth={true}
          size="large"
          variant="danger"
          onClick={() => openChainModal?.()}
        >
          Change network
        </Button>
      ) : user.status === "CONNECTED" ? (
        isRecasting || !userHasVoted ? (
          <CastVote
            vote={userVote}
            isSafe={isSafe}
            userCanVote={userCanVote}
            userHasVoted={userHasVoted}
            isRecasting={isRecasting}
            setIsRecasting={setIsRecasting}
            user={user}
            resetFormState={resetFormState}
          />
        ) : (
          <VoteIsCast>{user.features.recastVote && <RecastVote />}</VoteIsCast>
        )
      ) : null}
    </div>
  );
}

export function CastVote({
  vote,
  userCanVote,
  isSafe,
  isRecasting,
  setIsRecasting,
  resetFormState,
}: {
  vote: Array<number>;
  userCanVote: boolean;
  isSafe: boolean;
  userHasVoted: boolean;
  isRecasting: boolean;
  user: TUserConnected;
  setIsRecasting: (val: boolean) => void;
  resetFormState: () => void;
}) {
  const { transactionsState, transactionsDispatch } = useTransactions();
  const { setModal } = useModal();
  const writeIsEnabled = !!(vote.reduce((acc, num) => (acc += num), 0) > 0);

  const chainConfig = useActiveChain();
  const distributorAddress = chainConfig.DISBURSER.address;

  const {
    data: prepareConfig,
    status: prepareConfigStatus,
    error: prepareConfigError,
  } = useSimulateContract({
    address: distributorAddress,
    abi: DISTRIBUTOR_ABI,
    functionName: "castVote",
    args: [vote.map((num) => BigInt(num))],
    query: {
      enabled: writeIsEnabled && distributorAddress !== "0x",
    },
  });

  const {
    writeContract,
    data: writeData,
    isError: writeIsError,
    error: writeError,
  } = useWriteContract();

  useEffect(() => {
    (async () => {
      if (!writeData) return;
      if (transactionsState.submitted.find((tx) => tx.hash === writeData)) {
        return;
      }
      if (isSafe) {
        const safeSdk = new SafeAppsSDK();
        const tx = await safeSdk.txs.getBySafeTxHash(writeData);
        if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
          transactionsDispatch({
            type: "SET_SAFE_SUBMITTED",
            payload: { hash: writeData },
          });
          setModal({ type: "VOTE_TRANSACTION", hash: writeData });
          setIsRecasting(false);
          return;
        }
        if (tx.txStatus === TransactionStatus.SUCCESS) {
          transactionsDispatch({
            type: "SET_SUBMITTED",
            payload: { hash: writeData },
          });
          setIsRecasting(false);
          return;
        }
      }
      // not safe
      transactionsDispatch({
        type: "SET_SUBMITTED",
        payload: { hash: writeData },
      });
      setModal({ type: "VOTE_TRANSACTION", hash: writeData });
      setIsRecasting(false);
    })();
  }, [
    writeData,
    transactionsState,
    transactionsDispatch,
    isSafe,
    setModal,
    setIsRecasting,
  ]);

  useEffect(() => {
    if (!writeIsError && !writeError) return;
    // clear transaction closing modal on error including if user rejects the request
    setModal(null);
  }, [writeIsError, writeError, transactionsDispatch, setModal]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="grow">
        <Button
          fullWidth
          size="large"
          onClick={() => {
            if (!writeContract) return;
            if (prepareConfigStatus !== "success") {
              console.log("castVote tx prepare failed: ", prepareConfigError);
              return;
            }
            transactionsDispatch({
              type: "NEW",
              payload: {
                data: {
                  type: "VOTE",
                },
              },
            });
            setModal({
              type: "VOTE_TRANSACTION",
              hash: "",
            });
            writeContract(prepareConfig!.request);
          }}
          disabled={
            !userCanVote || !writeIsEnabled || prepareConfigStatus !== "success"
          }
        >
          Cast Vote
        </Button>
      </div>
      {isRecasting && (
        <div className="w-full sm:w-auto">
          <Button
            onClick={() => {
              setIsRecasting(false);
              resetFormState();
            }}
            variant="cancel"
            size="large"
            fullWidth
          >
            <div className="flex items-center gap-3">
              <svg
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.5 0H2.5V2H0.5V0ZM4.5 4H2.5V2H4.5V4ZM6.5 6H4.5V4H6.5V6ZM8.5 6H6.5V8H4.5V10H2.5V12H0.5V14H2.5V12H4.5V10H6.5V8H8.5V10H10.5V12H12.5V14H14.5V12H12.5V10H10.5V8H8.5V6ZM10.5 4V6H8.5V4H10.5ZM12.5 2V4H10.5V2H12.5ZM12.5 2V0H14.5V2H12.5Z"
                  fill="#D8745C"
                />
              </svg>

              <span>Cancel recast</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}

function VoteIsCast({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="dark:text-status-success py-2.5 bg-breadgray-ultra-white dark:bg-breadgray-charcoal rounded-lg grow flex justify-center text-lg font-bold ">
        <span className="flex gap-4">
          <div className="w-7 h-7 flex items-center text-status-success">
            <CheckIcon />
          </div>
          Vote cast
        </span>
      </div>
      {children}
    </div>
  );
}

function RecastVote({}: {}) {
  const { setModal } = useModal();

  return (
    <button
      className="bg-[#FFCCF1] dark:bg-[#402639] px-6 py-2 flex items-center justify-center gap-2.5 rounded-lg font-bold text-breadpink-400 dark:text-breadpink-shaded text-lg border-2 border-[#FFCCF1] dark:border-[#402639] hover:border-breadpink-400 dark:hover:border-breadpink-shaded hover:transition-[border]"
      onClick={() => setModal({ type: "CONFIRM_RECAST", isConfirmed: false })}
    >
      <div className="w-4 h-4">
        <svg
          className="w-full h-full fill-current"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0H10V2H12V4H2V6H0V14H2V16H8V14H2V6H12V8H10V10H12V8H14V6H16V4H14V2H12V0Z"
          />
        </svg>
      </div>

      <span>Recast Vote</span>
    </button>
  );
}
