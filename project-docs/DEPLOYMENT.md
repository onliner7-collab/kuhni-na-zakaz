# Деплой

## Локальный запуск (Replit)

```bash
pnpm install
pnpm --filter @workspace/kuhni-na-zakaz run dev
```

Сайт доступен на порту из переменной окружения PORT.

## Переменные окружения

Создайте `.env` в корне проекта:

```env
# Сайт
VITE_SITE_URL=https://yourdomain.by
VITE_PHONE=+375291234567
VITE_EMAIL=info@kuhni.by

# Формы
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_TELEGRAM_CHAT_ID=your_chat_id

# База данных (для бэкенда)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Сессия
SESSION_SECRET=your_secret_key
```

## Сборка для продакшена

```bash
pnpm --filter @workspace/kuhni-na-zakaz run build
# Файлы в: artifacts/kuhni-na-zakaz/dist/
```

## Деплой на VPS/VDS

### nginx конфигурация

```nginx
server {
    listen 80;
    server_name yourdomain.by www.yourdomain.by;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.by;

    ssl_certificate /etc/letsencrypt/live/yourdomain.by/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.by/privkey.pem;

    root /var/www/kuhni/dist/public;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## GitHub Flow

```
main    — продакшн (только merge через PR)
dev     — основная разработка
feature/название — новые фичи
fix/название — исправления
```

## Push в GitHub (по команде пользователя)

```bash
git init
git remote add origin https://github.com/onliner7-collab/kuhni-na-zakaz.git
git add .
git commit -m "docs: add project documentation and development rules"
git push -u origin main
```
