"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  postId: number;
  title?: string;
  dataTestId?: string;
  children: ReactNode;
}

export function BlogPostDeleteButton({
  postId,
  title = "Delete",
  dataTestId,
  children,
}: Props) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm("Удалить статью?")) return;

    try {
      const res = await fetch(`/kapi/admin/blog/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка удаления");
      }
      toast.success("Статья удалена");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Не удалось удалить статью");
    }
  }

  return (
    <button
      type="button"
      data-testid={dataTestId}
      className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
      title={title}
      onClick={onDelete}
    >
      {children}
    </button>
  );
}
