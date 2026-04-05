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
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}>
              <span className="text-white font-black text-sm">К</span>
            </div>
            <span className="font-black text-2xl text-foreground">Кухни<span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BY</span></span>
          </div>
          <p className="text-muted-foreground text-sm">Панель управления</p>
        </div>
        <LoginForm redirectTo={from || "/admin/dashboard"} />
      </div>
    </div>
  );
}
