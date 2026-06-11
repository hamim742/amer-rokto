"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (token) {
      router.replace(pathname === "/login" ? "/" : "/dashboard");
    }
  }, [pathname, router, token]);

  if (token) {
    return null;
  }

  return <>{children}</>;
}
