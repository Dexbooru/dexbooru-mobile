import * as SecureStore from 'expo-secure-store';

import {
  COOKIE_STORE_KEY,
  NOTIFICATIONS_SESSION_COOKIE_KEY,
  SESSION_COOKIE_KEY,
} from '@/constants/session';

type CookieMap = Record<string, string>;

let memoryCookies: CookieMap = {};
let loaded = false;

async function ensureLoaded(): Promise<void> {
  if (loaded) return;
  try {
    const raw = await SecureStore.getItemAsync(COOKIE_STORE_KEY);
    memoryCookies = raw ? (JSON.parse(raw) as CookieMap) : {};
  } catch {
    memoryCookies = {};
  }
  loaded = true;
}

async function persist(): Promise<void> {
  await SecureStore.setItemAsync(COOKIE_STORE_KEY, JSON.stringify(memoryCookies));
}

export async function getCookieHeader(): Promise<string | null> {
  await ensureLoaded();
  const parts = Object.entries(memoryCookies).map(([name, value]) => `${name}=${value}`);
  return parts.length > 0 ? parts.join('; ') : null;
}

export async function getSessionCookie(): Promise<string | null> {
  await ensureLoaded();
  return memoryCookies[SESSION_COOKIE_KEY] ?? null;
}

export function parseSetCookieHeaders(headers: Headers): CookieMap {
  const collected: string[] = [];
  const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  if (typeof getSetCookie === 'function') {
    collected.push(...getSetCookie.call(headers));
  } else {
    const single = headers.get('set-cookie');
    if (single) collected.push(single);
  }

  const next: CookieMap = {};
  for (const header of collected) {
    const firstPair = header.split(';', 1)[0];
    const eq = firstPair.indexOf('=');
    if (eq <= 0) continue;
    const name = firstPair.slice(0, eq).trim();
    const value = firstPair.slice(eq + 1).trim();
    if (name) next[name] = value;
  }
  return next;
}

export async function mergeCookiesFromResponse(headers: Headers): Promise<void> {
  const incoming = parseSetCookieHeaders(headers);
  if (Object.keys(incoming).length === 0) return;
  await ensureLoaded();
  memoryCookies = { ...memoryCookies, ...incoming };
  await persist();
}

export async function clearSessionCookies(): Promise<void> {
  await ensureLoaded();
  delete memoryCookies[SESSION_COOKIE_KEY];
  delete memoryCookies[NOTIFICATIONS_SESSION_COOKIE_KEY];
  await persist();
}
