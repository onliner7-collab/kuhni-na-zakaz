"use client";

import { useState, useEffect } from "react";
import { Bookmark, Send, Check, ChevronDown, ChevronUp } from "lucide-react";
import { usePersonalization, type SavedConfigData } from "@/hooks/usePersonalization";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  configData: SavedConfigData;
}

export function ConfigResultActions({ configData }: Props) {
  const { saveConfig, savedConfig, sessionId } = usePersonalization();
  const [saved, setSaved] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

  useEffect(() => {
    if (savedConfig?.label === configData.label && configData.label) setSaved(true);
  }, [savedConfig, configData.label]);

  const handleSave = async () => {
    await saveConfig(configData);
    setSaved(true);
    toast.success("Выбор сохранён! Вы сможете вернуться к нему из браузера.");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Укажите имя и телефон");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/kapi/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          city: form.city,
          comment: `Подбор из конфигуратора: ${configData.label}`,
          source: "configurator",
          formType: "configurator_result",
          configSessionId: sessionId,
          styleSlug: configData.styleSlug,
          materialSlug: configData.materialSlug,
          budgetLevel: configData.budgetLevel,
          scenarioSlug: configData.scenarioSlug,
          answers: configData.answers,
        }),
      });
      if (res.ok) {
        setSent(true);
        setShowSendForm(false);
        // Also save config to DB with phone
        fetch("/kapi/saved-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, ...configData, phone: form.phone }),
        }).catch(() => {});
        toast.success("Ваш вариант отправлен! Перезвоним в течение 30 минут.");
      } else {
        toast.error("Ошибка. Попробуйте ещё раз.");
      }
    } catch {
      toast.error("Ошибка сети. Проверьте соединение.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Ваш вариант кухни</p>
          {configData.label && (
            <p className="text-xs text-muted-foreground mt-0.5">{configData.label}</p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saved}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${saved ? "text-green-600 bg-green-50 border border-green-200" : "text-primary border border-primary/30 hover:bg-primary/5"}`}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Сохранено</> : <><Bookmark className="w-3.5 h-3.5" /> Сохранить выбор</>}
        </button>
      </div>

      {sent ? (
        <div className="flex items-center gap-2 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4">
          <Check className="w-4 h-4" />
          Вариант отправлен на просчёт. Перезвоним скоро!
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowSendForm(prev => !prev)}
            className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Отправить вариант на просчёт</span>
            {showSendForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSendForm && (
            <form onSubmit={handleSend} className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Имя *</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ваше имя" className="mt-1 h-9 text-sm" required />
                </div>
                <div>
                  <Label className="text-xs">Телефон *</Label>
                  <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+375 (__) ___-__-__" className="mt-1 h-9 text-sm" required />
                </div>
              </div>
              <div>
                <Label className="text-xs">Город</Label>
                <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Минск" className="mt-1 h-9 text-sm" />
              </div>
              <Button type="submit" className="w-full h-9 text-sm" disabled={sending}>
                {sending ? "Отправляем..." : "Отправить на просчёт"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy-policy" className="underline">политикой конфиденциальности</a>
              </p>
            </form>
          )}
        </>
      )}
    </div>
  );
}
