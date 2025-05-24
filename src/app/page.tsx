import { auth0 } from "@/lib/auth0";
import HomePage from "./HomePage";

// Definimos una interfaz para el usuario de Auth0
interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  nickname?: string;
  [key: string]: any;
}

export default async function Page() {
  const session = await auth0.getSession();
  
  // Pasamos el usuario si existe
  return <HomePage user={session?.user as Auth0User | undefined} />;
}
