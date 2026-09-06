import { createHash, timingSafeEqual } from "node:crypto";

const SAMPLE_RATE_PHONE = 8000;
const SAMPLE_RATE_XAI = 24000;
const RATIO = SAMPLE_RATE_XAI / SAMPLE_RATE_PHONE;

const BIAS = 0x84;
const SEG_END = [0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff, 0x3fff, 0x7fff];

function ulawCompressValue(pcm: number): number {
  let mask: number;
  if (pcm < 0) {
    pcm = BIAS - pcm;
    mask = 0x7f;
  } else {
    pcm += BIAS;
    mask = 0xff;
  }
  let seg = 0;
  while (seg < 8 && pcm > SEG_END[seg]) seg++;
  if (seg >= 8) return (0x7f ^ mask) & 0xff;
  const uval = (seg << 4) | ((pcm >> (seg + 3)) & 0x0f);
  return (uval ^ mask) & 0xff;
}

function ulawExpandValue(u: number): number {
  const v = (~u) & 0xff;
  let t = ((v & 0x0f) << 3) + BIAS;
  t <<= (v & 0x70) >> 4;
  return (v & 0x80) ? BIAS - t : t - BIAS;
}

const ENCODE_TABLE: number[] = (() => {
  const table = new Array<number>(0x10000);
  for (let i = 0; i < 0x10000; i++) {
    const x = i & 0x8000 ? i - 0x10000 : i;
    table[i] = ulawCompressValue(x);
  }
  return table;
})();

const DECODE_TABLE: number[] = (() => {
  const table = new Array<number>(256);
  for (let i = 0; i < 256; i++) {
    table[i] = ulawExpandValue(i);
  }
  return table;
})();

export function ulawEncode(pcmInt16: number[]): number[] {
  const out = new Array<number>(pcmInt16.length);
  for (let i = 0; i < pcmInt16.length; i++) {
    out[i] = ENCODE_TABLE[pcmInt16[i] & 0xffff];
  }
  return out;
}

export function ulawDecode(bytes: Uint8Array | number[]): number[] {
  const out = new Array<number>(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = DECODE_TABLE[bytes[i] & 0xff];
  }
  return out;
}

export function upsample8kTo24k(pcm: number[]): number[] {
  const out = new Array<number>(pcm.length * RATIO);
  for (let i = 0; i < pcm.length; i++) {
    const a = pcm[i];
    const b = i + 1 < pcm.length ? pcm[i + 1] : a;
    out[i * RATIO] = a;
    out[i * RATIO + 1] = Math.round((a * 2 + b) / 3);
    out[i * RATIO + 2] = Math.round((a + b * 2) / 3);
  }
  return out;
}

export function downsample24kTo8k(pcm: number[]): number[] {
  const outLength = Math.floor(pcm.length / RATIO);
  const out = new Array<number>(outLength);
  for (let i = 0; i < outLength; i++) {
    const base = i * RATIO;
    const a = pcm[base];
    const b = pcm[base + 1] ?? a;
    const c = pcm[base + 2] ?? a;
    out[i] = Math.round((a + b + c) / 3);
  }
  return out;
}

export function pcm16ToBytes(pcm: number[]): Buffer {
  const buf = Buffer.alloc(pcm.length * 2);
  for (let i = 0; i < pcm.length; i++) {
    buf.writeInt16LE(pcm[i], i * 2);
  }
  return buf;
}

export function bytesToPcm16(buf: Buffer): number[] {
  const out = new Array<number>(buf.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = buf.readInt16LE(i * 2);
  }
  return out;
}

export function ulawSamplesToXaiBytes(ulaw: Uint8Array): Buffer {
  const pcm8k = ulawDecode(ulaw);
  const pcm24k = upsample8kTo24k(pcm8k);
  return pcm16ToBytes(pcm24k);
}

export function xaiBytesToUlaw22ms(pcmBytes: Buffer): Buffer[] {
  const frames: Buffer[] = [];
  const pcm24k = bytesToPcm16(pcmBytes);
  const frameLen = Math.floor(SAMPLE_RATE_PHONE * 0.02);
  const usable = Math.floor(pcm24k.length / RATIO);
  const fullFrames = Math.floor(usable / frameLen);
  for (let f = 0; f < fullFrames; f++) {
    const start8k = f * frameLen;
    const start24k = start8k * RATIO;
    const seg = pcm24k.slice(start24k, start24k + frameLen * RATIO);
    const pcm8k = downsample24kTo8k(seg);
    frames.push(Buffer.from(ulawEncode(pcm8k)));
  }
  return frames;
}

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits;
}

export function timingSafeEqualStr(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}