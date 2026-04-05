import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description: "Согласие на обработку персональных данных на сайте КухниMinsk.",
  alternates: { canonical: "/personal-data" },
};

export default function PersonalDataPage() {
  return (
    <div className="section-padding">
      <div className="container-site max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Персональные данные</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-8">Согласие на обработку персональных данных</h1>
        <div className="prose prose-stone max-w-none space-y-6 text-muted-foreground">
          <p>Заполняя формы на сайте kuhniminsk.by, вы даёте согласие на обработку своих персональных данных в соответствии с законодательством Республики Беларусь о защите персональных данных.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">Цели обработки</h2>
          <ul><li>Обратная связь по заявке</li><li>Подготовка коммерческого предложения</li><li>Информирование об акциях (если вы дали согласие)</li></ul>
          <h2 className="font-serif text-xl font-semibold text-foreground">Права субъекта данных</h2>
          <p>Вы можете в любое время отозвать согласие, обратившись по email: info@kuhniminsk.by или по телефону +375 (29) 123-45-67.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">Оператор персональных данных</h2>
          <p>КухниMinsk, г. Минск, ул. Притыцкого, 100. УНП 000000000.</p>
        </div>
      </div>
    </div>
  );
}
