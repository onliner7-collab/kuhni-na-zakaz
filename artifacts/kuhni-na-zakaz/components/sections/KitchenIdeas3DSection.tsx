import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import {
  getKitchenIdeas3DForCity,
  kitchenIdeas3D,
  type KitchenIdea3D,
} from "@/data/kitchen-ideas-3d";

interface KitchenIdeas3DSectionProps {
  cityName: string;
  citySlug: string;
  cityPrepositional: string;
  titleSubject?: string;
}

interface HomeKitchenIdeas3DSectionProps {
  limit?: 4 | 6;
}

function ideaAltForCity(idea: KitchenIdea3D, cityName: string, cityPrepositional: string) {
  const normalizedAlt = idea.alt.toLocaleLowerCase("ru");

  if (
    normalizedAlt.includes(cityName.toLocaleLowerCase("ru")) ||
    normalizedAlt.includes(cityPrepositional.toLocaleLowerCase("ru"))
  ) {
    return idea.alt;
  }

  return `${idea.alt} в ${cityPrepositional}`;
}

export function KitchenIdeas3DSection({
  cityName,
  citySlug,
  cityPrepositional,
  titleSubject = cityName,
}: KitchenIdeas3DSectionProps) {
  const locationPath = `/locations/${citySlug}`;
  const adaptationText = `Такую кухню можно адаптировать под размеры квартиры или дома в ${cityPrepositional}.`;
  const ideas = getKitchenIdeas3DForCity(citySlug);

  return (
    <section className="bg-white section-padding" id="ideas-3d">
      <div className="container-site">
        <div className="mb-8 max-w-4xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Примеры дизайна
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            Идеи кухонь для {titleSubject}: 3D-визуализации перед заказом
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Если вы ещё не знаете, какую кухню хотите, посмотрите примеры решений. Это не фото
            выполненных работ, а 3D-визуализации КухниBY — такие идеи можно адаптировать под размеры вашей
            квартиры или дома в {cityPrepositional}.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <article key={idea.id} className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={idea.image}
                  alt={ideaAltForCity(idea, cityName, cityPrepositional)}
                  title={`${idea.badge}: ${idea.title}`}
                  width={720}
                  height={540}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full object-cover"
                />
                <BrandedImageWatermark compact />
                <span className="absolute left-3 top-3 z-[3] rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                  {idea.badge}
                </span>
              </div>
              <div className="p-5">
                <p className="text-base font-semibold text-foreground">{idea.title}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{idea.shortDescription}</p>
                <p className="mt-3 text-sm leading-6 text-foreground">{adaptationText}</p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{idea.disclosure}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {idea.suitableFor.map((item) => (
                    <span key={item} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  href={`${locationPath}#form`}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Хочу похожую кухню
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm leading-6 text-muted-foreground">
            3D-визуализации помогают заранее понять стиль, расположение шкафов, цвет фасадов и
            удобство хранения. После заявки мы можем адаптировать идею под размеры помещения,
            планировку, технику и бюджет. Для кухни в {cityPrepositional} можно взять одну из идей
            за основу: изменить размеры, материалы, цвет фасадов, расположение техники и количество
            мест хранения.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`${locationPath}#form`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Хочу похожую кухню
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={`${locationPath}#form`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Calculator className="h-4 w-4" aria-hidden />
              Рассчитать по моим размерам
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeKitchenIdeas3DSection({ limit = 4 }: HomeKitchenIdeas3DSectionProps) {
  const ideas = kitchenIdeas3D.slice(0, limit);

  return (
    <section className="section-padding bg-white" id="home-3d-ideas">
      <div className="container-site">
        <div className="mb-8 max-w-4xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Идеи перед расчетом
          </p>
          <p className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
            Не знаете, какую кухню выбрать? Покажем идеи в 3D
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Посмотрите примеры дизайна: прямые, угловые, маленькие кухни, кухни до потолка и решения
            со встроенной техникой. Это 3D-визуализации, которые можно адаптировать под размеры
            вашего помещения, город и бюджет.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ideas.map((idea) => (
            <article key={idea.id} className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={idea.image}
                  alt={idea.alt}
                  title={`${idea.badge}: ${idea.title}`}
                  width={720}
                  height={540}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-full w-full object-cover"
                />
                <BrandedImageWatermark compact />
                <span className="absolute left-3 top-3 z-[3] rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                  {idea.badge}
                </span>
              </div>
              <div className="p-5">
                <p className="text-base font-semibold text-foreground">{idea.title}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Пример дизайна, не фото выполненной работы.
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-lg border border-primary/20 bg-primary/5 p-5 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Мы показываем 3D-идеи не как готовые работы, а как понятный способ выбрать направление
            дизайна перед расчётом кухни.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#home-3d-ideas"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Посмотреть идеи
            </Link>
            <Link
              href="/#form"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Рассчитать похожую кухню
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
