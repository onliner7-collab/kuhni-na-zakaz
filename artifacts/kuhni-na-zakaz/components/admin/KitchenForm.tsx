"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, X, Image as ImageIcon } from "lucide-react";

interface Kitchen {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  style: string;
  material: string;
  priceFrom: number;
  priceTo?: number | null;
  features: string[];
  images: string[];
  mainImage: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  published: boolean;
}

const CATEGORIES = ["Угловые","Прямые","П-образные","С островом","Маленькие","До потолка","Без ручек","Дизайнерские","Классические"];

function toSlug(str: string): string {
  const map: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"i",
    к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
    х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ы:"y",ь:"",ъ:"",э:"e",ю:"yu",я:"ya",
  };
  return str.toLowerCase().split("").map(c => map[c] ?? c).join("")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function KitchenForm({ kitchen }: { kitchen?: Kitchen }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(kitchen?.features ?? []);
  const [images, setImages] = useState<string[]>(kitchen?.images ?? []);
  const [newFeature, setNewFeature] = useState("");
  const [newImage, setNewImage] = useState("");
  const [slugVal, setSlugVal] = useState(kitchen?.slug ?? "");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!kitchen) setSlugVal(toSlug(e.target.value));
  }

  function addFeature() {
    const v = newFeature.trim();
    if (v && !features.includes(v)) { setFeatures([...features, v]); setNewFeature(""); }
  }

  function addImage() {
    const v = newImage.trim();
    if (v) { setImages([...images, v]); setNewImage(""); }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      slug: slugVal,
      description: fd.get("description") as string,
      category: fd.get("category") as string,
      style: fd.get("style") as string,
      material: fd.get("material") as string,
      priceFrom: Number(fd.get("priceFrom")) || 0,
      priceTo: fd.get("priceTo") ? Number(fd.get("priceTo")) : null,
      features,
      images,
      mainImage: images[0] ?? "",
      seoTitle: (fd.get("seoTitle") as string) || null,
      seoDescription: (fd.get("seoDescription") as string) || null,
      published: fd.get("published") === "on",
    };
    try {
      const url = kitchen ? `/kapi/admin/kitchens/${kitchen.id}` : "/kapi/admin/kitchens";
      const method = kitchen ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        toast.success(kitchen ? "Изменения сохранены!" : "Кухня добавлена в каталог!");
        router.push("/admin/kitchens");
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Ошибка сохранения");
      }
    } catch { toast.error("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-12">

      {/* Основная информация */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <h2 className="font-bold text-base border-b border-border pb-3">Основная информация</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Название *</Label>
            <Input id="title" name="title" defaultValue={kitchen?.title} required className="mt-1.5" placeholder="Угловые кухни" onChange={handleTitleChange} />
          </div>
          <div>
            <Label htmlFor="slug">URL-адрес *</Label>
            <Input id="slug" name="slug" value={slugVal} onChange={e => setSlugVal(e.target.value)} required className="mt-1.5 font-mono text-sm" placeholder="uglovye-kuhni" />
            <p className="text-xs text-muted-foreground mt-1">/catalog/<span className="text-foreground font-mono">{slugVal || "..."}</span></p>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea id="description" name="description" defaultValue={kitchen?.description} className="mt-1.5 min-h-[110px] resize-y" placeholder="Расскажите о данном типе кухни: для кого подходит, какие размеры, особенности..." />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Категория</Label>
            <select id="category" name="category" defaultValue={kitchen?.category} className="mt-1.5 w-full rounded-lg border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">— выберите —</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="style">Стиль</Label>
            <Input id="style" name="style" defaultValue={kitchen?.style} className="mt-1.5" placeholder="Модерн, классика..." />
          </div>
          <div>
            <Label htmlFor="material">Материал фасада</Label>
            <Input id="material" name="material" defaultValue={kitchen?.material} className="mt-1.5" placeholder="МДФ, пластик, шпон..." />
          </div>
        </div>
      </section>

      {/* Цена */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">Цена</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priceFrom">Цена от (BYN) *</Label>
            <div className="relative mt-1.5">
              <Input id="priceFrom" name="priceFrom" type="number" defaultValue={kitchen?.priceFrom || ""} required min={0} placeholder="1200" className="pr-14" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">BYN</span>
            </div>
          </div>
          <div>
            <Label htmlFor="priceTo">Цена до (BYN)</Label>
            <div className="relative mt-1.5">
              <Input id="priceTo" name="priceTo" type="number" defaultValue={kitchen?.priceTo ?? ""} min={0} placeholder="Необязательно" className="pr-14" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">BYN</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">На сайте отображается: <span className="font-medium text-foreground">от {(kitchen?.priceFrom || 0).toLocaleString("ru")} BYN</span></p>
      </section>

      {/* Особенности */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">Особенности / Преимущества</h2>
        <p className="text-sm text-muted-foreground">Теги на карточке кухни. Например: «Вместительность», «Встроенная техника».</p>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {features.length === 0 && <p className="text-sm text-muted-foreground italic">Нет особенностей — добавьте ниже</p>}
          {features.map((f, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-800 text-sm px-3 py-1.5 rounded-full">
              {f}
              <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="text-violet-400 hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} placeholder="Введите и нажмите Enter..." className="flex-1" />
          <Button type="button" variant="outline" onClick={addFeature} className="shrink-0"><Plus className="w-4 h-4 mr-1" /> Добавить</Button>
        </div>
      </section>

      {/* Фотографии */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">Фотографии</h2>
        <p className="text-sm text-muted-foreground">Первое фото — главное (обложка каталога). Вставьте ссылки на изображения.</p>

        {images.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Добавьте ссылки на фотографии кухни</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted">
                <img src={img} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                {i === 0 && <span className="absolute top-1.5 left-1.5 text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full font-medium">Обложка</span>}
                <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1.5 left-1.5 text-xs text-white bg-black/40 px-1.5 py-0.5 rounded">{i + 1}/{images.length}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input value={newImage} onChange={e => setNewImage(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }} placeholder="https://example.com/kitchen-photo.jpg" className="flex-1 font-mono text-sm" type="url" />
          <Button type="button" variant="outline" onClick={addImage} className="shrink-0"><ImageIcon className="w-4 h-4 mr-1" /> Добавить фото</Button>
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">SEO — поисковая оптимизация</h2>
        <div>
          <Label htmlFor="seoTitle">Заголовок страницы (title)</Label>
          <Input id="seoTitle" name="seoTitle" defaultValue={kitchen?.seoTitle ?? ""} className="mt-1.5" placeholder="Угловые кухни на заказ в Беларуси — цены от 1800 BYN | КухниBY" maxLength={70} />
          <p className="text-xs text-muted-foreground mt-1">До 70 символов. Отображается во вкладке браузера и в Google.</p>
        </div>
        <div>
          <Label htmlFor="seoDescription">Мета-описание</Label>
          <Textarea id="seoDescription" name="seoDescription" defaultValue={kitchen?.seoDescription ?? ""} className="mt-1.5" rows={3} placeholder="Угловые кухни на заказ от производителя. Собственное производство в Беларуси. Цены от 1800 BYN." maxLength={160} />
          <p className="text-xs text-muted-foreground mt-1">До 160 символов. Отображается под ссылкой в результатах поиска.</p>
        </div>
      </section>

      {/* Публикация */}
      <section className="rounded-2xl border border-border bg-white p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Публикация</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {kitchen?.published ? "Кухня видна в каталоге на сайте" : "Черновик — скрыта от посетителей"}
          </p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="text-sm font-medium text-muted-foreground">{kitchen?.published ? "Опубликовано" : "Черновик"}</span>
          <input type="checkbox" id="published" name="published" defaultChecked={kitchen?.published} className="w-5 h-5 accent-violet-600" />
        </label>
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }} className="text-white px-8">
          {loading ? "Сохраняем..." : kitchen ? "Сохранить изменения" : "Добавить в каталог"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
      </div>
    </form>
  );
}
