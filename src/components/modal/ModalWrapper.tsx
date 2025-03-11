"use client";

import { usePathname } from "next/navigation";

export default function ModalWrapper({ modals }: { modals: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/auth") return null;

  return <>{modals}</>;
}
