import { TransactionType } from "@/app/governance/lp-vaults/components/VaultPanel";
import { type ReactNode, createContext, useContext, useState } from "react";

export type RecastModalState = {
  type: "CONFIRM_RECAST";
  isConfirmed: boolean;
};

export type VoteModalState = {
  type: "VOTE_TRANSACTION";
  hash: string | null;
};

export type BakeryTransactionModalState = {
  type: "BAKERY_TRANSACTION";
  hash: string | null;
};

export type LPVaultTransactionModalState = {
  type: "LP_VAULT_TRANSACTION";
  transactionType: TransactionType;
  parsedValue: bigint;
};

export type ModalState =
  | BakeryTransactionModalState
  | VoteModalState
  | RecastModalState
  | LPVaultTransactionModalState
  | null;
export type ModalContext = {
  modalState: ModalState;
  setModal: (modalState: ModalState) => void;
};

const ModalContext = createContext<ModalContext>({
  modalState: null,
  setModal() {},
});

function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>(null);

  function setModal(modalState: ModalState) {
    setModalState(modalState);
  }

  return (
    <ModalContext.Provider value={{ modalState, setModal }}>
      {children}
    </ModalContext.Provider>
  );
}

const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export { ModalProvider, useModal };
