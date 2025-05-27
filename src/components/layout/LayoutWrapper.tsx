// components/layout/LayoutWrapper.tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "../Navbar";
import { AuthUser } from "../../types/auth";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (query: string) => {
    router.push(`/browse?search=${encodeURIComponent(query)}`);
  };

  const handleCategorySelect = (category: string) => {
    router.push(`/browse?categoria=${encodeURIComponent(category)}`);
  };

  // Páginas que no deben mostrar el navbar (si las hay)
  const hideNavbarRoutes: string[] = [
    // Añadir aquí rutas donde no quieras el navbar, como páginas de auth
    // "/auth/login", 
    // "/auth/callback"
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  // Convertir el user de Auth0 al tipo que esperamos
  const authUser: AuthUser | undefined = user ? {
    ...user,
    sub: user.sub,
    name: user.name,
    email: user.email,
    picture: user.picture,
    email_verified: user.email_verified
  } : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          user={authUser}
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
        />
      )}
      {children}
    </>
  );
}
