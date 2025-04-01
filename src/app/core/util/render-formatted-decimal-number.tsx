export const renderFormattedDecimalNumber = (number: string) => {
  const part1 = number.split(".")[0];
  const part2 = number.split(".")[1];

  return (
    <div className="w-full text-end flex tracking-wider text-lg text-breadgray-grey100 dark:text-breadgray-ultra-white leading-none">
      <div className="flex gap-2 font-bold justify-end">
        <span>{part1}</span>
      </div>
      <div>.</div>
      <div className="text-sm font-semibold leading-[1.1] self-end">
        {part2}
      </div>
    </div>
  );
};
