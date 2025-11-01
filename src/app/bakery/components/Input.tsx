import type { ChangeEvent } from "react";

type TProps = {
  name: string;
  value: string;
  /* eslint-disable-next-line no-unused-vars */
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Input({ name, value, handleInputChange }: TProps) {
  return (
    <input
      name={name}
      // className="min-w-0 px-3 leading-3 truncate text-ellipsis text-[2.3rem] sm:text-[2.5rem] text-breadgray-grey100 dark:text-neutral-200 bg-breadgray-ultra-white dark:bg-breadgray-grey300 placeholder-breadgray-grey100 dark:placeholder-neutral-200"
      className="min-w-0 leading-3 truncate text-ellipsis text-[2.3rem] sm:text-[2.5rem] text-black focus-visible:outline-none"
      // focus:outline-0 focus:outline-none
      placeholder="00.00"
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      minLength={1}
      maxLength={79}
      spellCheck="false"
      onChange={handleInputChange}
      value={value}
    />
  );
}

export default Input;
