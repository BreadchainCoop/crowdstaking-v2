import { useMemo } from "react";
import { Close as DialogPrimitiveClose } from "@radix-ui/react-dialog";
import { Body, Caption, LiftedButton } from "@breadcoop/ui";
import {
	ShieldCheckIcon,
	ClockIcon,
	CheckCircleIcon,
	XCircleIcon,
	WarningCircleIcon,
	ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";

import {
	ModalContainer,
	ModalContent,
	ModalHeading,
} from "../ModalUI";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { SafeTransactionModalState } from "@/app/core/context/ModalContext";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";

const SAFE_APP_BASE = "https://app.safe.global/transactions/queue";

/**
 * Builds a deep link to the connected Safe's transaction queue so the user
 * can review and sign the pending transaction. Gnosis Chain uses the `gno:`
 * address prefix in the Safe web app.
 */
function buildSafeAppUrl(safeAddress: string | undefined): string {
	if (!safeAddress) return "https://app.safe.global";
	return `${SAFE_APP_BASE}?safe=gno:${safeAddress}`;
}

type SafeView = "PENDING" | "WAITING" | "CONFIRMED" | "REJECTED" | "EXPIRED";

export function SafeTransactionModal({
	modalState,
}: {
	modalState: SafeTransactionModalState;
}) {
	const { transactionsState } = useTransactions();
	const { user } = useConnectedUser();

	const safeAddress = user.status === "CONNECTED" ? user.address : undefined;

	const transaction = transactionsState.submitted.find(
		(tx) => tx.hash === modalState.hash
	);

	const confirmationsSubmitted =
		transaction?.status === "SAFE_SUBMITTED"
			? transaction.confirmationsSubmitted ?? 0
			: 0;
	const confirmationsRequired =
		transaction?.status === "SAFE_SUBMITTED"
			? transaction.confirmationsRequired ?? 0
			: 0;

	const view: SafeView = useMemo(() => {
		if (!transaction) return "PENDING";
		switch (transaction.status) {
			case "CONFIRMED":
				return "CONFIRMED";
			case "REVERTED":
				return "REJECTED";
			case "SAFE_EXPIRED":
				return "EXPIRED";
			case "SAFE_SUBMITTED":
				// Once at least one owner has signed (but threshold not yet
				// reached) we show the signer-progress view.
				return confirmationsSubmitted > 0 ? "WAITING" : "PENDING";
			default:
				return "PENDING";
		}
	}, [transaction, confirmationsSubmitted]);

	const safeAppUrl = buildSafeAppUrl(safeAddress);

	const content = SAFE_VIEW_CONTENT[view];

	return (
		<ModalContainer>
			<ModalHeading>{content.title}</ModalHeading>
			<ModalContent>
				<SafeStatusIcon view={view} />

				{view === "WAITING" && (
					<SignerProgress
						submitted={confirmationsSubmitted}
						required={confirmationsRequired}
					/>
				)}

				<Body className="text-surface-grey text-center pt-1 pb-1">
					{content.body}
				</Body>

				<SafeStatusNote view={view} />

				<div className="w-full flex flex-col gap-2 mt-2">
					{(view === "PENDING" || view === "WAITING") && (
						<div className="lifted-button-container w-full">
							<LiftedButton
								width="full"
								rightIcon={<ArrowSquareOutIcon weight="bold" />}
								onClick={() =>
									window.open(safeAppUrl, "_blank")
								}
							>
								Open Safe App
							</LiftedButton>
						</div>
					)}

					{view === "CONFIRMED" && (
						<DialogPrimitiveClose asChild>
							<div className="lifted-button-container w-full">
								<LiftedButton width="full" preset="positive">
									Done
								</LiftedButton>
							</div>
						</DialogPrimitiveClose>
					)}

					{(view === "REJECTED" || view === "EXPIRED") && (
						<DialogPrimitiveClose asChild>
							<div className="lifted-button-container w-full">
								<LiftedButton width="full">
									{view === "REJECTED"
										? "Try Again"
										: "Submit Again"}
								</LiftedButton>
							</div>
						</DialogPrimitiveClose>
					)}

					<DialogPrimitiveClose asChild>
						<div className="lifted-button-container w-full">
							<LiftedButton width="full" preset="secondary">
								{view === "CONFIRMED" ? "Close" : "Cancel"}
							</LiftedButton>
						</div>
					</DialogPrimitiveClose>
				</div>
			</ModalContent>
		</ModalContainer>
	);
}

const SAFE_VIEW_CONTENT: Record<
	SafeView,
	{ title: string; body: string }
> = {
	PENDING: {
		title: "Safe Transaction Submitted",
		body: "This transaction needs confirmation in your Safe app — it won't execute until the required number of owners sign it.",
	},
	WAITING: {
		title: "Waiting for Confirmations",
		body: "Share the Safe link with the other owners to collect the remaining signatures.",
	},
	CONFIRMED: {
		title: "Transaction Confirmed",
		body: "All required owners signed. Your transaction is now on-chain.",
	},
	REJECTED: {
		title: "Transaction Rejected",
		body: "This transaction was rejected by the Safe owners. You can submit a new transaction if needed.",
	},
	EXPIRED: {
		title: "Transaction Expired",
		body: "This transaction was not signed in time. Please submit it again to proceed.",
	},
};

function SafeStatusIcon({ view }: { view: SafeView }) {
	const ICON_SIZE = 40;

	const config: Record<
		SafeView,
		{ icon: JSX.Element; bg: string }
	> = {
		PENDING: {
			icon: (
				<ShieldCheckIcon
					size={ICON_SIZE}
					color="var(--color-primary-orange, #EA5817)"
				/>
			),
			bg: "bg-[#EA5817]/10",
		},
		WAITING: {
			icon: (
				<ClockIcon
					size={ICON_SIZE}
					color="var(--color-primary-orange, #EA5817)"
				/>
			),
			bg: "bg-[#EA5817]/10",
		},
		CONFIRMED: {
			icon: <CheckCircleIcon size={ICON_SIZE} color="#32A800" />,
			bg: "bg-system-green/10",
		},
		REJECTED: {
			icon: <XCircleIcon size={ICON_SIZE} color="#DF0B00" />,
			bg: "bg-system-red/10",
		},
		EXPIRED: {
			icon: <ClockIcon size={ICON_SIZE} color="#808080" />,
			bg: "bg-surface-grey/10",
		},
	};

	return (
		<div
			className={clsx(
				"size-[72px] rounded-full flex items-center justify-center my-2",
				config[view].bg
			)}
		>
			{config[view].icon}
		</div>
	);
}

function SignerProgress({
	submitted,
	required,
}: {
	submitted: number;
	required: number;
}) {
	const safeRequired = required > 0 ? required : 1;
	const pct = Math.min(100, Math.round((submitted / safeRequired) * 100));

	return (
		<div className="w-full flex flex-col items-center gap-2 bg-paper-1 rounded-lg p-3">
			<Body bold className="text-surface-ink text-center">
				{submitted} of {required || "?"} confirmations received
			</Body>
			<div className="w-full h-2 rounded-full bg-paper-main overflow-hidden">
				<div
					className="h-full rounded-full bg-primary-orange transition-all"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

function SafeStatusNote({ view }: { view: SafeView }) {
	const notes: Partial<
		Record<
			SafeView,
			{ icon: JSX.Element; text: string; className: string }
		>
	> = {
		PENDING: {
			icon: <WarningCircleIcon size={16} color="#CE7F00" />,
			text: "Keep this page open. Your transaction is pending in Safe.",
			className: "bg-system-warning/10 text-system-warning",
		},
		WAITING: {
			icon: <WarningCircleIcon size={16} color="#CE7F00" />,
			text: "Waiting for additional owner signatures. Keep this page open.",
			className: "bg-system-warning/10 text-system-warning",
		},
		CONFIRMED: {
			icon: <CheckCircleIcon size={16} color="#32A800" />,
			text: "Transaction executed successfully on Gnosis Chain.",
			className: "bg-system-green/10 text-system-green",
		},
		REJECTED: {
			icon: <XCircleIcon size={16} color="#DF0B00" />,
			text: "Transaction rejected. No funds were moved.",
			className: "bg-system-red/10 text-system-red",
		},
		EXPIRED: {
			icon: <WarningCircleIcon size={16} color="#808080" />,
			text: "Transaction expired — no action was taken. No funds were moved.",
			className: "bg-surface-grey/10 text-surface-grey",
		},
	};

	const note = notes[view];
	if (!note) return null;

	return (
		<div
			className={clsx(
				"w-full flex items-center gap-2 rounded px-3 py-2.5",
				note.className
			)}
		>
			<span className="shrink-0">{note.icon}</span>
			<Caption className="font-bold">{note.text}</Caption>
		</div>
	);
}
