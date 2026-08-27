/*
 * Создаёт отдельную копию листа "01_Семантика" и назначает владельца каждому
 * запросу. Исходный файл никогда не меняется.
 * Запуск: pnpm tsx scripts/assign-semantic-owners.ts "C:\\путь\\семантика.xlsx" "C:\\путь\\результат.xlsx"
 */
import * as XLSX from "xlsx";
import { existsSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Передайте исходный и выходной пути к XLSX.");
if (!existsSync(input)) throw new Error(`Исходный XLSX не найден: ${input}`);

const workbook = XLSX.readFile(input, { cellDates: false });
const sheet = workbook.Sheets["01_Семантика"];
if (!sheet) throw new Error('В книге нет листа "01_Семантика".');
const sourceRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
const headers = sourceRows[0].map(String);
const rows = sourceRows.slice(1);
if (rows.length !== 6307) throw new Error(`Ожидалось 6 307 строк, получено ${rows.length}.`);
const column = (name: string) => headers.indexOf(name);
const queryColumn = column("Ключевая фраза");
const clusterColumn = column("Кластер");
const geoColumn = column("Гео");

const cities: Record<string, string> = { минск: "minsk", борисов: "borisov", жодино: "zhodino", молодечно: "molodechno", солигорск: "soligorsk", слуцк: "slutsk", фанипол: "fanipol", смолевич: "smolevichi", дзержинск: "dzerzhinsk", заславл: "zaslavl", логойск: "logoisk", вилейк: "vileyka", несвиж: "nesvizh", березин: "berezino", воложин: "volozhin", столбц: "stolbtsy", узд: "uzda", червен: "cherven", марьин: "maryina-gorka", клецк: "kletsk", копыл: "kopyl", крупк: "krupki", любан: "lyuban", мядел: "myadel", "старые дороги": "starye-dorogi", брест: "brest", витебск: "vitebsk", гомел: "gomel", гродно: "grodno", могил: "mogilev" };
const materialRules: Array<[RegExp, string]> = [[/\bлдсп\b/i, "/materials/ldsp"], [/мдф.*эмал|эмаль/i, "/materials/mdf-emal"], [/\bмдф\b/i, "/materials/mdf-fasady"], [/hpl|пластик/i, "/materials/plastik-hpl"], [/шпон/i, "/materials/shpon"], [/акрил/i, "/materials/akril"], [/фурнитур|blum|hettich|gtv/i, "/materials/furnitura"]];
const styleRules: Array<[RegExp, string]> = [[/минимал/i, "/styles/minimalizm"], [/лофт/i, "/styles/loft"], [/неокласс/i, "/styles/neoklassika"], [/скандинав/i, "/styles/skandinavskie"], [/классич/i, "/styles/klassicheskie"], [/прованс/i, "/styles/provans"], [/хай[ -]?тек/i, "/styles/hay-tek"], [/современн|модерн/i, "/styles/sovremennye"]];
const articleRules: Array<[RegExp, string]> = [[/углов.*прям|прям.*углов/i, "/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat"], [/углов.*размер/i, "/blog/uglovaya-kuhnya-razmery-planirovka"], [/п-?образ.*(размер|проход)/i, "/blog/p-obraznaya-kuhnya-razmery-prohody-cena"], [/остров.*(размер|нуж)/i, "/blog/kuhnya-s-ostrovom"], [/потолк.*(плюс|минус|цен)/i, "/blog/kuhnya-do-potolka-plyusy-minusy-cena"], [/хрущ|6 кв/i, "/blog/kuhnya-6-kv-m-v-hruschevke"], [/маленьк.*квартир/i, "/blog/kuhnya-dlya-malenkoy-kvartiry"], [/частн.*дом/i, "/blog/kuhnya-dlya-chastnogo-doma-planirovka-hranenie-tehnika"], [/новостройк/i, "/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera"], [/встроенн.*техник/i, "/blog/kuhnya-pod-vstroennuyu-tehniku"], [/подготов.*замер/i, "/blog/kak-podgotovitsya-k-zameru-kuhni"], [/входит.*стоимост/i, "/blog/chto-vhodit-v-stoimost-kuhni-na-zakaz"], [/бюджет/i, "/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh"], [/ошибк.*договор/i, "/blog/oshibki-pri-zakaze-kuhni-15-punktov-pered-dogovorom"], [/готов.*или.*заказ/i, "/blog/kuhnya-na-zakaz-ili-gotovaya-chto-vygodnee"], [/blum|hettich|gtv/i, "/blog/kuhni-blum-hettich-gtv"], [/материал.*кухн/i, "/blog/kak-vybrat-materialy-dlya-kuhni"], [/выбрать.*кухн/i, "/blog/kak-vybrat-kuhnyu"]];
function value(row: unknown[]) { return String(row[queryColumn] || "").toLowerCase(); }
function assign(query: string, cluster: string, geo: string) {
  if (cluster === "Гео область" || geo.toLowerCase().includes("минская область")) return ["/locations/minskaya-oblast", "owner", "транзакционный", "оставить", "Региональный гео-коммерческий спрос закреплён за страницей области."];
  if (/массив|fenix|кварц|искусственн.*кам/i.test(query)) return ["/materials", "gap", "коммерческий", "проверить спрос", "Материал не подтверждён ассортиментом; временный честный хаб."];
  if (/\b(бел|сер|черн|беж|зел|син|графит|светл|темн|двухцвет|древесн)/i.test(query)) return ["/styles", "owner", "коммерческий", "добавить блок/фильтр", "Цвет ведёт в интерактивный хаб без цветовых дублей."];
  if (/доставк|монтаж|сборк|установк/i.test(query)) return ["/delivery-installation", "owner", "коммерческий", "переназначить", "Сервисный интент закреплён за профильной страницей."];
  if (/3d|дизайн.?проект/i.test(query)) return ["/design-proekt-kuhni", "owner", "коммерческий", "переназначить", "Проектирование не конкурирует с каталогом и геостраницами."];
  if (/рассчит|калькулятор/i.test(query)) return ["/calculator", "owner", "транзакционный", "переназначить", "Предварительный расчёт ведёт в калькулятор."];
  if (/цен|стоимост|рассроч/i.test(query)) return ["/prices", "owner", "коммерческий", "переназначить", "Ценовой интент закреплён за страницей цен."];
  if (cluster === "Информационный спрос") { for (const [re, url] of articleRules) if (re.test(query)) return [url, "owner", "информационный", "переназначить", "Точный информационный вопрос закреплён за профильной статьёй."]; return ["/blog", "owner", "информационный", "оставить", "Блог остаётся навигационным хабом для общего информационного спроса."]; }
  for (const [re, url] of materialRules) if (re.test(query)) return [url, "owner", "коммерческий", "переназначить", "Материальный кластер имеет профильного владельца."];
  for (const [re, url] of styleRules) if (re.test(query)) return [url, "owner", "коммерческий", "переназначить", "Стилевой кластер имеет профильного владельца."];
  if (/углов|г-?образ/i.test(query)) return ["/catalog/uglovye-kuhni", "owner", "коммерческий", "переназначить", "Угловая и Г-образная формы объединены."];
  if (/прям|линейн/i.test(query)) return ["/catalog/pryamye-kuhni", "owner", "коммерческий", "переназначить", "Прямая и линейная формы объединены."];
  if (/п-?образ|u-?образ/i.test(query)) return ["/catalog/p-obraznye-kuhni", "owner", "коммерческий", "переназначить", "П- и U-образные формы объединены."];
  if (/остров|полуостров/i.test(query)) return ["/catalog/kuhni-s-ostrovom", "owner", "коммерческий", "переназначить", "Остров и полуостров ведут к единой категории."];
  if (/маленьк|хрущ/i.test(query)) return ["/catalog/malenkie-kuhni", "owner", "коммерческий", "переназначить", "Коммерческий интент маленькой кухни закреплён за категорией."];
  if (/потолк|трехъярус|трёхъярус/i.test(query)) return ["/catalog/kuhni-do-potolka", "owner", "коммерческий", "переназначить", "Высокие секции ведут в профильную категорию."];
  if (/без руч/i.test(query)) return ["/catalog/kuhni-bez-ruchek", "owner", "коммерческий", "переназначить", "Механизм без ручек закреплён за категорией."];
  for (const [name, slug] of Object.entries(cities)) if (query.includes(name) && /купить|заказ|на заказ|изготов/i.test(query)) return [`/locations/${slug}`, "owner", "транзакционный", "оставить", "Геостраница владеет только базовым гео-коммерческим спросом."];
  if (/как |какие |что |сколько |почему |зачем /i.test(query)) return ["/blog", "support", "информационный", "проверить спрос", "Точный вопрос требует профильной статьи; назначение уточняется редактором."];
  return ["/catalog", "gap", "коммерческий", "проверить спрос", "Кластер не имеет точного подтверждённого владельца; временный хаб без новой посадочной."];
}
const outputSheet: XLSX.WorkSheet = JSON.parse(JSON.stringify(sheet));
const addedHeaders = ["Новый основной URL", "Тип роли", "Интент", "Действие", "Причина"];
const templateColumn = 8;
for (let rowIndex = 0; rowIndex <= rows.length; rowIndex += 1) {
  const sourceAddress = XLSX.utils.encode_cell({ r: rowIndex, c: templateColumn });
  const source = outputSheet[sourceAddress];
  const values = rowIndex === 0
    ? addedHeaders
    : assign(value(rows[rowIndex - 1]), String(rows[rowIndex - 1][clusterColumn] || ""), String(rows[rowIndex - 1][geoColumn] || ""));
  for (let offset = 0; offset < addedHeaders.length; offset += 1) {
    const address = XLSX.utils.encode_cell({ r: rowIndex, c: headers.length + offset });
    outputSheet[address] = {
      v: values[offset],
      t: "s",
      ...(source?.s ? { s: JSON.parse(JSON.stringify(source.s)) } : {}),
    };
  }
}
const range = XLSX.utils.decode_range(outputSheet["!ref"] || "A1:I1");
range.e.c = headers.length + addedHeaders.length - 1;
outputSheet["!ref"] = XLSX.utils.encode_range(range);
const sourceWidth = outputSheet["!cols"]?.[templateColumn] || { wch: 24 };
outputSheet["!cols"] = [...(outputSheet["!cols"] || []), ...addedHeaders.map(() => ({ ...sourceWidth, wch: 28 }))];
workbook.Sheets["01_Семантика — владельцы"] = outputSheet;
workbook.SheetNames.push("01_Семантика — владельцы");
XLSX.writeFile(workbook, output);
console.log(JSON.stringify({ rows: rows.length, output }, null, 2));
