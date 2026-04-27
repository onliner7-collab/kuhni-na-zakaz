"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";

const schema = z.object({
  name: z.string().min(2, "Введите имя"),
  phone: z.string().min(7, "Введите корректный номер"),
  city: z.string().optional(),
  comment: z.string().optional(),
  honeypot: z.string().max(0, "Это поле должно быть пустым"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm({ source = "website", city }: { source?: string; city?: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { city: city || "" },
  });

  const onSubmit = async (data: FormData) => {
    if (data.honeypot) return;
    setLoading(true);
    trackAnalyticsEvent(ANALYTICS_EVENTS.FORM_SUBMIT, {
      form_type: "contact",
      source,
      city: data.city || city,
    });

    try {
      const res = await fetch("/kapi/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source, formType: "contact" }),
      });
      if (res.ok) {
        setSent(true);
        reset();
        trackAnalyticsEvent(ANALYTICS_EVENTS.LEAD_SUCCESS, {
          form_type: "contact",
          source,
          city: data.city || city,
        });
        toast.success("Заявка отправлена! Перезвоним в течение 30 минут.");
      } else {
        toast.error("Ошибка отправки. Попробуйте ещё раз или позвоните нам.");
      }
    } catch {
      toast.error("Ошибка отправки. Проверьте интернет-соединение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12 card-base px-8">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-serif text-2xl font-semibold mb-2">Заявка получена!</h3>
        <p className="text-muted-foreground mb-6">Перезвоним в течение 30 минут в рабочее время.</p>
        <Button variant="outline" onClick={() => setSent(false)}>Отправить ещё</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="contact-form">
      {/* Honeypot */}
      <input {...register("honeypot")} type="text" className="hidden" tabIndex={-1} aria-hidden="true" />

      <div>
        <Label htmlFor="name">Имя *</Label>
        <Input id="name" {...register("name")} placeholder="Ваше имя" className="mt-1" data-testid="form-name" />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Телефон *</Label>
        <Input id="phone" {...register("phone")} placeholder="+375 (__) ___-__-__" className="mt-1" data-testid="form-phone" />
        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="city">Город</Label>
        <Input id="city" {...register("city")} placeholder="Минск" className="mt-1" data-testid="form-city" />
      </div>

      <div>
        <Label htmlFor="comment">Комментарий</Label>
        <Textarea id="comment" {...register("comment")} placeholder="Размеры кухни, стиль, пожелания..." className="mt-1" data-testid="form-comment" />
      </div>

      <Button type="submit" className="w-full" disabled={loading} data-testid="form-submit">
        {loading ? "Отправляем..." : "Отправить заявку"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="/privacy-policy" className="underline">политикой конфиденциальности</a>
      </p>
    </form>
  );
}
