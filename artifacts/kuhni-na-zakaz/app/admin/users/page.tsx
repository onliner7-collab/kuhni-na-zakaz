import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { AddUserForm } from "@/components/admin/AddUserForm";

export const metadata: Metadata = { title: "Пользователи" };

export default async function AdminUsersPage() {
  await requireSuperAdmin();
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true, lastLoginAt: true },
    orderBy: { createdAt: "asc" },
  }).catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Пользователи</h1>
      <div className="card-base overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Имя</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Роль</th>
              <th className="text-left p-3 font-medium">Последний вход</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3">
                  <Badge variant={u.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                    {u.role === "SUPER_ADMIN" ? "Супер Админ" : "Менеджер"}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground text-xs">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("ru") : "Никогда"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-w-md">
        <h2 className="font-semibold text-lg mb-4">Добавить пользователя</h2>
        <AddUserForm />
      </div>
    </div>
  );
}
