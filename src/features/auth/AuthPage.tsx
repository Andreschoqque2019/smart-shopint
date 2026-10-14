import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import type { AuthError } from '../../lib/auth'

type Mode = 'login' | 'register'

/** Visible Spanish copy for each rejection reason. */
const AUTH_ERROR_MESSAGES: Record<AuthError, string> = {
  'missing-fields': 'Completa todos los campos.',
  'weak-password': 'La contraseña debe tener al menos 4 caracteres.',
  'email-taken': 'Ya existe una cuenta con ese correo.',
  'invalid-credentials': 'Correo o contraseña incorrectos.',
}

/**
 * Register / login screen.
 *
 * This is a simulated gate: credentials are checked against the accounts kept
 * in `localStorage`. On success the reducer sets `currentUser` and the user is
 * redirected to the supermarket picker.
 */
export function AuthPage() {
  const { state, dispatch } = useAppStore()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (state.currentUser) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mode === 'register') {
      dispatch({ type: 'auth/register', name, email, password })
    } else {
      dispatch({ type: 'auth/login', email, password })
    }
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode)
    dispatch({ type: 'auth/clear-error' })
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-6 px-6 py-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          SMART SHOPINT
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tu compra inteligente en el supermercado.
        </p>
      </header>

      <form
        className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        onSubmit={handleSubmit}
        aria-label={mode === 'register' ? 'Crear cuenta' : 'Ingresar'}
      >
        {mode === 'register' && (
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Nombre
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base font-normal text-slate-900 outline-none focus:border-slate-900"
            />
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Correo electrónico
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base font-normal text-slate-900 outline-none focus:border-slate-900"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Contraseña
          <input
            type="password"
            name="password"
            autoComplete={
              mode === 'register' ? 'new-password' : 'current-password'
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base font-normal text-slate-900 outline-none focus:border-slate-900"
          />
        </label>

        {state.authError && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {AUTH_ERROR_MESSAGES[state.authError]}
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
        >
          {mode === 'register' ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </form>

      <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
        {mode === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
        <button
          type="button"
          className="font-semibold text-slate-900 underline"
          onClick={() => switchMode(mode === 'register' ? 'login' : 'register')}
        >
          {mode === 'register' ? 'Ingresar' : 'Crear cuenta'}
        </button>
      </p>
    </main>
  )
}
