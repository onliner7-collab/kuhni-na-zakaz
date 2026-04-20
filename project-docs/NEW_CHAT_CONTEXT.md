# New Chat Context (2026-04-12)

This file is a quick bootstrap for a new chat/agent.

## Project

- Repo: `https://github.com/onliner7-collab/kuhni-na-zakaz.git`
- Local path: `C:\Users\User\Desktop\kuhni-na-zakaz`
- Main app path: `artifacts/kuhni-na-zakaz`
- Current local branch: `work`

## What happened recently

1. Production DNS/SSL migration for:
- `kuhni.minsk.by`
- `www.kuhni.minsk.by`

2. Security incident on production host:
- malicious `xmrig`/`scanner_linux` processes were found
- incident artifacts were collected and cleanup was performed
- SSH and network hardening were applied

3. Temporary perimeter mitigation:
- nginx now returns `405` for `POST /` on production root path

## Current production status

- Canonical domain: `https://kuhni.minsk.by`
- Redirects:
  - `http://kuhni.minsk.by` -> `https://kuhni.minsk.by`
  - `http://www.kuhni.minsk.by` -> `https://kuhni.minsk.by`
  - `https://www.kuhni.minsk.by` -> `https://kuhni.minsk.by`
- SSL certificate exists for both names and is active
- App service: `kuhni-na-zakaz.service` active

## Important local git state (do not lose)

Tracked local changes:
- `artifacts/kuhni-na-zakaz/next.config.ts`
- `deploy/nginx/kuhni-na-zakaz.conf`
- `deploy/timeweb/README.md`
- `scripts/package.json` (pre-existing/unrelated for current server task)

Untracked local paths:
- `ai-agent-package/`
- `ai/`
- `scripts/src/ai/`

Before committing, separate security/deploy changes from unrelated AI work.

## Most important next tasks

1. Audit app-level root cause of prior RCE behavior (not only infra hardening).
2. Rotate all secrets in production:
- `SESSION_SECRET`
- DB credentials
- SMTP/Telegram/API keys
3. Add durable protections:
- fail2ban
- stricter nginx request rules/rate limits
- review server actions exposure and admin endpoints
4. Create clean commit(s) and open PR.

## Where to continue

- Server operation guide: `project-docs/SERVER_RUNBOOK_2026-04-12.md`
- Git and PR guide: `project-docs/GIT_PUSH_RUNBOOK_2026-04-12.md`

