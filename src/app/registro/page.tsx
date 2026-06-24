import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Crear cuenta — RatónStore" };

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthForm mode="registro" next={next ?? "/"} />;
}
