import { ModalContainer, ModalContent, ModalHeading } from "./ModalUI";
import { ConfirmBurnModalState, ModalState } from "../../context/ModalContext";
import Button from "@/app/core/components/Button/Button";
import { BreadIcon, XDAIIcon } from "@/app/core/components/Icons/TokenIcons";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import SwapBreadButton from "@/app/bakery/components/Swap/SwapBreadButton";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { useModal } from "@/app/core/context/ModalContext";

export function ConfirmBurnModal({
  modalState,
}: {
  modalState: ConfirmBurnModalState;
}) {
  const { transactionsState, transactionsDispatch } = useTransactions();
  const { setModal } = useModal();

  function confirmBurn({
    write,
    xdaiValue,
  }: {
    write: Function | undefined;
    xdaiValue: string;
  }) {
    if (!write) return;
    transactionsDispatch({
      type: "NEW",
      payload: {
        data: {
          type: "BURN",
          value: xdaiValue,
        },
      },
    });
    setModal({
      type: "BAKERY_TRANSACTION",
      hash: null,
    });
    write();
  }

  return (
    <ModalContainer>
      <ModalHeading>Important to know</ModalHeading>
      <ModalContent>
        <div className="w-full p-4 rounded-xl dark:text-breadgray-grey text-breadgray-rye border dark:border-breadgray-burnt border-breadgray-light-grey">
          <div className="flex mb-6 justify-between items-center">
            <p className="text-left">You are about to burn</p>
            <span className="flex gap-2 dark:text-breadgray-ultra-white font-bold">
              <BreadIcon bg="burnt" />
              {modalState.breadValue}
            </span>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="text-left">You will receive</p>
            <span className="flex gap-2 dark:text-breadgray-ultra-white font-bold">
              <XDAIIcon />
              {modalState.xdaiValue}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-10 border border-status-danger p-3 rounded-xl">
          <div className="col-span-1 flex mt-1 justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 0H10V2H8V4H6V6H4V8H2V10H0V12H2V14H4V16H6V18H8V20H10V22H12V20H14V18H16V16H18V14H20V12H22V10H20V8H18V6H16V4H14V2H12V0ZM12 2V4H14V6H16V8H18V10H20V12H18V14H16V16H14V18H12V20H10V18H8V16H6V14H4V12H2V10H4V8H6V6H8V4H10V2H12ZM12 6H10V12H12V6ZM12 14H10V16H12V14Z"
                fill="#D8745C"
              />
            </svg>
          </div>

          <div className="col-span-9 text-breadgray-rye dark:text-breadgray-light-grey">
            <p>
              Burning $BREAD will reduce crucial funding for our post-capitalist
              cooperatives.
              <b>
                To continue supporting the Breadchain network, consider swapping
                your $BREAD instead.
              </b>
            </p>
          </div>
        </div>

        <div className="w-full">
          <ExternalLink href={"/"}>
            <SwapBreadButton withRecommended={false} />
          </ExternalLink>
        </div>
        <Button
          fullWidth={true}
          size="xl"
          variant={"cancel"}
          onClick={() => {
            confirmBurn({
              write: modalState.write,
              xdaiValue: modalState.xdaiValue,
            });
          }}
        >
          Burn
        </Button>
      </ModalContent>
    </ModalContainer>
  );
}
