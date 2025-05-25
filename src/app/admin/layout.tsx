"use client";

import { ReactNode } from "react";
import AdminGuard from "../../components/admin/AdminGuard";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  );
}
