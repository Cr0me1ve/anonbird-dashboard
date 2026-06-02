import * as React from "react";
import { memo } from "react";
import AnonBirdIcon from "@/assets/icons/AnonBirdIcon";

const MemoizedAnonBirdIcon = () => {
  return <AnonBirdIcon size={14} />;
};

export default memo(MemoizedAnonBirdIcon);
