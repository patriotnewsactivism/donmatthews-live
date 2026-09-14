import assert from "node:assert/strict";
import {
  ulawDecode,
  ulawEncode,
  upsample8kTo24k,
  downsample24kTo8k,
  ulawSamplesToXaiBytes,
  xaiBytesToUlaw22ms,
  normalizePhone,
  timingSafeEqualStr,
} from "./audio.js";
import { stripHtml, isAllowedPageFetch } from "./content.js";
import { parseStreamStart, toWsUrl, xmlEscape, dtmfDigit } from "./telephony.js";

const pcm24k = Array.from({ length: 24000 }, (_, i) => Math.round(Math.sin(i / 64) * 12000));

const down = downsample24kTo8k(pcm24k);
assert.equal(down.length, 8000, "24k->8k downsample length");
const up = upsample8kTo24k(down);
assert.equal(up.length, 24000, "8k->24k upsample length");

const pcm8k = [0, 1000, -1000, 32000, -32000, 0];
const ulaw = ulawEncode(pcm8k);
const back = ulawDecode(ulaw);
assert.ok(back.every((v, i) => Math.abs(v - (pcm8k[i] > 32000 ? 32124 : pcm8k[i])) <= Math.abs(pcm8k[i] * 0.01) + 100), "ulaw roundtrip tolerance");

const ulawBytes = Buffer.from(pcm8k.map((v) => ulawEncode([v])[0]));
const xaiBuf = ulawSamplesToXaiBytes(ulawBytes);
assert.equal(xaiBuf.length, pcm8k.length * 3 * 2, "ulaw 8k -> pcm 24k bytes");
const longUlaw = Buffer.alloc(1600);
for (let i = 0; i < 1600; i++) {
  longUlaw[i] = ulawEncode([Math.round(Math.sin(i / 50) * 12000)])[0];
}
const longXai = ulawSamplesToXaiBytes(longUlaw);
const frames = xaiBytesToUlaw22ms(longXai);
assert.equal(frames[0].length, 160, "20ms ulaw frame size (160 bytes)");
assert.ok(frames.every((f) => f.length === 160), "all frames 20ms");
assert.equal(frames.length, 10, "200ms of audio -> 10 frames");

assert.equal(normalizePhone("+1 (832) 880-4970"), "8328804970");
assert.equal(normalizePhone("18328804970"), "8328804970");
assert.equal(normalizePhone("832-880-4970"), "8328804970");
assert.ok(timingSafeEqualStr("2269", "2269"));
assert.ok(!timingSafeEqualStr("2269", "2268"));

assert.equal(stripHtml("<p>Hello &amp; bye</p>"), "Hello & bye");
assert.ok(isAllowedPageFetch("https://www.wtpnews.org/feed/"));
assert.ok(isAllowedPageFetch("https://civilrightshub.org"));
assert.ok(!isAllowedPageFetch("https://evil.example.com"));

assert.equal(toWsUrl("https://voice.example.com"), "wss://voice.example.com");
assert.equal(toWsUrl("http://localhost:8080"), "ws://localhost:8080");
assert.equal(xmlEscape(`a&b<"c">`), "a&amp;b&lt;&quot;c&quot;&gt;");

const telnyxStart = parseStreamStart({
  event: "start",
  stream_id: "stream-1",
  start: { call_control_id: "v2:abc", from: "+18325550100", to: "+18325550199" },
});
assert.ok(telnyxStart);
assert.equal(telnyxStart.streamSid, "stream-1");
assert.equal(telnyxStart.callSid, "v2:abc");
assert.equal(telnyxStart.from, "+18325550100");

const twilioStart = parseStreamStart({
  event: "start",
  start: { streamSid: "MZ1", callSid: "CA1", from: "+15551212", to: "+15550000" },
});
assert.ok(twilioStart);
assert.equal(twilioStart.streamSid, "MZ1");
assert.equal(dtmfDigit({ event: "dtmf", dtmf: { digit: "2" } }), "2");

console.log("selftest: all audio/codec/phone/utils assertions passed");
process.exit(0);