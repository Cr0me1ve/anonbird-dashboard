import Image from "next/image";
import * as React from "react";
import { memo } from "react";
import NetBirdLogo from "@/assets/anonbird-logo.png";

type Props = {
  size?: number;
  className?: string;
};
function NetBirdIcon({ size = 16, className }: Props) {
  return (
    <Image
      src={NetBirdLogo}
      alt={"AnonBird Icon"}
      width={size}
      className={className}
    />
  );
}

export default memo(NetBirdIcon);
