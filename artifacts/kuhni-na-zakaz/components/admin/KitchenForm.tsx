"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Kitchen {
  id: number; title: string; slug: string; description: string; category: string;
  style: string; material: string; priceFrom: number; priceTo?: number | null;
  published: boolean;
}

export function KitchenForm({ kitchen }: { kitchen?: Kitchen }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title"), slug: fd.get("slug"), description: fd.get("description"),
      category: fd.get("category"), style: fd.get("style"), material: fd.get("material"),
      priceFrom: Number(fd.get("priceFrom")), priceTo: fd.get("priceTo") ? Number(fd.get("priceTo")) : null,
      published: fd.get("published") === "on",
    };
    try {
      const url = kitchen ? `/api/admin/kitchens/${kitchen.id}` : "/kapi/admin/kitchens";
      const method = kitchen ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        toast.success(kitchen ? "Сохранено" : "Кухня добавлена");
        router.push("/admin/kitchens");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Ошибка сохранения");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-base p-6 max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Название *</Label>
          <Input id="title" name="title" defaultValue={kitchen?.title} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="slug">URL-слаг *</Label>
          <Input id="slug" name="slug" defaultValue={kitchen?.slug} required className="mt-1" placeholder="uglovaya-kuhnya" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea id="description" name="description" defaultValue={kitchen?.description} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Категория</Label>
          <Input id="category" name="category" defaultValue={kitchen?.category} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="style">Стиль</Label>
          <Input id="style" name="style" defaultValue={kitchen?.style} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="material">Материал фасада</Label>
        <Input id="material" name="material" defaultValue={kitchen?.material} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priceFrom">Цена от (BYN) *</Label>
          <Input id="priceFrom" name="priceFrom" type="number" defaultValue={kitchen?.priceFrom} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="priceTo">Цена до (BYN)</Label>
          <Input id="priceTo" name="priceTo" type="number" defaultValue={kitchen?.priceTo ?? ""} className="mt-1" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="published" name="published" defaultChecked={kitchen?.published} className="w-4 h-4" />
        <Label htmlFor="published">Опубликовать</Label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>{loading ? "Сохраняем..." : kitchen ? "Сохранить" : "Добавить"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
      </div>
    </form>
  );
}
