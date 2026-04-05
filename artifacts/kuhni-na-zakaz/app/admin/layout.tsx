import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Панель управления", template: "%s | Admin КухниMinsk" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar session={session} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
