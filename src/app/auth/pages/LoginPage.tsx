import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthFrame } from '../components/AuthFrame'
import { ApiError } from '../../shared/services/ApiError'
import { authService } from '../services/AuthService'
import { setAuthSession } from '../services/authStorage'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const session = await authService.signIn({ email, password })
      setAuthSession(session)
      navigate('/home')
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Unexpected error')
      setErrorMessage(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFrame
      title="Welcome Back"
      subtitle="Accede a tu espacio de investigación y seguimiento de riesgo."
      ctaDescription="¿Aún no tienes cuenta?"
      ctaLabel="Crear cuenta"
      ctaPath="/register"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="auth-input"
            placeholder="analyst@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">Autenticacion conectada al backend.</p>
          <button
            type="submit"
            className="auth-button px-5 py-2.5 text-sm font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </AuthFrame>
  )
}
