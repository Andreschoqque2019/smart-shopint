/**
 * The only module allowed to touch `localStorage`.
 *
 * Every value is stored as JSON under a versioned key (`shopint:v2:*`) so the
 * app can migrate or reset demo data deterministically. Reads are defensive:
 * a missing key, corrupt JSON, a failed guard, or an unavailable storage all
 * fall back to the caller's default instead of throwing.
 */

/**
 * Storage namespace.
 *
 * Bumped from `v1` to `v2` when the selection flow changed from a single
 * supermarket to a mall + store pair. Old `shopint:v1:*` data is left in place
 * but never read, so stale selections are invalidated instead of migrated.
 */
export const STORAGE_NAMESPACE = 'shopint:v2'

const KEY_PREFIX = `${STORAGE_NAMESPACE}:`

/** Versioned storage keys. Components must read and write through these. */
export const StorageKeys = {
  auth: `${KEY_PREFIX}auth`,
  cart: `${KEY_PREFIX}cart`,
  orders: `${KEY_PREFIX}orders`,
  mall: `${KEY_PREFIX}mall`,
  store: `${KEY_PREFIX}store`,
} as const

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys]

/** Returns the browser storage, or `null` when it is unavailable. */
function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * Reads and parses a JSON value.
 *
 * Returns `fallback` when the key is absent, the stored text is not valid
 * JSON, the `validate` guard rejects the parsed value, or the guard itself
 * throws. Never throws.
 */
export function readJSON<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => boolean,
): T {
  const storage = getStorage()
  if (!storage) {
    return fallback
  }

  let raw: string | null
  try {
    raw = storage.getItem(key)
  } catch {
    return fallback
  }

  if (raw === null) {
    return fallback
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return fallback
  }

  try {
    return validate(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}

/** Serializes a value to JSON. Best-effort: never throws. */
export function writeJSON<T>(key: string, value: T): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  const serialized = JSON.stringify(value)
  if (serialized === undefined) {
    return
  }

  try {
    storage.setItem(key, serialized)
  } catch {
    // Storage can be full or blocked (e.g. private mode); writes are best-effort.
  }
}

/** Removes a single entry. Never throws. */
export function removeJSON(key: string): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.removeItem(key)
  } catch {
    // Ignore storage access errors.
  }
}

/**
 * Removes every `shopint:v2:*` entry and leaves unrelated keys untouched.
 * Backs the "reset demo data" control. Never throws.
 */
export function clearNamespace(): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    const doomed: string[] = []
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (key !== null && key.startsWith(KEY_PREFIX)) {
        doomed.push(key)
      }
    }
    for (const key of doomed) {
      storage.removeItem(key)
    }
  } catch {
    // Ignore storage access errors.
  }
}
