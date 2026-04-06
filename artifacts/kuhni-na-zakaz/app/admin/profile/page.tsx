import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Мой профиль — Админ" };

export default async function AdminProfilePage() {
  const session = await requireAdmin();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Мой профиль</h1>
        <p className="text-muted-foreground mt-1">Измените логин, имя и пароль для входа в панель</p>
      </div>
      <div className="card-base p-6">
        <ProfileForm user={{ login: user?.email ?? "", name: user?.name ?? "", role: user?.role ?? "" }} />
      </div>
    </div>
  );
}
