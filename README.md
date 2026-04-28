# ref.baily.life

Cloudflare Pages migration of the old VPS `van-nav` referral/navigation page.

## Status

- Source VPS service: `/home/ubuntu/van-nav` with SQLite data at `/home/ubuntu/van-nav-data/nav.db`.
- Local project: `ref-baily-life`.
- Cloudflare Pages project: `ref-baily-life`.
- Pages domain: `ref-baily-life-3jk.pages.dev`.
- Custom domain: `https://ref.baily.life`.
- D1 database: `ref-baily-life` (`d3f9e267-0012-4b2e-80fa-6b1459881ac6`).
- Admin route: `/admin`.
- CRM sync: `https://crm.baily.life/api/users/upsert`, with `product` / `source` set to `refer`.

## Deployment

Local secrets live in `.dev.vars` and are ignored by git. Production secrets are managed in Cloudflare Pages.

```bash
npm run check
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare --project-name ref-baily-life --branch main --commit-dirty=true
```

Cloudflare is currently the source of truth. The Pages project is not connected to a Git provider yet.

## Development

Use the bundled Codex Node runtime or any Node version supported by Vite 8.

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5175
npm run check
npm run build
```
