import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LeadDetail } from "@/components/admin/LeadDetail";

export const dynamic = "force-dynamic";
export const metadata = { title: "Данные заявки", robots: { index: false, follow: false } };

export default async function LeadDetailPage({ params }: { params: Promise<{ number: string }> }) {
  const session = await requireAdmin();
  if (session.guestSections && !session.guestSections.some(section => section === "leads" || section === "/admin/leads")) notFound();
  const { number } = await params;
  if (!/^\d{1,10}$/.test(number)) notFound();
  const lead = await prisma.lead.findUnique({ where: { publicNumber: Number(number) } });
  if (!lead) notFound();
  return <LeadDetail lead={lead} />;
}