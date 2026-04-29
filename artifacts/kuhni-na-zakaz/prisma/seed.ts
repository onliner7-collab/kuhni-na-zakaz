import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create super admin
  const existing = await prisma.user.findUnique({ where: { email: "admin@kuhniminsk.by" } });
  if (!existing) {
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    await prisma.user.create({
      data: {
        email: "admin@kuhniminsk.by",
        name: "Администратор",
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });
    console.log("✅ Super Admin created: admin@kuhniminsk.by / Admin123!");
  } else {
    console.log("ℹ️  Super Admin already exists");
  }

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: "КухниBY",
      phone: "+375296261547",
      phoneDisplay: "+375 (29) 626-15-47",
      email: "onliner7@gmail.com",
      address: "222520, г. Борисов, ул. Дзержинского, д. 90, каб. 1а",
      workingHours: "Пн-Сб 9:00-19:00, Вс 10:00-17:00",
    },
    update: {},
  });

  // FAQs
  const existingFaqs = await prisma.fAQItem.count();
  if (existingFaqs === 0) {
    await prisma.fAQItem.createMany({
      data: [
        { question: "Сколько стоит кухня на заказ?", answer: "Стоимость кухни зависит от площади, материалов и фурнитуры. Прямая кухня — от 1 200 BYN, угловая — от 1 800 BYN. Точный расчёт — после замера.", page: "home", order: 1 },
        { question: "Как долго изготавливается кухня?", answer: "Стандартная кухня из МДФ — 14–21 день. Кухня из эмали или шпона — 21–30 дней. Срок фиксируется в договоре.", page: "home", order: 2 },
        { question: "Замер действительно бесплатный?", answer: "Да, замер бесплатный и ни к чему вас не обязывает. Выезжаем в день обращения или в удобное для вас время.", page: "home", order: 3 },
        { question: "Вы работаете в Минской области?", answer: "Да, работаем в Борисове, Молодечно, Жодино, Солигорске, Слуцке и других городах. Стоимость доставки — от 50 BYN.", page: "home", order: 4 },
        { question: "Какая гарантия?", answer: "5 лет на фурнитуру Blum, 2 года на корпус и фасады, 1 год на монтажные работы.", page: "home", order: 5 },
        { question: "Можно ли заказать кухню по своим размерам?", answer: "Все кухни изготавливаются строго по вашим размерам. Нестандартные высоты потолков, ниши, колонны — учитываем всё.", page: "home", order: 6 },
        { question: "Как заключается договор?", answer: "Договор подписывается после согласования проекта и утверждения цены. Предоплата — 50%, остаток — после сдачи.", page: "home", order: 7 },
        { question: "Вы убираете за собой после монтажа?", answer: "Да, убираем строительный мусор и упаковку. Сдаём кухню в рабочем состоянии.", page: "home", order: 8 },
      ],
    });
    console.log("✅ FAQs created");
  }

  // Sample reviews
  const reviewsCount = await prisma.review.count();
  if (reviewsCount === 0) {
    await prisma.review.createMany({
      data: [
        { name: "Анна Ковалёва", city: "Минск", rating: 5, text: "Заказывали угловую кухню в Сухарево. Монтаж прошёл за один день, убрали за собой. Прошло полгода — всё держится, петли не провисли.", date: "Март 2025", status: "PUBLISHED" },
        { name: "Дмитрий Лебедев", city: "Борисов", rating: 5, text: "Сделали за 20 дней как и говорили. Качество хорошее. Взяли здесь потому что назвали конкретную цену сразу — без звёздочек.", date: "Январь 2025", status: "PUBLISHED" },
        { name: "Елена Мороз", city: "Минск", rating: 5, text: "Нетиповые потолки 2,85 м. Сделали фасады до потолка, смотрится здорово. Довольна полностью.", date: "Ноябрь 2024", status: "PUBLISHED" },
        { name: "Игорь Степанов", city: "Молодечно", rating: 4, text: "Кухня в частный дом, П-образная, 4 п.м. Сделали качественно. Монтаж немного затянулся, но предупредили заранее.", date: "Октябрь 2024", status: "PUBLISHED" },
        { name: "Марина Соколова", city: "Минск", rating: 5, text: "Маленькая кухня для студии, 2 погонных метра. Всё продумано до мелочей. Трансформируемая столешница — вообще находка.", date: "Сентябрь 2024", status: "PUBLISHED" },
      ],
    });
    console.log("✅ Reviews seeded");
  }

  console.log("🎉 Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
