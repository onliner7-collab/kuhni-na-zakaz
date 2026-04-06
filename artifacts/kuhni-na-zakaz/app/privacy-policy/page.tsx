import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности КухниBY.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <div className="section-padding">
      <div className="container-site max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Политика конфиденциальности</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-8">Политика конфиденциальности</h1>
        <div className="prose prose-stone max-w-none space-y-6 text-muted-foreground">
          <p>Настоящая политика конфиденциальности описывает, как КухниBY собирает, использует и защищает персональные данные пользователей сайта.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">1. Какие данные мы собираем</h2>
          <p>При заполнении форм на сайте мы получаем: имя, номер телефона, email (если указан), город, комментарий к заявке.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">2. Как мы используем данные</h2>
          <p>Данные используются для: обратной связи по заявке, подготовки коммерческого предложения, согласования замера. Мы не передаём данные третьим лицам в коммерческих целях.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">3. Хранение данных</h2>
          <p>Данные хранятся на защищённых серверах. Срок хранения — не более 3 лет с момента последнего взаимодействия.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">4. Права пользователя</h2>
          <p>Вы вправе запросить удаление своих данных. Для этого обратитесь по email: info@kuhniby.by</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">5. Контакты</h2>
          <p>КухниBY | info@kuhniby.by | +375 (29) 123-45-67</p>
        </div>
      </div>
    </div>
  );
}
