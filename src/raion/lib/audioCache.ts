// Client-side audio cache: fully downloads a track once, then plays it from a
// blob URL. Because the download completes independently of the <audio>
// element, switching tracks never cancels an in-flight range request (which is
// what surfaced as "Error: aborted"), and re-selecting a track starts instantly.

const blobUrls = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

const MAX_CACHED = 8;

function remember(key: string, url: string) {
  blobUrls.set(key, url);
  while (blobUrls.size > MAX_CACHED) {
    const oldest = blobUrls.keys().next().value as string | undefined;
    if (!oldest) break;
    const stale = blobUrls.get(oldest);
    blobUrls.delete(oldest);
    if (stale) URL.revokeObjectURL(stale);
  }
}

export function getCachedAudioUrl(streamUrl: string): string | null {
  return blobUrls.get(streamUrl) ?? null;
}

export function clearCachedAudio(streamUrl: string) {
  const url = blobUrls.get(streamUrl);
  if (url) URL.revokeObjectURL(url);
  blobUrls.delete(streamUrl);
  inFlight.delete(streamUrl);
}

/**
 * Loads a track into memory (or returns the cached blob URL immediately).
 * Concurrent callers for the same track share one request.
 */
export function loadAudio(streamUrl: string): Promise<string> {
  if (!streamUrl) return Promise.reject(new Error('Missing stream URL'));

  // Local/blob/data sources are already instant — play them directly.
  if (streamUrl.startsWith('blob:') || streamUrl.startsWith('data:')) {
    return Promise.resolve(streamUrl);
  }

  const cached = blobUrls.get(streamUrl);
  if (cached) return Promise.resolve(cached);

  const pending = inFlight.get(streamUrl);
  if (pending) return pending;

  const request = (async () => {
    const res = await fetch(streamUrl, { credentials: 'same-origin' });
    if (!res.ok) {
      if (res.status === 401) throw new Error('LOCKED');
      throw new Error(`Stream failed (${res.status})`);
    }
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    remember(streamUrl, objectUrl);
    return objectUrl;
  })();

  inFlight.set(streamUrl, request);
  request.catch(() => {}).finally(() => {
    if (inFlight.get(streamUrl) === request) inFlight.delete(streamUrl);
  });

  return request;
}

/** Warm the cache in the background; failures are ignored. */
export function prefetchAudio(streamUrl?: string | null) {
  if (!streamUrl) return;
  if (blobUrls.has(streamUrl) || inFlight.has(streamUrl)) return;
  loadAudio(streamUrl).catch(() => {});
}
