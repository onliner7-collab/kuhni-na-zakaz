import { requireAdmin } from "@/lib/auth";
import MaterialForm from "@/components/admin/MaterialForm";

export const metadata = { title: "Новый материал — Админ" };

export default async function NewMaterialPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Новый материал</h1>
      <p className="text-gray-500 text-sm mb-8">Заполните информацию о материале для кухонных фасадов</p>
      <div className="card-base p-6">
        <MaterialForm />
      </div>
    </div>
  );
}
