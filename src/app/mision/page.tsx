// app/mision/page.tsx
import { auth0 } from "@/lib/auth0";
import MisionClient from "./MisionClient";

export const metadata = {
  title: "Misión - Quimera Sneakers",
  description: "Conoce nuestra misión y el propósito detrás de Quimera Sneakers.",
};

export default async function MisionPage() {
  const session = await auth0.getSession();

  return <MisionClient user={session?.user} />;
}
