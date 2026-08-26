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

        const range = request.headers.get('range');
        const upstreamController = new AbortController();
        const abortUpstream = () => upstreamController.abort();
        request.signal.addEventListener('abort', abortUpstream, { once: true });

        let upstream: Response;
        try {
          upstream = await fetch(src, {
            headers: range ? { Range: range } : {},
            signal: upstreamController.signal,
          });
        } catch (error) {
          request.signal.removeEventListener('abort', abortUpstream);
          if (request.signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
            return new Response(null, { status: 499 });
          }
          console.error('RAION audio upstream request failed', error);
          return new Response('Audio temporarily unavailable', { status: 502 });
        }

        const headers = new Headers();
        headers.set('Content-Type', upstream.headers.get('content-type') ?? 'audio/mpeg');
        for (const h of ['content-length', 'content-range', 'accept-ranges']) {
          const v = upstream.headers.get(h);
          if (v) headers.set(h, v);
        }
        headers.set('Cache-Control', 'private, no-store');

        if (!upstream.body) {
          request.signal.removeEventListener('abort', abortUpstream);
          return new Response(null, { status: upstream.status, headers });
        }

        const reader = upstream.body.getReader();
        const body = new ReadableStream<Uint8Array>({
          async pull(controller) {
            try {
              const chunk = await reader.read();
              if (chunk.done) {
                request.signal.removeEventListener('abort', abortUpstream);
                controller.close();
                return;
              }
              controller.enqueue(chunk.value);
            } catch (error) {
              request.signal.removeEventListener('abort', abortUpstream);
              if (upstreamController.signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
                controller.close();
                return;
              }
              console.error('RAION audio stream failed', error);
              controller.close();
            }
          },
          async cancel() {
            request.signal.removeEventListener('abort', abortUpstream);
            upstreamController.abort();
            try {
              await reader.cancel();
            } catch {
              // Browser navigation and changing tracks cancel audio reads normally.
            }
          },
        });

        return new Response(body, { status: upstream.status, headers });
      },
    },
  },
});
