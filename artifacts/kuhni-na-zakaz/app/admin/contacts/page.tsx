"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Phone, Mail, MapPin, Clock, MessageCircle, Globe,
  Instagram, Youtube, Save, ExternalLink,
} from "lucide-react";

interface Settings {
  siteName: string;
  phone: string;
  phoneDisplay: string;
  phone2: string;
  phoneDisplay2: string;
  email: string;
  address: string;
  addressMap: string;
  workingHours: string;
  telegram: string;
  viber: string;
  whatsapp: string;
  instagram: string;
  vk: string;
  facebook: string;
  youtube: string;
}

const DEFAULTS: Settings = {
  siteName: "КухниBY",
  phone: "+375291234567",
  phoneDisplay: "+375 (29) 123-45-67",
  phone2: "",
  phoneDisplay2: "",
  email: "info@kuhniminsk.by",
  address: "г. Минск, ул. Притыцкого, 100",
  addressMap: "",
  workingHours: "Пн–Сб 9:00–19:00, Вс 10:00–17:00",
  telegram: "",
  viber: "",
  whatsapp: "",
  instagram: "",
  vk: "",
  facebook: "",
  youtube: "",
};

function Field({
  label, name, value, onChange, placeholder, hint, type = "text", prefix,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; type?: string; prefix?: string;
}) {
  return (
    <div>
      <Label htmlFor={name} className="text-sm font-medium">{label}</Label>
      <div className="relative mt-1.5">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono select-none">{prefix}</span>
        )}
        <Input
          id={name} name={name} type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={prefix ? "pl-14" : ""}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export default function ContactsPage() {
  const [form, setForm] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Settings) => (v: string) => setForm(prev => ({ ...prev, [key]: v }));

  const load = useCallback(async () => {
    try {
      const res = await fetch("/kapi/admin/settings");
      const data = await res.json();
      setForm(prev => ({ ...prev, ...data }));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/kapi/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) toast.success("Контактные данные сохранены!");
      else toast.error("Ошибка сохранения");
    } finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6 animate-pulse pb-12">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-2xl border border-border bg-white p-6 h-40" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl pb-12 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl">Контактная информация</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Данные отображаются в шапке, подвале сайта и на странице контактов.
          </p>
        </div>
        <Button
          onClick={handleSave} disabled={saving}
          style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
          className="text-white px-6 shrink-0"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>

      {/* Телефоны */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Phone className="w-4 h-4 text-violet-500" />
          <h2 className="font-bold text-base">Телефоны</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Основной телефон (для набора)"
            name="phone"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+375291234567"
            hint="Используется в ссылке tel:... (без пробелов и скобок)"
          />
          <Field
            label="Отображение основного телефона"
            name="phoneDisplay"
            value={form.phoneDisplay}
            onChange={set("phoneDisplay")}
            placeholder="+375 (29) 123-45-67"
            hint="Как телефон выглядит для посетителей"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Второй телефон (для набора)"
            name="phone2"
            value={form.phone2}
            onChange={set("phone2")}
            placeholder="+375291234568"
            hint="Необязательно"
          />
          <Field
            label="Отображение второго телефона"
            name="phoneDisplay2"
            value={form.phoneDisplay2}
            onChange={set("phoneDisplay2")}
            placeholder="+375 (29) 123-45-68"
            hint="Необязательно"
          />
        </div>

        <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
          💡 Совет: укажите телефон оба варианта — для набора (<code className="bg-muted px-1 rounded">+375291234567</code>) и отображения (<code className="bg-muted px-1 rounded">+375 (29) 123-45-67</code>)
        </div>
      </section>

      {/* Email и адрес */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Mail className="w-4 h-4 text-violet-500" />
          <h2 className="font-bold text-base">Email и адрес</h2>
        </div>

        <Field
          label="Email"
          name="email"
          value={form.email}
          onChange={set("email")}
          placeholder="info@kuhniby.by"
          type="email"
        />

        <Field
          label="Адрес офиса / шоурума"
          name="address"
          value={form.address}
          onChange={set("address")}
          placeholder="г. Минск, ул. Притыцкого, 100"
          hint="Отображается в подвале сайта и на странице Контакты"
        />

        <div>
          <Label className="text-sm font-medium">Ссылка на карту (Google Maps / Яндекс.Карты)</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              name="addressMap"
              value={form.addressMap}
              onChange={e => set("addressMap")(e.target.value)}
              placeholder="https://maps.google.com/maps?q=..."
              className="flex-1"
            />
            {form.addressMap && (
              <a href={form.addressMap} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <ExternalLink className="w-4 h-4" />
                Открыть
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Кнопка «Показать на карте» на странице Контакты</p>
        </div>
      </section>

      {/* Режим работы */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Clock className="w-4 h-4 text-violet-500" />
          <h2 className="font-bold text-base">Режим работы</h2>
        </div>

        <Field
          label="Часы работы"
          name="workingHours"
          value={form.workingHours}
          onChange={set("workingHours")}
          placeholder="Пн–Сб 9:00–19:00, Вс 10:00–17:00"
          hint="Отображается в подвале и на странице Контакты"
        />
      </section>

      {/* Мессенджеры */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <MessageCircle className="w-4 h-4 text-violet-500" />
          <h2 className="font-bold text-base">Мессенджеры</h2>
        </div>
        <p className="text-sm text-muted-foreground">Используются для кнопок-иконок в подвале и плавающей кнопки связи.</p>

        <div className="grid grid-cols-3 gap-4">
          <Field
            label="Telegram"
            name="telegram"
            value={form.telegram}
            onChange={set("telegram")}
            placeholder="@kuhniby"
            hint="Логин или https://t.me/..."
          />
          <Field
            label="Viber"
            name="viber"
            value={form.viber}
            onChange={set("viber")}
            placeholder="+375291234567"
            hint="Номер телефона Viber"
          />
          <Field
            label="WhatsApp"
            name="whatsapp"
            value={form.whatsapp}
            onChange={set("whatsapp")}
            placeholder="+375291234567"
            hint="Номер телефона WhatsApp"
          />
        </div>
      </section>

      {/* Социальные сети */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Globe className="w-4 h-4 text-violet-500" />
          <h2 className="font-bold text-base">Социальные сети</h2>
        </div>
        <p className="text-sm text-muted-foreground">Ссылки на иконки в подвале сайта. Оставьте пустым, если не используете.</p>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Instagram"
            name="instagram"
            value={form.instagram}
            onChange={set("instagram")}
            placeholder="https://instagram.com/kuhniby"
          />
          <Field
            label="ВКонтакте"
            name="vk"
            value={form.vk}
            onChange={set("vk")}
            placeholder="https://vk.com/kuhniby"
          />
          <Field
            label="Facebook"
            name="facebook"
            value={form.facebook}
            onChange={set("facebook")}
            placeholder="https://facebook.com/kuhniby"
          />
          <Field
            label="YouTube"
            name="youtube"
            value={form.youtube}
            onChange={set("youtube")}
            placeholder="https://youtube.com/@kuhniby"
          />
        </div>
      </section>

      {/* Предпросмотр */}
      <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-6 space-y-4">
        <h2 className="font-bold text-base text-violet-800">Предпросмотр — как это выглядит на сайте</h2>
        <div className="rounded-xl bg-[#0f0f1a] p-5 space-y-3">
          {form.phoneDisplay && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Phone className="w-4 h-4 text-violet-400 shrink-0" />
              <span>{form.phoneDisplay}</span>
              {form.phoneDisplay2 && <span className="text-white/40">· {form.phoneDisplay2}</span>}
            </div>
          )}
          {form.email && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Mail className="w-4 h-4 text-violet-400 shrink-0" />
              <span>{form.email}</span>
            </div>
          )}
          {form.address && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
              <span>{form.address}</span>
            </div>
          )}
          {form.workingHours && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock className="w-4 h-4 text-violet-400 shrink-0" />
              <span>{form.workingHours}</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer save button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave} disabled={saving}
          style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
          className="text-white px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Сохраняем..." : "Сохранить все изменения"}
        </Button>
      </div>
    </div>
  );
}
