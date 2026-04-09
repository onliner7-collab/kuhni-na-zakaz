import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Edit } from "lucide-react";

export const metadata: Metadata = { title: "Фасады" };

export default async function AdminFacadesPage() {
  const facades = await prisma.kitchenFacade
    .findMany({ orderBy: [{ material: "asc" }, { sortOrder: "asc" }] })
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black">Фасады</h1>
          <p className="text-muted-foreground text-sm mt-1">
            МДФ, эмаль, шпон, пластик — цвета, декоры, фактуры
          </p>
        </div>
        <Link
          href="/admin/configurator-visual/facades/new"
          className={cn(buttonVariants(), "text-white")}
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
        >
          <Plus className="w-4 h-4 mr-2" />Добавить фасад
        </Link>
      </div>

      {facades.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 p-12 text-center text-muted-foreground">
          Фасады ещё не добавлены.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {facades.map((f) => (
            <div key={f.id} className="rounded-xl border bg-card p-3 flex flex-col gap-2">
              <div
                className="rounded-lg w-full h-20 border"
                style={{
                  backgroundColor: f.colorHex || "#f5f5f0",
                  backgroundImage: f.imageUrl ? `url(${f.imageUrl})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <p className="font-medium text-sm leading-tight">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.material} · {f.finish}</p>
              <div className="flex items-center justify-between">
                <Badge variant={f.isEnabled ? "outline" : "secondary"} className="text-xs">
                  {f.isEnabled ? "Активен" : "Откл."}
                </Badge>
                <Link
                  href={`/admin/configurator-visual/facades/${f.id}`}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-7 px-2")}
                >
                  <Edit className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
