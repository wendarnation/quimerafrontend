// components/layout/LayoutWrapper.tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "../Navbar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (query: string) => {
    router.push(`/browse?search=${encodeURIComponent(query)}`);
  };

  const handleCategorySelect = (category: string) => {
    router.push(`/browse?categoria=${encodeURIComponent(category)}`);
  };

  // Páginas que no deben mostrar el navbar (si las hay)
  const hideNavbarRoutes = [
    // Añadir aquí rutas donde no quieras el navbar, como páginas de auth
    // "/auth/login", 
    // "/auth/callback"
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          user={user}
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
        />
      )}
      {children}
    </>
  );
}
