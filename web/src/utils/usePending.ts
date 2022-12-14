type CacheEntry = {
  suspendedAt: number;
};

const cache = new WeakMap<object, CacheEntry>();

export function usePending(pendingKey: object, pending: boolean) {
  if (!pending) {
    cache.delete(pendingKey);
  }

  if (pending && !cache.has(pendingKey)) {
    cache.set(pendingKey, { suspendedAt: Date.now() });
  }

  if (pending && cache.has(pendingKey)) {
    const entry = cache.get(pendingKey);
    throw new Promise(resolve => {
      setTimeout(resolve, jnd(Date.now() - entry.suspendedAt));
    });
  }
}

function jnd(timeElapsed: number) {
  return timeElapsed < 120
    ? 120
    : timeElapsed < 480
    ? 480
    : timeElapsed < 1080
    ? 1080
    : timeElapsed < 1920
    ? 1920
    : timeElapsed < 3000
    ? 3000
    : timeElapsed < 4320
    ? 4320
    : Math.ceil(timeElapsed / 1960) * 1960;
}
