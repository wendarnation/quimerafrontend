import { auth0 } from "@/lib/auth0";
import Navbar from "@/components/Navbar";
import ZapatillasList from "@/components/ZapatillasList";

// Definimos una interfaz personalizada para el usuario de Auth0
interface Auth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  [key: string]: any; // Para cualquier propiedad adicional
}

export default async function Home() {
  const session = await auth0.getSession();

  // Si el usuario está autenticado, mostramos la página con contenido para usuarios autenticados
  if (session && session.user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={session.user as Auth0User} />

        <main className="flex-grow flex flex-col items-center justify-center p-10">
          <div className="max-w-5xl w-full">
            <h1 className="text-4xl font-bold mb-6">
              Bienvenido, {session.user.name || "Usuario"}
            </h1>

            <h2 className="text-2xl font-semibold mb-4">Prueba Api</h2>

            <ZapatillasList />
          </div>
        </main>
      </div>
    );
  }

  // Si no está autenticado, mostramos la landing page original
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Bienvenido a Quimera Sneakers
        </h1>
        <p className="text-xl mb-8 text-center">
          Prueba de login y peticiones a api
        </p>

        <div className="flex justify-center">
          <a
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 text-white
          rounded-md hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </main>
  );
}
