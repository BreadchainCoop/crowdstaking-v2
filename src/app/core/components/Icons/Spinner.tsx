import CircularProgress from "@/app/components/circular-progress";

export function Spinner({ className }: { className?: string }) {
  return <CircularProgress className={className} />
  // return (
  //   <svg
  //     className="stroke-current fill-current"
  //     viewBox="0 0 24 24"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <g className="spinner_QPB9">
  //       <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="2"></circle>
  //     </g>
  //   </svg>
  // );
}
