import { ModalContainer, ModalContent, ModalHeading } from "./ModalUI";
import { ModalState } from "../../context/ModalContext";
import Button from "../Button";
import { Body, LiftedButton } from "@breadcoop/ui";

export function ConfirmRecastModal({
	setModal,
}: {
	setModal: (modalState: ModalState) => void;
}) {
	return (
		<ModalContainer>
			<ModalHeading>Re-cast your vote?</ModalHeading>
			<ModalContent>
				<div className="">
					<svg
						width="64"
						height="64"
						viewBox="0 0 64 64"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M32 34V20"
							stroke="#CE7F00"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M32 40.125C33.5878 40.125 34.875 41.4122 34.875 43C34.875 44.5878 33.5878 45.875 32 45.875C30.4122 45.875 29.125 44.5878 29.125 43C29.125 41.4122 30.4122 40.125 32 40.125Z"
							fill="#CE7F00"
							stroke="#CE7F00"
							strokeWidth="0.25"
						/>
						<path
							d="M30.5927 6.58305L6.58116 30.5946C5.80499 31.3708 5.80499 32.6292 6.58116 33.4054L30.5927 57.417C31.3689 58.1931 32.6273 58.1931 33.4035 57.417L57.4151 33.4054C58.1912 32.6292 58.1912 31.3708 57.4151 30.5946L33.4035 6.58305C32.6273 5.80688 31.3689 5.80688 30.5927 6.58305Z"
							stroke="#CE7F00"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<Body className="mb-6 text-surface-grey">
					You are about to Re-cast your vote.
				</Body>
				<div className="lifted-button-container">
					<LiftedButton
						onClick={() =>
							setModal({
								type: "CONFIRM_RECAST",
								isConfirmed: true,
							})
						}
					>
						Yes, proceed
					</LiftedButton>
				</div>
				<div className="lifted-button-container -mt-1">
					<LiftedButton
						preset="secondary"
						onClick={() => {
							setModal(null);
						}}
					>
						Cancel
					</LiftedButton>
				</div>
			</ModalContent>
		</ModalContainer>
	);
}
