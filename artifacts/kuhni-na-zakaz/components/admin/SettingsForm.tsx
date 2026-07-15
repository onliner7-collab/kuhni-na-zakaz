"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

interface Settings {
  siteName: string; phone: string; phoneDisplay: string; email: string;
  address: string; workingHours: string; telegram: string; viber: string;
  whatsapp: string;
  metaTitle: string; metaDescription: string;
}

export function SettingsForm({ settings }: { settings: Settings | null }) {
  const [loading, setLoading] = useState(false);

  const defaults: Settings = {
    siteName: "КухниBY", phone: CONTACT_DEFAULTS.phone, phoneDisplay: CONTACT_DEFAULTS.phoneDisplay,
    email: CONTACT_DEFAULTS.email, address: CONTACT_DEFAULTS.address,
    workingHours: CONTACT_DEFAULTS.workingHours, telegram: "", viber: "",
    whatsapp: "",
    metaTitle: "Кухни на заказ в Минске | КухниBY",
    metaDescription: "Кухни на заказ в Минске и Минской области. Собственное производство.",
  };

  const vals = settings || defaults;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/kapi/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) toast.success("Настройки сохранены");
      else toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  }

  const Field = ({ name, label, defaultValue, type = "text" }: { name: string; label: string; defaultValue?: string; type?: string }) => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} className="mt-1" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="card-base p-6">
        <h2 className="font-semibold mb-4">Общая информация</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="siteName" label="Название сайта" defaultValue={vals.siteName} />
          <Field name="phone" label="Телефон (формат)" defaultValue={vals.phone} />
          <Field name="phoneDisplay" label="Телефон (отображение)" defaultValue={vals.phoneDisplay} />
          <Field name="email" label="Email" defaultValue={vals.email} type="email" />
          <Field name="address" label="Адрес" defaultValue={vals.address} />
          <Field name="workingHours" label="Время работы" defaultValue={vals.workingHours} />
        </div>
      </div>

      <div className="card-base p-6">
        <h2 className="font-semibold mb-4">Мессенджеры</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field name="telegram" label="Telegram" defaultValue={vals.telegram} />
          <Field name="viber" label="Viber" defaultValue={vals.viber} />
          <Field name="whatsapp" label="WhatsApp" defaultValue={vals.whatsapp} />
        </div>
      </div>

      <div className="card-base p-6">
        <h2 className="font-semibold mb-4">SEO по умолчанию</h2>
        <div className="space-y-4">
          <Field name="metaTitle" label="Meta Title" defaultValue={vals.metaTitle} />
          <Field name="metaDescription" label="Meta Description" defaultValue={vals.metaDescription} />
        </div>
      </div>

      <Button type="submit" disabled={loading}>{loading ? "Сохраняем..." : "Сохранить настройки"}</Button>
    </form>
  );
}
