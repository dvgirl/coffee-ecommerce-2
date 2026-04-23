"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminAppShellProps = {
  children: ReactNode;
};

export default function AdminAppShell({ children }: AdminAppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(178,124,78,0.16),_transparent_28%),linear-gradient(180deg,_#f8f1e7_0%,_#fcfaf7_34%,_#f3ece3_100%)] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      {isLoginPage ? (
        <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center">
          {children}
        </main>
      ) : (
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
          <AdminSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      )}
    </div>
  );
}
