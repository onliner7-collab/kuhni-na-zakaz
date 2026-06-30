"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";
import { getKitchenIdea3DById } from "@/data/kitchen-ideas-3d";

const kitchenTypes = [
  { value: "", label: "Пока не знаю" },
  { value: "Прямая", label: "Прямая" },
  { value: "Угловая", label: "Угловая" },
  { value: "П-образная", label: "П-образная" },
  { value: "С островом", label: "С островом" },
  { value: "Кухня-студия", label: "Кухня-студия" },
  { value: "До потолка", label: "До потолка" },
];

const schema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(100, "Слишком длинное имя"),
  phone: z.string().trim().min(7, "Введите корректный номер").max(30, "Слишком длинный номер"),
  city: z.string().trim().max(100, "Слишком длинный город").optional(),
  kitchenType: z.string().trim().max(80).optional(),
  messenger: z.string().trim().max(80).optional(),
  uploadNote: z.string().trim().max(300).optional(),
  hasMeasurements: z.boolean().optional(),
  comment: z.string().trim().max(2000, "Комментарий слишком длинный").optional(),
  agreement: z.literal(true, {
    errorMap: () => ({ message: "Подтвердите согласие на обработку данных" }),
  }),
  sourcePage: z.string().optional(),
  sourceType: z.string().optional(),
  projectSlug: z.string().optional(),
  cityKey: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  referrer: z.string().optional(),
  honeypot: z.string().max(0, "Это поле должно быть пустым").optional(),
});

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
  source?: string;
  city?: string;
  sourcePage?: string;
  sourceType?: string;
  projectSlug?: string;
  cityKey?: string;
  formType?: string;
  formLocation?: string;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  showCity?: boolean;
  showKitchenType?: boolean;
  showMessenger?: boolean;
  showHasMeasurements?: boolean;
  showRoomFile?: boolean;
  defaultKitchenType?: string;
  defaultComment?: string;
}

interface TrackingFields {
  sourcePage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
}

function detectSourceType(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/portfolio/")) return "portfolio-project";
  if (pathname === "/portfolio") return "portfolio-index";
  if (pathname.startsWith("/locations/")) return "location-region";
  if (pathname === "/prices") return "prices";
  if (pathname === "/calculator") return "calculator";
  if (pathname === "/contacts") return "contacts";
  return "website";
}

function readTrackingFields(fallbackSourcePage: string, fixedSourcePage?: string): TrackingFields {
  if (typeof window === "undefined") {
    return {
      sourcePage: fixedSourcePage || fallbackSourcePage,
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      referrer: "",
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    sourcePage: fixedSourcePage || `${window.location.pathname}${window.location.search}${window.location.hash}`,
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmTerm: params.get("utm_term") || "",
    utmContent: params.get("utm_content") || "",
    referrer: document.referrer || "",
  };
}

function readIdeaComment(defaultComment = "") {
  if (typeof window === "undefined") return defaultComment;

  const params = new URLSearchParams(window.location.search);
  const ideaTitle = params.get("ideaTitle") || getKitchenIdea3DById(params.get("idea3d"))?.title;

  return ideaTitle ? `Интересует 3D-идея: ${ideaTitle}` : defaultComment;
}

function readDesignProjectComment(defaultComment = "") {
  if (typeof window === "undefined") return defaultComment;

  const rawSelection = window.sessionStorage.getItem("designProjectSelection");
  if (!rawSelection) return defaultComment;

  try {
    const selection = JSON.parse(rawSelection) as {
      shape?: string;
      size?: string;
      style?: string;
      facade?: string;
      extras?: string[];
    };
    const lines = [
      defaultComment,
      "Выбранные параметры 3D-проекта:",
      selection.shape ? `Тип кухни: ${selection.shape}` : "",
      selection.size ? `Размер помещения: ${selection.size}` : "",
      selection.style ? `Стиль: ${selection.style}` : "",
      selection.facade ? `Фасады: ${selection.facade}` : "",
      selection.extras?.length ? `Дополнительно: ${selection.extras.join(", ")}` : "",
    ].filter(Boolean);

    return lines.join("\n");
  } catch {
    return defaultComment;
  }
}

function readSourceTypeOverride() {
  if (typeof window === "undefined") return "";

  return new URLSearchParams(window.location.search).get("sourceType") || "";
}

function readPagePath(fallbackPathname: string) {
  if (typeof window === "undefined") return fallbackPathname;

  return window.location.pathname || fallbackPathname;
}

export function ContactForm({
  source = "website",
  city,
  sourcePage,
  sourceType,
  projectSlug,
  cityKey,
  formType = "contact",
  formLocation = formType,
  submitLabel = "Отправить заявку",
  successMessage = "Мы свяжемся с вами в рабочее время и уточним детали кухни.",
  errorMessage,
  showCity = true,
  showKitchenType = true,
  showMessenger = false,
  showHasMeasurements = false,
  showRoomFile = false,
  defaultKitchenType = "",
  defaultComment = "",
}: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [roomFile, setRoomFile] = useState<File | null>(null);
  const pathname = usePathname() || "/";
  const formRef = useRef<HTMLFormElement | null>(null);
  const formOpenTracked = useRef(false);
  const formId = useId();
  const resolvedSourceType = sourceType || detectSourceType(pathname);
  const fallbackSourcePage = sourcePage || pathname;
  const [trackingFields, setTrackingFields] = useState<TrackingFields>(() => readTrackingFields(fallbackSourcePage, sourcePage));
  const [effectiveSourceType, setEffectiveSourceType] = useState(() => readSourceTypeOverride() || resolvedSourceType);
  const [ideaComment, setIdeaComment] = useState(() => readIdeaComment(defaultComment));
  const nameId = `${formId}-lead-name`;
  const phoneId = `${formId}-lead-phone`;
  const cityId = `${formId}-lead-city`;
  const kitchenTypeId = `${formId}-lead-kitchen-type`;
  const messengerId = `${formId}-lead-messenger`;
  const hasMeasurementsId = `${formId}-lead-has-measurements`;
  const roomFileId = `${formId}-lead-room-file`;
  const commentId = `${formId}-lead-comment`;
  const agreementId = `${formId}-lead-agreement`;
  const formErrorSummaryId = `${formId}-lead-errors`;

  useEffect(() => {
    setTrackingFields(readTrackingFields(sourcePage || pathname, sourcePage));
    setEffectiveSourceType(readSourceTypeOverride() || resolvedSourceType);
    const baseComment = readIdeaComment(defaultComment);
    setIdeaComment(source === "design-proekt-kuhni" ? readDesignProjectComment(baseComment) : baseComment);
  }, [defaultComment, pathname, resolvedSourceType, source, sourcePage]);

  const defaultValues = useMemo<FormData>(() => ({
    name: "",
    phone: "",
    city: city || "",
    kitchenType: defaultKitchenType,
    messenger: "",
    uploadNote: "",
    comment: ideaComment,
    hasMeasurements: false,
    agreement: true,
    sourcePage: trackingFields.sourcePage,
    sourceType: effectiveSourceType,
    projectSlug: projectSlug || "",
    cityKey: cityKey || "",
    utmSource: trackingFields.utmSource,
    utmMedium: trackingFields.utmMedium,
    utmCampaign: trackingFields.utmCampaign,
    utmTerm: trackingFields.utmTerm,
    utmContent: trackingFields.utmContent,
    referrer: trackingFields.referrer,
    honeypot: "",
  }), [city, cityKey, defaultKitchenType, effectiveSourceType, ideaComment, projectSlug, trackingFields]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean);
  const fallbackErrorMessage = "Ошибка отправки. Попробуйте ещё раз или позвоните нам.";

  useEffect(() => {
    if (source !== "design-proekt-kuhni" || !formRef.current || formOpenTracked.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || formOpenTracked.current) return;
        formOpenTracked.current = true;
        trackAnalyticsEvent(ANALYTICS_EVENTS.DESIGN_FORM_OPEN, {
          source,
          formLocation,
          pagePath: readPagePath(pathname),
        });
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, [formLocation, pathname, source]);

  const onSubmit = async (data: FormData) => {
    if (data.honeypot) return;

    const currentTracking = readTrackingFields(fallbackSourcePage, sourcePage);
    const currentSourceType = readSourceTypeOverride() || data.sourceType || resolvedSourceType;
    const currentComment =
      source === "design-proekt-kuhni"
        ? readDesignProjectComment(data.comment || defaultComment)
        : data.comment;
    const fileNote = roomFile ? `${roomFile.name} (${Math.round(roomFile.size / 1024)} КБ)` : "";
    const payload = {
      ...data,
      comment: currentComment,
      uploadNote: fileNote || data.uploadNote || "",
      source,
      formType,
      city: data.city || city || "",
      sourcePage: currentTracking.sourcePage,
      sourceType: currentSourceType,
      projectSlug: data.projectSlug || projectSlug || "",
      cityKey: data.cityKey || cityKey || "",
      utmSource: currentTracking.utmSource,
      utmMedium: currentTracking.utmMedium,
      utmCampaign: currentTracking.utmCampaign,
      utmTerm: currentTracking.utmTerm,
      utmContent: currentTracking.utmContent,
      referrer: currentTracking.referrer,
    };

    setLoading(true);
    trackAnalyticsEvent(ANALYTICS_EVENTS.FORM_SUBMIT, {
      form_type: formType,
      source,
      source_page: payload.sourcePage,
      source_type: payload.sourceType,
      project_slug: payload.projectSlug,
      city_key: payload.cityKey,
      city: payload.city,
      kitchen_type: payload.kitchenType,
    });

    try {
      const res = await fetch("/kapi/leads", createLeadRequestBody(payload, roomFile));

      if (res.ok) {
        setSent(true);
        setRoomFile(null);
        reset({
          ...defaultValues,
          name: "",
          phone: "",
          comment: "",
          messenger: "",
          uploadNote: "",
          hasMeasurements: false,
          agreement: true,
        });
        trackAnalyticsEvent(ANALYTICS_EVENTS.LEAD_SUBMIT, {
          source,
          sourceType: payload.sourceType,
          formLocation,
          hasMeasurements: Boolean(payload.hasMeasurements),
          pagePath: readPagePath(pathname),
        });
        trackAnalyticsEvent(ANALYTICS_EVENTS.LEAD_FORM_SUBMIT, {
          form_type: formType,
          source,
          source_type: payload.sourceType,
          form_location: formLocation,
          city_key: payload.cityKey,
          page_path: readPagePath(pathname),
        });
        trackAnalyticsEvent(ANALYTICS_EVENTS.LEAD_SUCCESS, {
          form_type: formType,
          source,
          city: payload.city,
        });
        if (formType === "calculator") {
          trackAnalyticsEvent(ANALYTICS_EVENTS.CALCULATOR_SUBMIT, {
            source,
            city: payload.city,
          });
        }
        toast.success("Заявка отправлена. Свяжемся с вами в рабочее время.");
      } else {
        const error = await res.json().catch(() => null);
        toast.error(errorMessage || error?.error || fallbackErrorMessage);
      }
    } catch {
      toast.error(errorMessage || fallbackErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="card-base px-8 py-12 text-center" role="status" aria-live="polite" data-testid="form-success">
        <div className="mb-4 text-4xl" aria-hidden>✓</div>
        <h3 className="mb-2 font-serif text-2xl font-semibold">Заявка получена</h3>
        <p className="mb-6 text-muted-foreground">{successMessage}</p>
        <Button variant="outline" onClick={() => setSent(false)}>Отправить ещё одну заявку</Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      data-testid="contact-form"
      noValidate
      aria-describedby={errorMessages.length > 0 ? formErrorSummaryId : undefined}
    >
      <input
        {...register("honeypot")}
        type="text"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Дополнительное поле"
        autoComplete="off"
      />
      <input {...register("sourcePage")} type="hidden" value={trackingFields.sourcePage} readOnly />
      <input {...register("sourceType")} type="hidden" value={effectiveSourceType} readOnly />
      <input {...register("projectSlug")} type="hidden" value={projectSlug || ""} readOnly />
      <input {...register("cityKey")} type="hidden" value={cityKey || ""} readOnly />
      <input {...register("utmSource")} type="hidden" value={trackingFields.utmSource} readOnly />
      <input {...register("utmMedium")} type="hidden" value={trackingFields.utmMedium} readOnly />
      <input {...register("utmCampaign")} type="hidden" value={trackingFields.utmCampaign} readOnly />
      <input {...register("utmTerm")} type="hidden" value={trackingFields.utmTerm} readOnly />
      <input {...register("utmContent")} type="hidden" value={trackingFields.utmContent} readOnly />
      <input {...register("referrer")} type="hidden" value={trackingFields.referrer} readOnly />

      <div id={formErrorSummaryId} className="sr-only" role="alert" aria-live="assertive">
        {errorMessages.length > 0 ? "В форме есть ошибки. Проверьте поля ниже." : ""}
      </div>

      <div>
        <Label htmlFor={nameId}>Имя *</Label>
        <Input
          id={nameId}
          {...register("name")}
          placeholder="Ваше имя"
          className="mt-1"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
          data-testid="form-name"
        />
        {errors.name && <p id={`${nameId}-error`} className="mt-1 text-xs text-destructive" role="alert">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor={phoneId}>Телефон *</Label>
        <Input
          id={phoneId}
          {...register("phone")}
          type="tel"
          inputMode="tel"
          placeholder="+375 (__) ___-__-__"
          className="mt-1"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
          data-testid="form-phone"
        />
        {errors.phone && <p id={`${phoneId}-error`} className="mt-1 text-xs text-destructive" role="alert">{errors.phone.message}</p>}
      </div>

      {showCity && (
        <div>
          <Label htmlFor={cityId}>Город</Label>
          <Input id={cityId} {...register("city")} placeholder="Минск" className="mt-1" autoComplete="address-level2" data-testid="form-city" />
        </div>
      )}

      {showKitchenType && (
        <div>
          <Label htmlFor={kitchenTypeId}>Тип кухни</Label>
          <select
            id={kitchenTypeId}
            {...register("kitchenType")}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-testid="form-kitchen-type"
          >
            {kitchenTypes.map((item) => (
              <option key={item.label} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
      )}

      {showMessenger && (
        <div>
          <Label htmlFor={messengerId}>Мессенджер</Label>
          <select
            id={messengerId}
            {...register("messenger")}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-testid="form-messenger"
          >
            <option value="">Как удобнее связаться</option>
            <option value="Telegram">Telegram</option>
            <option value="Viber">Viber</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Телефонный звонок">Телефонный звонок</option>
          </select>
        </div>
      )}

      {showHasMeasurements && (
        <div>
          <label className="flex items-start gap-3 rounded-md border border-border bg-muted/20 p-3 text-sm leading-5 text-muted-foreground">
            <input
              id={hasMeasurementsId}
              type="checkbox"
              {...register("hasMeasurements")}
              className="mt-1 h-4 w-4 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-testid="form-has-measurements"
            />
            <span>У меня уже есть размеры помещения</span>
          </label>
        </div>
      )}

      {showRoomFile && (
        <div>
          <Label htmlFor={roomFileId}>Фото или план помещения</Label>
          <Input
            id={roomFileId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
            className="mt-1"
            data-testid="form-room-file"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] || null;
              setRoomFile(file);
              if (file) {
                trackAnalyticsEvent(ANALYTICS_EVENTS.DESIGN_FILE_SELECT, {
                  source,
                  formLocation,
                  fileType: file.type || "unknown",
                  fileSizeKb: Math.round(file.size / 1024),
                });
              }
            }}
          />
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Подойдут фото, план БТИ или PDF до 8 МБ. Если файл больше, отправьте его в Telegram.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor={commentId}>Комментарий / размеры</Label>
        <Textarea
          id={commentId}
          {...register("comment")}
          placeholder="Например: 3,2 м по одной стене, нужен высокий пенал и место под посудомойку"
          className="mt-1"
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={errors.comment ? `${commentId}-error` : undefined}
          data-testid="form-comment"
        />
        {errors.comment && <p id={`${commentId}-error`} className="mt-1 text-xs text-destructive" role="alert">{errors.comment.message}</p>}
      </div>

      <div>
        <label className="flex items-start gap-3 rounded-md border border-border bg-muted/20 p-3 text-xs leading-5 text-muted-foreground">
          <input
            id={agreementId}
            type="checkbox"
            {...register("agreement")}
            className="mt-1 h-4 w-4 rounded border-border accent-primary"
            aria-invalid={Boolean(errors.agreement)}
            aria-describedby={errors.agreement ? `${agreementId}-error` : undefined}
            data-testid="form-agreement"
          />
          <span>
            Согласен на обработку персональных данных и с{" "}
            <a href="/privacy-policy" className="underline underline-offset-2">политикой обработки данных</a>.
          </span>
        </label>
        {errors.agreement && <p id={`${agreementId}-error`} className="mt-1 text-xs text-destructive" role="alert">{errors.agreement.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading} data-testid="form-submit">
        {loading ? "Отправляем..." : submitLabel}
      </Button>
    </form>
  );
}

function createLeadRequestBody(payload: FormData & Record<string, unknown>, roomFile: File | null): RequestInit {
  if (!roomFile) {
    return {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
  }

  const formData = new window.FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }
    formData.append(key, String(value));
  });
  formData.append("roomFile", roomFile);

  return {
    method: "POST",
    body: formData,
  };
}
