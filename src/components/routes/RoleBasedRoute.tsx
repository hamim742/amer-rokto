"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import ProtectedRoute from "./ProtectedRoute";

export default function RoleBasedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const role = useAppSelector((state) => state.auth.user?.role);
  const router = useRouter();
  const allowed = Boolean(role && allowedRoles.includes(role));

  useEffect(() => {
    if (role && !allowed) {
      router.replace("/dashboard");
    }
  }, [allowed, role, router]);

  return <ProtectedRoute>{allowed ? children : null}</ProtectedRoute>;
}
