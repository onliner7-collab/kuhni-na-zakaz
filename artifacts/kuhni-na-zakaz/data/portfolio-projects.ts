export interface PortfolioProjectImage {
  src: string;
  alt: string;
  caption: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  city: string;
  cityKey: string;
  region: string;
  district: string;
  kitchenType: string;
  style: string;
  color: string;
  price: string;
  priceNote: string;
  size: string;
  materials: string[];
  facades: string;
  countertop: string;
  fittings: string;
  workDuration: string;
  mainImage: string;
  images: PortfolioProjectImage[];
  alt: string;
  description: string;
  task: string;
  solution: string;
  features: string[];
  relatedLocationSlugs: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface PortfolioCaseCard {
  id: number;
  title: string;
  slug: string;
  city: string;
  region: string;
  area: number;
  layout: string;
  style: string;
  material: string;
  priceFrom: number;
  priceTo: number;
  days: number;
  completedAt: string;
  description: string;
  mainImage: string;
  featured: boolean;
}

const defaultPriceNote = "Стоимость зависит от размеров, материалов и комплектации.";

export const portfolioProjects = [
  {
    id: "project-001",
    slug: "uglovaya-kuhnya-v-minske-svetlye-fasady",
    title: "Угловая кухня со светлыми фасадами в Минске",
    shortTitle: "Угловая кухня в Минске",
    city: "Минск",
    cityKey: "minsk",
    region: "Минск",
    district: "",
    kitchenType: "Угловая",
    style: "Современная",
    color: "Светлая",
    price: "",
    priceNote: defaultPriceNote,
    size: "",
    materials: ["МДФ", "ЛДСП"],
    facades: "МДФ в светлой матовой отделке",
    countertop: "",
    fittings: "",
    workDuration: "",
    mainImage: "/uploads/seo-showcase/portfolio-minsk-uglovaya-1.webp",
    images: [
      {
        src: "/uploads/seo-showcase/portfolio-minsk-uglovaya-1.webp",
        alt: "Угловая кухня на заказ в Минске со светлыми фасадами",
        caption: "Общий вид кухни",
      },
      {
        src: "/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp",
        alt: "Современная угловая кухня в Минске с рабочей зоной у окна",
        caption: "Дополнительный ракурс угловой планировки",
      },
    ],
    alt: "Угловая кухня на заказ в Минске",
    description: "Проект кухни по индивидуальным размерам для квартиры в Минске.",
    task: "Сделать удобную кухню с достаточным количеством мест хранения.",
    solution: "Использовали угловую планировку, светлые фасады и верхние шкафы до потолка.",
    features: ["Угловая планировка", "Встроенная техника", "Шкафы до потолка"],
    relatedLocationSlugs: ["minsk"],
    isFeatured: true,
    createdAt: "2026-01-01",
  },
  {
    id: "project-002",
    slug: "pryamaya-kuhnya-v-breste-v-svetlyh-tonah",
    title: "Прямая кухня в светлых тонах в Бресте",
    shortTitle: "Прямая кухня в Бресте",
    city: "Брест",
    cityKey: "brest",
    region: "Брестская область",
    district: "",
    kitchenType: "Прямая",
    style: "Современная",
    color: "Светлая",
    price: "",
    priceNote: defaultPriceNote,
    size: "",
    materials: ["МДФ", "ЛДСП"],
    facades: "Светлые фасады без лишнего декора",
    countertop: "",
    fittings: "",
    workDuration: "",
    mainImage: "/uploads/seo-showcase/portfolio-brest-pryamaya-1.webp",
    images: [
      {
        src: "/uploads/seo-showcase/portfolio-brest-pryamaya-1.webp",
        alt: "Прямая кухня на заказ в Бресте в светлых тонах",
        caption: "Линейная композиция кухни",
      },
      {
        src: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
        alt: "Светлая прямая кухня с удобной рабочей поверхностью",
        caption: "Рабочая зона и фасады",
      },
    ],
    alt: "Прямая кухня на заказ в Бресте",
    description: "Лаконичный проект прямой кухни для квартиры с ограниченной шириной помещения.",
    task: "Разместить основные зоны кухни вдоль одной стены и сохранить ощущение простора.",
    solution: "Выбрали прямую планировку, светлую палитру и практичные материалы для ежедневного ухода.",
    features: ["Прямая планировка", "Светлые фасады", "Компактное хранение"],
    relatedLocationSlugs: ["brest"],
    isFeatured: false,
    createdAt: "2026-01-05",
  },
  {
    id: "project-003",
    slug: "malenkaya-kuhnya-v-gomele-kompaktnaya-planirovka",
    title: "Маленькая кухня с компактной планировкой в Гомеле",
    shortTitle: "Маленькая кухня в Гомеле",
    city: "Гомель",
    cityKey: "gomel",
    region: "Гомельская область",
    district: "",
    kitchenType: "Маленькая",
    style: "Современная",
    color: "Светлая",
    price: "",
    priceNote: defaultPriceNote,
    size: "",
    materials: ["ЛДСП", "МДФ"],
    facades: "Гладкие фасады",
    countertop: "",
    fittings: "",
    workDuration: "",
    mainImage: "/uploads/seo-showcase/portfolio-gomel-malenkaya-1.webp",
    images: [
      {
        src: "/uploads/seo-showcase/portfolio-gomel-malenkaya-1.webp",
        alt: "Маленькая кухня на заказ в Гомеле с компактной планировкой",
        caption: "Компактный проект кухни",
      },
      {
        src: "/uploads/seo-showcase/kuhnya-malenkaya-funkcionalnaya-1.webp",
        alt: "Функциональная маленькая кухня со встроенной техникой",
        caption: "Хранение и встроенная техника",
      },
    ],
    alt: "Маленькая кухня на заказ в Гомеле",
    description: "Кухня для небольшого помещения, где важен каждый сантиметр рабочей зоны.",
    task: "Уместить хранение, технику и рабочую поверхность в компактном пространстве.",
    solution: "Собрали функциональную композицию с верхними шкафами и аккуратной рабочей зоной.",
    features: ["Компактная планировка", "Встроенная техника", "Практичные материалы"],
    relatedLocationSlugs: ["gomel"],
    isFeatured: true,
    createdAt: "2026-01-10",
  },
  {
    id: "project-004",
    slug: "kuhnya-s-ostrovom-v-grodno-sovremennyj-proekt",
    title: "Современная кухня с островом в Гродно",
    shortTitle: "Кухня с островом в Гродно",
    city: "Гродно",
    cityKey: "grodno",
    region: "Гродненская область",
    district: "",
    kitchenType: "С островом",
    style: "Современная",
    color: "Комбинированная",
    price: "",
    priceNote: defaultPriceNote,
    size: "",
    materials: ["МДФ", "ЛДСП"],
    facades: "Комбинированные фасады",
    countertop: "",
    fittings: "",
    workDuration: "",
    mainImage: "/uploads/seo-showcase/portfolio-grodno-ostrov-1.webp",
    images: [
      {
        src: "/uploads/seo-showcase/portfolio-grodno-ostrov-1.webp",
        alt: "Кухня с островом на заказ в Гродно",
        caption: "Кухонный остров в центре композиции",
      },
      {
        src: "/uploads/seo-showcase/kuhnya-s-ostrovom-1.webp",
        alt: "Современная кухня с островом и местом для общения",
        caption: "Остров и рабочая зона",
      },
    ],
    alt: "Кухня с островом на заказ в Гродно",
    description: "Проект кухни-гостиной с островом для просторного помещения.",
    task: "Объединить место для готовки, хранения и общения в одной композиции.",
    solution: "Добавили остров как рабочую поверхность и визуальный центр кухни.",
    features: ["Кухонный остров", "Зонирование кухни-гостиной", "Дополнительная рабочая поверхность"],
    relatedLocationSlugs: ["grodno"],
    isFeatured: true,
    createdAt: "2026-01-15",
  },
  {
    id: "project-005",
    slug: "kuhnya-do-potolka-v-mogileve-maksimum-hraneniya",
    title: "Кухня до потолка с максимумом хранения в Могилеве",
    shortTitle: "Кухня до потолка в Могилеве",
    city: "Могилев",
    cityKey: "mogilev",
    region: "Могилевская область",
    district: "",
    kitchenType: "До потолка",
    style: "Современная",
    color: "Светлая",
    price: "",
    priceNote: defaultPriceNote,
    size: "",
    materials: ["МДФ", "ЛДСП"],
    facades: "Фасады до потолка",
    countertop: "",
    fittings: "",
    workDuration: "",
    mainImage: "/uploads/seo-showcase/portfolio-mogilev-do-potolka-1.webp",
    images: [
      {
        src: "/uploads/seo-showcase/portfolio-mogilev-do-potolka-1.webp",
        alt: "Кухня до потолка на заказ в Могилеве",
        caption: "Высокие шкафы для хранения",
      },
      {
        src: "/uploads/seo-showcase/kuhnya-do-potolka-1.webp",
        alt: "Светлая кухня до потолка с верхними шкафами",
        caption: "Фасады до потолка",
      },
    ],
    alt: "Кухня до потолка на заказ в Могилеве",
    description: "Проект кухни с высокими шкафами для семьи, которой нужно больше мест хранения.",
    task: "Использовать высоту помещения и убрать визуальный шум от открытых полок.",
    solution: "Спроектировали шкафы до потолка и закрытые секции для посуды, техники и запасов.",
    features: ["Шкафы до потолка", "Закрытое хранение", "Современная лаконичная геометрия"],
    relatedLocationSlugs: ["mogilev"],
    isFeatured: false,
    createdAt: "2026-01-20",
  },
  {
    id: "project-006",
    slug: "neoklassicheskaya-kuhnya-v-vitebske-svetlye-fasady",
    title: "Неоклассическая кухня со светлыми фасадами в Витебске",
    shortTitle: "Неоклассическая кухня в Витебске",
    city: "Витебск",
    cityKey: "vitebsk",
    region: "Витебская область",
    district: "",
    kitchenType: "Прямая",
    style: "Неоклассика",
    color: "Светлая",
    price: "",
    priceNote: defaultPriceNote,
    size: "",
    materials: ["МДФ", "ЛДСП"],
    facades: "Рамочные фасады в светлой отделке",
    countertop: "",
    fittings: "",
    workDuration: "",
    mainImage: "/uploads/seo-showcase/portfolio-vitebsk-neoklassika-1.webp",
    images: [
      {
        src: "/uploads/seo-showcase/portfolio-vitebsk-neoklassika-1.webp",
        alt: "Неоклассическая кухня на заказ в Витебске со светлыми фасадами",
        caption: "Общий вид неоклассической кухни",
      },
      {
        src: "/uploads/seo-showcase/kuhnya-neoklassika-1.webp",
        alt: "Светлая кухня в стиле неоклассика с рамочными фасадами",
        caption: "Фасады и декоративные детали",
      },
    ],
    alt: "Неоклассическая кухня на заказ в Витебске",
    description: "Светлый проект кухни в стиле неоклассика для спокойного интерьера.",
    task: "Сохранить классический характер кухни и сделать ее удобной для повседневной готовки.",
    solution: "Использовали рамочные фасады, светлую гамму и современную организацию хранения.",
    features: ["Неоклассический стиль", "Рамочные фасады", "Светлая палитра"],
    relatedLocationSlugs: ["vitebsk"],
    isFeatured: true,
    createdAt: "2026-01-25",
  },
] satisfies PortfolioProject[];

export const featuredPortfolioProjects = portfolioProjects.filter((project) => project.isFeatured);

export const portfolioProjectsBySlug = new Map(
  portfolioProjects.map((project) => [project.slug, project]),
);

export function getPortfolioProjectBySlug(slug: string) {
  return portfolioProjectsBySlug.get(slug) ?? null;
}

export function getPortfolioProjectsByLocationSlug(locationSlug: string) {
  return portfolioProjects.filter((project) =>
    project.relatedLocationSlugs.includes(locationSlug),
  );
}

export function toPortfolioCaseCard(project: PortfolioProject, index = 0): PortfolioCaseCard {
  const area = Number.parseInt(project.size, 10);
  const days = Number.parseInt(project.workDuration, 10);

  return {
    id: index + 1,
    title: project.title,
    slug: project.slug,
    city: project.city,
    region: project.region,
    area: Number.isFinite(area) ? area : 0,
    layout: project.kitchenType,
    style: project.style,
    material: project.materials.join(", "),
    priceFrom: 0,
    priceTo: 0,
    days: Number.isFinite(days) ? days : 0,
    completedAt: "",
    description: project.description,
    mainImage: project.mainImage,
    featured: project.isFeatured,
  };
}

export const portfolioProjectCards = portfolioProjects.map(toPortfolioCaseCard);
