import { clearSessionCookies, getCookieHeader, mergeCookiesFromResponse } from '@/api/session-cookies';
import { ApiError } from '@/api/errors';
import { parseRetryAfter, shouldRetryStatus, withRetries } from '@/api/retry';
import type { TApiResponse } from '@/types/api';

export type ApiRequestOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | Record<string, unknown> | null;
  parseJson?: boolean;
  retry?: boolean;
  redirect?: RequestRedirect;
};

function getApiBaseUrl(): string {
  const raw =
    process.env.EXPO_PUBLIC_API_URL ??
    (__DEV__ ? 'http://localhost:5173' : 'https://dexbooru.neetbyte.fun');
  return raw.replace(/\/$/, '');
}

export function getApiOrigin(): string {
  return getApiBaseUrl();
}

export function buildApiUrl(
  path: string,
  params: Record<string, string | number | boolean | null | undefined> = {},
): string {
  const url = new URL(path.startsWith('http') ? path : `${getApiBaseUrl()}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function isPlainObject(body: unknown): body is Record<string, unknown> {
  return (
    typeof body === 'object' &&
    body !== null &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(typeof Blob !== 'undefined' && body instanceof Blob)
  );
}

async function toRequestInit(options: ApiRequestOptions = {}): Promise<RequestInit> {
  const headers = new Headers(options.headers);
  headers.set('Origin', getApiOrigin());
  if (!headers.has('Accept')) headers.set('Accept', 'application/json, text/plain, */*');

  const cookie = await getCookieHeader();
  if (cookie) headers.set('Cookie', cookie);

  let body: BodyInit | undefined;
  if (options.body == null) {
    body = undefined;
  } else if (isPlainObject(options.body)) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  } else {
    body = options.body;
  }

  return {
    method: options.method,
    headers,
    body,
    redirect: options.redirect,
    credentials: 'include',
  };
}

export async function apiFetch(path: string, options: ApiRequestOptions = {}): Promise<Response> {
  const url = path.startsWith('http') ? path : buildApiUrl(path);
  const retryEnabled = options.retry !== false;

  const run = async () => {
    const init = await toRequestInit(options);
    const response = await fetch(url, init);
    if (!response) {
      throw new TypeError(`Fetch returned no response for ${url}`);
    }
    await mergeCookiesFromResponse(response.headers);

    if (shouldRetryStatus(response.status)) {
      throw new ApiError(response.status, `Request failed with ${response.status}`, {
        retryAfterSeconds: parseRetryAfter(response.headers.get('Retry-After')),
      });
    }

    return response;
  };

  if (!retryEnabled) {
    const init = await toRequestInit(options);
    const response = await fetch(url, init);
    if (!response) {
      throw new TypeError(`Fetch returned no response for ${url}`);
    }
    await mergeCookiesFromResponse(response.headers);
    return response;
  }

  return withRetries(run, (error) => {
    if (error instanceof TypeError) return true;
    if (error instanceof ApiError) return shouldRetryStatus(error.status);
    return false;
  });
}

export async function apiJson<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await apiFetch(path, options);
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  let payload: unknown = isJson ? await response.json() : await response.text();

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        payload = JSON.parse(trimmed);
      } catch {
        // Keep the raw text when it is not JSON.
      }
    }
  }

  if (response.status === 401) {
    await clearSessionCookies();
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message: string }).message)
        : `Request failed with ${response.status}`;
    throw new ApiError(response.status, message, payload);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as TApiResponse<T>).data;
  }

  return payload as T;
}
