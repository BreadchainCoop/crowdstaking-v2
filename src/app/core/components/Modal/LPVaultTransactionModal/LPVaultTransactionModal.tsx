import { useEffect } from "react";
import {
  LPVaultTransactionModalState,
  useModal,
} from "../../../context/ModalContext";
// import { ModalContainer } from "../LPModalUI";
import {
  // ModalAdviceText,
  ModalContainer,
  // ModalContent,
  // ModalHeading,
  // transactionIcons,
  // TransactionValue,
} from "../ModalUI";
import { useConnectedUser } from "../../../hooks/useConnectedUser";
import { LockingTransaction } from "./Locking/LockingTransaction";
import { WithdrawTransaction } from "./WithdrawTransaction";

export function LPVaultTransactionModal({
  modalState,
}: {
  modalState: LPVaultTransactionModalState;
}) {
  const { user } = useConnectedUser();

  const { setModal } = useModal();

  useEffect(() => {
    if (user.status !== "CONNECTED") {
      setModal(null);
    }
  }, [user, setModal]);

  return (
    <ModalContainer className="max-w-[35.1875rem]!">
      {user.status === "CONNECTED" &&
        (modalState.transactionType === "LOCK" ? (
          <LockingTransaction user={user} modalState={modalState} />
        ) : (
          <WithdrawTransaction user={user} modalState={modalState} />
        ))}
    </ModalContainer>
  );
}
