import { requireAdmin } from "@/lib/auth";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Новая статья — Админ" };

export default async function NewBlogPostPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Новая статья</h1>
        <p className="text-muted-foreground mt-1">Создание новой статьи для блога</p>
      </div>
      <BlogPostForm />
    </div>
  );
}
