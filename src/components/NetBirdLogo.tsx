import { cn } from "@utils/helpers";
import Image from "next/image";
import * as React from "react";
import NetBirdLogoMark from "@/assets/netbird.svg";

type Props = {
  size?: "default" | "large";
  mobile?: boolean;
};

const sizes = {
  default: {
    desktop: 22,
    mobile: 30,
  },
  large: {
    desktop: 24,
    mobile: 40,
  },
};

export const NetBirdLogo = ({ size = "default", mobile = true }: Props) => {
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
          src={NetBirdLogoMark}
          width={sizes[size].desktop + 7}
          alt={"AnonBird Logo"}
        />
        <span>AnonBird</span>
      </div>
      {mobile && (
        <Image
          src={NetBirdLogoMark}
          width={sizes[size].mobile}
          alt={"AnonBird Logo"}
          className={cn(mobile && "md:hidden ml-4")}
        />
      )}
    </>
  );
};
