"use client";

import clsx from "clsx";
import { LiftedButton } from "@breadcoop/ui";
import { PlayIcon } from "@phosphor-icons/react";
import { Close as DialogClose, Title as DialogTitle } from "@radix-ui/react-dialog";
import { useModal } from "@/app/core/context/ModalContext";
import CloseIcon from "@/app/core/components/Icons/CloseIcon";

const VIDEO_SRC = "/videos/solidarity-fund-how-it-works.mp4";
const POSTER_SRC = "/videos/solidarity-fund-how-it-works-poster.jpg";

function HowItWorksVideo() {
	return (
		<div className="w-full flex flex-col gap-2">
			<DialogTitle className="sr-only">How the Solidarity Fund works</DialogTitle>
			<DialogClose
				className="self-end w-10 h-10 p-3 text-[#EA5817]"
				aria-label="Close video"
			>
				<CloseIcon />
			</DialogClose>
			<video
				className="w-full aspect-video bg-black"
				src={VIDEO_SRC}
				poster={POSTER_SRC}
				controls
				autoPlay
				playsInline
				preload="metadata"
			>
				Your browser can&apos;t play this video.{" "}
				<a href={VIDEO_SRC} className="underline">
					Download it instead
				</a>
				.
			</video>
		</div>
	);
}

export const HowItWorks = ({ className }: { className?: string }) => {
	const { setModal } = useModal();

	return (
		<div className={clsx("lifted-button-container max-w-[13rem]", className ?? "mb-6")}>
			<LiftedButton
				preset="stroke"
				className="border border-black !py-1 px-4 !h-8"
				onClick={() =>
					setModal({
						type: "GENERIC_MODAL",
						showCloseButton: true,
						includeContainerStyling: true,
						className: "sm:max-w-[40rem] md:max-w-[52rem] lg:max-w-[60rem]",
						children: <HowItWorksVideo />,
					})
				}
				leftIcon={<PlayIcon weight="fill" color="var(--color-primary-orange)" />}
			>
				How does it work?
			</LiftedButton>
		</div>
	);
};
