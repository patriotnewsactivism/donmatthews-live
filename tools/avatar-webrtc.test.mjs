import assert from 'node:assert/strict';
import { test } from 'node:test';
import { gatherAvatarOffer } from '../src/lib/avatar-webrtc.mjs';

class FakePeer extends EventTarget {
  iceGatheringState = 'gathering';
  localDescription = { type: 'offer', sdp: 'v=0\r\n' };
  listeners = 0;
  addEventListener(...args) { this.listeners++; return super.addEventListener(...args); }
  removeEventListener(...args) { this.listeners--; return super.removeEventListener(...args); }
  complete() {
    this.localDescription = { type: 'offer', sdp: 'v=0\r\na=candidate:1 1 udp 1 203.0.113.1 49160 typ relay\r\n' };
    this.iceGatheringState = 'complete';
    this.dispatchEvent(new Event('icegatheringstatechange'));
  }
}

test('non-trickle signalling waits for ICE and sends the gathered local SDP', async () => {
  const pc = new FakePeer();
  let resolved = false;
  const pending = gatherAvatarOffer(pc, 1000).then(value => { resolved = true; return value; });
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(resolved, false, 'must not signal an empty original offer');
  pc.complete();
  const offer = await pending;
  assert.equal(offer.type, 'offer');
  assert.match(offer.sdp, /a=candidate:/);
  assert.equal(offer.sdp, pc.localDescription.sdp);
  assert.equal(pc.listeners, 0);
});

test('already-complete gathering returns the current local description', async () => {
  const pc = new FakePeer(); pc.complete();
  assert.deepEqual(await gatherAvatarOffer(pc), pc.localDescription);
  assert.equal(pc.listeners, 0);
});

test('gathering timeout rejects and removes the listener', async () => {
  const pc = new FakePeer();
  await assert.rejects(gatherAvatarOffer(pc, 15), /ICE gathering timed out/);
  assert.equal(pc.listeners, 0);
});

test('missing local description cannot be signalled', async () => {
  const pc = new FakePeer(); pc.complete(); pc.localDescription = null;
  await assert.rejects(gatherAvatarOffer(pc), /No gathered local offer/);
});

test('an SDP with no reachable candidate is not sent as a usable offer', async () => {
  const pc = new FakePeer(); pc.iceGatheringState = 'complete';
  await assert.rejects(gatherAvatarOffer(pc), /No ICE candidates/);
});
