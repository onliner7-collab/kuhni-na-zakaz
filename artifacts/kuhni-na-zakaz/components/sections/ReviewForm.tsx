"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Введите имя"),
  city: z.string().min(2, "Введите город"),
  phone: z.string().optional(),
  rating: z.number().min(1).max(5),
  text: z.string().min(20, "Отзыв должен быть не менее 20 символов"),
  honeypot: z.string().max(0),
});

type FormData = z.infer<typeof schema>;

export function ReviewForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  const onSubmit = async (data: FormData) => {
    if (data.honeypot) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
        toast.success("Отзыв отправлен на проверку!");
      } else {
        toast.error("Ошибка отправки. Попробуйте ещё раз.");
      }
    } catch {
      toast.error("Ошибка. Проверьте соединение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12 card-base px-8">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-serif text-2xl font-semibold mb-2">Спасибо за отзыв!</h3>
        <p className="text-muted-foreground">Отзыв будет опубликован после проверки модератором.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 card-base p-6" data-testid="review-form">
      <input {...register("honeypot")} type="text" className="hidden" tabIndex={-1} aria-hidden="true" />

      <div>
        <Label>Оценка *</Label>
        <div className="flex gap-1 mt-1">
          {[1,2,3,4,5].map((s) => (
            <button key={s} type="button" onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setValue("rating", s)} data-testid={`star-${s}`}>
              <Star className={cn("w-7 h-7 transition-colors", (hoveredStar || rating) >= s ? "fill-primary text-primary" : "text-muted-foreground")} />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-destructive text-xs mt-1">Поставьте оценку</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rev-name">Имя *</Label>
          <Input id="rev-name" {...register("name")} placeholder="Ваше имя" className="mt-1" />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="rev-city">Город *</Label>
          <Input id="rev-city" {...register("city")} placeholder="Минск" className="mt-1" />
          {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="rev-phone">Телефон (не публикуется)</Label>
        <Input id="rev-phone" {...register("phone")} placeholder="+375 (__) ___-__-__" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="rev-text">Отзыв *</Label>
        <Textarea id="rev-text" {...register("text")} placeholder="Расскажите о вашем опыте..." className="mt-1" rows={4} />
        {errors.text && <p className="text-destructive text-xs mt-1">{errors.text.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Отправляем..." : "Отправить отзыв"}
      </Button>
    </form>
  );
}
