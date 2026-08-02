# General rollout — stage 7B

- Scope: 8 material routes.
- Runtime commit: `2af3575e5c96f4f818bc4426f45f175ddc8221fa`.
- Local Playwright: 47/47 PASS.
- Production HTTPS: 8/8 HTTP 200.
- Production Playwright via SSH tunnel: 3/3 PASS.
- Lighthouse: `/materials` 100/100/100, `/materials/shpon` 100/96/100; LCP 1561/1579 ms.
- Media: existing route-specific WebP reused; generated assets required: 0.
- Rollback: revert runtime commit, push `work`, rerun deploy script.

Result: `STAGE_7B_ACCEPTED`.
