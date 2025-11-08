import { useWriteContract, useSimulateContract } from "wagmi";
import { parseEther } from "viem";

import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import Button from "@/app/core/components/Button";
import { BREAD_ABI } from "@/abi";
import useDebounce from "@/app/bakery/hooks/useDebounce";

import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import SafeAppsSDK from "@safe-global/safe-apps-sdk/dist/src/sdk";
import { TransactionStatus } from "@safe-global/safe-apps-sdk/dist/src/types";
import { useModal } from "@/app/core/context/ModalContext";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { LiftedButton } from "@breadcoop/ui";

export default function Bake({
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

	const { setModal } = useModal();

	const { BREAD, ID: chainId } = useActiveChain();

	const debouncedValue = useDebounce(inputValue, 500);

	const parsedValue = parseEther(
		debouncedValue === "." ? "0" : debouncedValue || "0"
	);

	const { data: prepareConfig, status: prepareStatus } = useSimulateContract({
		address: BREAD.address,
		abi: BREAD_ABI,
		functionName: "mint",
		args: [user.address],
		value: parsedValue,
		query: {
			enabled: parseFloat(debouncedValue) > 0,
		},
		chainId,
	});

	const buttonIsEnabled =
		prepareStatus === "success" && inputValue === debouncedValue;

	const { writeContractAsync, isPending: isBaking } = useWriteContract();

	const onBake = async () => {
		if (!writeContractAsync || !prepareConfig || isBaking) return;

		try {
			transactionsDispatch({
				type: "NEW",
				payload: {
					data: { type: "BAKE", value: debouncedValue },
				},
			});

			setModal({
				type: "BAKERY_TRANSACTION",
				hash: null,
			});

			const hash = await writeContractAsync(prepareConfig.request);

			if (transactionsState.submitted.find((tx) => tx.hash === hash))
				return;

			if (isSafe) {
				// TODO look at using eth_getTransactionRecipt to catch submitted transactions
				const safeSdk = new SafeAppsSDK();
				const tx = await safeSdk.txs.getBySafeTxHash(hash);

				if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
					transactionsDispatch({
						type: "SET_SAFE_SUBMITTED",
						payload: { hash },
					});
					setModal({ type: "BAKERY_TRANSACTION", hash });
					clearInputValue();

					return;
				}
			}

			// not safe
			transactionsDispatch({
				type: "SET_SUBMITTED",
				payload: { hash },
			});
			setModal({ type: "BAKERY_TRANSACTION", hash });
			clearInputValue();
		} catch (error) {
			console.error("Baking error__", error);
			// clear transaction closing modal on error including if user rejects the request
			setModal(null);
		}
	};

	// console.log("__ USER __", user);

	// simulate bake flow
	// useEffect(() => {
	// 	const fill = async () => {
	// 		transactionsDispatch({
	// 			type: "NEW",
	// 			payload: {
	// 				data: { "type": "BAKE", "value": "1000" },
	// 			},
	// 		});

	// 		setModal({
	// 			type: "BAKERY_TRANSACTION",
	// 			hash: null,
	// 		});

	// 		await sleep(1000);

	// 		console.log("Submitted");

	// 		transactionsDispatch({
	// 			type: "SET_SUBMITTED",
	// 			payload: {
	// 				"hash": "0x431cec99f7987f59b177e725fcc000ace4797c7a80b78e67d86d64c7f0c1e8f4",
	// 			},
	// 		});
	// 		setModal({
	// 			type: "BAKERY_TRANSACTION",
	// 			hash: "0x431cec99f7987f59b177e725fcc000ace4797c7a80b78e67d86d64c7f0c1e8f4",
	// 		});
	// 	};

	// 	fill();
	// }, []);

	return (
		<div className="relative lifted-button-container">
			<LiftedButton
				disabled={!buttonIsEnabled || isBaking}
				onClick={onBake}
				className=""
			>
				Bake
			</LiftedButton>
		</div>
	);
}
