import { beforeEach, describe, expect, it } from 'vitest'

import {
  authenticate,
  EMPTY_AUTH_RECORD,
  isAuthRecord,
  readAuthRecord,
  registerAccount,
  writeAuthRecord,
} from './auth'
import { StorageKeys } from './storage'

describe('registerAccount', () => {
  it('creates an account and signs it in', () => {
    const { record, error } = registerAccount(EMPTY_AUTH_RECORD, {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secreto',
    })

    expect(error).toBeNull()
    expect(record.accounts).toHaveLength(1)
    expect(record.currentUser?.email).toBe('ana@example.com')
  })

  it('rejects a duplicate email regardless of casing', () => {
    const first = registerAccount(EMPTY_AUTH_RECORD, {
      name: 'Ana',
      email: 'Ana@Example.com',
      password: 'secreto',
    })
    const second = registerAccount(first.record, {
      name: 'Otra',
      email: 'ana@example.com',
      password: 'otra123',
    })

    expect(second.error).toBe('email-taken')
    expect(second.record.accounts).toHaveLength(1)
  })

  it('rejects missing fields and short passwords', () => {
    expect(
      registerAccount(EMPTY_AUTH_RECORD, {
        name: '',
        email: 'ana@example.com',
        password: 'secreto',
      }).error,
    ).toBe('missing-fields')

    expect(
      registerAccount(EMPTY_AUTH_RECORD, {
        name: 'Ana',
        email: 'ana@example.com',
        password: '123',
      }).error,
    ).toBe('weak-password')
  })
})

describe('authenticate', () => {
  const seeded = registerAccount(EMPTY_AUTH_RECORD, {
    name: 'Ana',
    email: 'ana@example.com',
    password: 'secreto',
  }).record

  it('signs in with a case-insensitive email and exact password', () => {
    const { record, error } = authenticate(
      { accounts: seeded.accounts, currentUser: null },
      { email: 'ANA@example.com', password: 'secreto' },
    )

    expect(error).toBeNull()
    expect(record.currentUser?.email).toBe('ana@example.com')
  })

  it('rejects unknown users and wrong passwords', () => {
    expect(
      authenticate(seeded, { email: 'ana@example.com', password: 'nope' }).error,
    ).toBe('invalid-credentials')
    expect(
      authenticate(seeded, { email: 'ghost@example.com', password: 'secreto' })
        .error,
    ).toBe('invalid-credentials')
  })
})

describe('auth persistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('round-trips a valid record', () => {
    const record = registerAccount(EMPTY_AUTH_RECORD, {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secreto',
    }).record

    writeAuthRecord(record)

    expect(readAuthRecord()).toEqual(record)
  })

  it('falls back to an empty record when the stored data is corrupt', () => {
    window.localStorage.setItem(StorageKeys.auth, '{not json')

    expect(readAuthRecord()).toEqual(EMPTY_AUTH_RECORD)
  })

  it('validates the auth record shape defensively', () => {
    expect(isAuthRecord({ accounts: [], currentUser: null })).toBe(true)
    expect(isAuthRecord({ accounts: 'nope', currentUser: null })).toBe(false)
    expect(isAuthRecord({ accounts: [], currentUser: { id: 1 } })).toBe(false)
    expect(isAuthRecord(null)).toBe(false)
  })
})
