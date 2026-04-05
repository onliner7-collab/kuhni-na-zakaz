"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddUserForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"), name: fd.get("name"),
          password: fd.get("password"), role: fd.get("role"),
        }),
      });
      if (res.ok) {
        toast.success("Пользователь добавлен");
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        const d = await res.json();
        toast.error(d.error || "Ошибка добавления");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-base p-6 space-y-4">
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="password">Пароль (мин. 8 символов)</Label>
        <Input id="password" name="password" type="password" minLength={8} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="role">Роль</Label>
        <select name="role" className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="MANAGER">Менеджер</option>
          <option value="SUPER_ADMIN">Супер Админ</option>
        </select>
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Добавляем..." : "Добавить"}</Button>
    </form>
  );
}
