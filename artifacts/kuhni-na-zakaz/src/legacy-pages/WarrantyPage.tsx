import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield } from "lucide-react";

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

export function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Гарантия" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Гарантия на кухни</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Мы несём ответственность за качество своей работы. Все условия прописываются в договоре.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "2 года", desc: "Гарантия на корпус и фасады", icon: <Shield className="w-8 h-8 text-primary" /> },
            { title: "5 лет", desc: "Гарантия на фурнитуру Blum", icon: <Shield className="w-8 h-8 text-primary" /> },
            { title: "1 год", desc: "Гарантия на монтажные работы", icon: <Shield className="w-8 h-8 text-primary" /> },
          ].map((item, i) => (
            <div key={i} className="text-center p-8 bg-secondary/30 rounded-2xl">
              <div className="mb-3 flex justify-center">{item.icon}</div>
              <div className="text-3xl font-bold text-primary mb-1">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold font-serif mb-6">Что входит в гарантийное обслуживание</h2>
          <ul className="space-y-3">
            {[
              "Бесплатная регулировка петель и направляющих",
              "Замена дефектных фасадов или фурнитуры",
              "Устранение производственных дефектов",
              "Консультация мастера по уходу",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold font-serif mb-2">Вопросы по гарантии?</h2>
          <p className="text-muted-foreground mb-4">Звоните или пишите — поможем разобраться.</p>
          <Button asChild data-testid="btn-warranty-cta">
            <Link href="/contacts">Связаться</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
