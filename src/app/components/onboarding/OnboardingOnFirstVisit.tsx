"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";

import { useModal } from "@/app/core/context/ModalContext";
import { Onboarding } from "./Onboarding";

const STORAGE_KEY = "bread_onboarding_seen";

/**
 * Shows the first-visit onboarding card once, before the user signs in, and
 * never again (persisted in localStorage so it survives across sessions and
 * doesn't become irritating). Renders nothing; just orchestrates the prompt.
 * Mounted inside the provider tree (Privy + ModalProvider), mirroring
 * FundOnSignIn (which handles the post-sign-in funding prompt instead).
 */
export function OnboardingOnFirstVisit() {
	const { ready, authenticated } = usePrivy();
	const { setModal } = useModal();
	const shown = useRef(false);

	useEffect(() => {
		if (shown.current) return;
		if (!ready) return;
		// Onboarding is an intro for newcomers, so only before sign-in.
		if (authenticated) return;

		let seen = false;
		try {
			seen = localStorage.getItem(STORAGE_KEY) === "1";
		} catch {
			// Private mode / blocked storage: fall back to showing it (once
			// per mount via the ref) rather than erroring.
		}
		if (seen) return;

		shown.current = true;
		try {
			localStorage.setItem(STORAGE_KEY, "1");
		} catch {
			// ignore — worst case it shows again next session
		}

		setModal({
			type: "GENERIC_MODAL",
			showCloseButton: true,
			includeContainerStyling: true,
			children: <Onboarding />,
		});
	}, [ready, authenticated, setModal]);

	return null;
}
