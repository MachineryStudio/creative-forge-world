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
        const upstream = await fetch(src, {
          headers: range ? { Range: range } : {},
        });

        const headers = new Headers();
        headers.set('Content-Type', upstream.headers.get('content-type') ?? 'audio/mpeg');
        for (const h of ['content-length', 'content-range', 'accept-ranges']) {
          const v = upstream.headers.get(h);
          if (v) headers.set(h, v);
        }
        headers.set('Cache-Control', 'private, no-store');

        return new Response(upstream.body, { status: upstream.status, headers });
      },
    },
  },
});
