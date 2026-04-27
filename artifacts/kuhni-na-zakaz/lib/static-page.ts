import { prisma } from "@/lib/db";

export async function getStaticPage(slug: string) {
  return prisma.staticPage.findUnique({ where: { slug } }).catch(() => null);
}
