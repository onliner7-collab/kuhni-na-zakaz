import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Редактировать статью — Админ" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id: parseInt(id) } });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Редактировать статью</h1>
        <p className="text-muted-foreground mt-1">{post.title}</p>
      </div>
      <BlogPostForm post={post} />
    </div>
  );
}
