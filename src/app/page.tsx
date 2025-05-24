import { auth0 } from "@/lib/auth0";
import HomePage from "./HomePage";

// Definimos una interfaz personalizada para el usuario de Auth0
interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  [key: string]: any; // Para cualquier propiedad adicional
}

export default async function Page() {
  const session = await auth0.getSession();
  
  // Siempre mostramos la HomePage, pero pasamos el usuario si existe
  return <HomePage user={session?.user as Auth0User | undefined} />;
}
