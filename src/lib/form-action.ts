export type PathMatcher = string | RegExp | ((path: string) => boolean);

export function isFormActionRedirect(status: number): boolean {
  return status === 0 || status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

export function getRedirectPath(response: Response): string | null {
  return pathnameFromLocation(response.headers.get('location') ?? response.headers.get('Location'));
}

export function pathMatches(path: string | null | undefined, matcher: PathMatcher): boolean {
  if (!path) return false;
  if (typeof matcher === 'string') return path.includes(matcher);
  if (matcher instanceof RegExp) return matcher.test(path);
  return matcher(path);
}

export function isRedirectTo(response: Response, matcher: PathMatcher): boolean {
  return pathMatches(getRedirectPath(response), matcher);
}

export function pathnameFromLocation(location: string | null | undefined): string | null {
  if (!location) return null;
  try {
    return new URL(location, 'http://localhost').pathname;
  } catch {
    return location;
  }
}

export async function readResponsePayload(response: Response): Promise<unknown> {
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

  return hydrateSvelteKitActionPayload(payload);
}

export function hydrateSvelteKitActionPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== 'object') return payload;
  const record = payload as Record<string, unknown>;
  if (typeof record.data !== 'string') return payload;
  const hydrated = hydrateDevalueString(record.data);
  if (hydrated === record.data) return payload;
  return { ...record, data: hydrated };
}

export function getActionResultType(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const type = (payload as Record<string, unknown>).type;
  return typeof type === 'string' ? type : null;
}

export function getActionResultLocation(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const location = (payload as Record<string, unknown>).location;
  return typeof location === 'string' ? pathnameFromLocation(location) : null;
}

function hydrateDevalueString(serialized: string): unknown {
  const trimmed = serialized.trim();
  if (!trimmed.startsWith('[')) return serialized;

  try {
    const table = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(table) || table.length === 0) return serialized;

    const resolving = new Set<number>();
    const resolve = (index: number): unknown => {
      if (!Number.isInteger(index) || index < 0 || index >= table.length) return index;
      if (resolving.has(index)) return table[index];
      resolving.add(index);
      const node = table[index];
      if (Array.isArray(node)) {
        return node.map((item) => (typeof item === 'number' ? resolve(item) : item));
      }
      if (node && typeof node === 'object') {
        const out: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
          out[key] = typeof value === 'number' ? resolve(value) : value;
        }
        return out;
      }
      return node;
    };

    return resolve(0);
  } catch {
    return serialized;
  }
}

function firstValidationMessage(value: unknown): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = firstValidationMessage(item);
      if (message) return message;
    }
    return null;
  }

  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.message === 'string' && record.message.length > 0 && Array.isArray(record.path)) {
    return record.message;
  }

  for (const nested of Object.values(record)) {
    const message = firstValidationMessage(nested);
    if (message) return message;
  }

  return null;
}

export function formActionErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;

  const record = payload as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === 'object' ? (record.data as Record<string, unknown>) : record;

  if (record.error && typeof record.error === 'object') {
    const error = record.error as Record<string, unknown>;
    if (typeof error.message === 'string' && error.message.length > 0) return error.message;
  }

  for (const source of [nested, record]) {
    if (typeof source.reason === 'string' && source.reason.length > 0) return source.reason;
  }

  const validationMessage = firstValidationMessage(payload);
  if (validationMessage) return validationMessage;

  for (const source of [nested, record]) {
    if (typeof source.message === 'string' && source.message.length > 0) return source.message;
  }

  return fallback;
}

export const SVELTEKIT_ACTION_HEADERS = {
  Accept: 'application/json',
  'x-sveltekit-action': 'true',
} as const;
