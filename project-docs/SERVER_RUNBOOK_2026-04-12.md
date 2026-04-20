# Server Runbook (Production)

## Host and access

- Host IP: `5.42.108.140`
- Typical user used in ops: `root`
- SSH key used from local machine: `C:\Users\User\.ssh\timeweb_kuhni_ed25519`

Example connect:

```powershell
ssh -i $env:USERPROFILE\.ssh\timeweb_kuhni_ed25519 root@5.42.108.140
```

## App/service layout

- Repo on server: `/var/www/kuhni-na-zakaz`
- App runtime dir: `/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz`
- Systemd service: `kuhni-na-zakaz.service`
- Nginx site file: `/etc/nginx/sites-available/kuhni-na-zakaz`
- Enabled symlink: `/etc/nginx/sites-enabled/kuhni-na-zakaz`

## Quick health checks

```bash
systemctl is-active kuhni-na-zakaz
systemctl is-active nginx
ss -tulpen | grep -E ':22|:80|:443|:3001'
curl -I https://kuhni.minsk.by
curl -I https://www.kuhni.minsk.by
```

Expected:
- `https://kuhni.minsk.by` -> `200`
- `https://www.kuhni.minsk.by` -> `301` to canonical

## Security/hardening state applied

- SSH:
  - `PasswordAuthentication no`
  - `PermitRootLogin prohibit-password`
  - `KbdInteractiveAuthentication no`
- App bound to localhost via systemd env:
  - `HOST=127.0.0.1`
  - `PORT=3001`
- UFW:
  - OpenSSH + Nginx Full
  - rate limit on `22/tcp`
  - specific deny for prior attacker IP `202.58.242.243`
- Nginx temporary mitigation:
  - `POST /` returns `405` on canonical host

## Incident artifacts

Forensics folder created:

- `/root/incident-20260412T082156Z`

Contains logs and snapshots collected during incident response.

## Clean rebuild procedure (if compromise suspected again)

```bash
systemctl stop kuhni-na-zakaz
pkill -9 -f 'xmrig-6.21.0/xmrig' || true
pkill -9 -f '/scanner_linux' || true

cd /var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz
rm -rf .next node_modules
rm -rf xmrig-6.21.0
rm -f xmrig.tar.gz scanner_linux data.log monitor.log exploited.log failed.log scanner_deployed.log

sudo -u kuhni bash -lc "cd /var/www/kuhni-na-zakaz && pnpm install --frozen-lockfile"
sudo -u kuhni bash -lc "cd /var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz && pnpm run build"

systemctl start kuhni-na-zakaz
systemctl is-active kuhni-na-zakaz
```

## Deploy/update app from git

```bash
cd /var/www/kuhni-na-zakaz
sudo -u kuhni git fetch origin
sudo -u kuhni git checkout work
sudo -u kuhni git pull --ff-only origin work

sudo -u kuhni bash -lc "cd /var/www/kuhni-na-zakaz && pnpm install --frozen-lockfile"
sudo -u kuhni bash -lc "cd /var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz && pnpm run build"

systemctl restart kuhni-na-zakaz
```

## SSL notes

Current LE certificate path:
- `/etc/letsencrypt/live/kuhni.minsk.by/fullchain.pem`
- `/etc/letsencrypt/live/kuhni.minsk.by/privkey.pem`

Re-issue/expand if needed:

```bash
certbot --nginx --non-interactive --agree-tos --expand --cert-name kuhni.minsk.by -d kuhni.minsk.by -d www.kuhni.minsk.by
```

