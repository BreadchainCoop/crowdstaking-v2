import { ReactNode } from "react";
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
import { Body, LiftedButton } from "@breadcoop/ui";
import { LoginButton } from "@/app/components/login-button";

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

	if (user.status !== "CONNECTED")
		return (
			<div className="mt-3">
				<LoginButton user={user} label="Sign in to vote" />
			</div>
		);

	if (isRecasting || !userHasVoted)
		return (
			<div className="mt-3">
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
			</div>
		);

	return (
		<div className="mt-3 mb-6 lg:mb-0">
			<VoteIsCast>
				{user.features.recastVote && <RecastVote />}
			</VoteIsCast>
		</div>
	);

	// return (
	// 	<div className="pt-3">
	// 		{user.status === "NOT_CONNECTED" ? (
	// 			<AccountMenu size="large" fullWidth>
	// 				<div className="tracking-wider">Connect to vote</div>
	// 			</AccountMenu>
	// 		) : user.status === "UNSUPPORTED_CHAIN" ? (
	// 			<Button
	// 				fullWidth={true}
	// 				size="large"
	// 				variant="danger"
	// 				onClick={() => openChainModal?.()}
	// 			>
	// 				Change network
	// 			</Button>
	// 		) : user.status === "CONNECTED" ? (
	// 			isRecasting || !userHasVoted ? (
	// 				<CastVote
	// 					vote={userVote}
	// 					isSafe={isSafe}
	// 					userCanVote={userCanVote}
	// 					userHasVoted={userHasVoted}
	// 					isRecasting={isRecasting}
	// 					setIsRecasting={setIsRecasting}
	// 					user={user}
	// 					resetFormState={resetFormState}
	// 				/>
	// 			) : (
	// 				<VoteIsCast>
	// 					{user.features.recastVote && <RecastVote />}
	// 				</VoteIsCast>
	// 			)
	// 		) : null}
	// 	</div>
	// );
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
		chainId: chainConfig.ID,
	});

	const { writeContractAsync, isPending: isCasting } = useWriteContract();

	const castVote = async () => {
		if (!writeContractAsync || !prepareConfig || isCasting) return;

		try {
			transactionsDispatch({
				type: "NEW",
				payload: { data: { type: "VOTE" } },
			});

			setModal({ type: "VOTE_TRANSACTION", hash: null });

			const hash = await writeContractAsync(prepareConfig.request);

			if (transactionsState.submitted.find((tx) => tx.hash === hash))
				return;

			if (isSafe) {
				const safeSdk = new SafeAppsSDK();
				const tx = await safeSdk.txs.getBySafeTxHash(hash);
				if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
					transactionsDispatch({
						type: "SET_SAFE_SUBMITTED",
						payload: { hash },
					});
				}

				setModal({ type: "VOTE_TRANSACTION", hash });
				setIsRecasting(false);
				return;
			}

			transactionsDispatch({ type: "SET_SUBMITTED", payload: { hash } });
			setModal({ type: "VOTE_TRANSACTION", hash });
			setIsRecasting(false);
		} catch (error) {
			// clear transaction closing modal on error including if user rejects the request
			setModal(null);
		}
	};

	return (
		<div className="flex flex-col gap-2 sm:flex-row">
			<div className="grow lifted-button-container">
				<LiftedButton
					onClick={castVote}
					disabled={
						!userCanVote ||
						!writeIsEnabled ||
						prepareConfigStatus !== "success"
					}
				>
					Vote
				</LiftedButton>
			</div>
			{isRecasting && (
				<div className="lifted-button-container sm:w-auto">
					<LiftedButton
						preset="secondary"
						onClick={() => {
							setIsRecasting(false);
							resetFormState();
						}}
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
					</LiftedButton>
				</div>
			)}
		</div>
	);
}

function VoteIsCast({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col gap-[1.0625rem] sm:flex-row">
			<Body
				bold
				className="py-4 px-8 opacity-50 bg-surface-grey text-paper-main w-full text-center grow-[2] h-14 flex items-center justify-center"
			>
				Voted
			</Body>
			{children}
		</div>
	);
}

function RecastVote({}: {}) {
	const { setModal } = useModal();

	return (
		<div className="lifted-button-container sm:max-w-[13.5625rem] grow">
			<LiftedButton
				preset="secondary"
				leftIcon={<RecastIcon />}
				onClick={() =>
					setModal({ type: "CONFIRM_RECAST", isConfirmed: false })
				}
			>
				Recast Vote
			</LiftedButton>
		</div>
	);
}

function RecastIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M15.9694 12.2194L19.1897 9.00005H8.25C7.05653 9.00005 5.91193 9.47416 5.06802 10.3181C4.22411 11.162 3.75 12.3066 3.75 13.5001C3.75 14.6935 4.22411 15.8381 5.06802 16.682C5.91193 17.5259 7.05653 18.0001 8.25 18.0001H16.5C16.6989 18.0001 16.8897 18.0791 17.0303 18.2197C17.171 18.3604 17.25 18.5511 17.25 18.7501C17.25 18.949 17.171 19.1397 17.0303 19.2804C16.8897 19.421 16.6989 19.5001 16.5 19.5001H8.25C6.6587 19.5001 5.13258 18.8679 4.00736 17.7427C2.88214 16.6175 2.25 15.0914 2.25 13.5001C2.25 11.9088 2.88214 10.3826 4.00736 9.25741C5.13258 8.13219 6.6587 7.50005 8.25 7.50005H19.1897L15.9694 4.28068C15.8997 4.21099 15.8444 4.12827 15.8067 4.03722C15.769 3.94618 15.7496 3.8486 15.7496 3.75005C15.7496 3.6515 15.769 3.55392 15.8067 3.46288C15.8444 3.37183 15.8997 3.28911 15.9694 3.21943C16.0391 3.14974 16.1218 3.09447 16.2128 3.05676C16.3039 3.01904 16.4015 2.99963 16.5 2.99963C16.5985 2.99963 16.6961 3.01904 16.7872 3.05676C16.8782 3.09447 16.9609 3.14974 17.0306 3.21943L21.5306 7.71943C21.6004 7.78908 21.6557 7.8718 21.6934 7.96285C21.7312 8.05389 21.7506 8.15149 21.7506 8.25005C21.7506 8.34861 21.7312 8.44621 21.6934 8.53726C21.6557 8.62831 21.6004 8.71102 21.5306 8.78068L17.0306 13.2807C16.8899 13.4214 16.699 13.5005 16.5 13.5005C16.301 13.5005 16.1101 13.4214 15.9694 13.2807C15.8286 13.1399 15.7496 12.9491 15.7496 12.7501C15.7496 12.551 15.8286 12.3602 15.9694 12.2194Z"
				fill="#EA5817"
			/>
		</svg>
	);
}
