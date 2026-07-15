import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const chatIdSchema = z
  .string()
  .trim()
  .min(1, "Chat ID обязателен")
  .max(100, "Chat ID слишком длинный")
  .regex(
    /^-?\d+$/,
    "Chat ID должен содержать только цифры (можно с минусом для групповых чатов)",
  );

const recipientUpdateSchema = z.object({
  label: z.string().trim().max(100).optional(),
  role: z.enum(["owner", "manager"]).optional(),
  chatId: chatIdSchema.optional(),
  active: z.boolean().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

async function requireSuperAdmin(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  return null;
}

function parseRecipientId(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireSuperAdmin();
  if (denied) return denied;

  const { id: idRaw } = await params;
  const id = parseRecipientId(idRaw);
  if (id === null) {
    return NextResponse.json(
      { error: "Некорректный идентификатор" },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = recipientUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.errors[0]?.message ?? "Неверные данные",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Не передано ни одно поле для обновления" },
      { status: 400 },
    );
  }

  if (data.chatId) {
    const conflict = await prisma.telegramRecipient.findFirst({
      where: { chatId: data.chatId, NOT: { id } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Этот Chat ID уже занят другим получателем" },
        { status: 400 },
      );
    }
  }

  try {
    const updated = await prisma.telegramRecipient.update({
      where: { id },
      data: {
        ...data,
        ...(data.chatId ? { telegramUserId: data.chatId.startsWith("-") ? null : data.chatId } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json(
          { error: "Получатель не найден" },
          { status: 404 },
        );
      }
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "Этот Chat ID уже занят другим получателем" },
          { status: 400 },
        );
      }
    }
    console.error("[TELEGRAM RECIPIENTS PATCH]", err);
    return NextResponse.json(
      { error: "Не удалось обновить получателя" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const denied = await requireSuperAdmin();
  if (denied) return denied;

  const { id: idRaw } = await params;
  const id = parseRecipientId(idRaw);
  if (id === null) {
    return NextResponse.json(
      { error: "Некорректный идентификатор" },
      { status: 400 },
    );
  }

  try {
    await prisma.telegramRecipient.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      // Единый стиль с PATCH: при отсутствии записи отвечаем 404,
      // чтобы UI и автотесты могли отличить «удалено» от «не было».
      return NextResponse.json(
        { error: "Получатель не найден" },
        { status: 404 },
      );
    }
    console.error("[TELEGRAM RECIPIENTS DELETE]", err);
    return NextResponse.json(
      { error: "Не удалось удалить получателя" },
      { status: 500 },
    );
  }
}
