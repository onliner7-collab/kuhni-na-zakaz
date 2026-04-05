import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Города — Админ" };

const LOCATIONS = [
  { name: "Минск", slug: "minsk", description: "Кухни на заказ в Минске" },
  { name: "Минский район", slug: "minskiy-rayon", description: "Кухни на заказ в Минском районе" },
  { name: "Борисов", slug: "borisov", description: "Кухни на заказ в Борисове" },
  { name: "Жодино", slug: "zhodino", description: "Кухни на заказ в Жодино" },
  { name: "Молодечно", slug: "molodechno", description: "Кухни на заказ в Молодечно" },
  { name: "Солигорск", slug: "soligorsk", description: "Кухни на заказ в Солигорске" },
  { name: "Слуцк", slug: "slutsk", description: "Кухни на заказ в Слуцке" },
  { name: "Дзержинск", slug: "dzerzhinsk", description: "Кухни на заказ в Дзержинске" },
];

export default async function AdminLocationsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Города и регионы</h1>
        <p className="text-muted-foreground mt-1">SEO-страницы по городам Минской области</p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
          <p className="text-sm text-amber-700">
            ℹ️ Страницы городов автоматически генерируются. Для редактирования контента используйте файлы в директории <code className="font-mono">app/locations/</code>.
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-foreground">Город</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">URL</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">SEO заголовок</th>
              <th className="text-right px-4 py-3 font-medium text-foreground">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {LOCATIONS.map((loc) => (
              <tr key={loc.slug} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{loc.name}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">/locations/{loc.slug}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{loc.description}</td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/locations/${loc.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"
                    title="Открыть страницу"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
