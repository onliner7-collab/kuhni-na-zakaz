import nodemailer from "nodemailer";

const LEAD_NOTIFICATION_RECIPIENT = "onliner7@gmail.com";

export interface EmailLeadData {
  id: number;
  name: string;
  phone: string;
  city: string;
  comment: string;
  source: string;
  formType: string;
  answers: unknown;
  createdAt: Date;
}

const FORM_TYPE_LABELS: Record<string, string> = {
  contact:     "Обратная связь",
  measurement: "Замер",
  calculator:  "Калькулятор",
  catalog:     "Каталог",
  portfolio:   "Портфолио",
  price:       "Цены",
  quiz:        "Квиз",
  popup:       "Поп-ап форма",
  header:      "Шапка сайта",
  footer:      "Подвал сайта",
};

function buildHtmlBody(lead: EmailLeadData): string {
  const formLabel = FORM_TYPE_LABELS[lead.formType] ?? lead.formType;
  const date = new Date(lead.createdAt).toLocaleString("ru-RU", {
    timeZone: "Europe/Minsk",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const esc = (s: string) => s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const answersHtml = (() => {
    const answersObj = (lead.answers && typeof lead.answers === "object" && !Array.isArray(lead.answers))
      ? (lead.answers as Record<string, unknown>)
      : {};
    const keys = Object.keys(answersObj);
    if (keys.length === 0) return "";
    const rows = keys.map((k) => `
      <tr>
        <td style="padding:4px 8px;color:#6b7280;white-space:nowrap">${esc(k)}</td>
        <td style="padding:4px 8px">${esc(String(answersObj[k]))}</td>
      </tr>`).join("");
    return `
      <tr><td colspan="2" style="padding:12px 8px 4px;font-weight:600;color:#374151">Ответы на вопросы</td></tr>
      ${rows}`;
  })();

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>Новая заявка</title></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1)">
    <div style="background:#7c3aed;padding:20px 24px">
      <h1 style="margin:0;color:#fff;font-size:18px">🆕 Новая заявка #${lead.id}</h1>
      <p style="margin:4px 0 0;color:#e9d5ff;font-size:13px">КухниBY</p>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151">
        <tr>
          <td style="padding:6px 8px;color:#6b7280;white-space:nowrap;width:140px">Форма</td>
          <td style="padding:6px 8px"><b>${esc(formLabel)}</b></td>
        </tr>
        <tr>
          <td style="padding:6px 8px;color:#6b7280">Дата / время</td>
          <td style="padding:6px 8px">${date}</td>
        </tr>
        <tr style="background:#f3f4f6">
          <td style="padding:6px 8px;color:#6b7280">Имя</td>
          <td style="padding:6px 8px"><b>${esc(lead.name)}</b></td>
        </tr>
        <tr>
          <td style="padding:6px 8px;color:#6b7280">Телефон</td>
          <td style="padding:6px 8px"><b>${esc(lead.phone)}</b></td>
        </tr>
        ${lead.city ? `<tr style="background:#f3f4f6"><td style="padding:6px 8px;color:#6b7280">Город</td><td style="padding:6px 8px">${esc(lead.city)}</td></tr>` : ""}
        ${lead.comment ? `<tr><td style="padding:6px 8px;color:#6b7280">Комментарий</td><td style="padding:6px 8px">${esc(lead.comment)}</td></tr>` : ""}
        <tr>
          <td style="padding:6px 8px;color:#6b7280">Источник</td>
          <td style="padding:6px 8px">${esc(lead.source)}</td>
        </tr>
        ${answersHtml}
      </table>
    </div>
    <div style="background:#f9fafb;padding:12px 24px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af">
      Автоматическое уведомление от сайта КухниBY
    </div>
  </div>
</body>
</html>`;
}

function getSmtpConfig() {
  const host = process.env.EMAIL_SMTP_HOST;
  if (!host) return null;

  return {
    host,
    port: Number(process.env.EMAIL_SMTP_PORT ?? 587),
    secure: process.env.EMAIL_SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SMTP_USER ?? "",
      pass: process.env.EMAIL_SMTP_PASS ?? "",
    },
  };
}

export async function sendEmailNotification(lead: EmailLeadData): Promise<void> {
  const smtp = getSmtpConfig();
  if (!smtp) {
    console.warn("[EMAIL] EMAIL_SMTP_HOST not set — skipping email notification");
    return;
  }

  const from = smtp.auth.user
    ? `"КухниBY" <${smtp.auth.user}>`
    : `"КухниBY" <noreply@kuhniby.by>`;

  const formLabel = FORM_TYPE_LABELS[lead.formType] ?? lead.formType;
  const subject = `Новая заявка #${lead.id} — ${formLabel} | КухниBY`;

  const transporter = nodemailer.createTransport(smtp);
  await transporter.sendMail({
    from,
    to: LEAD_NOTIFICATION_RECIPIENT,
    subject,
    html: buildHtmlBody(lead),
  });

  console.info(`[EMAIL] Notification sent for lead #${lead.id} to ${LEAD_NOTIFICATION_RECIPIENT}`);
}
