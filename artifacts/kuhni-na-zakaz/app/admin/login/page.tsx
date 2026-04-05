import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Вход в панель управления",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ from?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");
  const { from } = await searchParams;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold">КухниMinsk</h1>
          <p className="text-muted-foreground text-sm mt-1">Панель управления</p>
        </div>
        <LoginForm redirectTo={from || "/admin/dashboard"} />
      </div>
    </div>
  );
}
