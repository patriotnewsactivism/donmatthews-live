# Stage-server patch (don-paywall enforcement)

The repo (`donmatthews-live`) is the paywall **gate and ledger**. The hosted
Anam stage server (`~/workspace/don-avatar/anam-cartesia/server.mjs`) is the
**live enforcement point**: it holds the conversation, so it must cut the
connection off when the seconds run out. Without this patch, the hero's
countdown is the only cutoff (the mint gate still prevents re-claims).

Apply this patch to `server.mjs` when the stage is hosted. It needs one new
env var in the stage `.env`: `DON_PAYWALL_SHARED_SECRET` (same value as in
Vercel) and `DON_PAYWALL_API` (the repo base URL,
e.g. `https://www.donmatthews.live`).

## 1. Accept the session + budget on the WebSocket

The hero opens the socket as:

```
wss://<stage>/ws?session=<browserToken>&budget=<secondsRemaining>
```

In the `wss.on('connection')` handler, read the query and verify the budget
against the repo (the hero's number is not trusted on its own):

```js
const params = new URL(req.url, 'http://localhost').searchParams;
const browserToken = params.get('session') || '';
let budgetSeconds = Number(params.get('budget') || 0);
try {
  const bal = await fetch(
    `${process.env.DON_PAYWALL_API}/api/don/balance?session=${encodeURIComponent(browserToken)}`
  );
  const balData = await bal.json().catch(() => ({}));
  if (bal.ok && typeof balData.secondsRemaining === 'number') {
    budgetSeconds = Math.min(budgetSeconds, balData.secondsRemaining);
  } else {
    budgetSeconds = 0;
  }
} catch { budgetSeconds = 0; }
if (!browserToken || budgetSeconds <= 0) { ws.close(4403, 'no time remaining'); return; }
```

## 2. Count down and cut off

Track usage from connection time; close the socket at 0 and tell the hero:

```js
const startedAt = Date.now();
let usedReported = false;
const budgetTimer = setTimeout(() => {
  try { ws.send(JSON.stringify({ type: 'time-up' })); } catch {}
  ws.close(4403, 'time up');
}, budgetSeconds * 1000);
```

On `ws.on('close')`, report the authoritative usage. Keep the free/paid
split the repo returned at connect time: record `freeAtStart` and
`paidAtStart` from the balance fetch in step 1, then on close:

```js
clearTimeout(budgetTimer);
if (usedReported) return;
usedReported = true;
const usedTotal = Math.min(budgetSeconds, Math.floor((Date.now() - startedAt) / 1000));
const freeUsed = Math.min(usedTotal, freeAtStart);
const paidUsed = usedTotal - freeUsed;
await fetch(`${process.env.DON_PAYWALL_API}/api/don/usage`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-paywall-secret': process.env.DON_PAYWALL_SHARED_SECRET,
  },
  body: JSON.stringify({ browserToken, freeSecondsUsed: freeUsed, paidSecondsUsed: paidUsed, source: 'stage' }),
}).catch(() => {});
```

Also clear the timer and close the Ink STT stream on time-up (existing
`ws.on('close')` already closes STT).

## 3. Text turns (`{type:"say", text}`)

The hero's text box sends `{"type":"say","text":"..."}`. Handle it like a
finalized transcript — run it through the same turn logic as `turn.end`:

```js
if (msg.type === 'say' && typeof msg.text === 'string' && msg.text.trim()) {
  const text = msg.text.trim();
  if (speaking && ttsAbort) ttsAbort.abort();
  if (currentReply) { try { await currentReply; } catch {} }
  currentReply = reply(text);
  await currentReply;
}
```

Put this in the existing `ws.on('message')` JSON branch, next to the
`interrupt` handler. `reply()` is already defined in the connection scope.

## 4. Barge-in (already exists)

`{type:"interrupt"}` is already handled. The hero sends it from its
Interrupt button; no change needed.
