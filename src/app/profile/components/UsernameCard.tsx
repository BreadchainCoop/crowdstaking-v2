"use client";

import { useState } from "react";
import { Heading3, Body, Caption, LiftedButton } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { Copy } from "@phosphor-icons/react";

/**
 * UsernameCard Component
 *
 * Allows users to claim/edit ENS subdomain username (username.breadcooperative.eth)
 *
 * Note: This is currently a UI-only prototype. Full functionality requires:
 * - ENS subdomain registrar smart contract deployment
 * - Contract functions: claimUsername(), getUsernameForAddress(), isUsernameAvailable()
 * - Hooks: useWriteContract, useReadContract with proper ABIs
 */
export function UsernameCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Placeholder state - in production, fetch from smart contract
  const hasUsername = false; // TODO: Replace with useReadContract hook
  const currentUsername = ""; // TODO: Replace with actual username from contract

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUsername(value);

    // Validation
    if (value.length < 3 || value.length > 20) {
      setValidationError("Username must be 3-20 characters");
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(value)) {
      setValidationError("Only letters, numbers, dash, and underscore allowed");
      return;
    }

    // TODO: Add debounced availability check
    // TODO: Add profanity filter check

    setValidationError(null);
  };

  const handleClaim = () => {
    // TODO: Implement smart contract write with useWriteContract
    console.log("Claiming username:", username);
    alert("Username claiming feature coming soon! Smart contract deployment required.");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUsername(currentUsername);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername("");
    setValidationError(null);
  };

  const handleSave = () => {
    // TODO: Implement smart contract write to update username
    console.log("Updating username to:", username);
    alert("Username update feature coming soon!");
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentUsername}.breadcooperative.eth`);
    // TODO: Add toast notification
  };

  const isValid = username.length >= 3 && username.length <= 20 && /^[a-z0-9_-]+$/.test(username) && !validationError;

  return (
    <CardBox className="p-4">
      {!hasUsername && !isEditing ? (
        <div className="flex items-center gap-3">
          <Caption className="text-surface-grey-2 text-xs whitespace-nowrap">
            Username (Coming Soon)
          </Caption>
          <div className="flex gap-2 items-stretch flex-1">
            <input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={handleUsernameChange}
              className="flex-1 px-3 py-1 border border-surface-grey bg-paper-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange"
              disabled
            />
            <div className="px-2 py-1 border border-surface-grey bg-paper-2 rounded text-sm flex items-center">
              <Caption className="text-xs whitespace-nowrap">.breadcooperative.eth</Caption>
            </div>
          </div>
        </div>
      ) : hasUsername && !isEditing ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Caption className="text-surface-grey-2 text-xs">Username:</Caption>
            <Body className="text-sm font-bold">
              {currentUsername}.breadcooperative.eth
            </Body>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-surface-grey-2 hover:text-primary-orange transition-colors"
              aria-label="Copy username"
              type="button"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleEdit}
              className="text-xs text-primary-orange hover:underline"
              type="button"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Caption className="text-surface-grey-2 text-xs whitespace-nowrap">
            Username:
          </Caption>
          <div className="flex gap-2 items-stretch flex-1">
            <input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={handleUsernameChange}
              className="flex-1 px-3 py-1 border border-surface-grey bg-paper-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
            <div className="px-2 py-1 border border-surface-grey bg-paper-2 rounded text-sm flex items-center">
              <Caption className="text-xs whitespace-nowrap">.breadcooperative.eth</Caption>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-3 py-1 bg-primary-orange text-paper-0 rounded text-xs hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 border border-surface-grey rounded text-xs hover:bg-paper-2 transition-colors"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </CardBox>
  );
}
