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

// Interfaz para incluir permisos
interface UserWithPermissions extends Auth0User {
  permissions?: string[];
}

export default async function Page() {
  const session = await auth0.getSession();
  
  let userWithPermissions: UserWithPermissions | undefined;
  
  if (session?.user) {
    userWithPermissions = { ...session.user } as UserWithPermissions;
    userWithPermissions.permissions = [];
  }
  
  return <HomePage user={userWithPermissions} />;
}
