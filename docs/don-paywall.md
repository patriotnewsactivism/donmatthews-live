# Don live-avatar paywall

Visitors get **exactly 1 free minute** talking with Don, **once per IP
address, ever**. After that, **$1 per minute**, sold as minute packs via
Stripe Checkout ($5 = 5 min, $10 = 10 min, $20 = 20 min). One-time payments,
no subscription. 100% of the money funds the investigations and the projects.

## How the free minute is enforced (server-side)

- `POST /api/don/session` hashes the caller IP (SHA-256, raw IP never
  stored) and checks `don_paywall_ip`. The first mint from an IP hash claims
  that IP's free minute forever. A repeat mint from the same hash gets 0 free
  seconds. Refreshing, incognito, or a new browser token does not reset it.
- Paid seconds live on the browser-token row in `don_paywall_sessions`
  (a random UUID the hero keeps in `localStorage`). The Stripe webhook is the
  only thing that adds paid seconds.
- The hosted Anam stage server enforces the budget live on the connection
  (see `don-paywall-stage-patch.md`). The hero also counts down and stops at
  0 as defense in depth; the stage cutoff is authoritative.
- Usage is reported as absolute per-session totals (`/api/don/usage`, max
  wins), so the hero beacon and the stage report never double-count.
- Shared IPs (household/NAT) share one free minute — Matthew's explicit call.

## Endpoints (all in `src/app/api/don/`)

| Route | Purpose |
| --- | --- |
| `POST /session` | Paywall gate + Anam token mint (proxied from the stage server). Body `{browserToken}`. Returns `{sessionToken, secondsRemaining, freeSecondsRemaining, paidSecondsRemaining, stageWsUrl, stageConfigured}`. `sessionToken` is null when no time is left or the stage is not configured. |
| `GET /balance?session=` / `POST /balance` | Remaining seconds for a browser token. The stage server uses GET to learn the budget. |
| `POST /usage` | Report seconds used (absolute totals). `source: "hero"` needs no secret; `source: "stage"` needs header `x-paywall-secret: <DON_PAYWALL_SHARED_SECRET>`. |
| `POST /checkout` | Create a Stripe Checkout session for a pack. Body `{browserToken, pack: "5"\|"10"\|"20"}`. Returns `{checkoutUrl}`. |
| `POST /webhook` | Stripe webhook. Verifies the signature, credits `pack_minutes * 60` paid seconds on `checkout.session.completed` (only when `payment_status` is `paid`). |

## Environment variables (Vercel — Production)

| Var | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL (same project as the existing lead capture). |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key, **server-only**. The paywall tables have RLS enabled with no policies, so only this key can read/write them. Never expose it to the browser. |
| `DON_STAGE_URL` | Server-side base URL of the hosted Anam stage, e.g. `https://avatar.donmatthews.live`. The session route mints Anam tokens through it. |
| `NEXT_PUBLIC_DON_STAGE_URL` | Browser WebSocket base URL of the hosted Anam stage, e.g. `wss://avatar.donmatthews.live`. The hero connects its mic socket here. |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...`). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (reserved for future in-page Elements use; Checkout redirect does not need it). |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the webhook endpoint (`whsec_...`). Register `https://www.donmatthews.live/api/don/webhook` in the Stripe Dashboard, listening for `checkout.session.completed`. |
| `DON_PAYWALL_SHARED_SECRET` | Random secret shared between Vercel and the stage server so the stage can report usage. Set the same value in the stage `.env`. |
| `DON_PAYWALL_IP_SALT` | Optional extra salt for the IP hash. Same value everywhere or hashes change. |

No Stripe Dashboard products are needed: Checkout uses inline `price_data`
at the $1/minute rate.

## Database

Apply `supabase/migrations/20261127_don_paywall.sql` in the Supabase
dashboard (SQL Editor → paste → Run). It creates `don_paywall_ip` and
`don_paywall_sessions` with RLS on and no policies (service-role only).

## What changed in this PR

- `src/components/DonAvatarHero.tsx` — rewired from the dead WebRTC /
  LiveTalking stack (`avatar.wtpnews.org`, died with the China 5090) to the
  Anam Don stage: Anam JS SDK video + the stage WebSocket conversation loop
  (mic → Cartesia Ink → Gemini → Cartesia Sonic → Anam lip-sync). Adds the
  countdown timer, the pay screen, and the paid-resume flow. Keeps the
  poster-first flow, the black/gold design, and the AI-presenter disclosure.
- `src/lib/don-paywall.ts` + `src/app/api/don/*` — the paywall (above).
- `public/mic-worklet.js` — PCM16 mic capture worklet (copied from the
  Anam stage project).
- `next.config.js` — removed the dead `/don/*` rewrites to
  `avatar.wtpnews.org`. Nothing else in the repo used them.
- Deleted `src/lib/avatar-webrtc.mjs`, `tools/avatar-webrtc.test.mjs`, and
  the CI line that ran that test — the WebRTC path is gone.
- `.env.example` — documents every variable above (no real values).

## Go-live checklist (in order)

1. Apply the SQL migration in Supabase.
2. Host the Anam stage server and apply `docs/don-paywall-stage-patch.md`
   to it (budget enforcement + `{type:"say"}` text turns). It needs its own
   `.env`: rotated Anam key, Cartesia key, Gemini key, plus
   `DON_PAYWALL_SHARED_SECRET` (same value as Vercel).
3. Set all env vars above in Vercel (Production) and redeploy.
4. In the Stripe Dashboard, create the webhook endpoint
   `https://www.donmatthews.live/api/don/webhook` for
   `checkout.session.completed` and put its signing secret in
   `STRIPE_WEBHOOK_SECRET`.
5. Test live: new IP gets 60s free, timer cuts off at 0, pay screen shows,
   $5 test payment (Stripe test mode first) credits 5 minutes, resume works,
   a second session from the same IP gets 0 free seconds.

## Known gaps (not in this PR)

- The stage server is not hosted yet, so the hero currently shows "being
  set up" until `DON_STAGE_URL` is configured. The paywall code is complete
  and build-verified; it cannot be exercised end-to-end until the stage is up.
- Text chat sends `{type:"say", text}` over the stage WebSocket; it works
  only once the stage patch is applied.
- No refunds flow. A refund in Stripe does not claw back minutes; handle
  refunds manually if one ever happens.
- The free-minute grant is per IP hash. A visitor on a VPN/rotating IP can
  get a new free minute per address — that is inherent to IP-based gating
  and accepted; the Stripe payment wall is the real backstop.
