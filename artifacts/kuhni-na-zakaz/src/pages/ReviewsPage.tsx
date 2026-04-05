import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle } from "lucide-react";
import { REVIEWS } from "@/lib/data";

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
      ))}
    </div>
  );
}

export function ReviewsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setLocation("/thanks"), 2000);
  };

  const avgRating = (REVIEWS.reduce((acc, r) => acc + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Отзывы" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Отзывы клиентов</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
          Только реальные отзывы от людей, которые заказали у нас кухню.
        </p>
      </motion.div>

      {/* Общий рейтинг */}
      <div className="flex items-center gap-6 mb-12 p-6 bg-secondary/30 rounded-2xl w-fit">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-1">{avgRating}</div>
          <StarRating rating={5} />
          <p className="text-xs text-muted-foreground mt-1">{REVIEWS.length} отзывов</p>
        </div>
        <div className="h-16 w-px bg-border" />
        <div className="space-y-1">
          {[5, 4, 3].map(r => (
            <div key={r} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right">{r}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-2 bg-yellow-400 rounded-full"
                  style={{ width: `${(REVIEWS.filter(rev => rev.rating === r).length / REVIEWS.length) * 100}%` }}
                />
              </div>
              <span className="text-muted-foreground">{REVIEWS.filter(rev => rev.rating === r).length}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {REVIEWS.map((review, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="h-full" data-testid={`card-review-${i}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{review.name}</p>
                      <CheckCircle className="w-4 h-4 text-primary" title="Верифицированный клиент" />
                    </div>
                    <p className="text-sm text-muted-foreground">{review.city} · {review.date}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{review.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Форма отзыва */}
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold font-serif mb-6 text-center">Оставить отзыв</h2>
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="font-semibold">Спасибо за отзыв!</p>
            <p className="text-sm text-muted-foreground">Он появится после проверки модератором.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Ваша оценка</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRating(r)}
                    className="focus:outline-none"
                    data-testid={`btn-rating-${r}`}
                  >
                    <Star className={`w-8 h-8 transition-colors ${r <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Имя</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Иван"
                className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-review-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Телефон (для верификации)</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+375 (29) 000-00-00"
                className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-review-phone"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ваш отзыв</label>
              <textarea
                required
                rows={4}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Расскажите о вашем опыте..."
                className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                data-testid="textarea-review-text"
              />
            </div>
            <p className="text-xs text-muted-foreground">Отзыв будет опубликован после проверки модератором</p>
            <Button type="submit" className="w-full" size="lg" data-testid="btn-review-submit">
              Отправить отзыв
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
