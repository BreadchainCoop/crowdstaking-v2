import { formatUnits } from "viem";
import { ModalContent, ModalHeading } from "../LPModalUI";
import { useState } from "react";
import { useRefetchOnBlockChangeForUser } from "@/app/core/hooks/useRefetchOnBlockChange";
import { useWriteContract,  useSimulateContract } from "wagmi";
import { BUTTERED_BREAD_ABI } from "@/abi";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import {
	LPVaultTransactionModalState,
	useModal,
} from "@/app/core/context/ModalContext";
import { getChain } from "@/chainConfig";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { UnlockVPRate, ValueText, WXDaiBreadIcon } from "./VPRate";
import { StatusBadge } from "./Locking/LockingTransaction";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { Body, LiftedButton } from "@breadcoop/ui";
import {
	ArrowCounterClockwiseIcon,
	ArrowUpRightIcon,
} from "@phosphor-icons/react/ssr";
import { TTransactionHash } from "@/app/core/context/TransactionsContext/TransactionsReducer";
import SafeAppsSDK from "@safe-global/safe-apps-sdk/dist/src/sdk";
import { TransactionStatus } from "@safe-global/safe-apps-sdk/dist/src/types";

type WithdrawStatus = "idle" | "submitted" | "confirmed" | "reverted";

export function WithdrawTransaction({
	user,
	modalState,
	isSafe
}: {
	user: TUserConnected;
	modalState: LPVaultTransactionModalState;
	isSafe: boolean
}) {
	const { transactionsState, transactionsDispatch } = useTransactions();
	const { setModal } = useModal();
	const [isWalletOpen, setIsWalletOpen] = useState(false);
	const [txHash, setTxHash] = useState<TTransactionHash | null>(null);
	const chainConfig = getChain(user.chain.id);
	const { writeContractAsync } = useWriteContract();

	const submittedTx = txHash
		? transactionsState.submitted.find((t) => t.hash === txHash)
		: null;

	const status: WithdrawStatus = !txHash
		? "idle"
		: submittedTx?.status === "CONFIRMED"
		? "confirmed"
		: submittedTx?.status === "REVERTED"
		? "reverted"
		: "submitted";

	const { status: lockedBalanceStatus, data: lockedBalance } =
		useRefetchOnBlockChangeForUser(
			user.address,
			chainConfig.BUTTERED_BREAD.address,
			BUTTERED_BREAD_ABI,
			"accountToLPBalance",
			[user.address, chainConfig.BUTTER.address],
		);

	const prepareWrite = useSimulateContract({
		address: chainConfig.BUTTERED_BREAD.address,
		abi: BUTTERED_BREAD_ABI,
		functionName: "withdraw",
		args: [chainConfig.BUTTER.address, modalState.parsedValue],
		query: {
			enabled:
				lockedBalanceStatus === "success" &&
				modalState.parsedValue <= (lockedBalance as bigint),
		},
		chainId: chainConfig.ID,
	});

	const handleSubmit = async () => {
		if (!prepareWrite.data) return;

		transactionsDispatch({
			type: "NEW",
			payload: {
				data: { type: "LP_VAULT_WITHDRAW", transactionType: "UNLOCK" },
			},
		});

		setIsWalletOpen(true);

		try {
			const hash = await writeContractAsync(prepareWrite.data.request);

			if (isSafe) {
				const safeSdk = new SafeAppsSDK();
				const tx = await safeSdk.txs.getBySafeTxHash(hash);

				if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
					transactionsDispatch({
						type: "SET_SAFE_SUBMITTED",
						payload: { hash },
					});
					setTxHash(hash);
					return;
				}
			}

			transactionsDispatch({
				type: "SET_SUBMITTED",
				payload: { hash },
			});
			setTxHash(hash);
		} catch(e) {
			console.log("__ ERROR UNLOCKING LP TOKEN __", e);
		} finally {
			setIsWalletOpen(false);
		}
	};

	const handleRetry = () => {
		setTxHash(null);
		handleSubmit();
	};

	return (
		<>
			<ModalHeading>Unlocking LP Tokens</ModalHeading>
			<ModalContent className="!gap-2">
				<StatusBadge
					variant="unlock"
					status={
						status === "confirmed"
							? "complete"
							: status === "reverted"
							? "reverted"
							: "in-progress"
					}
				/>
				{status !== "confirmed" && (
					<>
						<UnlockVPRate value={modalState.parsedValue} />
						<div className="border-l-4 border-system-warning shadow-md p-[20px] flex flex-col items-center gap-4">
							<Body>
								By unlocking your LP tokens you will not be
								eligible to receive voting power within the
								Bread Coop network in future voting cycles.
							</Body>
						</div>
					</>
				)}
				{status === "idle" && (
					<Body className="text-surface-grey">
						Press `Unlock LP tokens` to execute the transaction
					</Body>
				)}
				{status === "submitted" && (
					<Body>Awaiting on-chain confirmation...</Body>
				)}
				{status === "reverted" && (
					<Body className="text-status-error">
						Transaction failed. Please try again.
					</Body>
				)}

				<div className="w-full">
					{status === "confirmed" && txHash && (
						<>
							<UnlockingSuccess
								value={modalState.parsedValue}
								explorerLink={`${chainConfig.EXPLORER}/tx/${txHash}`}
							/>
							<LiftedButton
								preset="secondary"
								onClick={() => setModal(null)}
								disabled={isWalletOpen}
								width="full"
							>
								Return to vault page
							</LiftedButton>
						</>
					)}
					{status === "submitted" && (
						<LiftedButton disabled width="full">
							Unlocking...
						</LiftedButton>
					)}
					{status === "reverted" && (
						<LiftedButton
							onClick={handleRetry}
							disabled={isWalletOpen}
							width="full"
							leftIcon={<ArrowCounterClockwiseIcon size={24} />}
						>
							Try again
						</LiftedButton>
					)}
					{status === "idle" && (
						<LiftedButton
							onClick={handleSubmit}
							disabled={isWalletOpen}
							width="full"
						>
							Unlock LP tokens
						</LiftedButton>
					)}
				</div>
			</ModalContent>
		</>
	);
}

function UnlockingSuccess({
	value,
	explorerLink,
}: {
	value: bigint;
	explorerLink: string;
}) {
	const tokenAmount = formatUnits(value, 18);

	return (
		<div className="w-full p-6 pb-0 flex flex-col items-center gap-4">
			<div className="w-auto border border-surface-ink flex items-center gap-2 px-2 mx-auto bg-paper-main">
				<WXDaiBreadIcon />
				<ValueText className="flex items-center justify-center pt-1">
					<span
						className="w-full max-w-[7.2rem] truncate mr-1.5"
						title={tokenAmount}
					>
						{tokenAmount}
					</span>{" "}
					<span className="shrink-0">LP TOKENS</span>
				</ValueText>
			</div>
			<ExternalLink href={explorerLink}>
				<LiftedButton preset="stroke" className="h-8">
					<span className="flex items-center gap-2">
						View receipt on Gnosisscan
						<ArrowUpRightIcon
							size={24}
							className="text-primary-orange"
						/>
					</span>
				</LiftedButton>
			</ExternalLink>
		</div>
	);
}
