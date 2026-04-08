import { useNavigate } from 'react-router-dom'

import { AuthFrame } from '../components/AuthFrame'
import { setAuthToken } from '../services/authStorage'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <AuthFrame
      title="Welcome Back"
      subtitle="Accede a tu espacio de investigación y seguimiento de riesgo."
      ctaDescription="¿Aún no tienes cuenta?"
      ctaLabel="Crear cuenta"
      ctaPath="/register"
    >
      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
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
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">Modo demo sin API por ahora.</p>
          <button
            type="button"
            className="auth-button px-5 py-2.5 text-sm font-semibold"
            onClick={() => {
              setAuthToken('dev-token')
              navigate('/home')
            }}
          >
            Entrar
          </button>
        </div>
      </form>
    </AuthFrame>
  )
}
