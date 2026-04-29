"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

interface FaqItem { q: string; a: string; }
interface UniquePoint { emoji: string; title: string; text: string; }
interface ContentBlock { title: string; text: string; type: "text" | "highlight"; }

interface LocationData {
  id?: number;
  city: string;
  slug: string;
  region: string;
  title: string;
  h1: string;
  intro: string;
  description: string;
  priceFrom: number;
  deliveryCost: string;
  deliveryDays: number;
  measureCost: string;
  timelineText: string;
  visitDetails: string;
  installDetails: string;
  images: string[];
  areas: string[];
  workZone: string;
  mapEmbed: string;
  features: string[];
  faq: FaqItem[];
  localIntro: string;
  uniquePoints: UniquePoint[];
  contentBlocks: ContentBlock[];
  caseSlugs: string[];
  reviewIds: number[];
  ctaHeadline: string;
  ctaSubtext: string;
  phone: string;
  address: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
}

const DEFAULT: LocationData = {
  city: "", slug: "", region: "",
  title: "", h1: "", intro: "", description: "",
  priceFrom: 900, deliveryCost: "", deliveryDays: 1,
  measureCost: "Бесплатно", timelineText: "",
  visitDetails: "", installDetails: "",
  images: [], areas: [], workZone: "", mapEmbed: "",
  features: [], faq: [],
  localIntro: "", uniquePoints: [], contentBlocks: [],
  caseSlugs: [], reviewIds: [],
  ctaHeadline: "", ctaSubtext: "",
  phone: "", address: "",
  seoTitle: "", seoDescription: "", published: true,
};

const CITY_TEMPLATES: Record<string, Partial<LocationData>> = {
  minsk: {
    city: "Минск", slug: "minsk", region: "г. Минск",
    title: "Кухни на заказ в Минске | КухниBY",
    h1: "Кухни на заказ в Минске",
    intro: "Производим и устанавливаем кухни на заказ в Минске с 2012 года. Собственный цех, штат дизайнеров и монтажников. Работаем во всех районах города.",
    description: "Кухни на заказ в Минске от производителя. Замер и 3D-проект бесплатно. Гарантия 5 лет. Изготовление от 14 рабочих дней.",
    priceFrom: 900, deliveryCost: "Бесплатно при заказе от 3 000 BYN",
    deliveryDays: 1, measureCost: "Бесплатно",
    timelineText: "Замер → Проект за 3 дня → Производство 14–21 день → Монтаж 1–2 дня",
    visitDetails: "Замерщик выезжает в день обращения или на следующий день. Работаем по всему Минску без доплаты за выезд. Замер занимает 30–60 минут.",
    installDetails: "Монтаж выполняют штатные установщики. Стандартная кухня устанавливается за 1 день. Убираем мусор самостоятельно.",
    areas: ["Центральный район", "Советский район", "Фрунзенский район", "Московский район", "Партизанский район", "Ленинский район", "Октябрьский район", "Заводской район"],
    workZone: "Работаем во всех 9 районах Минска, включая пригороды в радиусе 15 км от МКАД",
    features: ["Выезд замерщика в день обращения", "3D-проект за 3 рабочих дня", "Производство от 14 рабочих дней", "Монтаж штатными мастерами", "Гарантия 5 лет на всё изделие"],
    faq: [
      { q: "Сколько стоит кухня на заказ в Минске?", a: "Стоимость кухни зависит от материалов, размеров и фурнитуры. Средняя цена кухни в Минске — от 900 BYN за линейный метр. Финальная стоимость фиксируется в договоре после замера и проектирования." },
      { q: "Как долго изготавливается кухня?", a: "Производство занимает от 14 до 21 рабочего дня с момента подписания договора и внесения предоплаты. Монтаж — 1–2 рабочих дня." },
      { q: "Выезжаете ли вы в правый берег / на окраины Минска?", a: "Да, работаем во всех районах Минска без доплаты за выезд. Выезжаем в Малиновку, Каменную Горку, Уручье, Сухарево и другие микрорайоны." },
      { q: "Можно ли заказать кухню в новостройку?", a: "Да, мы специализируемся на кухнях для новостроек. Учитываем особенности планировки, высоту потолков, расположение розеток и коммуникаций." },
    ],
    seoTitle: "Кухни на заказ в Минске от производителя | КухниBY",
    seoDescription: "Кухни на заказ в Минске от 900 BYN. Собственное производство. Замер бесплатно. Гарантия 5 лет. Изготовление 14–21 день. Звоните!",
  },
  "minskaya-oblast": {
    city: "Минская область", slug: "minskaya-oblast", region: "Минская область",
    title: "Кухни на заказ в Минской области | КухниBY",
    h1: "Кухни на заказ в Минской области",
    intro: "Изготавливаем и устанавливаем кухни для жителей всей Минской области. Выезжаем на замер в любой населённый пункт. Доставляем и монтируем силами собственных специалистов.",
    description: "Кухни на заказ в Минской области: Борисов, Молодечно, Жодино, Солигорск. Выездной замер, доставка, монтаж. Изготовление от 14 дней.",
    priceFrom: 900, deliveryCost: "Бесплатно при заказе от 5 000 BYN; от 80 BYN при меньшей сумме",
    deliveryDays: 1, measureCost: "Бесплатно",
    timelineText: "Звонок → Выезд замерщика → Проект за 3 дня → Производство 14–21 день → Доставка и монтаж",
    visitDetails: "Выезжаем на замер в города и посёлки Минской области. Стоимость выезда включена в стоимость заказа. Назначаем удобное для вас время.",
    installDetails: "Доставляем собственным транспортом. Монтаж выполняют штатные специалисты. Время монтажа — 1–2 дня в зависимости от сложности.",
    areas: ["Борисов", "Молодечно", "Жодино", "Солигорск", "Слуцк", "Несвиж", "Дзержинск", "Вилейка", "Клецк", "Копыль", "Логойск", "Смолевичи", "Пуховичи", "Узда"],
    workZone: "Работаем во всех районах Минской области. Доставка и монтаж по всему региону.",
    features: ["Выезд на замер по всей Минской области", "Собственный транспорт для доставки", "Штатные монтажники в регионе", "Гарантия 5 лет", "Послепродажное обслуживание"],
    faq: [
      { q: "Сколько стоит выезд замерщика по Минской области?", a: "Выезд замерщика по Минской области бесплатный. Стоимость включена в цену кухни. Записывайтесь — приедем в удобное для вас время." },
      { q: "Как долго ждать кухню в Борисове или Молодечно?", a: "Сроки изготовления одинаковые — 14–21 рабочий день. После производства согласуем дату доставки и монтажа в вашем городе." },
      { q: "Привезёте ли вы кухню в небольшой посёлок области?", a: "Да, доставляем в любой населённый пункт Минской области. Стоимость доставки обсуждается индивидуально в зависимости от расстояния." },
    ],
    seoTitle: "Кухни на заказ в Минской области | КухниBY",
    seoDescription: "Кухни на заказ по всей Минской области. Борисов, Молодечно, Жодино, Слуцк. Замер бесплатно, доставка, монтаж. Звоните!",
  },
};

function slugify(city: string) {
  return city.toLowerCase()
    .replace(/[а]/g, "a").replace(/[б]/g, "b").replace(/[в]/g, "v").replace(/[г]/g, "g")
    .replace(/[д]/g, "d").replace(/[е|ё]/g, "e").replace(/[ж]/g, "zh").replace(/[з]/g, "z")
    .replace(/[и|й]/g, "i").replace(/[к]/g, "k").replace(/[л]/g, "l").replace(/[м]/g, "m")
    .replace(/[н]/g, "n").replace(/[о]/g, "o").replace(/[п]/g, "p").replace(/[р]/g, "r")
    .replace(/[с]/g, "s").replace(/[т]/g, "t").replace(/[у]/g, "u").replace(/[ф]/g, "f")
    .replace(/[х]/g, "kh").replace(/[ц]/g, "ts").replace(/[ч]/g, "ch").replace(/[ш]/g, "sh")
    .replace(/[щ]/g, "shch").replace(/[ъ|ь]/g, "").replace(/[ы]/g, "y").replace(/[э]/g, "e")
    .replace(/[ю]/g, "yu").replace(/[я]/g, "ya")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

interface Props { initial?: Partial<LocationData>; isEdit?: boolean; }

export default function LocationForm({ initial, isEdit }: Props) {
  const router = useRouter();
  const [data, setData] = useState<LocationData>({ ...DEFAULT, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [newCaseSlug, setNewCaseSlug] = useState("");
  const [newReviewId, setNewReviewId] = useState("");
  const [newUPEmoji, setNewUPEmoji] = useState("⭐");
  const [newUPTitle, setNewUPTitle] = useState("");
  const [newUPText, setNewUPText] = useState("");
  const [newCBTitle, setNewCBTitle] = useState("");
  const [newCBText, setNewCBText] = useState("");
  const [newCBType, setNewCBType] = useState<"text"|"highlight">("text");
  const [activeTab, setActiveTab] = useState<"basic"|"logistics"|"content"|"links"|"faq"|"seo">("basic");

  const set = (field: keyof LocationData, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const applyTemplate = (templateKey: string) => {
    const tmpl = CITY_TEMPLATES[templateKey];
    if (tmpl) setData(prev => ({ ...prev, ...tmpl }));
  };

  const handleCityBlur = () => {
    if (!data.slug && data.city) set("slug", slugify(data.city));
    if (!data.h1 && data.city) set("h1", `Кухни на заказ в ${data.city}`);
    if (!data.title && data.city) set("title", `Кухни на заказ в ${data.city} | КухниBY`);
    if (!data.seoTitle && data.city) set("seoTitle", `Кухни на заказ в ${data.city} от производителя | КухниBY`);
  };

  const addArea = () => {
    if (newArea.trim()) { set("areas", [...data.areas, newArea.trim()]); setNewArea(""); }
  };
  const removeArea = (i: number) => set("areas", data.areas.filter((_, idx) => idx !== i));

  const addImage = () => {
    if (newImage.trim()) { set("images", [...data.images, newImage.trim()]); setNewImage(""); }
  };
  const removeImage = (i: number) => set("images", data.images.filter((_, idx) => idx !== i));

  const addFeature = () => {
    if (newFeature.trim()) { set("features", [...data.features, newFeature.trim()]); setNewFeature(""); }
  };
  const removeFeature = (i: number) => set("features", data.features.filter((_, idx) => idx !== i));

  const addFaq = () => {
    if (newFaqQ.trim() && newFaqA.trim()) {
      set("faq", [...data.faq, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
      setNewFaqQ(""); setNewFaqA("");
    }
  };
  const removeFaq = (i: number) => set("faq", data.faq.filter((_, idx) => idx !== i));
  const updateFaqItem = (i: number, field: "q"|"a", val: string) => {
    const updated = data.faq.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    set("faq", updated);
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const url = isEdit ? `/kapi/admin/locations/${data.id}` : "/kapi/admin/locations";
      const method = isEdit ? "PUT" : "POST";
      const payload = { ...data, priceFrom: Number(data.priceFrom), deliveryDays: Number(data.deliveryDays) };
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Ошибка сохранения"); }
      router.push("/admin/locations");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const addUniquePoint = () => {
    if (newUPTitle.trim() && newUPText.trim()) {
      set("uniquePoints", [...(data.uniquePoints || []), { emoji: newUPEmoji, title: newUPTitle.trim(), text: newUPText.trim() }]);
      setNewUPTitle(""); setNewUPText(""); setNewUPEmoji("⭐");
    }
  };
  const removeUniquePoint = (i: number) => set("uniquePoints", (data.uniquePoints || []).filter((_, idx) => idx !== i));

  const addContentBlock = () => {
    if (newCBTitle.trim() && newCBText.trim()) {
      set("contentBlocks", [...(data.contentBlocks || []), { title: newCBTitle.trim(), text: newCBText.trim(), type: newCBType }]);
      setNewCBTitle(""); setNewCBText(""); setNewCBType("text");
    }
  };
  const removeContentBlock = (i: number) => set("contentBlocks", (data.contentBlocks || []).filter((_, idx) => idx !== i));

  const addCaseSlug = () => {
    const slug = newCaseSlug.trim();
    if (slug && !(data.caseSlugs || []).includes(slug)) {
      set("caseSlugs", [...(data.caseSlugs || []), slug]);
      setNewCaseSlug("");
    }
  };
  const removeCaseSlug = (i: number) => set("caseSlugs", (data.caseSlugs || []).filter((_, idx) => idx !== i));

  const addReviewId = () => {
    const id = parseInt(newReviewId);
    if (!isNaN(id) && !(data.reviewIds || []).includes(id)) {
      set("reviewIds", [...(data.reviewIds || []), id]);
      setNewReviewId("");
    }
  };
  const removeReviewId = (i: number) => set("reviewIds", (data.reviewIds || []).filter((_, idx) => idx !== i));

  const tabs = [
    { key: "basic", label: "Основное" },
    { key: "logistics", label: "Логистика" },
    { key: "content", label: "Контент" },
    { key: "links", label: "Связи" },
    { key: "faq", label: "FAQ" },
    { key: "seo", label: "SEO" },
  ] as const;

  const inputCls = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1";
  const cardCls = "bg-white rounded-2xl border border-border p-6 space-y-4";

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      {/* Templates */}
      {!isEdit && (
        <div className={cardCls}>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Шаблон города</h3>
            <p className="text-xs text-muted-foreground mb-3">Выберите готовый шаблон или создайте страницу с нуля</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CITY_TEMPLATES).map(([key, tmpl]) => (
              <button
                key={key}
                onClick={() => applyTemplate(key)}
                className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-sm hover:bg-primary/10 transition-colors font-medium"
              >
                {tmpl.city}
              </button>
            ))}
            <button
              onClick={() => setData({ ...DEFAULT })}
              className="px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-muted-foreground text-sm hover:bg-muted/50 transition-colors"
            >
              С нуля
            </button>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => set("published", !data.published)}
              className={`relative w-10 h-5 rounded-full transition-colors ${data.published ? "bg-green-500" : "bg-muted"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${data.published ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm font-medium">{data.published ? "Опубликована" : "Скрыта"}</span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-500">{error}</span>}
          <button onClick={() => router.push("/admin/locations")} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted/50 transition-colors">
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Сохранение..." : isEdit ? "Сохранить" : "Создать страницу"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/30 rounded-xl p-1 border border-border">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* === BASIC TAB === */}
      {activeTab === "basic" && (
        <div className="space-y-4">
          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Идентификация</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Город / регион *</label>
                <input className={inputCls} value={data.city} onChange={e => set("city", e.target.value)} onBlur={handleCityBlur} placeholder="Минск" />
              </div>
              <div>
                <label className={labelCls}>Регион / область</label>
                <input className={inputCls} value={data.region} onChange={e => set("region", e.target.value)} placeholder="г. Минск" />
              </div>
              <div>
                <label className={labelCls}>URL slug *</label>
                <input className={inputCls} value={data.slug} onChange={e => set("slug", e.target.value)} placeholder="minsk" />
                <p className="text-xs text-muted-foreground mt-1">Адрес: /locations/{data.slug || "..."}</p>
              </div>
              <div>
                <label className={labelCls}>H1 заголовок *</label>
                <input className={inputCls} value={data.h1} onChange={e => set("h1", e.target.value)} placeholder="Кухни на заказ в Минске" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Title страницы *</label>
              <input className={inputCls} value={data.title} onChange={e => set("title", e.target.value)} placeholder="Кухни на заказ в Минске | КухниBY" />
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Вводный текст</h3>
            <div>
              <label className={labelCls}>Краткое описание (под H1)</label>
              <textarea className={inputCls} rows={3} value={data.intro} onChange={e => set("intro", e.target.value)} placeholder="2–3 предложения о работе в этом городе" />
            </div>
            <div>
              <label className={labelCls}>Meta description</label>
              <textarea className={inputCls} rows={2} value={data.description} onChange={e => set("description", e.target.value)} placeholder="Расширенное описание для карточки в поиске" />
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Контакты для этого города</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Телефон (локальный)</label>
                <input className={inputCls} value={data.phone} onChange={e => set("phone", e.target.value)} placeholder={CONTACT_DEFAULTS.phoneDisplay} />
              </div>
              <div>
                <label className={labelCls}>Адрес офиса/шоурума</label>
                <input className={inputCls} value={data.address} onChange={e => set("address", e.target.value)} placeholder="г. Минск, ул. ..." />
              </div>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">CTA-блок (форма заявки)</h3>
            <p className="text-xs text-muted-foreground">Заголовок и подзаголовок финального CTA. Если пусто — используется стандартный текст.</p>
            <div>
              <label className={labelCls}>Заголовок CTA</label>
              <input className={inputCls} value={data.ctaHeadline} onChange={e => set("ctaHeadline", e.target.value)} placeholder={`Заказать кухню в ${data.city || "городе"}`} />
            </div>
            <div>
              <label className={labelCls}>Подзаголовок CTA</label>
              <textarea className={inputCls} rows={2} value={data.ctaSubtext} onChange={e => set("ctaSubtext", e.target.value)} placeholder="Оставьте заявку — позвоним в течение 15 минут..." />
            </div>
          </div>
        </div>
      )}

      {/* === LOGISTICS TAB === */}
      {activeTab === "logistics" && (
        <div className="space-y-4">
          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Цены и сроки</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Цена от (BYN за п.м.)</label>
                <input className={inputCls} type="number" value={data.priceFrom} onChange={e => set("priceFrom", e.target.value)} placeholder="900" />
              </div>
              <div>
                <label className={labelCls}>Стоимость доставки</label>
                <input className={inputCls} value={data.deliveryCost} onChange={e => set("deliveryCost", e.target.value)} placeholder="Бесплатно при заказе от 3 000 BYN" />
              </div>
              <div>
                <label className={labelCls}>Срок выезда (дней)</label>
                <input className={inputCls} type="number" value={data.deliveryDays} onChange={e => set("deliveryDays", e.target.value)} min={1} />
              </div>
              <div>
                <label className={labelCls}>Стоимость замера</label>
                <input className={inputCls} value={data.measureCost} onChange={e => set("measureCost", e.target.value)} placeholder="Бесплатно" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Цепочка сроков (для секции "Этапы")</label>
              <input className={inputCls} value={data.timelineText} onChange={e => set("timelineText", e.target.value)} placeholder="Замер → Проект за 3 дня → Производство 14–21 день → Монтаж 1–2 дня" />
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Замер и монтаж</h3>
            <div>
              <label className={labelCls}>Особенности выезда на замер</label>
              <textarea className={inputCls} rows={4} value={data.visitDetails} onChange={e => set("visitDetails", e.target.value)} placeholder="Кто выезжает, в какое время, какие документы брать, что замерять..." />
            </div>
            <div>
              <label className={labelCls}>Особенности монтажа</label>
              <textarea className={inputCls} rows={4} value={data.installDetails} onChange={e => set("installDetails", e.target.value)} placeholder="Сколько монтажников, сколько занимает монтаж, что включено, гарантия..." />
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Зона работы</h3>
            <div>
              <label className={labelCls}>Описание зоны работы</label>
              <textarea className={inputCls} rows={2} value={data.workZone} onChange={e => set("workZone", e.target.value)} placeholder="Работаем во всех районах города и пригородах в радиусе 20 км" />
            </div>
            <div>
              <label className={labelCls}>Районы / населённые пункты</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {data.areas.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {a}
                    <button onClick={() => removeArea(i)} className="hover:text-red-500 ml-0.5 text-base leading-none">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input className={inputCls} value={newArea} onChange={e => setNewArea(e.target.value)} onKeyDown={e => e.key === "Enter" && addArea()} placeholder="Добавить район или город" />
                <button onClick={addArea} className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 whitespace-nowrap">+ Добавить</button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Embed карты (iframe src из Google Maps)</label>
              <input className={inputCls} value={data.mapEmbed} onChange={e => set("mapEmbed", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
              <p className="text-xs text-muted-foreground mt-1">Google Maps → Поделиться → Вставить карту → скопируйте src из iframe</p>
            </div>
          </div>
        </div>
      )}

      {/* === CONTENT TAB === */}
      {activeTab === "content" && (
        <div className="space-y-4">

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Уникальный вводный текст</h3>
            <p className="text-xs text-muted-foreground">Длинный абзац, уникальный для этого города. Показывается после блока преимуществ. Раскрывает ваш опыт именно в этом регионе.</p>
            <textarea
              className={inputCls}
              rows={5}
              value={data.localIntro}
              onChange={e => set("localIntro", e.target.value)}
              placeholder="Минск — наш основной рынок с 2012 года. За это время мы изготовили более 800 кухонь..."
            />
            <p className="text-xs text-muted-foreground">{data.localIntro.length} символов</p>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Уникальные местные преимущества</h3>
            <p className="text-xs text-muted-foreground">Отличия работы именно в этом городе — не общие пункты, а реальные локальные факты. Показываются на странице в виде карточек с иконкой.</p>
            <div className="space-y-2">
              {(data.uniquePoints || []).map((pt, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/20">
                  <span className="text-xl flex-shrink-0">{pt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{pt.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pt.text}</p>
                  </div>
                  <button onClick={() => removeUniquePoint(i)} className="text-red-400 hover:text-red-600 text-sm px-2 flex-shrink-0">×</button>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Добавить преимущество</p>
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <label className={labelCls}>Эмодзи</label>
                  <input className={inputCls} value={newUPEmoji} onChange={e => setNewUPEmoji(e.target.value)} placeholder="🏭" />
                </div>
                <div className="col-span-4">
                  <label className={labelCls}>Заголовок</label>
                  <input className={inputCls} value={newUPTitle} onChange={e => setNewUPTitle(e.target.value)} placeholder="Собственный цех в Минске" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Описание</label>
                <textarea className={inputCls} rows={2} value={newUPText} onChange={e => setNewUPText(e.target.value)} placeholder="Производство находится в самом городе — нет наценки..." />
              </div>
              <button onClick={addUniquePoint} disabled={!newUPTitle.trim() || !newUPText.trim()} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors">
                + Добавить
              </button>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Дополнительные текстовые блоки</h3>
            <p className="text-xs text-muted-foreground">Уникальный контент для страницы: история работы в регионе, особенности, советы. Тип «акцент» показывается с фиолетовой рамкой.</p>
            <div className="space-y-2">
              {(data.contentBlocks || []).map((block, i) => (
                <div key={i} className={`p-3 rounded-xl border ${block.type === "highlight" ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${block.type === "highlight" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {block.type === "highlight" ? "Акцент" : "Текст"}
                        </span>
                        <p className="font-medium text-sm">{block.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{block.text}</p>
                    </div>
                    <button onClick={() => removeContentBlock(i)} className="text-red-400 hover:text-red-600 text-sm px-2 flex-shrink-0">×</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Добавить блок</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={newCBType === "text"} onChange={() => setNewCBType("text")} className="accent-primary" />
                  <span className="text-sm">Обычный текст</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={newCBType === "highlight"} onChange={() => setNewCBType("highlight")} className="accent-primary" />
                  <span className="text-sm">Акцент (фиолетовая рамка)</span>
                </label>
              </div>
              <div>
                <label className={labelCls}>Заголовок блока</label>
                <input className={inputCls} value={newCBTitle} onChange={e => setNewCBTitle(e.target.value)} placeholder="Почему минчане выбирают нас" />
              </div>
              <div>
                <label className={labelCls}>Текст блока</label>
                <textarea className={inputCls} rows={3} value={newCBText} onChange={e => setNewCBText(e.target.value)} placeholder="Мы не работаем по схеме «сделали — забыли»..." />
              </div>
              <button onClick={addContentBlock} disabled={!newCBTitle.trim() || !newCBText.trim()} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors">
                + Добавить блок
              </button>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Фотографии работ в регионе</h3>
            <p className="text-xs text-muted-foreground">Первое фото будет использоваться как обложка раздела</p>
            <div className="space-y-2">
              {data.images.map((img, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
                  <div className="w-12 h-9 rounded bg-muted overflow-hidden flex-shrink-0">
                    <img src={img} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                  </div>
                  <span className="flex-1 text-xs text-muted-foreground font-mono truncate">{img}</span>
                  {i === 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Обложка</span>}
                  <button onClick={() => removeImage(i)} className="text-red-400 hover:text-red-600 text-sm px-2">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={inputCls} value={newImage} onChange={e => setNewImage(e.target.value)} onKeyDown={e => e.key === "Enter" && addImage()} placeholder="https://... (URL фотографии)" />
              <button onClick={addImage} className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 whitespace-nowrap">+ Добавить</button>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Ключевые преимущества в регионе</h3>
            <div className="space-y-1.5">
              {data.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
                  <span className="text-green-500 flex-shrink-0">✓</span>
                  <span className="flex-1 text-sm">{f}</span>
                  <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 text-sm px-2">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={inputCls} value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => e.key === "Enter" && addFeature()} placeholder="Выезд замерщика в день обращения" />
              <button onClick={addFeature} className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 whitespace-nowrap">+ Добавить</button>
            </div>
          </div>
        </div>
      )}

      {/* === LINKS TAB === */}
      {activeTab === "links" && (
        <div className="space-y-4">
          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Прикреплённые кейсы</h3>
            <p className="text-xs text-muted-foreground">
              Укажите slug-и кейсов из портфолио, которые нужно показывать на этой странице.
              Они будут показываться первыми, дополнительно к кейсам, найденным автоматически по городу.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(data.caseSlugs || []).map((slug, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium font-mono">
                  {slug}
                  <button onClick={() => removeCaseSlug(i)} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={newCaseSlug}
                onChange={e => setNewCaseSlug(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addCaseSlug()}
                placeholder="uglovaya-kuhnya-minimalizm-minsk-kirova"
              />
              <button onClick={addCaseSlug} className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 whitespace-nowrap">+ Добавить</button>
            </div>
            <p className="text-xs text-muted-foreground">Slug кейса из адреса /portfolio/[slug]</p>
          </div>

          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Прикреплённые отзывы</h3>
            <p className="text-xs text-muted-foreground">
              ID опубликованных отзывов, которые нужно показывать на этой странице.
              Они будут показываться первыми, дополнительно к отзывам, найденным автоматически по городу.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(data.reviewIds || []).map((id, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  Отзыв #{id}
                  <button onClick={() => removeReviewId(i)} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={inputCls}
                type="number"
                value={newReviewId}
                onChange={e => setNewReviewId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addReviewId()}
                placeholder="ID отзыва (число)"
              />
              <button onClick={addReviewId} className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 whitespace-nowrap">+ Добавить</button>
            </div>
            <p className="text-xs text-muted-foreground">ID можно посмотреть в разделе «Модерация отзывов»</p>
          </div>
        </div>
      )}

      {/* === FAQ TAB === */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Локальные FAQ</h3>
            <p className="text-xs text-muted-foreground">Вопросы и ответы, специфичные для этого региона. Включаются в FAQ Schema для Google.</p>
            <div className="space-y-4">
              {data.faq.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-primary mt-2.5 w-6 flex-shrink-0">Q{i + 1}</span>
                    <input className={inputCls} value={item.q} onChange={e => updateFaqItem(i, "q", e.target.value)} placeholder="Вопрос" />
                    <button onClick={() => removeFaq(i)} className="mt-2 text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-muted-foreground mt-2.5 w-6 flex-shrink-0">A</span>
                    <textarea className={inputCls} rows={2} value={item.a} onChange={e => updateFaqItem(i, "a", e.target.value)} placeholder="Ответ" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Новый вопрос</p>
              <div>
                <label className={labelCls}>Вопрос</label>
                <input className={inputCls} value={newFaqQ} onChange={e => setNewFaqQ(e.target.value)} placeholder="Сколько стоит кухня на заказ в ..." />
              </div>
              <div>
                <label className={labelCls}>Ответ</label>
                <textarea className={inputCls} rows={3} value={newFaqA} onChange={e => setNewFaqA(e.target.value)} placeholder="Развёрнутый ответ..." />
              </div>
              <button onClick={addFaq} disabled={!newFaqQ.trim() || !newFaqA.trim()} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors">
                + Добавить вопрос
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === SEO TAB === */}
      {activeTab === "seo" && (
        <div className="space-y-4">
          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">SEO meta теги</h3>
            <div>
              <label className={labelCls}>SEO Title (для &lt;title&gt;)</label>
              <input className={inputCls} value={data.seoTitle || ""} onChange={e => set("seoTitle", e.target.value)} placeholder="Кухни на заказ в Минске от производителя | КухниBY" />
              <p className="text-xs text-muted-foreground mt-1">Оптимально: 50–60 символов. Сейчас: {(data.seoTitle || "").length}</p>
            </div>
            <div>
              <label className={labelCls}>SEO Description (для meta description)</label>
              <textarea className={inputCls} rows={3} value={data.seoDescription || ""} onChange={e => set("seoDescription", e.target.value)} placeholder="Кухни на заказ в Минске от 900 BYN. Замер бесплатно. Гарантия 5 лет." />
              <p className="text-xs text-muted-foreground mt-1">Оптимально: 140–160 символов. Сейчас: {(data.seoDescription || "").length}</p>
            </div>
          </div>
          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">Предпросмотр в поиске</h3>
            <div className="rounded-xl border border-border p-4 bg-white space-y-1">
              <p className="text-sm text-[#1a0dab] font-medium hover:underline cursor-pointer">
                {data.seoTitle || data.title || "Заголовок страницы"}
              </p>
              <p className="text-xs text-[#006621]">kuhni.minsk.by/locations/{data.slug || "..."}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.seoDescription || data.description || "Описание страницы в поиске..."}
              </p>
            </div>
          </div>
          <div className={cardCls}>
            <h3 className="font-semibold text-foreground">JSON-LD LocalBusiness</h3>
            <div className="rounded-lg bg-muted/30 p-3 font-mono text-xs overflow-auto">
              <pre>{JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "КухниBY",
                "areaServed": data.city || "Минск",
                "priceRange": `от ${data.priceFrom} BYN`,
                "telephone": data.phone || CONTACT_DEFAULTS.phone,
                "@id": `https://kuhni.minsk.by/locations/${data.slug || ""}`,
              }, null, 2)}</pre>
            </div>
            <p className="text-xs text-muted-foreground">Разметка генерируется автоматически при публикации страницы</p>
          </div>
        </div>
      )}

      {/* Bottom save */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        {error && <span className="text-sm text-red-500">{error}</span>}
        <div className="ml-auto flex gap-3">
          <button onClick={() => router.push("/admin/locations")} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted/50 transition-colors">
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Сохранение..." : isEdit ? "Сохранить изменения" : "Создать страницу"}
          </button>
        </div>
      </div>
    </div>
  );
}
