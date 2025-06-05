// app/contacta/page.tsx
import { auth0 } from "@/lib/auth0";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contacta - Quimera Sneakers",
  description: "¿Tienes alguna consulta, sugerencia o problema? Contacta con nosotros y te ayudaremos.",
};

export default async function ContactPage() {
  const session = await auth0.getSession();

  return <ContactClient user={session?.user} />;
}
