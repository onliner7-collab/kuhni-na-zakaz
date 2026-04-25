# Production Security Runbook

Use this after any suspected server compromise or unexplained production behavior.

## Immediate containment

1. Stop unexpected processes and preserve a minimal backup of evidence.
2. Verify the public site and the local app port both return `200`.
3. Check `systemctl status kuhni-na-zakaz` and `journalctl -u kuhni-na-zakaz -n 200`.
4. Confirm `fail2ban` and the firewall are active.

## Secret rotation

Current production layout:

- systemd reads env from `/etc/kuhni-na-zakaz.env`
- `/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/.env` should be a symlink to `/etc/kuhni-na-zakaz.env`

Minimum secrets to rotate:

- `SESSION_SECRET`
- PostgreSQL password used in `DATABASE_URL`
- Telegram bot token and chat bindings if Telegram notifications are enabled
- SMTP credentials if email notifications are enabled
- SSH keys or passwords if there is any doubt about shell access

Expected side effects:

- rotating `SESSION_SECRET` signs out all active admin sessions
- rotating the PostgreSQL password requires updating `/etc/kuhni-na-zakaz.env` before restarting the service
- rotating Telegram or SMTP credentials may temporarily disable notifications until the new values are saved

## Deployment checks

1. `systemctl cat kuhni-na-zakaz`
2. `stat -c '%a %U:%G %n' /etc/kuhni-na-zakaz.env`
3. `stat -c '%a %U:%G %N' /var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/.env`
4. `curl -I https://kuhni.minsk.by`

## Follow-up hardening

1. Rebuild or reprovision the VPS if compromise is confirmed.
2. Audit public write endpoints and all admin APIs before reopening access.
3. Keep production secrets outside the repository tree.
4. Avoid world-readable secret files; the env file should stay limited to the service account path.
