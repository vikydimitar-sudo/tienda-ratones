import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Iniciar sesión — RatónStore" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthForm mode="login" next={next ?? "/"} />;
}
