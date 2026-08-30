const NAMESPACE = "geoknowledge";
const VERSION = "v1";

function buildKey(key: string): string {
  return `${NAMESPACE}:${key}:${VERSION}`;
}

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(buildKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(buildKey(key), JSON.stringify(value));
  } catch {
    // Quota exceeded or private mode — silently ignore
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(buildKey(key));
  } catch {
    // Silently ignore
  }
}
