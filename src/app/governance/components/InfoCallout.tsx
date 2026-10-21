import Image from "next/image";

export function InfoCallout() {
  return (
    <a
      className="grow max-h-[200px] relative rounded-lg overflow-clip border border-breadgray-light-grey dark:border dark:border-breadgray-toast dark:hover:border-breadgray-light-grey transition-colors"
      href="https://www.notion.so/breadchain/Understanding-BREAD-Voting-Power-0f2d350320b94e4ba9aeec2ef6fdcb84"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="absolute top-0 left-0 w-full h-full ">
        <Image
          className="h-full object-cover"
          width="352"
          height="188"
          src="cyber_bg.png"
          alt="cosy background image"
        />
      </div>
      <div className="h-full flex flex-col justify-center backdrop-blur-sm bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-80 p-4 py-16 lg:py-0 text-center">
        <div>
          <svg
            className="absolute top-4 right-4 w-6 h-6"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 0.674316H2C1.46957 0.674316 0.960859 0.88503 0.585786 1.2601C0.210714 1.63518 0 2.14388 0 2.67432V22.6743C0 23.2047 0.210714 23.7135 0.585786 24.0885C0.960859 24.4636 1.46957 24.6743 2 24.6743H22C22.5304 24.6743 23.0391 24.4636 23.4142 24.0885C23.7893 23.7135 24 23.2047 24 22.6743V2.67432C24 2.14388 23.7893 1.63518 23.4142 1.2601C23.0391 0.88503 22.5304 0.674316 22 0.674316ZM22 22.6743H2V2.67432H22V22.6743ZM7.2925 17.3818C7.19952 17.2889 7.12576 17.1787 7.07544 17.0573C7.02512 16.9359 6.99921 16.8057 6.99921 16.6743C6.99921 16.5429 7.02512 16.4128 7.07544 16.2914C7.12576 16.17 7.19952 16.0597 7.2925 15.9668L13.5863 9.67432H10C9.73478 9.67432 9.48043 9.56896 9.29289 9.38142C9.10536 9.19389 9 8.93953 9 8.67432C9 8.4091 9.10536 8.15475 9.29289 7.96721C9.48043 7.77967 9.73478 7.67432 10 7.67432H16C16.2652 7.67432 16.5196 7.77967 16.7071 7.96721C16.8946 8.15475 17 8.4091 17 8.67432V14.6743C17 14.9395 16.8946 15.1939 16.7071 15.3814C16.5196 15.569 16.2652 15.6743 16 15.6743C15.7348 15.6743 15.4804 15.569 15.2929 15.3814C15.1054 15.1939 15 14.9395 15 14.6743V11.0881L8.7075 17.3818C8.61463 17.4748 8.50434 17.5486 8.38294 17.5989C8.26154 17.6492 8.13142 17.6751 8 17.6751C7.86858 17.6751 7.73846 17.6492 7.61706 17.5989C7.49566 17.5486 7.38537 17.4748 7.2925 17.3818Z"
              fill="#E873D3"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-2xl">What the BREAD is this?</h3>
          <p className="dark:text-breadgray-light-grey">
            Discover more about voting power, governance & BREAD distribution.
          </p>
        </div>
      </div>
    </a>
  );
}
