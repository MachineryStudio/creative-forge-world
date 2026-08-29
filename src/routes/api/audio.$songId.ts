import { createFileRoute } from '@tanstack/react-router';
import { getListenSession } from '@/lib/listenGate.server';
import { AUDIO_SOURCES } from '@/lib/audioSources.server';

export const Route = createFileRoute('/api/audio/$songId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const session = await getListenSession();
        if (!session.data.unlocked) {
          return new Response('Locked', { status: 401 });
        }

        const src = AUDIO_SOURCES[params.songId];
        if (!src) return new Response('Not found', { status: 404 });

        // The browser's <audio> element routinely cancels range requests when
        // seeking or switching tracks. Buffering the upstream body (instead of
        // piping a long-lived stream) keeps those cancellations from surfacing
        // as "Error: aborted" on the server.
        const range = request.headers.get('range');

        let upstream: Response;
        let buffer: ArrayBuffer;
        try {
          upstream = await fetch(src, { headers: range ? { Range: range } : {} });
          buffer = await upstream.arrayBuffer();
        } catch (error) {
          if (request.signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
            return new Response(null, { status: 499 });
          }
          console.error('RAION audio upstream request failed', error);
          return new Response('Audio temporarily unavailable', { status: 502 });
        }

        if (request.signal.aborted) {
          return new Response(null, { status: 499 });
        }

        const headers = new Headers();
        headers.set('Content-Type', upstream.headers.get('content-type') ?? 'audio/mpeg');
        const contentRange = upstream.headers.get('content-range');
        if (contentRange) headers.set('Content-Range', contentRange);
        headers.set('Accept-Ranges', 'bytes');
        headers.set('Content-Length', String(buffer.byteLength));
        headers.set('Cache-Control', 'private, no-store');

        return new Response(buffer, { status: upstream.status, headers });
      },
    },
  },
});
