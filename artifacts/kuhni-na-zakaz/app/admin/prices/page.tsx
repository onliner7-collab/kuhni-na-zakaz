import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Цены — Админ" };

export default async function AdminPricesPage() {
  await requireAdmin();

  const priceRanges = [
    { category: "Эконом", from: 800, to: 1500, per: "погонный метр", description: "МДФ плёнка, акрил, пластик" },
    { category: "Стандарт", from: 1500, to: 3000, per: "погонный метр", description: "МДФ эмаль, AGT, рамочные фасады" },
    { category: "Комфорт", from: 3000, to: 5000, per: "погонный метр", description: "Крашеный МДФ, массив, шпон" },
    { category: "Премиум", from: 5000, to: 10000, per: "погонный метр", description: "Массив дерева, лак, HPL" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Управление ценами</h1>
        <p className="text-muted-foreground mt-1">Настройте ценовые диапазоны для отображения на сайте</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
          ℹ️ Цены редактируются в настройках сайта. Здесь отображается текущая сетка цен.
        </p>

        <div className="grid gap-4">
          {priceRanges.map((range) => (
            <div key={range.category} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
              <div>
                <div className="font-semibold text-foreground">{range.category}</div>
                <div className="text-sm text-muted-foreground">{range.description}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary text-lg">
                  от {range.from.toLocaleString("ru-RU")} BYN
                </div>
                <div className="text-xs text-muted-foreground">за {range.per}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-semibold text-foreground mb-3">Что входит в стоимость</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Выезд замерщика — бесплатно",
              "3D-проект в программе — бесплатно",
              "Доставка по Минску — бесплатно от 2000 BYN",
              "Сборка — включена в стоимость",
              "Гарантия — 5 лет",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
