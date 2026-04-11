# Release Checklist

## Before first push

- Confirm `.env` is not tracked
- Confirm local logs are ignored
- Confirm local database files are ignored
- Confirm production templates exist in `deploy/`

## Before deployment

- Set production `DATABASE_URL`
- Set strong `SESSION_SECRET`
- Set real `NEXT_PUBLIC_SITE_URL`
- Run `pnpm install`
- Run `pnpm exec prisma db push`
- Run required seeds
- Run `pnpm run build`
- Keep in mind: current `next build` ignores TypeScript build errors until legacy typing debt is cleaned up

## After deployment

- Open `/`
- Open `/contacts`
- Open `/blog`
- Open one location page
- Log into `/admin/login`
- Create a test lead
- Confirm lead appears in admin/API

## SEO baseline after deployment

- Add site to Google Search Console
- Add site to Yandex Webmaster
- Submit sitemap
- Verify robots.txt
- Verify canonical URLs
- Verify title and description on priority pages
- Add `GOOGLE_SITE_VERIFICATION` and `YANDEX_VERIFICATION` to production `.env` after consoles are created
