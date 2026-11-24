/**
 * Build a complete offer for an HTTP, non-trickle WebRTC signalling endpoint.
 * createOffer().sdp is a snapshot made before ICE candidates are gathered.
 * @param {RTCPeerConnection} pc
 * @param {number} timeoutMs
 * @returns {Promise<{sdp: string, type: RTCSdpType}>}
 */
export async function gatherAvatarOffer(pc, timeoutMs = 10000) {
  if (pc.iceGatheringState !== 'complete') {
    await new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        pc.removeEventListener('icegatheringstatechange', onStateChange);
      };
      const onStateChange = () => {
        if (pc.iceGatheringState === 'complete') {
          cleanup();
          resolve();
        }
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('ICE gathering timed out; please retry'));
      }, timeoutMs);
      pc.addEventListener('icegatheringstatechange', onStateChange);
      onStateChange();
    });
  }
  const offer = pc.localDescription;
  if (!offer || !offer.sdp) throw new Error('No gathered local offer');
  if (!/^a=candidate:/m.test(offer.sdp)) throw new Error('No ICE candidates gathered');
  return { sdp: offer.sdp, type: offer.type };
}
