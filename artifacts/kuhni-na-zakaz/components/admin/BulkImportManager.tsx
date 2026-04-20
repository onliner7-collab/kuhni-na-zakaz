"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImportEntity =
  | "kitchens"
  | "styles"
  | "materials"
  | "scenarios"
  | "portfolio"
  | "locations";

type ImportOperation = "create" | "update" | "unchanged" | "invalid";
type IssueSeverity = "error" | "warning";

type ImportIssue = {
  severity: IssueSeverity;
  sheet: string;
  rowNumber?: number;
  field?: string;
  message: string;
};

type ImportRowPreview = {
  sheet: string;
  entity: ImportEntity;
  rowNumber: number;
  externalId: string | null;
  slug: string | null;
  title: string | null;
  operation: ImportOperation;
  issues: ImportIssue[];
  changedFields: string[];
};

type ImportSummary = {
  totalRows: number;
  create: number;
  update: number;
  unchanged: number;
  invalid: number;
  errors: number;
  warnings: number;
  bySheet: Record<
    string,
    {
      totalRows: number;
      create: number;
      update: number;
      unchanged: number;
      invalid: number;
    }
  >;
};

type ApplyImportResult = {
  appliedAt: string;
  summary: {
    created: number;
    updated: number;
    unchanged: number;
    invalid: number;
  };
};

type PreviewResponse = {
  sessionId: string;
  version: "bulk-import-v1";
  fileName: string;
  createdAt: string;
  expiresAt: string;
  appliedAt: string | null;
  workbookSheets: string[];
  summary: ImportSummary;
  issues: ImportIssue[];
  rows: ImportRowPreview[];
  applyResult?: ApplyImportResult;
};

const OPERATION_BADGE: Record<
  ImportOperation,
  {
    label: string;
    variant: "default" | "secondary" | "success" | "warning" | "destructive";
  }
> = {
  create: { label: "Create", variant: "success" },
  update: { label: "Update", variant: "default" },
  unchanged: { label: "Unchanged", variant: "secondary" },
  invalid: { label: "Invalid", variant: "destructive" },
};

const ENTITY_LABELS: Record<ImportEntity, string> = {
  kitchens: "Kitchens",
  styles: "Styles",
  materials: "Materials",
  scenarios: "Scenarios",
  portfolio: "Portfolio",
  locations: "Locations",
};

const V1_LIMITATIONS = [
  "Workbook поддерживает только листы Kitchens, Styles, Materials, Scenarios, Portfolio и Locations.",
  "Нераспознанные листы пропускаются и попадают в warnings.",
  "Для существующих записей slug не меняется: backend показывает warning и игнорирует такое изменение.",
  "Поля вне safe scope v1 игнорируются. Критичные примеры: relatedMaterials, relatedCaseSlugs, relatedScenarioSlugs, relatedStyles, styleSlug, materialSlugs, scenarioSlugs, caseSlugs, reviewIds.",
  "Apply доступен только когда preview без ошибок. Warnings допустимы, но должны быть осознанно приняты оператором.",
  "Preview-сессия временная. После истечения срока workbook нужно загрузить заново.",
];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU");
}

function buildIssueKey(issue: ImportIssue, fallbackIndex: number) {
  return [
    issue.severity,
    issue.sheet,
    issue.rowNumber ?? fallbackIndex,
    issue.field ?? "",
    issue.message,
  ].join(":");
}

export function BulkImportManager({
  initialSessionId,
}: {
  initialSessionId: string | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<string>("all");
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState(false);

  useEffect(() => {
    if (!initialSessionId) return;

    let cancelled = false;

    async function loadPreview() {
      setLoadingSession(true);
      setError(null);

      try {
        const res = await fetch(`/kapi/admin/imports/bulk/v1/sessions/${initialSessionId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Не удалось загрузить import session");
        }

        if (!cancelled) {
          setPreview(data);
          setSelectedSheet("all");
        }
      } catch (loadError) {
        if (!cancelled) {
          const message =
            loadError instanceof Error ? loadError.message : "Не удалось загрузить preview";
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoadingSession(false);
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [initialSessionId]);

  const filteredRows = (preview?.rows ?? []).filter((row) => {
    if (selectedSheet !== "all" && row.sheet !== selectedSheet) return false;
    if (showOnlyIssues && row.issues.length === 0) return false;
    return true;
  });
  const deferredRows = useDeferredValue(filteredRows);

  const derivedIssues = [
    ...(preview?.issues ?? []),
    ...((preview?.rows ?? []).flatMap((row) => row.issues)),
  ];
  const uniqueIssues = Array.from(
    new Map(
      derivedIssues.map((issue, index) => [buildIssueKey(issue, index), issue] as const)
    ).values()
  );
  const blockingErrors = preview?.summary.errors ?? 0;
  const actionableRows = (preview?.summary.create ?? 0) + (preview?.summary.update ?? 0);
  const canApply =
    !!preview &&
    !preview.appliedAt &&
    !applying &&
    blockingErrors === 0 &&
    actionableRows > 0 &&
    acknowledgedWarnings;

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setUploading(false);
      toast.error("Выберите workbook для загрузки");
      return;
    }

    try {
      const res = await fetch("/kapi/admin/imports/bulk/v1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Не удалось построить preview");
      }

      setPreview(data);
      setSelectedSheet("all");
      setShowOnlyIssues(false);
      setAcknowledgedWarnings(false);
      router.replace(`/admin/imports?session=${data.sessionId}`, { scroll: false });
      toast.success("Preview готов. Проверьте errors и warnings перед apply.");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Загрузка workbook не удалась";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  async function refreshPreview() {
    if (!preview) return;

    setLoadingSession(true);
    setError(null);

    try {
      const res = await fetch(`/kapi/admin/imports/bulk/v1/sessions/${preview.sessionId}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Не удалось обновить preview");
      }

      setPreview(data);
      toast.success("Preview обновлён.");
    } catch (refreshError) {
      const message =
        refreshError instanceof Error ? refreshError.message : "Не удалось обновить preview";
      setError(message);
      toast.error(message);
    } finally {
      setLoadingSession(false);
    }
  }

  async function handleApply() {
    if (!preview) return;

    setApplying(true);
    setError(null);

    try {
      const res = await fetch(`/kapi/admin/imports/bulk/v1/sessions/${preview.sessionId}/confirm`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Apply не удался");
      }

      setPreview(data);
      toast.success("Bulk import применён.");
    } catch (applyError) {
      const message = applyError instanceof Error ? applyError.message : "Apply не удался";
      setError(message);
      toast.error(message);
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 via-white to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            Загрузка workbook
          </CardTitle>
          <CardDescription>
            Продуктовый flow для контентщика и менеджера: upload, preview, проверка проблем и
            confirm/apply на одном экране.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleUpload}
            className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
          >
            <div className="space-y-2">
              <Label htmlFor="bulk-import-file">Workbook (.xlsx, .xls, .xlsm)</Label>
              <Input
                id="bulk-import-file"
                name="file"
                type="file"
                accept=".xlsx,.xls,.xlsm"
                required
                disabled={uploading || applying}
              />
              <p className="text-xs text-muted-foreground">
                После загрузки backend создаст preview-сессию с summary, row diff и списком
                issues.
              </p>
            </div>
            <Button type="submit" disabled={uploading || applying} className="lg:min-w-48">
              {uploading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Строим preview...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Загрузить и проверить
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loadingSession && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Загружаю сохранённый preview...
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Preview и summary</CardTitle>
              <CardDescription>
                {!preview
                  ? "Загрузите workbook, чтобы увидеть preview."
                  : `Файл ${preview.fileName}, версия ${preview.version}, создан ${formatDateTime(preview.createdAt)}.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {!preview ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
                  <p className="text-sm font-medium text-foreground">Preview пока не создан</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Загрузите workbook выше, чтобы получить summary, row preview и список проблем.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard label="Create" value={preview.summary.create} tone="emerald" />
                    <SummaryCard label="Update" value={preview.summary.update} tone="violet" />
                    <SummaryCard label="Unchanged" value={preview.summary.unchanged} tone="slate" />
                    <SummaryCard label="Invalid" value={preview.summary.invalid} tone="rose" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <MiniStat label="Всего строк" value={preview.summary.totalRows} />
                    <MiniStat
                      label="Errors"
                      value={preview.summary.errors}
                      destructive={preview.summary.errors > 0}
                    />
                    <MiniStat
                      label="Warnings"
                      value={preview.summary.warnings}
                      warning={preview.summary.warnings > 0}
                    />
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant="outline">Session {preview.sessionId.slice(0, 8)}</Badge>
                      <Badge variant="outline">
                        Sheets: {preview.workbookSheets.join(", ") || "—"}
                      </Badge>
                      {preview.appliedAt ? (
                        <Badge variant="success">Applied {formatDateTime(preview.appliedAt)}</Badge>
                      ) : (
                        <Badge variant="warning">
                          Истекает {formatDateTime(preview.expiresAt)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {preview.applyResult && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                        <div className="text-sm text-emerald-900">
                          <p className="font-semibold">Apply завершён</p>
                          <p className="mt-1">
                            Created: {preview.applyResult.summary.created}, updated:{" "}
                            {preview.applyResult.summary.updated}, unchanged:{" "}
                            {preview.applyResult.summary.unchanged}, skipped invalid:{" "}
                            {preview.applyResult.summary.invalid}.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Breakdown по листам
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={selectedSheet === "all" ? "default" : "outline"}
                          onClick={() => setSelectedSheet("all")}
                        >
                          Все листы
                        </Button>
                        {Object.keys(preview.summary.bySheet).map((sheet) => (
                          <Button
                            key={sheet}
                            type="button"
                            size="sm"
                            variant={selectedSheet === sheet ? "default" : "outline"}
                            onClick={() => setSelectedSheet(sheet)}
                          >
                            {sheet}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(preview.summary.bySheet).map(([sheet, sheetSummary]) => (
                        <div key={sheet} className="rounded-2xl border border-border bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">{sheet}</p>
                            <Badge variant="outline">{sheetSummary.totalRows} rows</Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <Badge variant="success">Create {sheetSummary.create}</Badge>
                            <Badge variant="default">Update {sheetSummary.update}</Badge>
                            <Badge variant="secondary">Unchanged {sheetSummary.unchanged}</Badge>
                            <Badge variant="destructive">Invalid {sheetSummary.invalid}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Preview строк</CardTitle>
              <CardDescription>
                Список create/update/unchanged/invalid с changed fields и row-level issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={showOnlyIssues ? "default" : "outline"}
                  onClick={() => setShowOnlyIssues((current) => !current)}
                  disabled={!preview}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Только строки с issues
                </Button>
                {preview && (
                  <span className="text-sm text-muted-foreground">
                    Показано {deferredRows.length} из {preview.rows.length} строк
                  </span>
                )}
              </div>

              {!preview ? null : deferredRows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                  Под текущий фильтр строки не попали.
                </div>
              ) : (
                <div className="space-y-3">
                  {deferredRows.map((row) => {
                    const operation = OPERATION_BADGE[row.operation];

                    return (
                      <div
                        key={`${row.sheet}-${row.rowNumber}-${row.externalId ?? row.slug ?? row.title ?? "row"}`}
                        className={cn(
                          "rounded-2xl border p-4",
                          row.operation === "invalid"
                            ? "border-red-200 bg-red-50/80"
                            : row.operation === "create"
                              ? "border-emerald-200 bg-emerald-50/70"
                              : row.operation === "update"
                                ? "border-violet-200 bg-violet-50/60"
                                : "border-border bg-white"
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={operation.variant}>{operation.label}</Badge>
                              <Badge variant="outline">{row.sheet}</Badge>
                              <Badge variant="outline">{ENTITY_LABELS[row.entity]}</Badge>
                              <span className="text-xs text-muted-foreground">Row {row.rowNumber}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {row.title || row.slug || row.externalId || "Без названия"}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span>externalId: {row.externalId || "—"}</span>
                                <span>slug: {row.slug || "—"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="max-w-sm text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              Changed fields
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                              {row.changedFields.length > 0
                                ? row.changedFields.join(", ")
                                : "Нет изменений"}
                            </p>
                          </div>
                        </div>

                        {row.issues.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {row.issues.map((issue, index) => (
                              <div
                                key={buildIssueKey(issue, index)}
                                className={cn(
                                  "rounded-xl px-3 py-2 text-sm",
                                  issue.severity === "error"
                                    ? "border border-red-200 bg-white text-red-700"
                                    : "border border-amber-200 bg-white text-amber-800"
                                )}
                              >
                                <span className="font-semibold">
                                  {issue.severity === "error" ? "Ошибка" : "Предупреждение"}
                                </span>
                                <span className="ml-2">{issue.message}</span>
                                {issue.field && (
                                  <span className="ml-2 text-xs opacity-80">
                                    field: {issue.field}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Errors и warnings</CardTitle>
              <CardDescription>
                Если есть errors, workbook нужно исправить и загрузить заново. Warnings можно
                принять осознанно.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!preview ? (
                <p className="text-sm text-muted-foreground">
                  После upload здесь появится consolidated issue list.
                </p>
              ) : uniqueIssues.length === 0 ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Preview чистый: backend не нашёл ни ошибок, ни предупреждений.
                </div>
              ) : (
                uniqueIssues.map((issue, index) => (
                  <div
                    key={buildIssueKey(issue, index)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm",
                      issue.severity === "error"
                        ? "border-red-200 bg-red-50 text-red-800"
                        : "border-amber-200 bg-amber-50 text-amber-900"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">
                        {issue.severity === "error" ? "Ошибка" : "Предупреждение"}
                      </p>
                      <span className="text-xs opacity-80">
                        {issue.sheet}
                        {issue.rowNumber ? ` · row ${issue.rowNumber}` : ""}
                      </span>
                    </div>
                    <p className="mt-1">{issue.message}</p>
                    {issue.field && <p className="mt-1 text-xs opacity-80">Field: {issue.field}</p>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-amber-950">
                <ShieldAlert className="h-5 w-5" />
                Ограничения v1
              </CardTitle>
              <CardDescription className="text-amber-900/80">
                Остаточные ограничения явно показаны оператору до confirm/apply.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-amber-950">
              {V1_LIMITATIONS.map((item) => (
                <div key={item} className="rounded-xl border border-amber-200 bg-white/80 px-3 py-2">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Confirm / apply</CardTitle>
              <CardDescription>
                Apply использует существующий endpoint confirm и не трогает import engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!preview ? (
                <p className="text-sm text-muted-foreground">
                  Сначала загрузите workbook и получите preview.
                </p>
              ) : (
                <>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm">
                    <p className="font-semibold text-foreground">Статус готовности</p>
                    <ul className="mt-2 space-y-2 text-muted-foreground">
                      <li>Rows to create/update: {actionableRows}</li>
                      <li>Blocking errors: {preview.summary.errors}</li>
                      <li>Warnings: {preview.summary.warnings}</li>
                      <li>Session expires: {formatDateTime(preview.expiresAt)}</li>
                    </ul>
                  </div>

                  {!preview.appliedAt && (
                    <label className="flex items-start gap-3 rounded-2xl border border-border p-4 text-sm">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-violet-600"
                        checked={acknowledgedWarnings}
                        onChange={(event) => setAcknowledgedWarnings(event.target.checked)}
                      />
                      <span className="text-muted-foreground">
                        Я проверил preview, понимаю ограничения safe bulk import v1 и готов
                        применить только разрешённые изменения.
                      </span>
                    </label>
                  )}

                  {preview.appliedAt ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      Импорт уже применён {formatDateTime(preview.appliedAt)}. Повторный apply не
                      требуется.
                    </div>
                  ) : preview.summary.errors > 0 ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                      Apply заблокирован: исправьте errors в workbook и загрузите его заново.
                    </div>
                  ) : actionableRows === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      Apply не нужен: backend не нашёл create/update изменений.
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                      Preview готов к apply. Warnings не блокируют запуск, но должны быть
                      осознанно приняты оператором.
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button type="button" onClick={handleApply} disabled={!canApply}>
                      {applying ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Применяем...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Confirm and apply
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={!preview || loadingSession || uploading || applying}
                      onClick={() => void refreshPreview()}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Обновить preview
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "violet" | "slate" | "rose";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : tone === "violet"
        ? "border-violet-200 bg-violet-50 text-violet-950"
        : tone === "rose"
          ? "border-rose-200 bg-rose-50 text-rose-950"
          : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <div className={cn("rounded-2xl border p-4", toneClass)}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  destructive,
  warning,
}: {
  label: string;
  value: number;
  destructive?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        destructive
          ? "border-red-200 bg-red-50 text-red-900"
          : warning
            ? "border-amber-200 bg-amber-50 text-amber-900"
            : "border-border bg-white text-foreground"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
