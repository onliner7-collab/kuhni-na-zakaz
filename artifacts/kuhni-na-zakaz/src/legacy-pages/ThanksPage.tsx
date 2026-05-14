import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function ThanksPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">Заявка принята!</h1>
        <p className="text-muted-foreground text-lg mb-3">
          Спасибо за обращение. Мы свяжемся с вами в течение 30 минут в рабочее время.
        </p>
        <p className="text-sm text-muted-foreground mb-8">Пн–Сб 9:00–19:00, Вс 10:00–17:00</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild data-testid="btn-thanks-home">
            <Link href="/">На главную</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/portfolio">Смотреть портфолио</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
