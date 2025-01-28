import { forwardRef, Ref, type MouseEvent, type ReactNode } from "react";
import clsx from "clsx";

export type TButtonSize = "small" | "regular" | "large" | "xl";
export type TButtonVariant = keyof typeof ButtonVariants;

interface IProps {
  children: ReactNode;
  onClick: (event: MouseEvent) => void;
  disabled?: boolean;
  size?: TButtonSize;
  variant?: TButtonVariant;
  fullWidth?: boolean;
}

export const ButtonSizes = {
  small: "px-4 py-2 text-sm",
  regular: "px-4 py-2 text-base",
  large: "px-7 py-2.5 text-lg sm:text-lg",
  xl: "px-7 py-3 text-xl sm:text-xl tracking-wider",
};

export const ButtonVariants = {
  primary:
    "bg-breadviolet-shaded text-breadgray-ultra-white \
    dark:bg-breadpink-shaded dark:text-breadgray-og-dark \
    enabled:dark:hover:bg-breadpink-pink enabled:hover:bg-breadviolet-violet \
    disabled:bg-opacity-60",
  secondary:
    "bg-[#FFCCF1] dark:bg-[#402639] text-breadpink-400 dark:text-breadpink-shaded border-2 border-[#FFCCF1] dark:border-[#402639] hover:border-breadpink-400 dark:hover:border-breadpink-shaded hover:transition-[border]",
  danger:
    "bg-status-danger-light dark:bg-status-danger text-breadgray-ultra-white dark:text-breadgray-grey100 bg-opacity-85 hover:bg-opacity-100",
  cancel:
    "text-status-danger-light  transition-all bg-status-danger-light-alpha \
      disabled:text-opacity-50 \
      enabled:hover:outline enabled:hover:outline-2 enabled:hover:outline-status-danger-alpha \
      dark:bg-status-danger dark:bg-opacity-10 dark:text-status-danger",
};

const Button = forwardRef(
  (
    {
      children,
      onClick,
      size = "regular",
      variant = "primary",
      fullWidth = false,
      disabled = false,
    }: IProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          "rounded-xl inline-block font-bold transition-all",
          ButtonSizes[size],
          ButtonVariants[variant],
          fullWidth && "w-full"
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
