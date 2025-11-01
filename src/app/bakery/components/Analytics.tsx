"use client";

import { LiftedButton } from "@breadcoop/ui";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export const ViewAnalytics = () => {
  const router = useRouter();

  return (
    <LiftedButton
      preset="stroke"
      onClick={() => {
        window.open(
          "https://dune.com/bread_cooperative/solidarity",
          "_blank"
        );
      }}
      rightIcon={<ArrowUpRightIcon color="var(--color-primary-orange)" />}
    >
      View analytics
    </LiftedButton>
  );
};
