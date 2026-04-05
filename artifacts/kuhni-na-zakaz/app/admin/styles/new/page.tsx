import { requireAdmin } from "@/lib/auth";
import StyleForm from "@/components/admin/StyleForm";

export const metadata = { title: "Новый стиль — Админ" };

export default async function NewStylePage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Новый стиль кухни</h1>
      <p className="text-gray-500 text-sm mb-8">Заполните информацию о стиле кухни</p>
      <div className="card-base p-6">
        <StyleForm />
      </div>
    </div>
  );
}
