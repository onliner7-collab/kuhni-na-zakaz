import { requireAdmin } from "@/lib/auth";
import LocationForm from "@/components/admin/LocationForm";

export const metadata = { title: "Новая страница города — Админ" };

export default async function NewLocationPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Новая страница города</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Выберите шаблон — он заполнит все поля. Затем дополните реальным локальным контентом.
        </p>
      </div>
      <LocationForm />
    </div>
  );
}
