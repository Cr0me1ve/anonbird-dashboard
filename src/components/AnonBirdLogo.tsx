import { cn } from "@utils/helpers";
import Image from "next/image";
import * as React from "react";
import AnonBirdLogoMark from "@/assets/anonbird-logo.png";
import AnonBirdLogoSquare from "@/assets/anonbird-logo-square.png";

type Props = {
  size?: "default" | "large";
  mobile?: boolean;
};

const sizes = {
  default: {
    desktop: 38,
    mobile: 32,
  },
  large: {
    desktop: 42,
    mobile: 40,
  },
};

export const AnonBirdLogo = ({ size = "default", mobile = true }: Props) => {
  return (
    <>
      <div
        className={cn(
          "items-center gap-2 font-semibold text-nb-gray-50",
          size === "large" ? "text-2xl" : "text-xl",
          mobile ? "hidden md:inline-flex" : "inline-flex",
        )}
      >
        <Image
          src={AnonBirdLogoMark}
          width={sizes[size].desktop}
          alt={"AnonBird Logo"}
        />
        <span>AnonBird</span>
      </div>
      {mobile && (
        <Image
          src={AnonBirdLogoSquare}
          width={sizes[size].mobile}
          height={sizes[size].mobile}
          alt={"AnonBird Logo"}
          className={cn(mobile && "md:hidden ml-4")}
        />
      )}
    </>
  );
};
