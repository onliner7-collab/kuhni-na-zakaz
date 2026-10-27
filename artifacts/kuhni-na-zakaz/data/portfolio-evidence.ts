/**
 * Публичные факты портфолио разрешены только после проверки источников.
 * Запись БД, имя файла и визуальная группировка фотографий не являются источниками.
 * Реестр намеренно пуст: на 27.10.2026 подтверждений выполненных заказов нет.
 * Аудит: docs/seo/2026-10-27-portfolio-cleanup.md.
 */
export interface PortfolioEvidence {
  projectSource: string;
  mediaSource: string;
  verifiedAt: string;
  city: string;
  cityKey: string;
  region: string;
  district: string;
  price?: {
    source: string;
    checkedAt: string;
    from: number;
    to: number;
    scope: string;
  };
}

export const PORTFOLIO_EVIDENCE: Readonly<Record<string, PortfolioEvidence>> = {};

export function getPortfolioEvidence(slug: string) {
  const evidence = PORTFOLIO_EVIDENCE[slug];
  if (!evidence?.projectSource.trim() || !evidence.mediaSource.trim() ||
      evidence.projectSource === evidence.mediaSource || !evidence.verifiedAt) return undefined;
  return evidence;
}
