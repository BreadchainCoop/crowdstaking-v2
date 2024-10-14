export default function NotFound() {
  return (
    <div>
      <div className="flex flex-col items-center my-10">
        <h1 className="text-[2.5rem] font-pressstart uppercase leading-tight">
          <span>404</span>
        </h1>
        <h2 className="uppercase md:text-2xl font-normal">
          <span>Page not found</span>
        </h2>
        <hr className="w-1/4 max-w-[160px] border-breadpink-shaded my-6" />
        <div className="flex flex-col items-center max-w-[250px]">
          <p className="leading-tight text-center">
            Post-Capitalism can only be achieved through perserverance.
          </p>
          <p className="leading-tight text-center">Please try again later.</p>
        </div>
        <a
          href="/"
          className="px-5 py-2 my-6 text-base rounded-xl inline-block font-bold transition-all bg-breadviolet-shaded dark:bg-breadpink-shaded text-breadgray-ultra-white dark:text-breadgray-og-dark disabled:bg-opacity-60"
        >
          Return home
        </a>
      </div>
    </div>
  );
}
