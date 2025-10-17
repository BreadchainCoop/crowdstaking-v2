import Link from "next/link";
import { LogoSVG } from "../Icons/Logo";
import { Logo as UILogo } from "@breadcoop/ui";

export function Logo() {
  return (
    <Link href="/">
      <UILogo />
    </Link>
  );
  // return (
  //   <div className="flex items-center">
  //     <Link href="/" className="w-8 h-8">
  //       <LogoSVG />
  //     </Link>
  //   </div>
  // );
}

export default Logo;
