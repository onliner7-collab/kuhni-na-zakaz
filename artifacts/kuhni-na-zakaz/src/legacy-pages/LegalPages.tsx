import { Link } from "wouter";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/data";

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-muted-foreground mb-8">
      <ol className="flex flex-wrap gap-1 items-center">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {item.href ? <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link> : <span className="text-foreground">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Политика конфиденциальности" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-neutral max-w-none">
        <h1 className="text-3xl font-bold font-serif mb-6">Политика конфиденциальности</h1>
        <p className="text-muted-foreground">Дата вступления в силу: 1 января 2025 г.</p>
        <p>Настоящая политика конфиденциальности описывает, как {SITE_CONFIG.name} собирает, использует и защищает персональные данные пользователей сайта.</p>
        <h2 className="font-serif">1. Какие данные мы собираем</h2>
        <p>Мы собираем данные, которые вы добровольно предоставляете при заполнении форм: имя, номер телефона, email, комментарий.</p>
        <h2 className="font-serif">2. Как мы используем данные</h2>
        <p>Данные используются исключительно для связи с вами по вашему запросу. Мы не передаём данные третьим лицам без вашего согласия.</p>
        <h2 className="font-serif">3. Хранение данных</h2>
        <p>Данные хранятся на защищённых серверах и удаляются по вашему запросу.</p>
        <h2 className="font-serif">4. Контакты</h2>
        <p>По вопросам конфиденциальности: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
      </motion.div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Условия использования" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-neutral max-w-none">
        <h1 className="text-3xl font-bold font-serif mb-6">Условия использования сайта</h1>
        <p className="text-muted-foreground">Дата вступления в силу: 1 января 2025 г.</p>
        <p>Используя данный сайт, вы соглашаетесь с настоящими условиями использования.</p>
        <h2 className="font-serif">1. Использование сайта</h2>
        <p>Сайт предоставляется в информационных целях. Вся информация на сайте является актуальной на момент публикации.</p>
        <h2 className="font-serif">2. Интеллектуальная собственность</h2>
        <p>Все материалы сайта (тексты, фото, дизайн) являются собственностью {SITE_CONFIG.name}.</p>
        <h2 className="font-serif">3. Контакты</h2>
        <p>По вопросам: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
      </motion.div>
    </div>
  );
}

export function PersonalDataPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Согласие на обработку данных" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-neutral max-w-none">
        <h1 className="text-3xl font-bold font-serif mb-6">Согласие на обработку персональных данных</h1>
        <p>Нажимая кнопку «Отправить заявку» или «Получить расчёт», вы даёте согласие {SITE_CONFIG.name} на обработку ваших персональных данных в соответствии с Законом Республики Беларусь «О защите персональных данных».</p>
        <h2 className="font-serif">Цель обработки</h2>
        <p>Обработка данных осуществляется исключительно с целью обработки вашего обращения и предоставления запрошенных услуг.</p>
        <h2 className="font-serif">Ваши права</h2>
        <p>Вы вправе отозвать своё согласие в любой момент, направив запрос на email: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
      </motion.div>
    </div>
  );
}
