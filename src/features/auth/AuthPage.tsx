import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Logo } from '../../components/ui/Logo'
import { Screen } from '../../components/ui/Screen'
import { TextField } from '../../components/ui/TextField'
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
 * redirected to the mall picker.
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
    <Screen className="justify-center">
      <header className="flex flex-col items-center gap-4 text-center">
        <Logo />
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink">
            SMART SHOPINT
          </h1>
          <p className="text-sm text-muted">
            Tu compra inteligente en el supermercado.
          </p>
        </div>
      </header>

      <Card>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          aria-label={mode === 'register' ? 'Crear cuenta' : 'Ingresar'}
        >
          {mode === 'register' && (
            <TextField
              label="Nombre"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          )}

          <TextField
            label="Correo electrónico"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <TextField
            label="Contraseña"
            type="password"
            name="password"
            autoComplete={
              mode === 'register' ? 'new-password' : 'current-password'
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {state.authError && (
            <p role="alert" className="text-sm font-medium text-primary">
              {AUTH_ERROR_MESSAGES[state.authError]}
            </p>
          )}

          <Button type="submit" className="mt-1">
            {mode === 'register' ? 'Crear cuenta' : 'Ingresar'}
          </Button>
        </form>
      </Card>

      <p className="flex items-center justify-center gap-2 text-sm text-muted">
        {mode === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
        <button
          type="button"
          className="font-semibold text-primary underline underline-offset-4"
          onClick={() => switchMode(mode === 'register' ? 'login' : 'register')}
        >
          {mode === 'register' ? 'Ingresar' : 'Crear cuenta'}
        </button>
      </p>
    </Screen>
  )
}
