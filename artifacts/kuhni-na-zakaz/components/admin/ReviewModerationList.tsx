"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star, CheckCircle, XCircle, Trash2, Clock, ExternalLink,
  Star as StarFill, MessageSquare, Globe, Send, Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ReviewFull {
  id: number;
  name: string;
  city: string;
  region: string;
  phone: string;
  rating: number;
  text: string;
  date: string;
  caseSlug: string;
  caseTitle?: string;
  source: string;
  sourceUrl: string;
  featured: boolean;
  managerNote: string;
  status: string;
  rejectionReason: string | null;
  moderatedAt: string | null;
  createdAt: string;
}

interface Props {
  newReviews: ReviewFull[];
  pending: ReviewFull[];
  published: ReviewFull[];
  rejected: ReviewFull[];
  canModerate: boolean;
}

const SOURCE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  website: { label: "Сайт", icon: <Globe className="w-3 h-3" />, color: "bg-blue-100 text-blue-700" },
  google: { label: "Google", icon: <Globe className="w-3 h-3" />, color: "bg-green-100 text-green-700" },
  yandex: { label: "Яндекс", icon: <Globe className="w-3 h-3" />, color: "bg-yellow-100 text-yellow-700" },
  telegram: { label: "Telegram", icon: <Send className="w-3 h-3" />, color: "bg-sky-100 text-sky-700" },
  instagram: { label: "Instagram", icon: <Instagram className="w-3 h-3" />, color: "bg-pink-100 text-pink-700" },
  vk: { label: "ВКонтакте", icon: <Globe className="w-3 h-3" />, color: "bg-indigo-100 text-indigo-700" },
  direct: { label: "Напрямую", icon: <MessageSquare className="w-3 h-3" />, color: "bg-gray-100 text-gray-700" },
};

function SourceBadge({ source }: { source: string }) {
  const meta = SOURCE_META[source] || SOURCE_META.website;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium", meta.color)}>
      {meta.icon} {meta.label}
    </span>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("w-3.5 h-3.5", i <= rating ? "fill-primary text-primary" : "text-muted-foreground/30")} />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  canModerate,
  onUpdate,
}: {
  review: ReviewFull;
  canModerate: boolean;
  onUpdate: (id: number, updated: Partial<ReviewFull> | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [note, setNote] = useState(review.managerNote || "");
  const [editCaseSlug, setEditCaseSlug] = useState(review.caseSlug || "");
  const [editSource, setEditSource] = useState(review.source || "website");
  const [expanded, setExpanded] = useState(false);

  async function moderate(action: string, extra?: Record<string, string>) {
    setLoading(true);
    try {
      const res = await fetch(`/kapi/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: rejectReason, managerNote: note, ...extra }),
      });
      if (res.ok) {
        const msgs: Record<string, string> = {
          publish: "Отзыв опубликован",
          reject: "Отзыв отклонён",
          delete: "Отзыв удалён с сайта",
          pending: "Отзыв отправлен на проверку",
        };
        toast.success(msgs[action] || "Готово");
        onUpdate(review.id, { status: { publish: "PUBLISHED", reject: "REJECTED", delete: "DELETED", pending: "PENDING" }[action] || review.status });
      } else {
        toast.error("Ошибка операции");
      }
    } finally {
      setLoading(false);
      setShowReject(false);
    }
  }

  async function saveEdits() {
    setLoading(true);
    try {
      const res = await fetch(`/kapi/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseSlug: editCaseSlug, source: editSource, managerNote: note }),
      });
      if (res.ok) {
        toast.success("Сохранено");
        onUpdate(review.id, { caseSlug: editCaseSlug, source: editSource, managerNote: note });
      } else {
        toast.error("Ошибка сохранения");
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeatured() {
    setLoading(true);
    try {
      const res = await fetch(`/kapi/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !review.featured }),
      });
      if (res.ok) {
        toast.success(review.featured ? "Убрано из избранных" : "Добавлено в избранные");
        onUpdate(review.id, { featured: !review.featured });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("card-base p-5 border-l-4", {
      "border-l-yellow-400": review.status === "NEW",
      "border-l-blue-400": review.status === "PENDING",
      "border-l-green-500": review.status === "PUBLISHED",
      "border-l-red-400": review.status === "REJECTED",
      "border-l-gray-300": review.status === "DELETED",
    })}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{review.name}</span>
            <span className="text-muted-foreground text-xs">
              {review.city}{review.region ? `, ${review.region}` : ""}
            </span>
            <SourceBadge source={review.source} />
            {review.featured && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                <StarFill className="w-3 h-3 fill-amber-500 text-amber-500" /> Избранный
              </span>
            )}
          </div>
          <StarRow rating={review.rating} />
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" })}</p>
          {review.moderatedAt && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Проверено: {new Date(review.moderatedAt).toLocaleDateString("ru")}
            </p>
          )}
        </div>
      </div>

      <p className={cn("text-sm text-muted-foreground leading-relaxed mb-3", !expanded && "line-clamp-3")}>
        &ldquo;{review.text}&rdquo;
      </p>
      {review.text.length > 200 && (
        <button onClick={() => setExpanded((v) => !v)} className="text-xs text-primary hover:underline mb-3">
          {expanded ? "Свернуть" : "Читать полностью"}
        </button>
      )}

      {review.caseSlug && (
        <div className="mb-3 text-xs flex items-center gap-1.5">
          <span className="text-muted-foreground">Связанный проект:</span>
          <Link href={`/portfolio/${review.caseSlug}`} target="_blank" className="text-primary hover:underline flex items-center gap-1">
            {review.caseTitle || review.caseSlug} <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {review.sourceUrl && (
        <div className="mb-3 text-xs">
          <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
            Оригинал отзыва <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {review.rejectionReason && (
        <div className="mb-3 p-2 bg-red-50 rounded text-xs text-red-700">
          <strong>Причина отклонения:</strong> {review.rejectionReason}
        </div>
      )}

      {canModerate && (
        <div className="mt-4 space-y-3 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Источник</label>
              <select
                value={editSource}
                onChange={(e) => setEditSource(e.target.value)}
                className="w-full text-xs border border-border rounded px-2 py-1.5 bg-background"
              >
                {Object.entries(SOURCE_META).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Связанный проект (slug)</label>
              <Input
                value={editCaseSlug}
                onChange={(e) => setEditCaseSlug(e.target.value)}
                placeholder="slug-кейса"
                className="text-xs h-8"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Пояснение менеджеру (не публикуется)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Внутренняя заметка..."
              className="text-xs"
              rows={2}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={saveEdits} disabled={loading} className="text-xs gap-1">
              Сохранить правки
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleFeatured}
              disabled={loading}
              className={cn("text-xs gap-1", review.featured ? "border-amber-400 text-amber-600 hover:bg-amber-50" : "")}
            >
              <StarFill className={cn("w-3 h-3", review.featured ? "fill-amber-500 text-amber-500" : "")} />
              {review.featured ? "Убрать из избранных" : "В избранные"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            {(review.status === "NEW" || review.status === "PENDING") && (
              <>
                <Button
                  size="sm"
                  onClick={() => moderate("publish")}
                  disabled={loading}
                  className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                  data-testid={`publish-review-${review.id}`}
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Опубликовать
                </Button>
                {!showReject ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReject(true)}
                    disabled={loading}
                    className="gap-1.5 text-red-600 border-red-300 hover:bg-red-50"
                    data-testid={`reject-review-${review.id}`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Отклонить
                  </Button>
                ) : (
                  <div className="flex gap-2 items-center w-full">
                    <Input
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Причина отклонения..."
                      className="text-xs h-8 flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => moderate("reject")}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      Отклонить
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowReject(false)} className="text-xs">
                      Отмена
                    </Button>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moderate("pending")}
                  disabled={loading}
                  className="gap-1.5 text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Clock className="w-3.5 h-3.5" /> На проверку
                </Button>
              </>
            )}
            {review.status === "PUBLISHED" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => moderate("delete")}
                disabled={loading}
                className="gap-1.5 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Удалить с сайта
              </Button>
            )}
            {(review.status === "REJECTED" || review.status === "DELETED") && (
              <Button
                size="sm"
                onClick={() => moderate("publish")}
                disabled={loading}
                className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Опубликовать всё-таки
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type TabKey = "new" | "pending" | "published" | "rejected";

export function ReviewModerationList({
  newReviews: initialNew,
  pending: initialPending,
  published: initialPub,
  rejected: initialRej,
  canModerate,
}: Props) {
  const [lists, setLists] = useState<Record<TabKey, ReviewFull[]>>({
    new: initialNew,
    pending: initialPending,
    published: initialPub,
    rejected: initialRej,
  });
  const [tab, setTab] = useState<TabKey>("new");

  function handleUpdate(id: number, updated: Partial<ReviewFull> | null) {
    setLists((prev) => {
      const all = Object.values(prev).flat();
      const review = all.find((r) => r.id === id);
      if (!review) return prev;

      const merged = { ...review, ...updated };

      const newStatus = merged.status;
      const tabForStatus: Record<string, TabKey> = {
        NEW: "new",
        PENDING: "pending",
        PUBLISHED: "published",
        REJECTED: "rejected",
        DELETED: "rejected",
      };

      const targetTab = tabForStatus[newStatus] || "rejected";

      const next: Record<TabKey, ReviewFull[]> = {
        new: prev.new.filter((r) => r.id !== id),
        pending: prev.pending.filter((r) => r.id !== id),
        published: prev.published.filter((r) => r.id !== id),
        rejected: prev.rejected.filter((r) => r.id !== id),
      };

      if (updated !== null) {
        next[targetTab] = [merged, ...next[targetTab]];
      }

      return next;
    });
  }

  const tabs: { key: TabKey; label: string; urgent?: boolean }[] = [
    { key: "new", label: `Новые (${lists.new.length})`, urgent: lists.new.length > 0 },
    { key: "pending", label: `На проверке (${lists.pending.length})` },
    { key: "published", label: `Опубликовано (${lists.published.length})` },
    { key: "rejected", label: `Отклонено (${lists.rejected.length})` },
  ];

  const reviews = lists[tab];

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap flex items-center gap-2",
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.urgent && (
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            )}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "new" && reviews.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>{reviews.length} {reviews.length === 1 ? "отзыв ждёт" : reviews.length < 5 ? "отзыва ждут" : "отзывов ждут"} проверки.</strong> Проверьте текст, поставьте оценку достоверности, при необходимости — отклоните с пояснением.
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Нет отзывов в этой категории
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} canModerate={canModerate} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
