import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft } from "lucide-react";
import { BLOG_POSTS } from "@/lib/data";

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

export function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "Р‘Р»РѕРі" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Р‘Р»РѕРі Рѕ РєСѓС…РЅСЏС…</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          РџРѕР»РµР·РЅС‹Рµ СЃРѕРІРµС‚С‹, СЂРµР°Р»СЊРЅС‹Рµ С†РёС„СЂС‹ Рё С‡РµСЃС‚РЅС‹Р№ СЂР°Р·Р±РѕСЂ РјР°С‚РµСЂРёР°Р»РѕРІ вЂ” Р±РµР· РІРѕРґС‹.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BLOG_POSTS.map((post, i) => (
          <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={`/blog/${post.slug}`}>
              <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-blog-${post.slug}`}>
                <div className="h-44 bg-secondary rounded-t-xl" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime} РјРёРЅ
                    </span>
                  </div>
                  <h2 className="font-bold text-lg font-serif mb-2 group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground mt-3">{new Date(post.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold font-serif mb-4">РЎС‚Р°С‚СЊСЏ РЅРµ РЅР°Р№РґРµРЅР°</h1>
        <Button asChild><Link href="/blog">Рљ Р±Р»РѕРіСѓ</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumb items={[
        { label: "Р“Р»Р°РІРЅР°СЏ", href: "/" },
        { label: "Р‘Р»РѕРі", href: "/blog" },
        { label: post.title },
      ]} />
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Р’СЃРµ СЃС‚Р°С‚СЊРё
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readTime} РјРёРЅ С‡С‚РµРЅРёСЏ
          </span>
          <span className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-6">{post.title}</h1>
        <div className="bg-secondary rounded-2xl h-64 mb-8" />
        <div className="prose prose-neutral max-w-none">
          <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
          <p>РЎРѕРґРµСЂР¶РёРјРѕРµ СЃС‚Р°С‚СЊРё Р±СѓРґРµС‚ РґРѕР±Р°РІР»РµРЅРѕ С‡РµСЂРµР· Р°РґРјРёРЅРёСЃС‚СЂР°С‚РёРІРЅСѓСЋ РїР°РЅРµР»СЊ. Р—РґРµСЃСЊ Р±СѓРґРµС‚ РїРѕР»РЅС‹Р№ С‚РµРєСЃС‚ СЃ СЃРѕРІРµС‚Р°РјРё, СЂРµР°Р»СЊРЅС‹РјРё РїСЂРёРјРµСЂР°РјРё Рё РєРѕРЅРєСЂРµС‚РЅС‹РјРё СЂРµРєРѕРјРµРЅРґР°С†РёСЏРјРё.</p>
          <h2>Р§С‚Рѕ РІР°Р¶РЅРѕ Р·РЅР°С‚СЊ РїРµСЂРµРґ Р·Р°РєР°Р·РѕРј</h2>
          <p>РљСѓС…РЅСЏ РЅР° Р·Р°РєР°Р· вЂ” СЃРµСЂСЊС‘Р·РЅРѕРµ СЂРµС€РµРЅРёРµ. РџСЂР°РІРёР»СЊРЅС‹Р№ РІС‹Р±РѕСЂ РїРѕРјРѕР¶РµС‚ РёР·Р±РµР¶Р°С‚СЊ РѕС€РёР±РѕРє, РєРѕС‚РѕСЂС‹Рµ СЃС‚РѕСЏС‚ РІСЂРµРјРµРЅРё Рё РґРµРЅРµРі.</p>
        </div>
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <h3 className="font-bold font-serif text-xl mb-2">РќСѓР¶РЅР° РєРѕРЅСЃСѓР»СЊС‚Р°С†РёСЏ?</h3>
          <p className="text-muted-foreground text-sm mb-4">Р‘РµСЃРїР»Р°С‚РЅРѕ РѕС‚РІРµС‚РёРј РЅР° РІРѕРїСЂРѕСЃС‹ Рё РїРѕРјРѕР¶РµРј РїРѕРґРѕР±СЂР°С‚СЊ СЂРµС€РµРЅРёРµ РїРѕРґ РІР°С€ Р±СЋРґР¶РµС‚.</p>
          <Button asChild data-testid="btn-blog-cta">
            <Link href="/contacts">РџРѕР»СѓС‡РёС‚СЊ РєРѕРЅСЃСѓР»СЊС‚Р°С†РёСЋ</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default BlogPage;

