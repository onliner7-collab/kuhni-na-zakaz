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

export interface EditablePortfolioCase {
  id: number;
  externalId: string | null;
  title: string;
  shortTitle: string;
  slug: string;
  city: string;
  cityKey: string;
  region: string;
  district: string;
  kitchenType: string;
  area: number;
  layout: string;
  style: string;
  color: string;
  material: string;
  materials: string[];
  priceFrom: number;
  priceTo: number;
  priceNote: string;
  size: string;
  facades: string;
  countertop: string;
  fittings: string;
  workDuration: string;
  days: number;
  description: string;
  task: string;
  solution: string;
  result: string;
  features: string[];
  relatedLocationSlugs: string[];
  mainImage: string;
  images: string[];
  imageAlts: string[];
  imageCaptions: string[];
  alt: string;
  featured: boolean;
  createdAt: Date;
}

const defaultPriceNote = "Стоимость зависит от размеров, материалов и комплектации.";

function formatPrice(priceFrom: number, priceTo: number) {
  if (priceFrom > 0 && priceTo > 0) return `${priceFrom.toLocaleString("ru")}–${priceTo.toLocaleString("ru")} BYN`;
  if (priceFrom > 0) return `от ${priceFrom.toLocaleString("ru")} BYN`;
  return "";
}

function normalizeCityKey(city: string) {
  const value = city.trim().toLowerCase();
  const map: Record<string, string> = {
    минск: "minsk",
    гомель: "gomel",
    могилев: "mogilev",
    могилёв: "mogilev",
    витебск: "vitebsk",
    брест: "brest",
    гродно: "grodno",
  };

  return map[value] || value;
}

function normalizeKitchenType(portfolioCase: EditablePortfolioCase) {
  return portfolioCase.kitchenType || portfolioCase.layout;
}

function normalizeMaterials(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.materials.length > 0) return portfolioCase.materials;
  if (portfolioCase.material) return [portfolioCase.material];
  return [];
}

function normalizeSize(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.size) return portfolioCase.size;
  if (portfolioCase.area > 0) return `${portfolioCase.area} п.м`;
  return "";
}

function normalizeWorkDuration(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.workDuration) return portfolioCase.workDuration;
  if (portfolioCase.days > 0) return `${portfolioCase.days} дней`;
  return "";
}

function normalizeFeatures(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.features.length > 0) return portfolioCase.features;
  if (!portfolioCase.result) return [];

  return portfolioCase.result
    .split(/[.;]/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

function normalizeRelatedLocations(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.relatedLocationSlugs.length > 0) return portfolioCase.relatedLocationSlugs;
  const cityKey = portfolioCase.cityKey || normalizeCityKey(portfolioCase.city);
  return cityKey ? [cityKey] : [];
}

function buildImages(portfolioCase: EditablePortfolioCase, projectAlt: string) {
  const srcList = portfolioCase.images.length > 0
    ? portfolioCase.images
    : portfolioCase.mainImage
      ? [portfolioCase.mainImage]
      : [];

  return srcList.map((src, index) => ({
    src,
    alt: portfolioCase.imageAlts[index] || projectAlt || portfolioCase.title,
    caption: portfolioCase.imageCaptions[index] || (index === 0 ? "Общий вид кухни" : "Дополнительный ракурс"),
  }));
}

export function toPortfolioProject(portfolioCase: EditablePortfolioCase): PortfolioProject {
  const kitchenType = normalizeKitchenType(portfolioCase);
  const materials = normalizeMaterials(portfolioCase);
  const cityKey = portfolioCase.cityKey || normalizeCityKey(portfolioCase.city);
  const price = formatPrice(portfolioCase.priceFrom, portfolioCase.priceTo);
  const alt = portfolioCase.alt || portfolioCase.title;

  return {
    id: portfolioCase.externalId || `project-${portfolioCase.id}`,
    slug: portfolioCase.slug,
    title: portfolioCase.title,
    shortTitle: portfolioCase.shortTitle || portfolioCase.title,
    city: portfolioCase.city,
    cityKey,
    region: portfolioCase.region,
    district: portfolioCase.district,
    kitchenType,
    style: portfolioCase.style,
    color: portfolioCase.color || "Светлая",
    price,
    priceNote: portfolioCase.priceNote || defaultPriceNote,
    size: normalizeSize(portfolioCase),
    materials,
    facades: portfolioCase.facades || portfolioCase.material,
    countertop: portfolioCase.countertop,
    fittings: portfolioCase.fittings,
    workDuration: normalizeWorkDuration(portfolioCase),
    mainImage: portfolioCase.mainImage,
    images: buildImages(portfolioCase, alt),
    alt,
    description: portfolioCase.description,
    task: portfolioCase.task,
    solution: portfolioCase.solution,
    features: normalizeFeatures(portfolioCase),
    relatedLocationSlugs: normalizeRelatedLocations(portfolioCase),
    isFeatured: portfolioCase.featured,
    createdAt: portfolioCase.createdAt.toISOString().slice(0, 10),
  };
}
