# Agent instructions

## Project overview

RATIO Smart Innovations is a bilingual Polish/English building automation company site built with Next.js App Router, React, JavaScript/JSX and Tailwind CSS. It includes a contact form, optional Storyblok content and Sentry monitoring, interactive sections and an animated intro. Configuration in the repository does not establish that any external integration is active in production.

## Architecture

- `src/app/`: locale routes, layouts, Route Handlers, global styles, metadata, sitemap and robots rules. `src/middleware.js` redirects `/` to the default locale.
- `src/components/`: UI, page sections and interactive project, service and technology components.
- `src/hooks/`: client-side behavior, including the intro animation state machine.
- `src/i18n/` and `messages/`: locale configuration, dictionary loading and PL/EN copy.
- `src/lib/`: server-only Storyblok setup and content normalization/fallback.
- `src/data/`: site configuration, local projects, services, icons and social links. `public/` contains static assets.

## Next.js and React

- Keep the App Router architecture and existing Server Component boundaries. Add `"use client"` only for browser APIs, state, effects or event handlers that require it; do not convert server components without a concrete reason.
- Keep server-only integrations and secrets on the server. `NEXT_PUBLIC_*` values are exposed to the browser; never put credentials there.
- Follow existing component contracts and naming. Prefer readable components and functions, existing helpers and minimal, justified changes; avoid needless wrappers, abstractions, effects and memoization. Remove dead code or stale comments only when safe and relevant.

## UI and animation

- Preserve the existing design. Do not rebuild the intro or interactive sections unless explicitly asked, and avoid incidental visual changes during refactoring.
- Account for mobile layouts, keyboard operation and accessibility. Preserve existing `prefers-reduced-motion` behavior in the intro, navigation and styles; verify it when changing motion.

## Internationalization and SEO

- Update both `messages/pl.json` and `messages/en.json` for user-facing copy that belongs in dictionaries; avoid new hard-coded strings. Preserve locale-aware links and routing: Polish defaults to `/pl`, English uses `/en`, and project paths differ by locale.
- Check metadata, canonical and alternate language links, Open Graph, sitemap, robots and structured data when relevant. `src/data/site.js` defines the production canonical URL; `NEXT_PUBLIC_SITE_URL` overrides it only in development.

## Integrations

### Storyblok

- Keep Storyblok access server-only, fetch published content and retain the local project fallback and merge behavior. The token and region are optional; do not assume the CMS is configured or available. See `docs/storyblok-content-model.md`.
- Respect the current portfolio feature flag and routing behavior. Do not enable or disable project sections or routes without an explicit request. Verify the active configuration before making changes.

### Sentry

- Preserve the existing optional client, server and edge configuration and privacy filtering. A public DSN is not a secret; keep authentication tokens and other credentials private.
- The locale-specific test page is gated by `SENTRY_TEST_ENABLED=true` and excluded from indexing. Do not enable it in production without a specific need. Do not assume events reach Sentry without verification.

### Contact form

- Preserve client and server validation, the `company` honeypot, client cooldown and request limits. `POST /api/contact` limits request bodies to 16 KiB and applies five requests per minute across all users in one process.
- This in-memory limit is neither per-IP nor distributed and resets on restart. Do not trust client-supplied IP headers or weaken existing limits; proxy and distributed protection require a separately verified deployment design.
- SMTP credentials stay server-side; missing configuration produces a controlled error. Automated tests must use the mail stub and must not send real email.

## Environment and operations

- Use Node.js 22 and `npm ci`. Copy `.env.example` to `.env.local` only when needed; never commit secrets or expose their values in logs. Do not assume SMTP, Storyblok or Sentry is configured.
- `next.config.mjs` sets standalone output, security headers, Storyblok image access and Sentry build options. Keep these constraints in mind when changing integrations or assets.
- `Dockerfile` builds a Node 22 multi-stage standalone image with a non-root runtime and `/api/health` health check; `compose.yaml` supports an optional `.env.local`. Preserve `.dockerignore` exclusions and distinguish build-time public variables from runtime secrets.

## Workflow and verification

- Inspect the relevant code, dependencies and existing changes before editing. Preserve user work, keep diffs small, justify changes and avoid inventing a new architecture.
- Before implementing changes outside the requested scope, explain the specific problem, proposed solution, advantages, disadvantages, alternatives and risks, then wait for explicit approval. Do not ask again for changes already approved within the current task. An analysis or review request does not authorize fixing every issue found.
- Run checks appropriate to the change: `npm test` (Node test runner with a stubbed mailer), `npm run lint` (ESLint with Next core-web-vitals), and `npm run build` when build behavior is affected. Use `npm ci`, `npm run dev` and `npm run start` as needed; do not run development and build concurrently against the same `.next` directory on Windows.
- Do not introduce new tests, testing frameworks, CI workflows or dependencies without explicit approval.
- Existing tests cover contact handling, middleware, security headers and social links; they do not prove email delivery, live CMS/monitoring behavior or complete UI accessibility. For UI changes, manually check both locales, responsive layouts, keyboard use and reduced motion as relevant. Report checks performed, failures and verification limits.

## Git workflow

Check the working tree before making changes and preserve existing work. Prefer separate branches and focused commits.

Do not push, merge, deploy, force push or rewrite history unless explicitly authorized by the current task.

Review the complete diff before committing and report any unrelated changes.
