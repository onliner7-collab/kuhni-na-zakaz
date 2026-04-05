import { requireAdmin } from "@/lib/auth";
import { PortfolioCaseForm } from "@/components/admin/PortfolioCaseForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Новый проект — Админ" };

export default async function NewPortfolioCasePage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Новый проект</h1>
        <p className="text-muted-foreground mt-1">Добавление нового реализованного проекта</p>
      </div>
      <PortfolioCaseForm />
    </div>
  );
}
