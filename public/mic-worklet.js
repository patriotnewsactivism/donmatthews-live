// AudioWorklet processor: float32 mic samples (16 kHz, mono) -> Int16 PCM.
// Posts 200 ms chunks (3200 samples) to the main thread, which forwards
// them over the WebSocket to Cartesia Ink STT.
class Pcm16Capture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Int16Array(3200);
    this.filled = 0;
  }

  process(inputs) {
    const input = inputs[0] && inputs[0][0];
    if (!input) return true;
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      this.buffer[this.filled++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this.filled === this.buffer.length) {
        this.port.postMessage(this.buffer.buffer.slice(0));
        this.buffer = new Int16Array(3200);
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor('pcm16-capture', Pcm16Capture);
