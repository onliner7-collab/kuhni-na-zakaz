"use client";

import { useState } from "react";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Review {
  id: number; name: string; city: string; rating: number; text: string;
  date: string; status: string; createdAt: string;
}

interface Props {
  newReviews: Review[]; published: Review[]; rejected: Review[];
  canModerate: boolean;
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  NEW: { label: "Новый", variant: "warning" },
  PENDING: { label: "На проверке", variant: "default" },
  PUBLISHED: { label: "Опубликован", variant: "success" },
  REJECTED: { label: "Отклонён", variant: "destructive" },
  DELETED: { label: "Удалён", variant: "outline" },
};

function ReviewCard({ review, onAction }: { review: Review; onAction: (id: number, action: string) => void }) {
  const [loading, setLoading] = useState(false);

  async function handle(action: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        toast.success(action === "publish" ? "Опубликован" : action === "reject" ? "Отклонён" : "Удалён");
        onAction(review.id, action);
      } else {
        toast.error("Ошибка операции");
      }
    } finally {
      setLoading(false);
    }
  }

  const status = STATUS_LABELS[review.status] || { label: review.status, variant: "outline" as const };

  return (
    <div className="card-base p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{review.name}</span>
            <span className="text-muted-foreground text-sm">· {review.city}</span>
            <Badge variant={status.variant as "default"}>{status.label}</Badge>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className={cn("w-3.5 h-3.5", i <= review.rating ? "fill-primary text-primary" : "text-muted")} />
            ))}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("ru")}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{review.text}</p>
      {(review.status === "NEW" || review.status === "PENDING") && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handle("publish")} disabled={loading} className="gap-1" data-testid={`publish-review-${review.id}`}>
            <CheckCircle className="w-3.5 h-3.5" /> Опубликовать
          </Button>
          <Button size="sm" variant="outline" onClick={() => handle("reject")} disabled={loading} className="gap-1 text-destructive border-destructive hover:bg-destructive hover:text-white" data-testid={`reject-review-${review.id}`}>
            <XCircle className="w-3.5 h-3.5" /> Отклонить
          </Button>
        </div>
      )}
      {review.status === "PUBLISHED" && (
        <Button size="sm" variant="outline" onClick={() => handle("delete")} disabled={loading} className="gap-1 text-destructive">
          <Trash2 className="w-3.5 h-3.5" /> Удалить
        </Button>
      )}
    </div>
  );
}

export function ReviewModerationList({ newReviews: initialNew, published: initialPub, rejected: initialRej, canModerate }: Props) {
  const [newReviews, setNewReviews] = useState(initialNew);
  const [published, setPublished] = useState(initialPub);
  const [rejected, setRejected] = useState(initialRej);
  const [tab, setTab] = useState<"new" | "published" | "rejected">("new");

  function handleAction(id: number, action: string) {
    const review = newReviews.find((r) => r.id === id);
    if (review) {
      setNewReviews((prev) => prev.filter((r) => r.id !== id));
      if (action === "publish") {
        setPublished((prev) => [{ ...review, status: "PUBLISHED" }, ...prev]);
      } else if (action === "reject") {
        setRejected((prev) => [{ ...review, status: "REJECTED" }, ...prev]);
      }
    } else {
      setPublished((prev) => prev.filter((r) => r.id !== id));
    }
  }

  const tabs = [
    { key: "new", label: `На проверке (${newReviews.length})` },
    { key: "published", label: `Опубликованные (${published.length})` },
    { key: "rejected", label: `Отклонённые (${rejected.length})` },
  ] as const;

  const reviews = tab === "new" ? newReviews : tab === "published" ? published : rejected;

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px", tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {t.label}
          </button>
        ))}
      </div>
      {reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Нет отзывов в этой категории</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  );
}
