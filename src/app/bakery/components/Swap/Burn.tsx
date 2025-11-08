import { useWriteContract, useSimulateContract } from "wagmi";
import { parseEther } from "viem";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { BREAD_ABI } from "@/abi";
import useDebounce from "@/app/bakery/hooks/useDebounce";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { useModal } from "@/app/core/context/ModalContext";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import SwapBreadButton from "@/app/bakery/components/Swap/SwapBreadButton";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { LiftedButton } from "@breadcoop/ui";
import { useEffect } from "react";
import { sleep } from "@/utils/sleep";
export default function Burn({
	user,
	inputValue,
	clearInputValue,
	isSafe,
}: {
	user: TUserConnected;
	inputValue: string;
	clearInputValue: () => void;
	isSafe: boolean;
}) {
	const { transactionsState, transactionsDispatch } = useTransactions();
	const { BREAD, ID: chainId } = useActiveChain();
	const { setModal } = useModal();
	const debouncedValue = useDebounce(inputValue, 500);
	const parsedValue = parseEther(
		debouncedValue === "." ? "0" : debouncedValue || "0"
	);
	const { data: prepareConfig, status: prepareStatus } = useSimulateContract({
		address: BREAD.address,
		abi: BREAD_ABI,
		functionName: "burn",
		args: [parsedValue, user.address],
		query: {
			enabled: parseFloat(debouncedValue) > 0,
		},
		chainId,
	});

	const buttonIsEnabled =
		prepareStatus === "success" && inputValue === debouncedValue;

	const { writeContractAsync, isPending: isBurning } = useWriteContract();

	// // Use to simulate burn flow
	// useEffect(() => {
	// 	const fill = async () => {
	// 		const hash =
	// 			"0x014a507436c266ea14b23bf9eb5178f8c7df7101aa502a68c8acea7dab1f5f5b";
	// 		const value = "22";

	// 		setModal({
	// 			type: "CONFIRM_BURN",
	// 			breadValue: value,
	// 			xdaiValue: value,
	// 			write: () => writeContractAsync(prepareConfig!.request),
	// 			isSafe,
	// 			clearInputValue,
	// 		});

	// 		await sleep(2000);

	// 		transactionsDispatch({
	// 			type: "NEW",
	// 			payload: {
	// 				data: {
	// 					type: "BURN",
	// 					value,
	// 				},
	// 			},
	// 		});
	// 		setModal({
	// 			type: "BAKERY_TRANSACTION",
	// 			hash: null,
	// 		});

	// 		await sleep(2000);

	// 		transactionsDispatch({
	// 			type: "SET_SUBMITTED",
	// 			payload: { hash },
	// 		});
	// 		setModal({ type: "BAKERY_TRANSACTION", hash });
	// 	};

	// 	fill();
	// }, []);

	return (
		<div className="relative">
			<div className="group">
				<SwapBreadButton withRecommended />
			</div>
			<div className="m-3"></div>
			<div className="relative lifted-button-container">
				<LiftedButton
					disabled={!buttonIsEnabled || isBurning}
					preset="secondary"
					onClick={() => {
						setModal({
							type: "CONFIRM_BURN",
							breadValue: inputValue,
							xdaiValue: debouncedValue,
							write: () =>
								writeContractAsync(prepareConfig!.request),
							isSafe,
							clearInputValue,
						});
					}}
					className=""
				>
					Burn
				</LiftedButton>
			</div>
		</div>
	);
}
