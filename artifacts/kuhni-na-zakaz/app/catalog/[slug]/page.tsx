import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { CheckCircle } from "lucide-react";
import { cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { getCatalogCategoryGallery, resolveCatalogCategoryImage } from "@/lib/catalog-category-images";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, offerJsonLd, siteUrl } from "@/lib/schema-org";
import { CatalogCategoryImage } from "@/components/catalog/CatalogCategoryImage";

type SeoLink = {
  href: string;
  label: string;
};

type SeoBlock = {
  suitableFor: string[];
  planning: string[];
  priceGuide: string;
  timeline: string;
  materials: string[];
  faq: { question: string; answer: string }[];
  links: {
    portfolio: SeoLink[];
    styles: SeoLink[];
    materials: SeoLink[];
  };
};

type StaticCategory = {
  title: string;
  description: string;
  priceFrom: number;
  features: string[];
  content: string;
  seo: SeoBlock;
};

const STATIC_CATEGORIES: Record<string, StaticCategory> = {
  "uglovye-kuhni": {
    title: "Угловые кухни на заказ в Минске",
    description: "Угловые кухни на заказ в Минске — оптимальное использование угловых зон. От 1 800 BYN. Замер бесплатно.",
    priceFrom: 1800,
    features: ["Эффективное использование угла", "Вместительность", "Зонирование рабочей поверхности", "Любые размеры"],
    content: "Угловая кухня — одно из самых популярных решений для жилых квартир. Она позволяет рационально использовать угловую зону, собрать удобный рабочий треугольник и добавить хранение без перегруза прохода.",
    seo: {
      suitableFor: [
        "семьям, которым нужна полноценная зона готовки в типовой кухне 6–12 м²",
        "квартирам с окном или вентиляционным коробом рядом с одной из стен",
        "тем, кто хочет больше ящиков и столешницы, но не готов занимать третью стену",
      ],
      planning: [
        "мойку чаще ставим ближе к углу, а варочную поверхность — на длинное плечо, чтобы между ними осталась рабочая зона",
        "в глухой угол закладываем карусель, выкатную систему или глубокую полку под редко используемую посуду",
        "верхние шкафы можно вести по одной стене, чтобы кухня выглядела легче и не давила на обеденную группу",
      ],
      priceGuide: "Ориентир начинается от 1 800 BYN за компактный вариант. На цену сильнее всего влияют угловые механизмы, длина второго плеча, фасады и количество выдвижных ящиков.",
      timeline: "Обычно проектирование и смета занимают до 3 рабочих дней после замера, производство — 18–28 рабочих дней, монтаж — 1–2 дня.",
      materials: [
        "корпус ЛДСП EGGER или аналог с влагостойкой кромкой в зоне мойки",
        "фасады МДФ в пленке, эмали или пластике для активной ежедневной готовки",
        "столешница постформинг, HPL или компакт-плита, если в углу планируется мойка",
      ],
      faq: [
        { question: "Можно ли поставить мойку в угол?", answer: "Да, но важно заранее выбрать мойку и смеситель: от этого зависит доступ к сифону, ширина фасада и удобство открывания соседних ящиков." },
        { question: "Что делать с труднодоступным углом?", answer: "Для бюджета оставляем глубокую полку, для частого использования ставим карусель, magic corner или выдвижную систему." },
        { question: "Подойдёт ли угловая кухня для маленького помещения?", answer: "Подойдёт, если сохранить проход от 90 см и не перегрузить вторую стену высокими шкафами." },
      ],
      links: {
        portfolio: [{ href: "/portfolio/uglovaya-kuhnya-minsk-kirova", label: "Угловая кухня в стиле минимализм" }],
        styles: [
          { href: "/styles/sovremennye", label: "Современные кухни" },
          { href: "/styles/minimalizm", label: "Минимализм" },
        ],
        materials: [
          { href: "/materials/mdf", label: "Фасады МДФ" },
          { href: "/materials/emal", label: "Эмаль" },
        ],
      },
    },
  },
  "pryamye-kuhni": {
    title: "Прямые кухни на заказ в Минске",
    description: "Прямые кухни на заказ в Минске — классика дизайна. От 1 200 BYN. Замер бесплатно.",
    priceFrom: 1200,
    features: ["Простой монтаж", "Лаконичность", "Подходят для узких кухонь", "Экономичность"],
    content: "Прямая кухня выстраивает хранение, мойку, технику и рабочую поверхность вдоль одной стены. Это спокойное решение для узких помещений, студий и случаев, когда важно оставить максимум свободного места.",
    seo: {
      suitableFor: [
        "студиям и кухням-пеналам, где гарнитур не должен съедать проход",
        "арендным квартирам и первым ремонтам с понятным бюджетом",
        "помещениям, где коммуникации уже выведены по одной стене",
      ],
      planning: [
        "холодильник лучше ставить с края линии, чтобы не разрывать рабочую поверхность",
        "между мойкой и плитой оставляем участок столешницы хотя бы 60 см",
        "для короткой стены используем высокие пеналы и верхние шкафы до потолка, чтобы компенсировать нехватку базы",
      ],
      priceGuide: "Простая прямая кухня стартует от 1 200 BYN. Итог растёт из-за встроенной техники, высоких пеналов, дорогой столешницы и фурнитуры полного выдвижения.",
      timeline: "Компактные прямые проекты обычно делаем быстрее других: 14–20 рабочих дней на производство после утверждения чертежей.",
      materials: [
        "ЛДСП EGGER для корпуса и бюджетных фасадов",
        "МДФ пленка или пластик, если нужна практичная поверхность без сложного ухода",
        "столешница постформинг как самый рациональный вариант для прямой линии",
      ],
      faq: [
        { question: "Хватит ли прямой кухни для семьи?", answer: "Да, если длина стены от 2,6–3 м и есть место под верхние шкафы или пенал. Для короткой линии заранее считаем технику и хранение." },
        { question: "Можно ли встроить посудомоечную машину?", answer: "Можно, но важно проверить ширину линии: посудомойка 45 или 60 см должна не конфликтовать с мойкой и выдвижными ящиками." },
        { question: "Почему прямая кухня дешевле?", answer: "В ней меньше сложных угловых модулей, проще столешница и монтаж, поэтому бюджет легче контролировать." },
      ],
      links: {
        portfolio: [{ href: "/portfolio/pryamaya-kuhnya-borisov", label: "Прямая кухня в скандинавском стиле" }],
        styles: [
          { href: "/styles/skandinavskie", label: "Скандинавские кухни" },
          { href: "/styles/sovremennye", label: "Современные кухни" },
        ],
        materials: [
          { href: "/materials/egger", label: "EGGER" },
          { href: "/materials/plastik", label: "Пластик" },
        ],
      },
    },
  },
  "p-obraznye-kuhni": {
    title: "П-образные кухни на заказ в Минске",
    description: "П-образные кухни на заказ — максимум рабочего пространства. От 3 500 BYN. Замер бесплатно.",
    priceFrom: 3500,
    features: ["Максимум хранения", "Большая рабочая поверхность", "Разделение зон", "Для просторных кухонь"],
    content: "П-образная кухня задействует три стороны помещения и даёт много столешницы, техники и хранения. Такой формат особенно хорош, когда готовят часто и хотят разделить мойку, варку и подготовку продуктов.",
    seo: {
      suitableFor: [
        "просторным кухням и отдельным помещениям, где проход между рядами не меньше 110 см",
        "семьям, которые готовят много и одновременно используют несколько зон",
        "домам, где кухня должна вместить запасы, мелкую технику и большую посуду",
      ],
      planning: [
        "три стороны позволяют развести мойку, варочную и холодильник без длинных переходов",
        "одну сторону можно сделать полуостровом с посадочными местами",
        "важно заранее проверить открывание духовки, посудомойки и угловых фасадов, чтобы они не пересекались",
      ],
      priceGuide: "П-образные кухни начинаются от 3 500 BYN. Бюджет зависит от общей длины, двух угловых узлов, количества техники и выбранной столешницы.",
      timeline: "Из-за большего числа модулей и точной подгонки такие кухни обычно занимают 24–35 рабочих дней в производстве, монтаж чаще планируем на 2 дня.",
      materials: [
        "усиленный корпус и качественная фурнитура для большого количества ящиков",
        "эмаль, пластик или шпон для фасадов в зависимости от стиля и нагрузки",
        "стыковка столешницы с герметизацией в двух углах",
      ],
      faq: [
        { question: "Какой проход нужен внутри П-образной кухни?", answer: "Комфортный минимум — 110 см между противоположными рядами. Если меньше, проверяем сценарии открывания техники." },
        { question: "Можно ли сделать одну сторону барной стойкой?", answer: "Да, часто третья сторона становится полуостровом: снаружи посадочные места, внутри хранение или рабочая зона." },
        { question: "Не будет ли кухня выглядеть слишком массивной?", answer: "Можно облегчить верх: оставить шкафы только на одной-двух стенах, добавить витрины или сделать часть фасадов светлее." },
      ],
      links: {
        portfolio: [{ href: "/portfolio/kuhnya-do-potolka-minsk-vostok", label: "Кухня до потолка с большим хранением" }],
        styles: [
          { href: "/styles/klassicheskie", label: "Классические кухни" },
          { href: "/styles/sovremennye", label: "Современные кухни" },
        ],
        materials: [
          { href: "/materials/emal", label: "Эмаль" },
          { href: "/materials/shpon", label: "Шпон" },
        ],
      },
    },
  },
  "kuhni-s-ostrovom": {
    title: "Кухни с островом на заказ в Минске",
    description: "Кухни с островом на заказ — для открытых пространств. От 4 500 BYN. Замер бесплатно.",
    priceFrom: 4500,
    features: ["Барная стойка", "Дополнительные рабочие поверхности", "Место для хранения", "Совмещение зон"],
    content: "Кухня с островом работает как центр кухни-гостиной: на нём готовят, сервируют, завтракают и общаются. Здесь особенно важны проходы, электрика и точный размер острова под ваш сценарий.",
    seo: {
      suitableFor: [
        "кухням-гостиным от 18 м², где остров не мешает маршруту к столу и дивану",
        "новостройкам со свободной планировкой и возможностью заранее вывести электрику",
        "тем, кто часто принимает гостей и хочет открытую зону общения",
      ],
      planning: [
        "вокруг острова оставляем проходы 100–120 см, чтобы ящики и техника открывались свободно",
        "остров может быть рабочим, обеденным или смешанным — от этого зависят розетки и высота столешницы",
        "если переносится мойка или варочная, заранее обсуждаем воду, вытяжку и требования к полу",
      ],
      priceGuide: "Ориентир — от 4 500 BYN. Цена растёт при водопроводе на острове, встроенной варочной, каменной столешнице, подсветке и декоративной отделке задней стороны.",
      timeline: "На проект островной кухни закладываем больше времени: до 3 рабочих дней на планировку и смету, 25–40 рабочих дней на изготовление.",
      materials: [
        "износостойкая столешница HPL, компакт-плита, акрил или керамика",
        "фасады шпон, эмаль или пластик для видимой со всех сторон мебели",
        "качественные направляющие для широких ящиков под посуду и кастрюли",
      ],
      faq: [
        { question: "Какой минимальный размер помещения нужен для острова?", answer: "Обычно комфорт начинается от 18 м², но важнее не площадь, а проходы вокруг острова и расположение обеденной зоны." },
        { question: "Можно ли поставить на остров варочную панель?", answer: "Можно, если продумать электрику и вытяжку. Для квартир чаще выбирают остров без варочной, чтобы упростить согласования и уход." },
        { question: "Остров заменяет обеденный стол?", answer: "Иногда да, но для семьи с детьми чаще оставляют стол, а остров используют для завтраков, готовки и сервировки." },
      ],
      links: {
        portfolio: [{ href: "/portfolio/kuhnya-s-ostrovom-minsk-partizansky", label: "Кухня с островом для новостройки" }],
        styles: [
          { href: "/styles/sovremennye", label: "Современные кухни" },
          { href: "/styles/loft", label: "Лофт" },
        ],
        materials: [
          { href: "/materials/shpon", label: "Шпон" },
          { href: "/materials/plastik", label: "Пластик" },
        ],
      },
    },
  },
  "malenkie-kuhni": {
    title: "Маленькие кухни на заказ в Минске",
    description: "Маленькие кухни на заказ до 2 п.м — Минск и область. От 900 BYN. Замер бесплатно.",
    priceFrom: 900,
    features: ["Компактные решения", "Встроенная техника", "Вертикальное хранение", "Складные элементы"],
    content: "Маленькая кухня требует не уменьшенной копии большого гарнитура, а точного выбора функций. Мы заранее решаем, что хранить, какую технику встроить и где оставить рабочую поверхность.",
    seo: {
      suitableFor: [
        "хрущёвкам, студиям, гостинкам и квартирам с кухней до 6 м²",
        "заказчикам, которым важны базовые функции без лишней мебели",
        "помещениям с нишами, выступами и короткими стенами",
      ],
      planning: [
        "сначала выбираем технику, потому что она забирает самый ценный сантиметраж",
        "хранение поднимаем вверх: антресоли, узкие пеналы, рейлинги и внутренние органайзеры",
        "рабочую поверхность сохраняем за счёт компактной мойки, варочной на 2 конфорки и выдвижных решений",
      ],
      priceGuide: "Небольшие кухни начинаются от 900 BYN. Экономия идёт за счёт длины, но встроенная техника, нестандартные модули и фасады до потолка могут заметно поднять смету.",
      timeline: "Простые маленькие кухни изготавливаем за 14–20 рабочих дней, сложные варианты с нестандартными нишами — до 25 рабочих дней.",
      materials: [
        "светлые фасады МДФ или пластик, чтобы визуально не утяжелять помещение",
        "влагостойкая кромка около мойки и плиты",
        "тонкая, но прочная столешница с аккуратным примыканием к стенам",
      ],
      faq: [
        { question: "Можно ли уместить всё на 2 погонных метрах?", answer: "Можно, если заранее расставить приоритеты: холодильник, мойка, варочная, хранение и рабочая зона не всегда помещаются в полном размере." },
        { question: "Какие цвета лучше для маленькой кухни?", answer: "Чаще выбирают светлые фасады, дерево и спокойные матовые поверхности. Контраст оставляем точечно: столешница, ручки или фартук." },
        { question: "Есть ли смысл делать шкафы до потолка?", answer: "Да, в маленькой кухне верхнее хранение часто решает половину задачи, особенно для сезонной посуды и запасов." },
      ],
      links: {
        portfolio: [{ href: "/portfolio/malenkaya-kuhnya-studiya", label: "Кухня для квартиры-студии" }],
        styles: [
          { href: "/styles/skandinavskie", label: "Скандинавские кухни" },
          { href: "/styles/minimalizm", label: "Минимализм" },
        ],
        materials: [
          { href: "/materials/egger", label: "EGGER" },
          { href: "/materials/mdf", label: "МДФ" },
        ],
      },
    },
  },
  "kuhni-do-potolka": {
    title: "Кухни до потолка на заказ в Минске",
    description: "Кухни с фасадами до потолка — максимум хранения. От 2 200 BYN. Замер бесплатно.",
    priceFrom: 2200,
    features: ["Максимум высоты", "Нет пыли на верхних шкафах", "Монолитный вид", "Дополнительное хранение"],
    content: "Кухня до потолка закрывает верхнюю зону, добавляет хранение и делает гарнитур встроенным на вид. Такой формат особенно требователен к замеру, геометрии стен и аккуратной подгонке доборов.",
    seo: {
      suitableFor: [
        "квартирам с потолками 2,5–2,8 м, где хочется убрать пыльный зазор над шкафами",
        "семьям с большим количеством посуды, круп и мелкой техники",
        "современным интерьерам, где кухня должна выглядеть как встроенная мебель",
      ],
      planning: [
        "верх делим на рабочий уровень и антресоли, чтобы ежедневная посуда оставалась под рукой",
        "до потолка часто ведём не фасад одним полотном, а комбинацию шкафов и доборной планки",
        "при неровном потолке закладываем технологический зазор и закрываем его аккуратным добором",
      ],
      priceGuide: "Стоимость начинается от 2 200 BYN. Доплата чаще связана с антресолями, высокими боковинами, подъёмными механизмами, подсветкой и точной подгонкой к потолку.",
      timeline: "Срок обычно 20–30 рабочих дней: больше деталей, больше сверки размеров и аккуратный монтаж верхнего яруса.",
      materials: [
        "МДФ эмаль или пленка для ровных высоких фасадов",
        "ЛДСП EGGER для корпусов и внутренних антресолей",
        "надёжные петли и подъёмники, если верхние фасады открываются вверх",
      ],
      faq: [
        { question: "Нужен ли идеально ровный потолок?", answer: "Идеально ровный — нет, но перепады нужно знать до производства. На замере проверяем высоту в нескольких точках." },
        { question: "Как пользоваться самыми верхними шкафами?", answer: "Туда обычно кладут сезонную посуду, технику и запасы. Для ежедневных вещей оставляем нижний и средний уровень." },
        { question: "Кухня до потолка выглядит тяжелее?", answer: "Не обязательно: светлые фасады, вертикальные линии и отсутствие открытого зазора часто делают интерьер спокойнее." },
      ],
      links: {
        portfolio: [{ href: "/portfolio/kuhnya-do-potolka-minsk-vostok", label: "Кухня до потолка в Минске" }],
        styles: [
          { href: "/styles/sovremennye", label: "Современные кухни" },
          { href: "/styles/minimalizm", label: "Минимализм" },
        ],
        materials: [
          { href: "/materials/emal", label: "Эмалевые фасады" },
          { href: "/materials/egger", label: "EGGER" },
        ],
      },
    },
  },
  "kuhni-bez-ruchek": {
    title: "Кухни без ручек на заказ в Минске",
    description: "Кухни без ручек — современный дизайн. Нажимные механизмы или J-профиль. От 2 000 BYN.",
    priceFrom: 2000,
    features: ["Чистый дизайн", "Удобный уход", "Современный вид", "Нажимные механизмы"],
    content: "Кухня без ручек строится на ровных фасадах и чистых линиях. Открывание можно сделать через профиль, интегрированную фрезеровку или нажимные механизмы — выбор зависит от привычек и материала фасада.",
    seo: {
      suitableFor: [
        "современным интерьерам, где важна цельная линия фасадов",
        "семьям, которые хотят меньше выступающих деталей и проще уход за поверхностями",
        "кухням-гостиным, где гарнитур должен выглядеть как часть мебели, а не как рабочий цех",
      ],
      planning: [
        "J-профиль удобен для нижних модулей и часто практичнее push-to-open в зоне активной готовки",
        "на высоких пеналах продумываем высоту хвата, чтобы дверцы открывались естественно",
        "для посудомойки и холодильника подбираем специальные решения, потому что обычный профиль подходит не всегда",
      ],
      priceGuide: "Ориентир — от 2 000 BYN. На смету влияет тип открывания: профиль обычно предсказуемее по бюджету, push-to-open и качественные механизмы дороже.",
      timeline: "Срок — 18–30 рабочих дней. Больше времени может потребоваться для крашеных фасадов, интегрированной фрезеровки и нестандартных пеналов.",
      materials: [
        "МДФ эмаль для чистой геометрии и аккуратной фрезеровки",
        "пластик или акрил для практичных гладких фасадов",
        "алюминиевый профиль, Tip-On или аналоги под конкретный сценарий открывания",
      ],
      faq: [
        { question: "Что лучше: профиль или нажимной механизм?", answer: "Для активной кухни чаще выбирают профиль: он понятнее в быту. Push-to-open хорош для верхов, пеналов и минималистичных зон." },
        { question: "На фасадах без ручек больше следов?", answer: "На глянце следы заметнее, на матовой эмали и пластике меньше. Мы подбираем материал под привычки семьи." },
        { question: "Можно ли сделать без ручек встроенный холодильник?", answer: "Да, но механизм и усилие открывания подбираются отдельно, особенно если фасад высокий и тяжёлый." },
      ],
      links: {
        portfolio: [{ href: "/portfolio/uglovaya-kuhnya-minsk-kirova", label: "Минималистичная кухня со скрытым открыванием" }],
        styles: [
          { href: "/styles/minimalizm", label: "Минимализм" },
          { href: "/styles/sovremennye", label: "Современные кухни" },
        ],
        materials: [
          { href: "/materials/emal", label: "Эмаль" },
          { href: "/materials/plastik", label: "Пластик" },
        ],
      },
    },
  },
};

const PRIMARY_CATEGORY_SLUGS = new Set(Object.keys(STATIC_CATEGORIES));

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const cat = STATIC_CATEGORIES[slug];
  if (cat) {
    return {
      title: cleanSeoTitle(cat.title, "Кухня на заказ"),
      description: trimMetaDescription(cat.description, cat.description),
      alternates: { canonical: `/catalog/${slug}` },
      robots: { index: true, follow: true },
    };
  }

  try {
    const kitchen = await prisma.kitchen.findUnique({ where: { slug } });
    if (kitchen?.published) {
      const canonicalSlug = resolvePrimaryCategorySlug({
        slug,
        title: kitchen.title,
        category: kitchen.category,
      });
      const isPrimaryCategory = PRIMARY_CATEGORY_SLUGS.has(slug);

      return {
        title: cleanSeoTitle(kitchen.seoTitle, kitchen.title),
        description: trimMetaDescription(kitchen.seoDescription, kitchen.description),
        alternates: { canonical: canonicalSlug === "catalog" ? "/catalog" : `/catalog/${canonicalSlug}` },
        robots: isPrimaryCategory
          ? { index: true, follow: true }
          : { index: false, follow: true },
      };
    }
  } catch {}

  return { title: "Кухня на заказ" };
}

export default async function CatalogItemPage({ params }: Props) {
  const { slug } = await params;

  let data: {
    title: string;
    description: string;
    priceFrom: number;
    features: string[];
    content: string;
    mainImage?: string;
    images?: string[];
  } | null = null;

  data = STATIC_CATEGORIES[slug] || null;

  if (!data) {
    try {
      const kitchen = await prisma.kitchen.findUnique({ where: { slug } });
      if (kitchen && kitchen.published) {
        data = {
          title: kitchen.title,
          description: kitchen.description,
          priceFrom: kitchen.priceFrom,
          features: kitchen.features,
          content: kitchen.description,
          mainImage: kitchen.mainImage || undefined,
          images: kitchen.images,
        };
      }
    } catch {}
  }

  if (!data) notFound();

  const seo = STATIC_CATEGORIES[slug]?.seo;
  const heroImage = resolveCatalogCategoryImage({
    slug,
    title: data.title,
    mainImage: data.mainImage,
    images: data.images,
  });
  const galleryImages = getCatalogCategoryGallery(slug);

  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
    { name: data.title, path: `/catalog/${slug}` },
  ]);

  const jsonLdProduct = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.title,
    description: data.description || data.content,
    image: heroImage.src ? siteUrl(heroImage.src) : undefined,
    url: siteUrl(`/catalog/${slug}`),
    category: "Кухни на заказ",
    brand: { "@type": "Brand", name: "КухниBY" },
    offers: offerJsonLd(data.priceFrom, `/catalog/${slug}`),
  });

  const jsonLdFaq = seo
    ? compactJsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      })
    : null;

  return (
    <>
      <JsonLd data={jsonLdFaq ? [jsonLdBreadcrumb, jsonLdProduct, jsonLdFaq] : [jsonLdBreadcrumb, jsonLdProduct]} />
      <div className="section-padding">
        <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-primary">Каталог</Link>
          <span>/</span>
          <span className="text-foreground">{data.title.split(" ").slice(0, 3).join(" ")}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="font-serif text-4xl font-bold mb-4">{data.title}</h1>
            <div className="mb-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
              <CatalogCategoryImage src={heroImage.src} alt={heroImage.alt} priority sizes="(max-width: 1024px) 100vw, 820px" />
            </div>
            {galleryImages.length > 0 && (
              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold mb-4">Примеры кухонь</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.src} className="overflow-hidden rounded-xl border bg-card">
                      <CatalogCategoryImage src={image.src} alt={image.alt} sizes="(max-width: 640px) 100vw, 260px" />
                    </div>
                  ))}
                </div>
              </section>
            )}
            <p className="text-muted-foreground text-lg mb-6">{data.content}</p>
            <div className="card-base p-6 mb-6">
              <h2 className="font-semibold mb-4">Особенности</h2>
              <ul className="space-y-2">
                {data.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
              <p className="font-semibold text-primary text-lg">Стоимость: от {data.priceFrom.toLocaleString("ru")} BYN</p>
              <p className="text-sm text-muted-foreground mt-1">Точная цена — после замера и согласования проекта</p>
            </div>
            {seo && (
              <div className="mt-10 space-y-8">
                <section className="rounded-xl border bg-card p-6">
                  <h2 className="font-serif text-2xl font-semibold mb-4">Кому подходит такая кухня</h2>
                  <ul className="grid gap-3 md:grid-cols-3">
                    {seo.suitableFor.map((item) => (
                      <li key={item} className="rounded-lg bg-muted/60 p-4 text-sm leading-6 text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-xl border bg-card p-6">
                  <h2 className="font-serif text-2xl font-semibold mb-4">Особенности планировки</h2>
                  <div className="space-y-3">
                    {seo.planning.map((item) => (
                      <p key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border bg-card p-6">
                    <h2 className="font-serif text-2xl font-semibold mb-3">Ориентиры цены</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{seo.priceGuide}</p>
                  </div>
                  <div className="rounded-xl border bg-card p-6">
                    <h2 className="font-serif text-2xl font-semibold mb-3">Сроки</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{seo.timeline}</p>
                  </div>
                </section>

                <section className="rounded-xl border bg-card p-6">
                  <h2 className="font-serif text-2xl font-semibold mb-4">Материалы и фурнитура</h2>
                  <ul className="space-y-3">
                    {seo.materials.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-xl border bg-card p-6">
                  <h2 className="font-serif text-2xl font-semibold mb-4">Частые вопросы</h2>
                  <div className="divide-y">
                    {seo.faq.map((item) => (
                      <div key={item.question} className="py-4 first:pt-0 last:pb-0">
                        <h3 className="font-semibold">{item.question}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border bg-card p-6">
                  <h2 className="font-serif text-2xl font-semibold mb-4">Что посмотреть дальше</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    <RelatedLinks title="Портфолио" links={seo.links.portfolio} />
                    <RelatedLinks title="Стили" links={seo.links.styles} />
                    <RelatedLinks title="Материалы" links={seo.links.materials} />
                  </div>
                </section>
              </div>
            )}
          </div>
          <div>
            <div className="sticky top-20 space-y-5">
              <div className="card-base p-6">
              <h2 className="font-serif text-xl font-semibold mb-4">Заказать замер</h2>
              <p className="text-sm text-muted-foreground mb-4">Бесплатно и без обязательств</p>
              <ContactForm source={`catalog/${slug}`} />
              </div>
              <div className="card-base p-5">
                <h3 className="font-semibold text-sm mb-3">Связанные разделы</h3>
                <div className="space-y-1">
                  {[
                    { href: "/styles", label: "Стили кухонь" },
                    { href: "/materials", label: "Материалы и фасады" },
                    { href: "/portfolio", label: "Кейсы в портфолио" },
                    { href: "/prices", label: "Цены на кухни" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

function RelatedLinks({ title, links }: { title: string; links: SeoLink[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm font-medium text-primary hover:underline">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function resolvePrimaryCategorySlug({
  slug,
  title,
  category,
}: {
  slug: string;
  title: string;
  category?: string | null;
}) {
  if (PRIMARY_CATEGORY_SLUGS.has(slug)) return slug;

  const text = `${slug} ${title} ${category ?? ""}`;

  if (/bez-ruchek|без ручек/i.test(text)) return "kuhni-bez-ruchek";
  if (/do-potolka|до потолка/i.test(text)) return "kuhni-do-potolka";
  if (/malenk|маленьк|небольш|studii|студи/i.test(text)) return "malenkie-kuhni";
  if (/pryam|прям/i.test(text)) return "pryamye-kuhni";
  if (/uglov|углов/i.test(text)) return "uglovye-kuhni";
  if (/p-obraz|п-образ/i.test(text)) return "p-obraznye-kuhni";
  if (/ostrov|остров/i.test(text)) return "kuhni-s-ostrovom";

  return "catalog";
}
