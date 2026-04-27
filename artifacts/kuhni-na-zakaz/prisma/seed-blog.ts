import { PrismaClient } from "@prisma/client";
import { BLOG_POSTS } from "../lib/blog-static";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding blog posts...");
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`  ✅ ${post.slug}`);
  }
  console.log("🎉 Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
