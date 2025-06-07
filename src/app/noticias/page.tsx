// app/noticias/page.tsx
import { auth0 } from "@/lib/auth0";
import NoticiasClient from "./NoticiasClient";

export const metadata = {
  title: "Noticias - Quimera Sneakers",
  description: "Mantente al día con las últimas noticias del mundo sneaker. Editoriales, lanzamientos y tendencias en Quimera Sneakers.",
};

export default async function NoticiasPage() {
  const session = await auth0.getSession();

  return <NoticiasClient user={session?.user} />;
}
