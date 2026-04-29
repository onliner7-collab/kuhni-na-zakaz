"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Bell, Plus, Trash2, ToggleLeft, ToggleRight,
  Send, Bot, Info, Eye, EyeOff, CheckCircle2, XCircle,
} from "lucide-react";

interface Recipient {
  id: number;
  label: string;
  chatId: string;
  active: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [botToken, setBotToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [tokenSaving, setTokenSaving] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newChatId, setNewChatId] = useState("");
  const [adding, setAdding] = useState(false);
  const [testChatId, setTestChatId] = useState("");
  const [testing, setTesting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/kapi/admin/notifications/telegram");
      const data = await res.json();
      setRecipients(data.recipients ?? []);
      setBotToken(data.botToken ?? "");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveBotToken() {
    setTokenSaving(true);
    try {
      const res = await fetch("/kapi/admin/notifications/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _action: "saveBotToken", botToken }),
      });
      if (res.ok) toast.success("Токен бота сохранён");
      else toast.error("Ошибка сохранения токена");
    } finally { setTokenSaving(false); }
  }

  async function addRecipient() {
    if (!newChatId.trim()) { toast.error("Введите Chat ID"); return; }
    setAdding(true);
    try {
      const res = await fetch("/kapi/admin/notifications/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim(), chatId: newChatId.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecipients(prev => [...prev, data]);
        setNewLabel(""); setNewChatId("");
        toast.success("Получатель добавлен!");
      } else { toast.error(data.error || "Ошибка добавления"); }
    } finally { setAdding(false); }
  }

  async function toggleRecipient(id: number, active: boolean) {
    const res = await fetch(`/kapi/admin/notifications/telegram/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (res.ok) {
      setRecipients(prev => prev.map(r => r.id === id ? { ...r, active: !active } : r));
      toast.success(!active ? "Уведомления включены" : "Уведомления отключены");
    }
  }

  async function deleteRecipient(id: number) {
    if (!confirm("Удалить получателя?")) return;
    const res = await fetch(`/kapi/admin/notifications/telegram/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRecipients(prev => prev.filter(r => r.id !== id));
      toast.success("Получатель удалён");
    }
  }

  async function sendTest() {
    if (!botToken) { toast.error("Сначала сохраните токен бота"); return; }
    if (!testChatId.trim()) { toast.error("Введите Chat ID для теста"); return; }
    setTesting(true);
    try {
      const res = await fetch("/kapi/admin/notifications/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _action: "test", botToken, chatId: testChatId.trim() }),
      });
      const data = await res.json();
      if (data.ok) toast.success("✅ Тестовое сообщение отправлено!");
      else toast.error(`Ошибка: ${data.error}`);
    } finally { setTesting(false); }
  }

  const activeCount = recipients.filter(r => r.active).length;

  return (
    <div className="max-w-3xl space-y-6 pb-12">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="font-bold text-2xl">Telegram-уведомления</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            При каждой новой заявке с сайта всем активным получателям придёт сообщение с данными клиента.
          </p>
        </div>
      </div>

      {/* Статус */}
      <div className={`rounded-2xl border p-4 flex items-center gap-3 ${botToken && activeCount > 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
        {botToken && activeCount > 0
          ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          : <XCircle className="w-5 h-5 text-amber-500 shrink-0" />
        }
        <p className={`text-sm font-medium ${botToken && activeCount > 0 ? "text-green-800" : "text-amber-800"}`}>
          {!botToken
            ? "Бот не настроен — добавьте токен бота ниже"
            : activeCount === 0
              ? "Токен настроен, но нет активных получателей"
              : `Уведомления активны · ${activeCount} ${activeCount === 1 ? "получатель" : activeCount < 5 ? "получателя" : "получателей"}`
          }
        </p>
      </div>

      {/* Инструкция */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <p className="font-semibold text-blue-800 text-sm">Как настроить бота</p>
        </div>
        <ol className="text-sm text-blue-900 space-y-1.5 list-decimal list-inside">
          <li>Напишите <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">@BotFather</span> в Telegram, создайте бота командой <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">/newbot</span></li>
          <li>Скопируйте токен вида <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">1234567890:ABCdef...</span> и вставьте ниже</li>
          <li>Напишите боту любое сообщение, затем откройте: <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-xs">api.telegram.org/bot&lt;TOKEN&gt;/getUpdates</span></li>
          <li>Найдите <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">"chat":{"{"}​"id":...</span> — это ваш Chat ID (цифры, может быть с минусом)</li>
          <li>Или используйте бота <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">@userinfobot</span> — он сразу даёт ваш ID</li>
        </ol>
      </div>

      {/* Токен бота */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Bot className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-bold text-base">Токен Telegram-бота</h2>
        </div>
        <p className="text-sm text-muted-foreground">Токен получается у <strong>@BotFather</strong>. Один бот для всех получателей.</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showToken ? "text" : "password"}
              value={botToken}
              onChange={e => setBotToken(e.target.value)}
              placeholder="1234567890:ABCdefGHIjklmNOPqrstUVwxyz"
              className="font-mono text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button onClick={saveBotToken} disabled={tokenSaving} style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }} className="text-white shrink-0">
            {tokenSaving ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </section>

      {/* Получатели */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="font-bold text-base">Получатели уведомлений</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {recipients.length} / активных {activeCount}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Загрузка...</p>
        ) : recipients.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Нет получателей — добавьте первого</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recipients.map((r) => (
              <div
                key={r.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${r.active ? "border-violet-200 bg-violet-50/50" : "border-border bg-muted/30"}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {r.label || "Без имени"}
                    {!r.active && <span className="ml-2 text-xs text-muted-foreground font-normal">(отключён)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">Chat ID: {r.chatId}</p>
                </div>
                <button
                  onClick={() => toggleRecipient(r.id, r.active)}
                  className={`shrink-0 transition-colors ${r.active ? "text-violet-600 hover:text-violet-800" : "text-muted-foreground hover:text-foreground"}`}
                  title={r.active ? "Отключить" : "Включить"}
                >
                  {r.active
                    ? <ToggleRight className="w-7 h-7" />
                    : <ToggleLeft className="w-7 h-7" />
                  }
                </button>
                <button
                  onClick={() => deleteRecipient(r.id)}
                  className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors p-1"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Добавить получателя */}
        <div className="pt-3 border-t border-border space-y-3">
          <p className="text-sm font-medium">Добавить получателя</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Имя / роль (необязательно)</Label>
              <Input
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Директор, Менеджер Иван..."
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Chat ID *</Label>
              <Input
                value={newChatId}
                onChange={e => setNewChatId(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addRecipient(); }}
                placeholder="-1001234567890 или 123456789"
                className="mt-1 font-mono text-sm"
              />
            </div>
          </div>
          <Button onClick={addRecipient} disabled={adding} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {adding ? "Добавляем..." : "Добавить получателя"}
          </Button>
        </div>
      </section>

      {/* Тест */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Send className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-bold text-base">Проверить доставку</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Отправьте тестовое сообщение на любой Chat ID, чтобы убедиться, что бот работает.
          Токен должен быть сохранён.
        </p>
        <div className="flex gap-3">
          <Input
            value={testChatId}
            onChange={e => setTestChatId(e.target.value)}
            placeholder="Введите Chat ID для теста"
            className="flex-1 font-mono text-sm"
          />
          <Button onClick={sendTest} disabled={testing || !botToken} variant="outline" className="shrink-0">
            <Send className="w-4 h-4 mr-2" />
            {testing ? "Отправляем..." : "Отправить тест"}
          </Button>
        </div>
        {!botToken && (
          <p className="text-xs text-amber-600">⚠ Сначала сохраните токен бота</p>
        )}
      </section>

      {/* Пример сообщения */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">Пример сообщения</h2>
        <div className="bg-[#effdde] rounded-2xl p-4 font-mono text-sm text-[#2c2c2c] whitespace-pre-wrap border border-[#c8e6c9] leading-relaxed">
{`🆕 Новая заявка #42
📋 Форма: Замер
📅 Время: 07.04.2026, 14:32

👤 Имя: Александр Иванов
📞 Телефон: +375296261547
📍 Город: Минск
💬 Комментарий: Хочу угловую кухню 3×4 м

📝 Ответы на вопросы:
  • Стиль: Модерн
  • Бюджет: до 3000 BYN

🔗 Источник: catalog`}
        </div>
      </section>

    </div>
  );
}
