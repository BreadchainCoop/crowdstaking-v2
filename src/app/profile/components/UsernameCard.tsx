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
    <CardBox className="p-6">
      <Heading3 className="mb-4">Username</Heading3>

      {!hasUsername && !isEditing ? (
        <div>
          <Body className="mb-4 text-surface-grey-2 text-sm">
            Claim your personalized ENS subdomain
          </Body>
          <Caption className="mb-3 text-surface-grey-2 block text-xs opacity-70">
            ⚠️ Feature coming soon
          </Caption>
          <div className="flex gap-2 items-stretch mb-3">
            <input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={handleUsernameChange}
              className="flex-1 px-3 py-2 border border-surface-grey bg-paper-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange"
              disabled
            />
            <div className="px-2 py-2 border border-surface-grey bg-paper-2 rounded text-sm flex items-center whitespace-nowrap">
              <Caption className="text-xs">.breadcooperative.eth</Caption>
            </div>
          </div>
          <LiftedButton onClick={handleClaim} disabled>
            Claim Username
          </LiftedButton>
        </div>
      ) : hasUsername && !isEditing ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Body className="text-base font-bold break-all">
              {currentUsername}.breadcooperative.eth
            </Body>
            <button
              onClick={handleCopy}
              className="text-surface-grey-2 hover:text-primary-orange transition-colors flex-shrink-0"
              aria-label="Copy username"
              type="button"
            >
              <Copy size={20} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <Caption className="text-surface-grey-2 text-xs">Your ENS subdomain</Caption>
            <button
              onClick={handleEdit}
              className="text-sm text-primary-orange hover:underline"
              type="button"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Body className="mb-4 text-surface-grey-2 text-sm">
            Update your ENS subdomain
          </Body>
          <div className="flex gap-2 items-stretch mb-3">
            <input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={handleUsernameChange}
              className="flex-1 px-3 py-2 border border-surface-grey bg-paper-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
            <div className="px-2 py-2 border border-surface-grey bg-paper-2 rounded text-sm flex items-center whitespace-nowrap">
              <Caption className="text-xs">.breadcooperative.eth</Caption>
            </div>
          </div>
          {validationError && (
            <Caption className="text-red-500 mb-3 block text-xs">
              {validationError}
            </Caption>
          )}
          <div className="flex gap-2">
            <LiftedButton onClick={handleSave} disabled={!isValid}>
              Save
            </LiftedButton>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-surface-grey rounded text-sm hover:bg-paper-2 transition-colors"
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
