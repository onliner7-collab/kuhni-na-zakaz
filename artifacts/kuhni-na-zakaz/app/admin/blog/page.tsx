import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "@/components/navigation/Link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { BlogPostDeleteButton } from "@/components/admin/BlogPostDeleteButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Блог — Админ" };

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Блог
          </h1>
          <p className="text-muted-foreground mt-1">
            Управление статьями блога
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          data-testid="btn-new-post"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новая статья
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">Статей пока нет</p>
            <p className="text-sm mt-1">Создайте первую статью для блога</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Заголовок
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                    Категория
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    Статус
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                    Дата
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-foreground">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {post.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {post.category || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs w-fit">
                          <Eye className="w-3 h-3" /> Опубликовано
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs w-fit">
                          <EyeOff className="w-3 h-3" /> Черновик
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          data-testid={`btn-edit-post-${post.id}`}
                          className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                          title="Редактировать"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <BlogPostDeleteButton
                          postId={post.id}
                          dataTestId={`btn-delete-post-${post.id}`}
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </BlogPostDeleteButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
