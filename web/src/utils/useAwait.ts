import deepEqual from 'fast-deep-equal';

interface PromiseCache {
  promise?: Promise<void>;
  inputs: unknown[];
  error?: unknown;
  response?: unknown;
}

const promiseCaches: PromiseCache[] = [];

export function useAwait<T, I extends unknown[] = []>(
  fn: (...inputs: I) => Promise<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs: I = [] as any,
  lifespan = 0,
): T {
  for (const promiseCache of promiseCaches) {
    if (deepEqual(inputs, promiseCache.inputs)) {
      if (Object.prototype.hasOwnProperty.call(promiseCache, 'error')) {
        throw promiseCache.error;
      }
      if (Object.prototype.hasOwnProperty.call(promiseCache, 'response')) {
        return promiseCache.response as T;
      }
      throw promiseCache.promise;
    }
  }
  const promiseCache: PromiseCache = {
    promise: fn(...inputs)
      .then(response => {
        promiseCache.response = response;
      })
      .catch(e => {
        promiseCache.error = e;
      })
      .then(() => {
        if (lifespan > 0) {
          setTimeout(() => {
            const index = promiseCaches.indexOf(promiseCache);
            if (index !== -1) {
              promiseCaches.splice(index, 1);
            }
          }, lifespan);
        }
      }),
    inputs,
  };
  promiseCaches.push(promiseCache);

  throw promiseCache.promise;
}
