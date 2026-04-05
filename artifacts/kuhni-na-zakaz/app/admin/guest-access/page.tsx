import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { GuestAccessList } from "@/components/admin/GuestAccessList";

export const metadata: Metadata = { title: "Гостевой доступ" };

export default async function GuestAccessPage() {
  const accesses = await prisma.guestAccess.findMany({
    include: { createdBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Гостевой доступ</h1>
      <GuestAccessList accesses={JSON.parse(JSON.stringify(accesses))} />
    </div>
  );
}
