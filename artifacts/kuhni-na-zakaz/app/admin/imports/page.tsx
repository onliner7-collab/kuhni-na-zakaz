import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BulkImportManager } from "@/components/admin/BulkImportManager";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Bulk import",
};

type ImportsPageProps = {
  searchParams: Promise<{
    session?: string;
  }>;
};

export default async function ImportsPage({ searchParams }: ImportsPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login?from=/admin/imports");
  }

  const { session: sessionId } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-black text-foreground">Bulk import v1</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Загрузите workbook, проверьте preview, разберите ошибки и предупреждения,
          затем подтвердите apply. Экран использует текущий bulk import backend без
          переписывания import engine.
        </p>
      </div>

      <BulkImportManager initialSessionId={sessionId ?? null} />
    </div>
  );
}
