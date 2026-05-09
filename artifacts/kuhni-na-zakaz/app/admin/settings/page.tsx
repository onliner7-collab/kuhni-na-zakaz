import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Настройки сайта" };

export default async function AdminSettingsPage() {
  await requireSuperAdmin();
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Настройки сайта</h1>
      <SettingsForm settings={settings ? JSON.parse(JSON.stringify(settings)) : null} />
    </div>
  );
}
