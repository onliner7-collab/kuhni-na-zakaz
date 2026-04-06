"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck, User, KeyRound } from "lucide-react";

interface Props {
  user: { login: string; name: string; role: string };
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Супер-администратор",
  MANAGER: "Менеджер",
  GUEST: "Гость",
};

export function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [login, setLogin] = useState(user.login);
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Новые пароли не совпадают");
      return;
    }
    if (!currentPassword) {
      toast.error("Введите текущий пароль для подтверждения");
      return;
    }
    setLoading(true);
    try {
      const payload: any = { name, login, currentPassword };
      if (newPassword) payload.newPassword = newPassword;
      const res = await fetch("/kapi/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Ошибка"); return; }
      toast.success("Профиль обновлён");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="profile-form">
      {/* Role badge */}
      <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm text-primary font-medium">{ROLE_LABELS[user.role] ?? user.role}</span>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <User className="w-4 h-4" /> Данные аккаунта
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Имя (отображается в панели)</label>
          <input className="form-input w-full" value={name} onChange={e => setName(e.target.value)}
            placeholder="Администратор" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Логин для входа</label>
          <input className="form-input w-full" value={login} onChange={e => setLogin(e.target.value)}
            placeholder="admin" autoComplete="username" />
          <p className="text-xs text-muted-foreground mt-1">Используется вместо email на странице входа</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <KeyRound className="w-4 h-4" /> Смена пароля
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Новый пароль <span className="text-muted-foreground font-normal">(если хотите изменить)</span></label>
          <div className="relative">
            <input className="form-input w-full pr-10" type={showNew ? "text" : "password"} value={newPassword}
              onChange={e => setNewPassword(e.target.value)} placeholder="Минимум 4 символа" autoComplete="new-password" />
            <button type="button" onClick={() => setShowNew(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {newPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Повторите новый пароль</label>
            <input className="form-input w-full" type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Пароли не совпадают</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Текущий пароль <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-2">Введите текущий пароль для подтверждения любых изменений</p>
        <div className="relative">
          <input className="form-input w-full pr-10" type={showCurrent ? "text" : "password"} value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)} placeholder="Ваш текущий пароль" required autoComplete="current-password" />
          <button type="button" onClick={() => setShowCurrent(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading || !currentPassword}
        className="w-full py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
        {loading ? "Сохранение..." : "Сохранить изменения"}
      </button>
    </form>
  );
}
