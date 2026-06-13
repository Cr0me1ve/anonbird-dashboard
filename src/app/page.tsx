"use client";

import FullScreenLoading from "@components/ui/FullScreenLoading";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { useRedirect } from "@hooks/useRedirect";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  url: string;
  queryParams?: string;
};

export default function Home() {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);
  const [tempQueryParams, setTempQueryParams] = useLocalStorage(
    "netbird-query-params",
    "",
  );
  const [queryParams, setQueryParams] = useState("");

  useEffect(() => {
    setQueryParams(tempQueryParams);
    setTempQueryParams("");
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return mounted ? (
    <Redirect
      url={path || "/"}
      queryParams={queryParams}
    />
  ) : (
    <FullScreenLoading />
  );
}

const Redirect = ({ url, queryParams }: Props) => {
  const params = queryParams && `?${queryParams}`;
  useRedirect(url == "/" ? `/peers${params}` : `${url}${params}`, true);
  return <FullScreenLoading />;
};
