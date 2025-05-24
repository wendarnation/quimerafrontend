"use client";

import Home from "./HomePage";
import { useUser } from "@auth0/nextjs-auth0/client";

// Definimos una interfaz personalizada para el usuario de Auth0
interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  [key: string]: any;
}

export default function ClientHomePage() {
  const { user, isLoading } = useUser();

  // Durante la carga, mostrar la página sin usuario
  if (isLoading) {
    return <Home />;
  }

  return <Home user={user as Auth0User} />;
}
