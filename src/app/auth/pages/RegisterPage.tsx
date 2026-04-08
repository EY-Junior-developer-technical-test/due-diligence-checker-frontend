import { useState } from 'react'

import { AuthFrame } from '../components/AuthFrame'
import { ApiError } from '../../shared/services/ApiError'
import { authService } from '../services/AuthService'

export function RegisterPage() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const response = await authService.signUp({ fullname, email, password })
      setSuccessMessage(response.message)
      setFullname('')
      setEmail('')
      setPassword('')
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Unexpected error')
      setErrorMessage(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFrame
      title="Create Account"
      subtitle="Configura tu acceso para iniciar evaluaciones de due diligence."
      ctaDescription="¿Ya tienes cuenta?"
      ctaLabel="Iniciar sesión"
      ctaPath="/login"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className="auth-input"
            placeholder="Jane Miller"
            value={fullname}
            onChange={(event) => setFullname(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="registerEmail">
            Email
          </label>
          <input
            id="registerEmail"
            type="email"
            autoComplete="email"
            className="auth-input"
            placeholder="jane.miller@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="registerPassword"
          >
            Contraseña
          </label>
          <input
            id="registerPassword"
            type="password"
            autoComplete="new-password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {successMessage ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className="auth-button w-full px-5 py-2.5 text-sm font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="text-xs text-slate-500">Registro conectado al backend.</p>
      </form>
    </AuthFrame>
  )
}
