"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Bell, Plus, Trash2, ToggleLeft, ToggleRight,
  Send, Bot, Info, Eye, EyeOff, CheckCircle2, XCircle,
  Pencil, X, Save, History, Mail,
} from "lucide-react";

interface Recipient {
  id: number;
  label: string;
  chatId: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface EditDraft {
  label: string;
  chatId: string;
  role: string;
  active: boolean;
}

interface EmailStatus {
  configured: boolean;
  smtpHost: string;
  smtpUserConfigured: boolean;
  recipients: string[];
}

// Подсказки ролей — задаются в требовании этапа.
// Свободный ввод оставляем (через datalist), бэк ограничивает только длиной до 50 символов.
const ROLE_OPTIONS = ["owner", "manager", "moderator", "client"] as const;
const ROLE_LABELS: Record<string, string> = {
  owner: "Владелец",
  manager: "Менеджер",
  moderator: "Модератор",
  client: "Клиент",
};
const DEFAULT_ROLE = "moderator";

const CHAT_ID_PATTERN = /^-?\d+$/;
const TELEGRAM_FAILURE_TEXT =
  "Не удалось отправить сообщение. Проверьте, что пользователь уже запускал бота, Chat ID указан верно и бот не заблокирован.";

function roleLabel(role: string) {
  if (!role) return "—";
  return ROLE_LABELS[role] ?? role;
}

function roleBadgeClass(role: string) {
  switch (role) {
    case "owner":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "manager":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "moderator":
      return "bg-violet-100 text-violet-800 border-violet-200";
    case "client":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function isValidChatId(value: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return false;
  return CHAT_ID_PATTERN.test(trimmed);
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const [botToken, setBotToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [tokenSaving, setTokenSaving] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  const [newLabel, setNewLabel] = useState("");
  const [newChatId, setNewChatId] = useState("");
  const [newRole, setNewRole] = useState<string>(DEFAULT_ROLE);
  const [adding, setAdding] = useState(false);

  const [testChatId, setTestChatId] = useState("");
  const [testing, setTesting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [testingId, setTestingId] = useState<number | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/kapi/admin/notifications/telegram");
      const data = await res.json();
      setRecipients(data.recipients ?? []);
      setBotToken(data.botToken ?? "");
      setEmailStatus(data.email ?? null);
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
    const chatId = newChatId.trim();
    if (!chatId) {
      toast.error("Введите Chat ID");
      return;
    }
    if (!isValidChatId(chatId)) {
      toast.error("Некорректный Chat ID", {
        description: "Только цифры (можно с минусом для групповых чатов), до 100 символов.",
      });
      return;
    }
    const role = newRole.trim() || DEFAULT_ROLE;
    setAdding(true);
    try {
      const res = await fetch("/kapi/admin/notifications/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: newLabel.trim(),
          chatId,
          role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecipients(prev => [...prev, data as Recipient]);
        setNewLabel("");
        setNewChatId("");
        setNewRole(DEFAULT_ROLE);
        toast.success("Получатель добавлен");
      } else {
        toast.error(data.error || "Ошибка добавления получателя");
      }
    } catch {
      toast.error("Сеть недоступна. Попробуйте ещё раз.");
    } finally {
      setAdding(false);
    }
  }

  async function toggleRecipient(id: number, active: boolean) {
    const res = await fetch(`/kapi/admin/notifications/telegram/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setRecipients(prev => prev.map(r => (r.id === id ? (data as Recipient) : r)));
      toast.success(!active ? "Уведомления включены" : "Уведомления отключены");
    } else {
      toast.error(data.error || "Не удалось обновить статус получателя");
    }
  }

  async function deleteRecipient(id: number) {
    if (!confirm("Удалить получателя?")) return;
    const res = await fetch(`/kapi/admin/notifications/telegram/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRecipients(prev => prev.filter(r => r.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditDraft(null);
      }
      toast.success("Получатель удалён");
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Не удалось удалить получателя");
    }
  }

  function startEdit(r: Recipient) {
    setEditingId(r.id);
    setEditDraft({
      label: r.label ?? "",
      chatId: r.chatId,
      role: r.role || DEFAULT_ROLE,
      active: r.active,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  async function saveEdit(id: number) {
    if (!editDraft) return;
    const chatId = editDraft.chatId.trim();
    if (!isValidChatId(chatId)) {
      toast.error("Некорректный Chat ID", {
        description: "Только цифры (можно с минусом для групповых чатов), до 100 символов.",
      });
      return;
    }
    const role = editDraft.role.trim() || DEFAULT_ROLE;
    setSavingEdit(true);
    try {
      const res = await fetch(`/kapi/admin/notifications/telegram/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editDraft.label.trim(),
          chatId,
          role,
          active: editDraft.active,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setRecipients(prev => prev.map(r => (r.id === id ? (data as Recipient) : r)));
        setEditingId(null);
        setEditDraft(null);
        toast.success("Получатель обновлён");
      } else {
        toast.error(data.error || "Не удалось сохранить изменения");
      }
    } catch {
      toast.error("Сеть недоступна. Попробуйте ещё раз.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function sendTestToChatId(chatId: string, options: { recipientId?: number; recipientLabel?: string } = {}) {
    if (!botToken) {
      toast.error("Сначала сохраните токен бота");
      return;
    }
    const trimmed = chatId.trim();
    if (!trimmed) {
      toast.error("Введите Chat ID для теста");
      return;
    }
    if (!isValidChatId(trimmed)) {
      toast.error("Некорректный Chat ID", {
        description: "Только цифры (можно с минусом для групповых чатов).",
      });
      return;
    }

    if (options.recipientId) setTestingId(options.recipientId);
    else setTesting(true);

    try {
      const res = await fetch("/kapi/admin/notifications/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _action: "test", botToken, chatId: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        toast.success("Тестовое сообщение отправлено", {
          description: options.recipientLabel
            ? `Получатель: ${options.recipientLabel}`
            : `Chat ID: ${trimmed}`,
        });
      } else {
        toast.error(TELEGRAM_FAILURE_TEXT, {
          description: typeof data.error === "string" ? data.error : undefined,
        });
      }
    } catch {
      toast.error(TELEGRAM_FAILURE_TEXT, {
        description: "Не удалось обратиться к Telegram API. Проверьте подключение.",
      });
    } finally {
      if (options.recipientId) setTestingId(null);
      else setTesting(false);
    }
  }

  async function sendTestEmail() {
    setTestingEmail(true);
    try {
      const res = await fetch("/kapi/admin/notifications/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _action: "testEmail" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        toast.success("Тестовое email-уведомление отправлено");
      } else {
        toast.error(data.error || "Не удалось отправить тестовое email-уведомление");
      }
    } catch {
      toast.error("Сеть недоступна. Попробуйте ещё раз.");
    } finally {
      setTestingEmail(false);
    }
  }

  const activeCount = recipients.filter(r => r.active).length;
  const canTestGlobal = botToken.trim().length > 0;
  const newChatIdInvalid = newChatId.trim().length > 0 && !isValidChatId(newChatId);

  return (
    <div className="max-w-3xl space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-violet-600" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-2xl">Telegram-уведомления</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              При каждой новой заявке с сайта всем активным получателям придёт сообщение с данными клиента.
            </p>
          </div>
        </div>
        <Link
          href="/admin/notifications/logs"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white text-sm font-medium text-foreground hover:bg-muted hover:border-violet-300 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          aria-label="Открыть журнал отправок Telegram-уведомлений"
          title="Журнал последних отправок"
        >
          <History className="w-4 h-4 text-violet-600" aria-hidden="true" />
          Открыть журнал отправок
        </Link>
      </div>

      {/* Статус */}
      <div
        className={`rounded-2xl border p-4 flex items-center gap-3 ${botToken && activeCount > 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
        role="status"
        aria-live="polite"
      >
        {botToken && activeCount > 0
          ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" aria-hidden="true" />
          : <XCircle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
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
          <Info className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
          <p className="font-semibold text-blue-800 text-sm">Как настроить бота</p>
        </div>
        <ol className="text-sm text-blue-900 space-y-1.5 list-decimal list-inside">
          <li>Напишите <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">@BotFather</span> в Telegram, создайте бота командой <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">/newbot</span></li>
          <li>Скопируйте токен вида <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">1234567890:ABCdef...</span> и вставьте ниже</li>
          <li>Напишите боту любое сообщение, затем откройте: <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-xs">api.telegram.org/bot&lt;TOKEN&gt;/getUpdates</span></li>
          <li>Найдите <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">&quot;chat&quot;:{"{"}&quot;id&quot;:...</span> — это ваш Chat ID (цифры, может быть с минусом)</li>
          <li>Или используйте бота <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">@userinfobot</span> — он сразу даёт ваш ID</li>
        </ol>
      </div>

      {/* Datalist общий для всех инпутов роли */}
      <datalist id="telegram-role-options">
        {ROLE_OPTIONS.map(option => (
          <option key={option} value={option}>{ROLE_LABELS[option]}</option>
        ))}
      </datalist>

      {/* Токен бота */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4" aria-labelledby="tg-token-heading">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Bot className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <h2 id="tg-token-heading" className="font-bold text-base">Токен Telegram-бота</h2>
        </div>
        <p className="text-sm text-muted-foreground">Токен получается у <strong>@BotFather</strong>. Один бот для всех получателей.</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Label htmlFor="tg-bot-token" className="sr-only">Токен Telegram-бота</Label>
            <Input
              id="tg-bot-token"
              type={showToken ? "text" : "password"}
              value={botToken}
              onChange={e => setBotToken(e.target.value)}
              placeholder="1234567890:ABCdefGHIjklmNOPqrstUVwxyz"
              className="font-mono text-sm pr-10"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded"
              aria-label={showToken ? "Скрыть токен" : "Показать токен"}
              aria-pressed={showToken}
              title={showToken ? "Скрыть токен" : "Показать токен"}
            >
              {showToken
                ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                : <Eye className="w-4 h-4" aria-hidden="true" />
              }
            </button>
          </div>
          <Button
            onClick={saveBotToken}
            disabled={tokenSaving}
            style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
            className="text-white shrink-0"
          >
            {tokenSaving ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </section>

      {/* Получатели */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4" aria-labelledby="email-notifications-heading">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Mail className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <h2 id="email-notifications-heading" className="font-bold text-base">Email-уведомления</h2>
        </div>
        <div
          className={`rounded-xl border p-3 flex items-start gap-3 ${emailStatus?.configured ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
          role="status"
          aria-live="polite"
        >
          {emailStatus?.configured
            ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
            : <XCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          }
          <div className="min-w-0">
            <p className={`text-sm font-medium ${emailStatus?.configured ? "text-green-800" : "text-amber-800"}`}>
              {emailStatus?.configured ? "Email-уведомления настроены" : "Email-уведомления не настроены"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 break-words">
              SMTP: {emailStatus?.smtpHost || "не задан"} · Получатели: {emailStatus?.recipients?.join(", ") || "не заданы"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={sendTestEmail}
          disabled={testingEmail || !emailStatus?.configured}
          className="gap-2"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          {testingEmail ? "Отправляем..." : "Отправить тест на email"}
        </Button>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 space-y-5" aria-labelledby="tg-recipients-heading">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 id="tg-recipients-heading" className="font-bold text-base">Получатели уведомлений</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {recipients.length} / активных {activeCount}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Загрузка...</p>
        ) : recipients.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Нет получателей — добавьте первого</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {recipients.map((r) => {
              const isEditing = editingId === r.id;
              const dateLabel = formatDate(r.updatedAt || r.createdAt);
              const displayName = r.label?.trim() || "Без имени";

              return (
                <li
                  key={r.id}
                  className={`rounded-xl border transition-colors ${r.active ? "border-violet-200 bg-violet-50/50" : "border-border bg-muted/30"}`}
                >
                  {isEditing && editDraft ? (
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`edit-label-${r.id}`} className="text-xs text-muted-foreground">Имя</Label>
                          <Input
                            id={`edit-label-${r.id}`}
                            value={editDraft.label}
                            onChange={e => setEditDraft(d => (d ? { ...d, label: e.target.value } : d))}
                            placeholder="Директор, Менеджер Иван..."
                            className="mt-1"
                            autoFocus
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-role-${r.id}`} className="text-xs text-muted-foreground">Роль</Label>
                          <Input
                            id={`edit-role-${r.id}`}
                            list="telegram-role-options"
                            value={editDraft.role}
                            onChange={e => setEditDraft(d => (d ? { ...d, role: e.target.value } : d))}
                            placeholder="moderator"
                            className="mt-1"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor={`edit-chatid-${r.id}`} className="text-xs text-muted-foreground">Chat ID *</Label>
                          <Input
                            id={`edit-chatid-${r.id}`}
                            value={editDraft.chatId}
                            onChange={e => setEditDraft(d => (d ? { ...d, chatId: e.target.value } : d))}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(r.id); }}
                            placeholder="-1001234567890 или 123456789"
                            className="mt-1 font-mono text-sm"
                            inputMode="numeric"
                            aria-invalid={editDraft.chatId.trim().length > 0 && !isValidChatId(editDraft.chatId)}
                          />
                          {editDraft.chatId.trim().length > 0 && !isValidChatId(editDraft.chatId) && (
                            <p className="text-xs text-red-600 mt-1">
                              Только цифры (можно с минусом), до 100 символов.
                            </p>
                          )}
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editDraft.active}
                          onChange={e => setEditDraft(d => (d ? { ...d, active: e.target.checked } : d))}
                          className="w-4 h-4 rounded border-border text-violet-600 focus:ring-violet-500"
                        />
                        <span>Активен — получает уведомления</span>
                      </label>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Button
                          onClick={() => saveEdit(r.id)}
                          disabled={savingEdit}
                          style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
                          className="text-white"
                          aria-label="Сохранить изменения получателя"
                        >
                          <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                          {savingEdit ? "Сохраняем..." : "Сохранить"}
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          disabled={savingEdit}
                          variant="outline"
                          aria-label="Отменить редактирование"
                        >
                          <X className="w-4 h-4 mr-2" aria-hidden="true" />
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-sm truncate">
                            {displayName}
                          </p>
                          <span className={`text-[11px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full border ${roleBadgeClass(r.role)}`}>
                            {roleLabel(r.role)}
                          </span>
                          {!r.active && (
                            <span className="text-[11px] text-muted-foreground font-normal px-2 py-0.5 rounded-full bg-muted border border-border">
                              отключён
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-1">Chat ID: {r.chatId}</p>
                        {dateLabel && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Обновлён: {dateLabel}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => sendTestToChatId(r.chatId, { recipientId: r.id, recipientLabel: displayName })}
                          disabled={testingId === r.id || !canTestGlobal}
                          className="inline-flex items-center justify-center min-h-10 min-w-10 p-2 rounded-lg text-muted-foreground hover:text-violet-700 hover:bg-violet-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                          aria-label={`Отправить тестовое сообщение получателю ${displayName}`}
                          title={canTestGlobal ? "Отправить тест этому получателю" : "Сначала сохраните токен бота"}
                        >
                          <Send className={`w-4 h-4 ${testingId === r.id ? "animate-pulse motion-reduce:animate-none" : ""}`} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(r)}
                          className="inline-flex items-center justify-center min-h-10 min-w-10 p-2 rounded-lg text-muted-foreground hover:text-violet-700 hover:bg-violet-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                          aria-label={`Редактировать получателя ${displayName}`}
                          title="Редактировать"
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleRecipient(r.id, r.active)}
                          className={`inline-flex items-center justify-center min-h-10 min-w-10 p-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${r.active ? "text-violet-600 hover:text-violet-800" : "text-muted-foreground hover:text-foreground"}`}
                          aria-label={r.active ? `Отключить уведомления для ${displayName}` : `Включить уведомления для ${displayName}`}
                          aria-pressed={r.active}
                          title={r.active ? "Отключить уведомления" : "Включить уведомления"}
                        >
                          {r.active
                            ? <ToggleRight className="w-7 h-7" aria-hidden="true" />
                            : <ToggleLeft className="w-7 h-7" aria-hidden="true" />
                          }
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRecipient(r.id)}
                          className="inline-flex items-center justify-center min-h-10 min-w-10 p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          aria-label={`Удалить получателя ${displayName}`}
                          title="Удалить получателя"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Добавить получателя */}
        <div className="pt-3 border-t border-border space-y-3">
          <p className="text-sm font-medium">Добавить получателя</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="new-label" className="text-xs text-muted-foreground">Имя (необязательно)</Label>
              <Input
                id="new-label"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Директор, Менеджер Иван..."
                className="mt-1"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="new-role" className="text-xs text-muted-foreground">Роль</Label>
              <Input
                id="new-role"
                list="telegram-role-options"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                placeholder="moderator"
                className="mt-1"
                maxLength={50}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Подсказки: owner, manager, moderator, client. Можно ввести свою.
              </p>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="new-chat-id" className="text-xs text-muted-foreground">Chat ID *</Label>
              <Input
                id="new-chat-id"
                value={newChatId}
                onChange={e => setNewChatId(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addRecipient(); }}
                placeholder="-1001234567890 или 123456789"
                className="mt-1 font-mono text-sm"
                inputMode="numeric"
                aria-invalid={newChatIdInvalid}
                aria-describedby="new-chat-id-hint"
              />
              <p id="new-chat-id-hint" className={`text-[11px] mt-1 ${newChatIdInvalid ? "text-red-600" : "text-muted-foreground"}`}>
                Только цифры (можно с минусом для групповых чатов), до 100 символов.
              </p>
            </div>
          </div>
          <Button
            onClick={addRecipient}
            disabled={adding}
            variant="outline"
            className="w-full"
            aria-label="Добавить получателя уведомлений"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            {adding ? "Добавляем..." : "Добавить получателя"}
          </Button>
        </div>
      </section>

      {/* Тест */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4" aria-labelledby="tg-test-heading">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Send className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <h2 id="tg-test-heading" className="font-bold text-base">Проверить доставку</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Отправьте тестовое сообщение на любой Chat ID, чтобы убедиться, что бот работает.
          Токен должен быть сохранён.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="test-chat-id" className="sr-only">Chat ID для теста</Label>
            <Input
              id="test-chat-id"
              value={testChatId}
              onChange={e => setTestChatId(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendTestToChatId(testChatId); }}
              placeholder="Введите Chat ID для теста"
              className="font-mono text-sm"
              inputMode="numeric"
            />
          </div>
          <Button
            onClick={() => sendTestToChatId(testChatId)}
            disabled={testing || !canTestGlobal}
            variant="outline"
            className="shrink-0"
            aria-label="Отправить тестовое сообщение на указанный Chat ID"
          >
            <Send className="w-4 h-4 mr-2" aria-hidden="true" />
            {testing ? "Отправляем..." : "Отправить тест"}
          </Button>
        </div>
        {!canTestGlobal && (
          <p className="text-xs text-amber-700">Сначала сохраните токен бота</p>
        )}
      </section>

      {/* Пример сообщения */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4" aria-labelledby="tg-sample-heading">
        <h2 id="tg-sample-heading" className="font-bold text-base border-b border-border pb-3">Пример сообщения</h2>
        <div className="bg-[#effdde] rounded-2xl p-4 font-mono text-sm text-[#2c2c2c] whitespace-pre-wrap border border-[#c8e6c9] leading-relaxed">
{`Новая заявка #42
Форма: Замер
Дата/время: 07.04.2026, 14:32

Имя: Александр Иванов
Телефон: +375293720674
Город: Минск
Комментарий: Хочу угловую кухню 3×4 м

Ответы на вопросы:
  • Стиль: Модерн
  • Бюджет: до 3000 BYN

Источник: catalog`}
        </div>
      </section>

    </div>
  );
}
