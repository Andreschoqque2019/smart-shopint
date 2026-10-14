import type { User } from '../data/types'
import { readJSON, StorageKeys, writeJSON } from './storage'

/**
 * Demo-only authentication.
 *
 * SMART SHOPINT has no backend: accounts and the active session are simulated
 * in `localStorage`. This is NOT real security — passwords are stored in plain
 * text and never leave the browser. It exists only to satisfy the "authenticate
 * before anything else" requirement of the mock product.
 */
export interface AuthRecord {
  /** Every account registered on this device. */
  accounts: User[]
  /** The account currently signed in, or `null` when there is no session. */
  currentUser: User | null
}

/** Convenience value for "nobody registered, nobody signed in". */
export const EMPTY_AUTH_RECORD: AuthRecord = { accounts: [], currentUser: null }

/** Why an authentication attempt was rejected. The UI maps these to copy. */
export type AuthError =
  | 'missing-fields'
  | 'weak-password'
  | 'email-taken'
  | 'invalid-credentials'

/** Credential fields collected by the register form. */
export interface RegisterInput {
  name: string
  email: string
  password: string
}

/** Credential fields collected by the login form. */
export interface LoginInput {
  email: string
  password: string
}

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.password === 'string'
  )
}

/** Storage guard: accepts the persisted `AuthRecord` shape and nothing else. */
export function isAuthRecord(value: unknown): value is AuthRecord {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  if (!Array.isArray(candidate.accounts) || !candidate.accounts.every(isUser)) {
    return false
  }
  const { currentUser } = candidate
  return currentUser === null || isUser(currentUser)
}

/** Reads the persisted auth record, falling back to an empty one. */
export function readAuthRecord(): AuthRecord {
  return readJSON<AuthRecord>(
    StorageKeys.auth,
    EMPTY_AUTH_RECORD,
    isAuthRecord,
  )
}

/** Persists the auth record. */
export function writeAuthRecord(record: AuthRecord): void {
  writeJSON(StorageKeys.auth, record)
}

function createUserId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `user-${crypto.randomUUID()}`
  }
  return `user-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
}

/**
 * Registers a new account and signs it in.
 *
 * Returns the next record plus, when the input is rejected, the reason. It
 * never throws and never mutates the incoming record.
 */
export function registerAccount(
  record: AuthRecord,
  input: RegisterInput,
): { record: AuthRecord; error: AuthError | null } {
  const name = input.name.trim()
  const email = input.email.trim()
  const password = input.password

  if (name === '' || email === '' || password === '') {
    return { record, error: 'missing-fields' }
  }
  if (password.length < 4) {
    return { record, error: 'weak-password' }
  }

  const normalizedEmail = email.toLowerCase()
  const alreadyRegistered = record.accounts.some(
    (account) => account.email.toLowerCase() === normalizedEmail,
  )
  if (alreadyRegistered) {
    return { record, error: 'email-taken' }
  }

  const user: User = { id: createUserId(), email, name, password }
  return {
    record: { accounts: [...record.accounts, user], currentUser: user },
    error: null,
  }
}

/**
 * Signs an existing account in.
 *
 * Matches an account by email (case-insensitive) and exact password. Returns
 * the next record plus, on failure, the reason. Never throws.
 */
export function authenticate(
  record: AuthRecord,
  input: LoginInput,
): { record: AuthRecord; error: AuthError | null } {
  const email = input.email.trim()
  const password = input.password

  if (email === '' || password === '') {
    return { record, error: 'missing-fields' }
  }

  const normalizedEmail = email.toLowerCase()
  const match = record.accounts.find(
    (account) =>
      account.email.toLowerCase() === normalizedEmail &&
      account.password === password,
  )
  if (!match) {
    return { record, error: 'invalid-credentials' }
  }

  return { record: { ...record, currentUser: match }, error: null }
}
