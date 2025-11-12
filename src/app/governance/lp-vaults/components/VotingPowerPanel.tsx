import { ReactElement } from "react";
import { CardBox } from "@/app/core/components/CardBox";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import { AccountMenu } from "@/app/core/components/Header/AccountMenu";
import {
  TUnsupportedChain,
  TUserConnected,
  useConnectedUser,
} from "@/app/core/hooks/useConnectedUser";
import { useVotingPower } from "../../context/VotingPowerContext";
import { formatBalance } from "@/app/core/util/formatter";
import { useCurrentAccumulatedVotingPower } from "../../useCurrentAccumulatedVotingPower";
import Elipsis from "@/app/core/components/Elipsis";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useCycleLength } from "../../useCycleLength";
import { useVaultTokenBalance } from "../context/VaultTokenBalanceContext";
import Tooltip from "@/app/core/components/Tooltip";
import { useDistributions } from "../../useDistributions";
import { useChainModal } from "@rainbow-me/rainbowkit";
import Button from "@/app/core/components/Button";
import { Caption, Body, Heading2, Heading4 } from "@breadcoop/ui";
import { HowDoesThisWorkButton } from "@/app/core/components/HowDoesThisWorkButton";

export function VotingPowerPanel() {
  const { user } = useConnectedUser();
  const { openChainModal } = useChainModal();

  const votingPower = useVotingPower();
  const vaultTokenBalance = useVaultTokenBalance();
  const { totalDistributions } = useDistributions();
  const { BREAD } = useTokenBalances();

  const renderFormattedDecimalNumber = (
    number: string,
    icon?: ReactElement
  ) => {
    const part1 = number.split(".")[0];
    const part2 = number.split(".")[1];

    return (
      <div className="w-full flex justify-center">
        <div className=" flex gap-2 justify-end">
          {icon && <div className="mt-1">{icon}</div>}
          <Heading2 className="text-[48px]">{part1}</Heading2>
        </div>
        <div>.</div>
        <Heading2 className="text-[24px] text-surface-grey-2 leading-[1.1] w-[56px] self-end">
          {part2}
        </Heading2>
      </div>
    );
  };

  return (
		<div>
			<div className="lg:ml-auto">
				<CardBox>
					<div className="p-4 flex flex-col items-center gap-4">
						<Heading4 className="text-surface-grey-2 text-[24px]">
							My voting power
						</Heading4>
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<div className="w-full leading-none">
									{votingPower &&
									votingPower.bread.status === "success" &&
									votingPower.butteredBread.status ===
										"success" ? (
										renderFormattedDecimalNumber(
											formatBalance(
												Number(
													votingPower.bread.value +
														votingPower
															.butteredBread.value
												) /
													10 ** 18,
												1
											),
											// <FistIcon bg="burnt" />
											<FistIcon />
										)
									) : (
										<div className="flex justify-center items-center">
											{/* <FistIcon bg="burnt" /> */}
											<FistIcon />
											<span className="ms-2">-</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex items-center gap-2 font-medium text-xs">
								<Caption className="pb-1 text-surface-grey">
									Accessible voting power
								</Caption>
								<Tooltip>
									Your total available voting power for the
									current voting cycle #
									{totalDistributions
										? totalDistributions + 1 + "."
										: "-"}
								</Tooltip>
							</div>
						</div>

						{/* voting power grid */}
						<div className="w-full grid grid-cols-[repeat(2, max-content)] gap-3">
							<DividerWithText text="Breakdown" />

							<Body className="text-surface-grey">
								Voting power from locked LP
							</Body>

							<span className="font-bold text-right">
								{votingPower &&
								votingPower.butteredBread.status === "success"
									? formatBalance(
											Number(
												votingPower.butteredBread.value
											) /
												10 ** 18,
											1
									  )
									: "-"}
							</span>

							<Body className="text-surface-grey">
								Voting power from $BREAD
							</Body>
							<Body bold className="text-right">
								{votingPower &&
								votingPower.bread.status === "success"
									? formatBalance(
											Number(votingPower.bread.value) /
												10 ** 18,
											1
									  )
									: "-"}
							</Body>
							<DividerWithText text="Source(s)" />

							<Body className="text-surface-grey">
								Total locked LP tokens
							</Body>

							<Body
								bold
								className="text-right text-primary-orange"
							>
								{vaultTokenBalance &&
								vaultTokenBalance.butter.status === "success"
									? formatBalance(
											Number(
												vaultTokenBalance.butter.value
											) /
												10 ** 18,
											0
									  )
									: "-"}
							</Body>

							{user.status === "CONNECTED" ||
								(user.status === "UNSUPPORTED_CHAIN" && (
									<>
										<Body className="text-surface-grey">
											Total $BREAD baked
										</Body>

										<Body bold className="text-right">
											{BREAD && BREAD.status === "SUCCESS"
												? formatBalance(
														parseFloat(BREAD.value),
														2
												  )
												: "-"}
										</Body>
									</>
								))}

							{user.status === "CONNECTED" ||
							user.status === "UNSUPPORTED_CHAIN" ? (
								<>
									<DividerWithText text="Future voting power" />

									<div className="flex items-center gap-2">
										<Body className="pb-1 text-surface-grey">
											Pending voting power
										</Body>
										<Tooltip>
											The voting power you will receive in
											the next voting cycle.
										</Tooltip>
									</div>

									<Body bold className="text-right w-27">
										<PendingVotingPowerDisplay
											user={user}
										/>
									</Body>
								</>
							) : (
								<></>
							)}

							{user.status === "CONNECTED" ? (
								<></>
							) : user.status === "UNSUPPORTED_CHAIN" ? (
								<div className="col-span-2 pt-3">
									<Button
										fullWidth={true}
										size="large"
										variant="danger"
										onClick={() => openChainModal?.()}
									>
										Change network
									</Button>
								</div>
							) : (
								<div className="col-span-2 pt-3">
									<AccountMenu size="large" fullWidth>
										Connect
									</AccountMenu>
								</div>
							)}
						</div>
						<HowDoesThisWorkButton href="https://breadchain.notion.site/Voting-Power-LP-Vaults-15e0ad9b12798026a4e6cb917c3137a5?pvs=74" />
					</div>
				</CardBox>
			</div>
		</div>
  );
}

function DividerWithText({ text }: { text: string }) {
  return (
    <div className="flex col-span-2 py-2 h-[1px] items-center">
      <div className="flex-1 border-t border-primary-orange"></div>
      <Caption className="px-2 text-surface-grey">{text}</Caption>
      <div className="flex-1 border-t border-primary-orange"></div>
    </div>
  );
}

function PendingVotingPowerDisplay({
  user,
}: {
  user: TUserConnected | TUnsupportedChain;
}) {
  const {
    status: currentAccumulatedVotingPowerStatus,
    data: currentAccumulatedVotingPowerData,
  } = useCurrentAccumulatedVotingPower(user);

  const { cycleLength } = useCycleLength();

  return currentAccumulatedVotingPowerStatus === "success" &&
    cycleLength.status === "SUCCESS" &&
    currentAccumulatedVotingPowerData ? (
    formatBalance(
      Number(currentAccumulatedVotingPowerData) / 10 ** 18 / cycleLength.data,
      1
    )
  ) : (
    <Elipsis />
  );
}
