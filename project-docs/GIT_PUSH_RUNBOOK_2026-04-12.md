# Git Push Runbook (for next chat)

## Current branch and workspace

- Branch: `work`
- Repo path: `C:\Users\User\Desktop\kuhni-na-zakaz`

Check before doing anything:

```powershell
git status --short
git branch --show-current
```

## Important: split commit scope

There are unrelated local changes in workspace.
Do not mix unrelated AI files with production security/deploy fixes.

Known relevant files for this server/security session:
- `artifacts/kuhni-na-zakaz/next.config.ts`
- `deploy/nginx/kuhni-na-zakaz.conf`
- `deploy/timeweb/README.md`
- `project-docs/NEW_CHAT_CONTEXT.md`
- `project-docs/SERVER_RUNBOOK_2026-04-12.md`
- `project-docs/GIT_PUSH_RUNBOOK_2026-04-12.md`

Potentially unrelated files:
- `scripts/package.json`
- `ai-agent-package/`
- `ai/`
- `scripts/src/ai/`

## Safe commit flow

1. Stage only relevant files:

```powershell
git add artifacts/kuhni-na-zakaz/next.config.ts
git add deploy/nginx/kuhni-na-zakaz.conf
git add deploy/timeweb/README.md
git add project-docs/NEW_CHAT_CONTEXT.md
git add project-docs/SERVER_RUNBOOK_2026-04-12.md
git add project-docs/GIT_PUSH_RUNBOOK_2026-04-12.md
```

2. Verify staged diff:

```powershell
git diff --cached
```

3. Commit:

```powershell
git commit -m "security: harden prod deployment and add handoff runbooks"
```

4. Push current branch:

```powershell
git push origin work
```

5. Open PR (via GitHub UI or gh):

```powershell
gh pr create --base main --head work --title "Security hardening + handoff runbooks" --body "Includes prod hardening, SSL/deploy docs, and incident handoff context."
```

## Post-push checklist

- Confirm PR shows only intended files.
- Ensure no secrets/tokens/host-only configs are committed.
- Add review note: temporary nginx mitigation `POST / -> 405` is intentional.

