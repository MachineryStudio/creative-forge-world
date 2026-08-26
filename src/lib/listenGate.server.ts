import { useSession } from '@tanstack/react-start/server';
import { createHash, timingSafeEqual } from 'node:crypto';

export type ListenSession = { unlocked?: boolean };

export function sessionConfig() {
  return {
    password: process.env['SESSION_SECRET']!,
    name: 'raion-listen',
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/' },
  };
}

export function getListenSession() {
  return useSession<ListenSession>(sessionConfig());
}

export function passkeyMatches(input: string): boolean {
  const expected = process.env['AUDIO_PASSKEY'];
  if (!expected) return false;
  const a = createHash('sha256').update(input, 'utf8').digest();
  const b = createHash('sha256').update(expected, 'utf8').digest();
  return timingSafeEqual(a, b);
}
