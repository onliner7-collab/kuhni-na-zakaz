"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Copy, Trash2 } from "lucide-react";

interface GuestAccess {
  id: number; name: string; loginToken: string; allowedSections: string[];
  allowedActions: string[]; expiresAt: string; revokedAt: string | null;
  createdAt: string; createdBy: { name: string };
}

const SECTIONS = ["reviews", "kitchens", "portfolio", "blog", "prices", "settings"];
const ACTIONS = ["read", "publish", "reject", "edit", "delete"];

export function GuestAccessList({ accesses: initial }: { accesses: GuestAccess[] }) {
  const [accesses, setAccesses] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>(["reviews"]);
  const [selectedActions, setSelectedActions] = useState<string[]>(["read", "publish", "reject"]);
  const router = useRouter();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/kapi/admin/guest-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), expiresAt: fd.get("expiresAt"),
          allowedSections: selectedSections, allowedActions: selectedActions,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Создан. Ссылка: ${baseUrl}${data.loginUrl}`);
        router.refresh();
      } else {
        toast.error("Ошибка создания");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke(id: number) {
    const res = await fetch("/kapi/admin/guest-access", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setAccesses((prev) => prev.map((a) => a.id === id ? { ...a, revokedAt: new Date().toISOString() } : a));
      toast.success("Доступ отозван");
    }
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${baseUrl}/admin/login?token=${token}`);
    toast.success("Ссылка скопирована");
  }

  const isActive = (a: GuestAccess) => !a.revokedAt && new Date(a.expiresAt) > new Date();

  return (
    <div className="space-y-8">
      <div className="card-base p-6 max-w-lg">
        <h2 className="font-semibold mb-4">Создать гостевой доступ</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <Label htmlFor="ga-name">Имя гостя</Label>
            <Input id="ga-name" name="name" required placeholder="Фотограф Иван" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="ga-expires">Срок действия</Label>
            <Input id="ga-expires" name="expiresAt" type="datetime-local" required className="mt-1" />
          </div>
          <div>
            <Label>Разделы</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SECTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setSelectedSections((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                  className={`px-2 py-1 rounded text-xs border transition-colors ${selectedSections.includes(s) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Действия</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ACTIONS.map((a) => (
                <button key={a} type="button" onClick={() => setSelectedActions((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])}
                  className={`px-2 py-1 rounded text-xs border transition-colors ${selectedActions.includes(a) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Создаём..." : "Создать ссылку"}</Button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold mb-4">Активные доступы ({accesses.filter(isActive).length})</h2>
        {accesses.length === 0 ? <p className="text-muted-foreground text-sm">Доступов нет</p> : (
          <div className="space-y-3">
            {accesses.map((a) => (
              <div key={a.id} className={`card-base p-4 flex items-center justify-between ${!isActive(a) ? "opacity-50" : ""}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{a.name}</span>
                    <Badge variant={isActive(a) ? "success" : "secondary"}>{isActive(a) ? "Активен" : "Истёк/Отозван"}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Разделы: {a.allowedSections.join(", ")} · До {new Date(a.expiresAt).toLocaleString("ru")}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isActive(a) && (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => copyLink(a.loginToken)}><Copy className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleRevoke(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
