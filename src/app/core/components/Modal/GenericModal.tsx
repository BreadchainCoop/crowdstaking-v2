// This is a generic wrapper for any custom modal UI. Will still get the presentation transition and backdrop.
import { ModalContainer } from "./ModalUI";
import { GenericModalState } from "../../context/ModalContext";

export function GenericModal({ 
    modalState
}: { 
    modalState: GenericModalState
}) {
  return (
    <ModalContainer showCloseButton={modalState.showCloseButton} includeContainerStyling={modalState.includeContainerStyling}>
      {modalState.children}
    </ModalContainer>
  );
}