import { forwardRef, Ref, type MouseEvent, type ReactNode } from "react";
import clsx from "clsx";

export type TButtonVariant = "small" | "regular" | "large" | "xl";

interface IProps {
  children: ReactNode;
  onClick: (event: MouseEvent) => void;
  disabled?: boolean;
  variant?: TButtonVariant;
  fullWidth?: boolean;
}

export const ButtonVariants = {
  small: "px-4 py-2 text-sm",
  regular: "px-4 py-2 text-base",
  large: "px-7 py-2.5 text-lg sm:text-lg",
  xl: "px-7 py-3 text-xl sm:text-xl tracking-wider",
};

const Button = forwardRef(
  (
    {
      children,
      onClick,
      variant = "regular",
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
          " bg-breadviolet-shaded dark:bg-breadpink-shaded text-breadgray-ultra-white dark:text-breadgray-og-dark disabled:bg-opacity-60 rounded-xl inline-block font-bold",
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
