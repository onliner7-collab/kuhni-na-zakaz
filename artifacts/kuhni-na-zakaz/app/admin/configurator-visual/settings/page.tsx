import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ConfiguratorSettingsForm from "@/components/admin/configurator/ConfiguratorSettingsForm";

export default async function ConfiguratorSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Настройки конфигуратора</h1>
      <p className="text-gray-500 mb-6 text-sm">Глобальные параметры визуального конфигуратора кухонь.</p>
      <ConfiguratorSettingsForm />
    </div>
  );
}
