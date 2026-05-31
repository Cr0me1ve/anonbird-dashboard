import { globalMetaTitle } from "@utils/meta";
import type { Metadata } from "next";
import AppLayout from "@/layouts/AppLayout";

export const metadata: Metadata = {
  title: `${globalMetaTitle}`,
  description:
    "AnonBird combines an anonymous private mesh network and a centralized access control system in a single open-source platform",
};
export default AppLayout;
