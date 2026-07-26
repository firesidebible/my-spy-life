# MY SPY LIFE // MUSCLE Field Terminal

Full source of the Lovable-built web app (myspylife.lovable.app), extracted
for independent hosting. TanStack Start (React 19, SSR) + Tailwind v4 +
Supabase.

Your daily activity is a L.I.F.E. (Long-range Inductively Focused Energy)
transfer keeping Agent 86 alive against F.L.A.B.:

| HealthKit metric | Agent 86 vital | Daily target |
|---|---|---|
| Stand hours | STAMINA | 12 h |
| Workout minutes | STRENGTH | 60 min |
| Mindful minutes | INTELLIGENCE | 20 min |

## Architecture

- `src/routes/index.tsx` — the whole experience: boot → incoming transmission
  → briefing → hold-to-accept → mission board → mission complete.
- `src/routes/api/public/healthkit-ingest.ts` — POST endpoint the iPhone
  Shortcut calls with today's Health numbers. Token-protected via the
  `x-hk-token` header. GET it for self-documentation.
- Supabase table `healthkit_readings` (migration included) — one row,
  upserted on each sync; the UI polls it every 15 s.

## Run locally

```bash
npm install
npm run dev
```

`.env` ships with the public (publishable) Supabase keys for the existing
Lovable Cloud database — reads work out of the box.

## Server secrets (required for the ingest endpoint)

Set these in your hosting provider's environment (never commit them):

- `SUPABASE_URL` — same as in .env
- `SUPABASE_SERVICE_ROLE_KEY` — from your Supabase project's API settings
- `HEALTHKIT_INGEST_TOKEN` — any long random string; the Shortcut sends the
  same one

If you can't retrieve the service-role key from the Lovable-managed Supabase
project, create a free project at supabase.com, run
`supabase/migrations/*.sql` in its SQL editor, and swap the URL/keys in .env.
Takes ~5 minutes and makes you fully independent.

## Deploy (free)

The build targets Cloudflare by default (via @lovable.dev/vite-tanstack-config
→ nitro). Easiest path: Cloudflare Workers — connect the GitHub repo at
dash.cloudflare.com, or `npx wrangler deploy` after `npm run build`. Set the
three server secrets above in the Cloudflare dashboard. Netlify/Vercel also
work with a nitro preset change.

## iPhone Shortcut (the HealthKit uplink)

Shortcuts app → new shortcut:

1. Find Health Samples (Stand Hours, today) → Count
2. Find Health Samples (Workouts, today) → Statistics: Sum of Duration (min)
3. Find Health Samples (Mindful Minutes, today) → Statistics: Sum of Duration
4. Get Contents of URL:
   - URL: `https://YOUR-DOMAIN/api/public/healthkit-ingest`
   - Method: POST, Request Body: JSON
     - standHours / workoutMinutes / mindfulMinutes → the variables above
   - Headers: `x-hk-token: <your HEALTHKIT_INGEST_TOKEN>`

5. Get Dictionary from Input (the URL response)
6. Get Dictionary Value → key: `transmission`
7. Show Notification — Title: `AGENT 86 // FIELD`, Body: the Dictionary Value

The endpoint replies with Agent 86's status and a line of dialogue keyed to
your vitals, so every sync ends with a transmission on your lock screen —
"VITALS CRITICAL. My legs just gave out mid-chase. Coincidence?"

Automate it (Time of Day — hourly slots or a few per day) and Agent 86
stays fed and stays chatty.

SECURE THIS TERMINAL // DO NOT SHARE
