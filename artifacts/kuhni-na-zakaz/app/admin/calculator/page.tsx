import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CalculatorTariffs } from "@/components/calculator/CalculatorTariffs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Тарифы калькулятора в метрах" };
export default async function CalculatorTariffsPage() {
  await requireAdmin();
  const rules = await prisma.priceRule.findMany({ where: { key: { startsWith: "calc_v2_" } }, select: { key: true, value: true, active: true } });
  return <div className="max-w-4xl space-y-6"><h1 className="text-2xl font-bold">Калькулятор: тарифы за погонный метр</h1><p>Цена = сумма длин сторон × (мебель + столешница + фурнитура + поправка на планировку). Все ставки — в BYN/м. Не вычитайте углы из длины: тарифы должны быть рассчитаны для суммы сторон вдоль стен.</p><p>Пустое поле означает, что тариф не опубликован. Цена появится только когда заполнены все четыре составляющие выбранной комплектации. Ноль допустим для включённой в мебель столешницы, фурнитуры и отсутствующей поправки. Корпус и фасады должны иметь положительную стоимость. Техника, доставка и монтаж отдельно.</p><p>Для типовой комплектации зафиксируйте высоту, глубину шкафов и наполнение. Перед включением цен сравните результат с реальными сметами. Сейчас можно оставить все поля пустыми — заявки продолжат работать.</p><CalculatorTariffs rules={rules} /></div>;
}
