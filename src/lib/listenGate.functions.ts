import { createServerFn } from '@tanstack/react-start';
import { getListenSession, passkeyMatches } from './listenGate.server';

export const unlockListening = createServerFn({ method: 'POST' })
  .inputValidator((data: { passkey: string }) => data)
  .handler(async ({ data }) => {
    if (!passkeyMatches(String(data?.passkey ?? ''))) {
      return { ok: false as const };
    }
    const session = await getListenSession();
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const listeningStatus = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getListenSession();
  return { unlocked: Boolean(session.data.unlocked) };
});
