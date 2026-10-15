"use client";

import { usePathname } from "next/navigation";
import { isTunnel } from "./tunnel";

export default function TunnelAware({ children, tunnel }: { children: React.ReactNode; tunnel: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  return <>{isTunnel(pathname) ? tunnel : children}</>;
}
