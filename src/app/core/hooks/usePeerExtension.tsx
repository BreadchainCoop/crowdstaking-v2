"use client";

import { useState, useEffect, useCallback } from "react";
import { peerExtensionSdk, peerConfig } from "@/lib/peer";
import { useToast } from "@/app/core/context/ToastContext/ToastContext";

export type PeerExtensionState =
  | 'loading'
  | 'needs_install'
  | 'needs_connection'
  | 'ready'
  | 'not_available';

export interface OnrampParams {
  inputAmount?: string;
  recipientAddress?: string;
}

export function usePeerExtension() {
  const [state, setState] = useState<PeerExtensionState>('loading');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toastDispatch } = useToast();

  // Check extension state on mount
  useEffect(() => {
    const checkExtension = async () => {
      try {
        if (!peerExtensionSdk.isAvailable()) {
          setState('not_available');
          return;
        }

        const extensionState = await peerExtensionSdk.getState();
        setState(extensionState);
      } catch (error) {
        console.error('Failed to check Peer extension:', error);
        setState('not_available');
      }
    };

    checkExtension();
  }, []);

  // Subscribe to proof completion events
  useEffect(() => {
    if (state !== 'ready') return;

    const unsubscribe = peerExtensionSdk.onProofComplete((data) => {
      toastDispatch({
        type: "CUSTOM",
        payload: {
          variant: "success",
          message: "Purchase completed! Your xDAI should arrive shortly.",
        },
      });
    });

    return () => unsubscribe();
  }, [state, toastDispatch]);

  const openInstall = useCallback(() => {
    peerExtensionSdk.openInstallPage();
  }, []);

  const requestConnection = useCallback(async () => {
    setIsConnecting(true);
    try {
      await peerExtensionSdk.requestConnection();
      setState('ready');
      toastDispatch({
        type: "CUSTOM",
        payload: {
          variant: "success",
          message: "Peer extension connected successfully!",
        },
      });
    } catch (error) {
      console.error('Failed to connect to Peer extension:', error);
      toastDispatch({
        type: "CUSTOM",
        payload: {
          variant: "error",
          message: "Failed to connect to Peer extension. Please try again.",
        },
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toastDispatch]);

  const startOnramp = useCallback((params: OnrampParams) => {
    try {
      peerExtensionSdk.onramp({
        referrer: peerConfig.referrer,
        referrerLogo: peerConfig.referrerLogo,
        toToken: peerConfig.toToken,
        inputCurrency: peerConfig.inputCurrency,
        ...(params.inputAmount && { inputAmount: params.inputAmount }),
        ...(params.recipientAddress && { recipientAddress: params.recipientAddress }),
      });
    } catch (error) {
      console.error('Failed to start onramp:', error);
      toastDispatch({
        type: "CUSTOM",
        payload: {
          variant: "error",
          message: "Failed to start purchase. Please try again.",
        },
      });
    }
  }, [toastDispatch]);

  return {
    state,
    isAvailable: state !== 'not_available',
    isReady: state === 'ready',
    isConnecting,
    openInstall,
    requestConnection,
    startOnramp,
  };
}
