export function UserIcon({ size = 3 }: { size?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  return (
    <svg
      className={`fill-current w-${size} h-${size}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15 2H9V3.99994H7.00024V9.99994H9.00024V4H15V2ZM15 10H9V12H15V10ZM15.0002 3.99994H17.0002V9.99994H15.0002V3.99994ZM4 15.9999H6V14H18V16H6V20H18.0002V15.9999H20.0002V21.9999H20V22H4V21.9999V20V15.9999Z"
        fill="#E873D3"
      />
    </svg>
  );
}
