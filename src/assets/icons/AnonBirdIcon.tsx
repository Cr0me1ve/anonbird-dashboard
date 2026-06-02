import Image from "next/image";
import * as React from "react";
import { memo } from "react";
import AnonBirdLogo from "@/assets/anonbird-logo-square.png";

type Props = {
  size?: number;
  className?: string;
};

function AnonBirdIcon({ size = 16, className }: Props) {
  return (
    <Image
      src={AnonBirdLogo}
      alt={"AnonBird Icon"}
      width={size}
      height={size}
      className={className}
    />
  );
}

export default memo(AnonBirdIcon);
